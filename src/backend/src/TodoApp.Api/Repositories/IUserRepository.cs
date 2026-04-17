using TodoApp.Api.Models;

namespace TodoApp.Api.Repositories;

/// <summary>
/// Userリポジトリのインターフェース
/// </summary>
public interface IUserRepository
{
    /// <summary>
    /// ユーザー名でユーザーを検索します。
    /// </summary>
    /// <param name="username">ユーザー名</param>
    /// <returns>該当するUser。存在しない場合は null。</returns>
    Task<User?> FindByUsernameAsync(string username);

    /// <summary>
    /// 指定したユーザー名のユーザーが存在するか確認します。
    /// </summary>
    /// <param name="username">ユーザー名</param>
    /// <returns>存在する場合は true。存在しない場合は false。</returns>
    Task<bool> ExistsAsync(string username);

    /// <summary>
    /// ユーザーを作成します。
    /// </summary>
    /// <param name="user">作成するUser</param>
    /// <returns>作成されたUser</returns>
    Task<User> CreateAsync(User user);
}
