using TodoApp.Api.Models;

namespace TodoApp.Api.Repositories;

/// <summary>
/// 優先度リポジトリのインターフェース
/// </summary>
public interface IPriorityRepository
{
    /// <summary>
    /// 論理削除されていない優先度一覧を表示順で取得します。
    /// </summary>
    /// <returns>優先度リスト</returns>
    Task<IEnumerable<Priority>> GetAllActiveAsync();
}
