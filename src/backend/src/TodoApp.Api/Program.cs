using System.Globalization;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using Serilog;
using Serilog.Filters;
using TodoApp.Api.Data;
using TodoApp.Api.Repositories;
using TodoApp.Api.Services;

// WebApplicationBuilderを生成し、設定・DI・ミドルウェアを構成する
// argsにDockerfileの環境変数がセットされる。設定の優先順位は以下となる。
// 優先度1:builder.WebHost.UseUrls()
// 優先度2:ASPNETCORE_URLS 環境変数(Dockerfile内の変数)
// 優先度3:appsettings.json の Urls
// 優先度4:デフォルト（http://localhost:5000）
WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

// Serilog を設定する（通常ログと SQL ログを別ファイルに出力）
builder.Host.UseSerilog((context, configuration) =>
{
    // LOG_DIR 環境変数が設定されている場合はそのパスを使用する（Docker 環境向け）。
    // 未設定の場合は ContentRootPath から3階層上の src/log/ に出力する（ローカル開発向け）。
    string logDir = Environment.GetEnvironmentVariable("LOG_DIR")
        ?? Path.GetFullPath(Path.Combine(context.HostingEnvironment.ContentRootPath, "..", "..", "..", "log"));
    configuration
        .ReadFrom.Configuration(context.Configuration)
        .WriteTo.Logger(lc => lc
            .Filter.ByExcluding(Matching.FromSource("Microsoft.EntityFrameworkCore.Database.Command"))
            .WriteTo.File(
                path: Path.Combine(logDir, "app-.log"),
                outputTemplate: "{Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz} [{Level:u3}] {Message:lj}{NewLine}{Exception}",
                formatProvider: CultureInfo.InvariantCulture,
                rollingInterval: RollingInterval.Day));
    if (context.HostingEnvironment.IsDevelopment())
    {
        configuration.WriteTo.Logger(lc => lc
            .Filter.ByIncludingOnly(Matching.FromSource("Microsoft.EntityFrameworkCore.Database.Command"))
            .WriteTo.File(
                path: Path.Combine(logDir, "sql-.log"),
                outputTemplate: "{Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz} [{Level:u3}] {Message:lj}{NewLine}{Exception}",
                formatProvider: CultureInfo.InvariantCulture,
                rollingInterval: RollingInterval.Day));
    }
});

// PostgreSQL への接続を構成する（appsettings.Development.json のローカル Docker 接続文字列を使用）
string connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException("接続文字列 'DefaultConnection' が設定されていません。");

// AppDbContext を DI コンテナに登録し、PostgreSQL への接続を設定する
builder.Services.AddDbContext<AppDbContext>(options => options.UseNpgsql(connectionString));

// ヘルスチェックを登録する（GET /health でDB接続状態を確認できる）
builder.Services.AddHealthChecks().AddDbContextCheck<AppDbContext>("database");

// Cookie 認証を登録する。
// ログイン時に暗号化された Cookie をブラウザへ発行し、以降のリクエストで自動送信させる。
builder.Services
    .AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        // ブラウザに保存される Cookie の名前
        options.Cookie.Name = "todo_session";
        // JavaScript から Cookie を読めないようにする（XSS 攻撃対策）
        options.Cookie.HttpOnly = true;
        // 他サイトからのリクエストに Cookie を付けない（CSRF 攻撃対策）
        options.Cookie.SameSite = SameSiteMode.Lax;
        // HTTPS 接続のときは Secure 属性（通信経路の暗号化）を自動で付ける
        options.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;
        // ログイン後 8 時間で Cookie が期限切れになる
        options.ExpireTimeSpan = TimeSpan.FromHours(8);
        // アクセスするたびに有効期限を 8 時間リセットする（操作中に突然ログアウトされるのを防ぐ）
        options.SlidingExpiration = true;
        // 未ログインでアクセスした場合、通常はログインページへ 302 リダイレクトするが、
        // API では HTML ページへのリダイレクトは不要なので 401 Unauthorized に変換する
        options.Events.OnRedirectToLogin = ctx =>
        {
            ctx.Response.StatusCode = StatusCodes.Status401Unauthorized;
            return Task.CompletedTask;
        };
        // アクセス権限がない場合も同様に、302 リダイレクトを 403 Forbidden に変換する
        options.Events.OnRedirectToAccessDenied = ctx =>
        {
            ctx.Response.StatusCode = StatusCodes.Status403Forbidden;
            return Task.CompletedTask;
        };
    });
// [Authorize] 属性によるアクセス制御（認可）を有効化する
builder.Services.AddAuthorization();

// リポジトリ・サービスを DI コンテナに登録する（スコープ単位でインスタンスを生成）
builder.Services.AddScoped<ITodoRepository, TodoRepository>();
builder.Services.AddScoped<ITodoService, TodoService>();
builder.Services.AddScoped<IPriorityRepository, PriorityRepository>();
builder.Services.AddScoped<IPriorityService, PriorityService>();
// 認証機能に必要なリポジトリ・サービスを登録する
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IAuthService, AuthService>();

// MVC コントローラーと OpenAPI（Swagger）仕様の生成を有効化する
builder.Services.AddControllers();
builder.Services.AddOpenApi();

// CORS ポリシーを定義する（フロントエンド開発サーバーからのアクセスを許可）
// 開発環境のみ有効（本番では localhost:5173 へのアクセスを許可しない）
if (builder.Environment.IsDevelopment())
{
    builder.Services.AddCors(options =>
    {
        options.AddPolicy("AllowFrontend", policy =>
        {
            policy.WithOrigins("http://localhost:5173")
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  // Cookie 付きリクエストを許可する（これがないとブラウザが Cookie を送信しない）
                  .AllowCredentials();
        });
    });
}

// ビルダーから WebApplication を生成する
WebApplication app = builder.Build();

// 起動時にマイグレーションを自動適用する（未適用のマイグレーションを DB に反映）
// 開発環境のみ有効（本番では CI/CD パイプラインで手動実行するためスキップ）
// DB に接続できない場合（OpenAPI ドキュメント生成時など）はスキップしてログに記録する
if (app.Environment.IsDevelopment())
{
    // 開発環境のみ OpenAPI 仕様と Scalar UI を公開する
    // JSONにシリアル化されたOpenAPIドキュメントを表示するためのエンドポイントをアプリに追加する。
    app.MapOpenApi();
    app.MapScalarApiReference();
    // CORS ポリシーを適用し、コントローラーのルーティングを登録する（開発環境のみ）
    app.UseCors("AllowFrontend");

    try
    {
        using (IServiceScope scope = app.Services.CreateScope())
        {
            AppDbContext db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            await db.Database.MigrateAsync();

            // admin ユーザーが存在しない場合のみ、appsettings.Development.json の SeedUser 設定をもとに作成する
            IAuthService authService = scope.ServiceProvider.GetRequiredService<IAuthService>();
            await authService.SeedAdminUserAsync();
        }
    }
    catch (Exception ex)
    {
        Log.Warning(ex, "DB migration skipped: {Message}", ex.Message);
    }
}

// Cookie を読んで「誰がアクセスしているか」を確認する（UseAuthorization より先に呼ぶ必要がある）
app.UseAuthentication();
// [Authorize] が付いたエンドポイントへのアクセス可否を判断する
app.UseAuthorization();

// コントローラーのルーティングを登録する
app.MapControllers();
// ヘルスチェックエンドポイント（GET /health）を登録する
app.MapHealthChecks("/health");
// アプリを起動し、リクエストの待ち受けを開始する
await app.RunAsync();
