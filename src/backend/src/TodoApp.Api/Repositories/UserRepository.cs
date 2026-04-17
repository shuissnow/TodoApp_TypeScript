using Microsoft.EntityFrameworkCore;
using TodoApp.Api.Data;
using TodoApp.Api.Models;

namespace TodoApp.Api.Repositories;

/// <summary>
/// Userリポジトリの実装
/// </summary>
public class UserRepository(AppDbContext context) : IUserRepository
{
    /// <summary>
    /// ユーザーを作成します。
    /// </summary>
    /// <param name="user">作成するUser</param>
    /// <returns>作成されたUser</returns>
    public async Task<User> CreateAsync(User user)
    {
        context.Users.Add(user);
        await context.SaveChangesAsync();
        return user;
    }

    /// <summary>
    /// 指定したユーザー名のユーザーが存在するか確認します。
    /// </summary>
    /// <param name="username">ユーザー名</param>
    /// <returns>存在する場合は true。存在しない場合は false。</returns>
    public async Task<bool> ExistsAsync(string username) => await context.Users.AnyAsync(u => u.Username == username);

    /// <summary>
    /// ユーザー名でユーザーを検索します。
    /// </summary>
    /// <param name="username">ユーザー名</param>
    /// <returns>該当するUser。存在しない場合は null。</returns>
    public async Task<User?> FindByUsernameAsync(string username) => await context.Users.FirstOrDefaultAsync(u => u.Username == username);
}
