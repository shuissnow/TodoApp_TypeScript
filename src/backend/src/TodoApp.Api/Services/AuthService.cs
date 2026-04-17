using Microsoft.AspNetCore.Identity;
using TodoApp.Api.Models;
using TodoApp.Api.Repositories;

namespace TodoApp.Api.Services;

/// <summary>
/// 認証サービスの実装
/// </summary>
public class AuthService(IUserRepository userRepository, IConfiguration configuration) : IAuthService
{
    /// <summary>
    /// シードユーザー（admin）が存在しない場合に作成します。
    /// </summary>
    public async Task SeedAdminUserAsync()
    {
        // 設定からユーザー名・パスワードを取得kai
        string username = configuration["SeedUser:Username"] ?? "admin";
        string password = configuration["SeedUser:Password"] ?? "P@ssw0rd";

        if (await userRepository.ExistsAsync(username)) return;

        PasswordHasher<User> hasher = new();
        User user = new()
        {
            Username = username,
            PasswordHash = string.Empty,
            CreatedAt = DateTime.UtcNow,
        };

        user.PasswordHash = hasher.HashPassword(user, password);

        await userRepository.CreateAsync(user);
    }

    /// <summary>
    /// ユーザー名とパスワードを検証します。
    /// </summary>
    /// <param name="username">ユーザー名</param>
    /// <param name="password">パスワード（平文）</param>
    /// <returns>認証成功時はUser。失敗時は null。</returns>
    public async Task<User?> ValidateAsync(string username, string password)
    {
        User? user = await userRepository.FindByUsernameAsync(username);
        if (user == null) return null;

        PasswordHasher<User> hasher = new();
        PasswordVerificationResult result = hasher.VerifyHashedPassword(user, user.PasswordHash, password);

        return result == PasswordVerificationResult.Success ? user : null;
    }
}
