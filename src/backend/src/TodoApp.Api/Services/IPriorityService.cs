using TodoApp.Api.DTOs;
using TodoApp.Api.Models;

namespace TodoApp.Api.Services;

/// <summary>
/// 優先度サービスのインターフェース
/// </summary>
public interface IPriorityService
{
    /// <summary>
    /// 優先度を登録します。
    /// </summary>
    /// <param name="request">登録内容</param>
    /// <returns></returns>
    Task<Priority> CreateAsync(CreatePriorityRequest request);

    /// <summary>
    /// 論理削除されていない優先度一覧を取得します。
    /// </summary>
    /// <returns>優先度リスト</returns>
    Task<IEnumerable<Priority>> GetAllActiveAsync();

    /// <summary>
    /// 優先度一覧を取得します（削除済み含む）。
    /// </summary>
    /// <returns>優先度リスト</returns>
    Task<IEnumerable<Priority>> GetAllAsync();

    /// <summary>
    /// 指定したIDの優先度を更新します。
    /// </summary>
    /// <param name="id">優先度のID</param>
    /// <param name="request">更新内容</param>
    /// <returns>更新後のPriority。存在しない場合は null。</returns>
    Task<Priority?> UpdateAsync(string id, UpdatePriorityRequest request);
}
