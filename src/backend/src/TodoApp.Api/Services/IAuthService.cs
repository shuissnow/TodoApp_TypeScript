using TodoApp.Api.Models;

namespace TodoApp.Api.Services;

/// <summary>
/// 認証サービスのインターフェース
/// </summary>
public interface IAuthService
{
    /// <summary>
    /// ユーザー名とパスワードを検証します。
    /// </summary>
    /// <param name="username">ユーザー名</param>
    /// <param name="password">パスワード（平文）</param>
    /// <returns>認証成功時はUser。失敗時は null。</returns>
    Task<User?> ValidateAsync(string username, string password);

    /// <summary>
    /// シードユーザー（admin）が存在しない場合に作成します。
    /// </summary>
    Task SeedAdminUserAsync();
}
