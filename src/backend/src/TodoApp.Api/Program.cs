using System.Globalization;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using Serilog;
using Serilog.Filters;
using TodoApp.Api.Data;
using TodoApp.Api.Repositories;
using TodoApp.Api.Services;

// WebApplicationBuilderを生成し、設定・DI・ミドルウェアを構成する
WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

// Serilog を設定する（通常ログと SQL ログを別ファイルに出力）
builder.Host.UseSerilog((context, configuration) =>
{
    // src/log/ ディレクトリにログを出力する（ContentRootPath から3階層上が src/）
    string logDir = Path.GetFullPath(Path.Combine(context.HostingEnvironment.ContentRootPath, "..", "..", "..", "log"));
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

// リポジトリ・サービスを DI コンテナに登録する（スコープ単位でインスタンスを生成）
builder.Services.AddScoped<ITodoRepository, TodoRepository>();
builder.Services.AddScoped<ITodoService, TodoService>();

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
                  .AllowAnyMethod();
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
#pragma warning disable S6966 // Awaitable method should be used
            db.Database.Migrate();
#pragma warning restore S6966 // Awaitable method should be used
        }
    }
    catch (Exception ex)
    {
        Log.Warning(ex, "DB migration skipped: {Message}", ex.Message);
    }
}

// コントローラーのルーティングを登録する
app.MapControllers();
// ヘルスチェックエンドポイント（GET /health）を登録する
app.MapHealthChecks("/health");
// アプリを起動し、リクエストの待ち受けを開始する
#pragma warning disable S6966 // Awaitable method should be used
app.Run();
#pragma warning restore S6966 // Awaitable method should be used
