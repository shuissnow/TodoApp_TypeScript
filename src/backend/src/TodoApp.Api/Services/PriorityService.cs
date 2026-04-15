using TodoApp.Api.DTOs;
using TodoApp.Api.Models;
using TodoApp.Api.Repositories;

namespace TodoApp.Api.Services;

/// <summary>
/// 優先度サービスの実装
/// </summary>
public class PriorityService(IPriorityRepository repository) : IPriorityService
{
    /// <summary>
    /// 優先度を登録します。
    /// </summary>
    /// <param name="request"></param>
    /// <returns></returns>
    /// <exception cref="NotImplementedException"></exception>
    public async Task<Priority> CreateAsync(CreatePriorityRequest request)
    {
        Priority priority = new()
        {
            Id = request.Id,
            Name = request.Name,
            ForegroundColor = request.ForegroundColor,
            BackgroundColor = request.BackgroundColor,
            DisplayOrder = request.DisplayOrder,
            IsDeleted = request.IsDeleted,
        };

        return await repository.CreateAsync(priority);
    }

    /// <summary>
    /// 優先度一覧を取得します（削除済み含む）。
    /// </summary>
    /// <returns>優先度リスト</returns>
    public Task<IEnumerable<Priority>> GetAllAsync() => repository.GetAllAsync();

    /// <summary>
    /// 論理削除されていない優先度一覧を取得します。
    /// </summary>
    /// <returns>優先度リスト</returns>
    public Task<IEnumerable<Priority>> GetAllActiveAsync() => repository.GetAllActiveAsync();

    /// <summary>
    /// 指定したIDの優先度を更新します。
    /// </summary>
    /// <param name="id">優先度のID</param>
    /// <param name="request">更新内容</param>
    /// <returns>更新後のPriority。存在しない場合は null。</returns>
    public async Task<Priority?> UpdateAsync(string id, UpdatePriorityRequest request)
    {
        Priority? priority = await repository.GetByIdAsync(id);
        if (priority is null) return null;

        if (request.Name is not null) priority.Name = request.Name;
        if (request.ForegroundColor is not null) priority.ForegroundColor = request.ForegroundColor;
        if (request.BackgroundColor is not null) priority.BackgroundColor = request.BackgroundColor;
        if (request.DisplayOrder is not null) priority.DisplayOrder = request.DisplayOrder.Value;
        if (request.IsDeleted is not null) priority.IsDeleted = request.IsDeleted.Value;

        return await repository.UpdateAsync(priority);
    }


}
