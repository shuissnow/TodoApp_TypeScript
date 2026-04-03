using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using Serilog;
using Serilog.Filters;
using TodoApp.Api.Data;
using TodoApp.Api.Repositories;
using TodoApp.Api.Services;

// WebApplicationBuilder を生成し、設定・DI・ミドルウェアを構成する
var builder = WebApplication.CreateBuilder(args);

// Serilog を設定する（通常ログと SQL ログを別ファイルに出力）
builder.Host.UseSerilog((context, configuration) =>
{
    configuration
        .ReadFrom.Configuration(context.Configuration)
        .WriteTo.Logger(lc => lc
            .Filter.ByExcluding(Matching.FromSource("Microsoft.EntityFrameworkCore.Database.Command"))
            .WriteTo.File(
                path: "logs/app-.log",
                rollingInterval: RollingInterval.Day,
                outputTemplate: "{Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz} [{Level:u3}] {Message:lj}{NewLine}{Exception}"))
        .WriteTo.Logger(lc => lc
            .Filter.ByIncludingOnly(Matching.FromSource("Microsoft.EntityFrameworkCore.Database.Command"))
            .WriteTo.File(
                path: "logs/sql-.log",
                rollingInterval: RollingInterval.Day,
                outputTemplate: "{Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz} [{Level:u3}] {Message:lj}{NewLine}{Exception}"));
});

// PostgreSQL への接続を構成する（接続文字列は appsettings.json / 環境変数から取得）
builder.Services.AddDbContext<AppDbContext>(options => options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// リポジトリ・サービスを DI コンテナに登録する（スコープ単位でインスタンスを生成）
builder.Services.AddScoped<ITodoRepository, TodoRepository>();
builder.Services.AddScoped<ITodoService, TodoService>();

// MVC コントローラーと OpenAPI（Swagger）仕様の生成を有効化する
builder.Services.AddControllers();
builder.Services.AddOpenApi();

// CORS ポリシーを定義する（フロントエンド開発サーバーからのアクセスを許可）
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// ビルダーから WebApplication を生成する
var app = builder.Build();

// 起動時にマイグレーションを自動適用する（未適用のマイグレーションを DB に反映）
using (IServiceScope scope = app.Services.CreateScope())
{
    AppDbContext db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

// 開発環境のみ OpenAPI 仕様と Scalar UI を公開する
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

// CORS ポリシーを適用し、コントローラーのルーティングを登録する
app.UseCors("AllowFrontend");
app.MapControllers();

app.Run();
