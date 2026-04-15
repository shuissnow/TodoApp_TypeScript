using TodoApp.Api.Models;

namespace TodoApp.Api.Repositories;

/// <summary>
/// 優先度リポジトリのインターフェース
/// </summary>
public interface IPriorityRepository
{
    /// <summary>
    /// 優先度を登録します。
    /// </summary>
    /// <param name="priority"></param>
    /// <returns></returns>
    Task<Priority> CreateAsync(Priority priority);

    /// <summary>
    /// 優先度一覧を取得します。
    /// </summary>
    /// <returns>Priorityリスト</returns>
    Task<IEnumerable<Priority>> GetAllAsync();

    /// <summary>
    /// 論理削除されていない優先度一覧を表示順で取得します。
    /// </summary>
    /// <returns>Priorityリスト</returns>
    Task<IEnumerable<Priority>> GetAllActiveAsync();

    /// <summary>
    /// Idに紐づく優先度を取得します。
    /// </summary>
    /// <returns>Priority</returns>
    Task<Priority?> GetByIdAsync(string id);

    /// <summary>
    /// 優先度を更新します。
    /// </summary>
    /// <returns>Priority</returns>
    Task<Priority> UpdateAsync(Priority priority);
}
