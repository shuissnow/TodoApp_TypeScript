using Microsoft.EntityFrameworkCore;
using TodoApp.Api.Data;
using TodoApp.Api.Models;

namespace TodoApp.Api.Repositories;

/// <summary>
/// 優先度リポジトリの実装
/// </summary>
public class PriorityRepository(AppDbContext context) : IPriorityRepository
{
    /// <summary>
    /// 優先度一覧を表示順で取得します。
    /// </summary>
    /// <returns>優先度リスト</returns>
    public async Task<IEnumerable<Priority>> GetAllAsync() => await context.Priorities
        .OrderBy(p => p.DisplayOrder)
        .ToListAsync();

    /// <summary>
    /// 論理削除されていない優先度一覧を表示順で取得します。
    /// </summary>
    /// <returns>優先度リスト</returns>
    public async Task<IEnumerable<Priority>> GetAllActiveAsync() => await context.Priorities
        .Where(p => !p.IsDeleted)
        .OrderBy(p => p.DisplayOrder)
        .ToListAsync();

    /// <summary>
    /// ID紐づく優先度を取得します。
    /// </summary>
    /// <param name="id">ID</param>
    /// <returns>優先度</returns>
    public async Task<Priority?> GetByIdAsync(string id)
    {
        return await context.Priorities.FirstOrDefaultAsync(x => x.Id == id);
    }

    /// <summary>
    /// 優先度を更新します。
    /// </summary>
    /// <param name="priority">更新対象の優先度データ</param>
    /// <returns></returns>
    public async Task<Priority> UpdateAsync(Priority priority)
    {
        context.Priorities.Update(priority);
        await context.SaveChangesAsync();
        return priority;
    }

    /// <summary>
    /// 優先度を登録します。
    /// </summary>
    /// <param name="priority">登録対象の優先度データ</param>
    /// <returns></returns>
    public async Task<Priority> CreateAsync(Priority priority)
    {
        context.Priorities.Add(priority);
        await context.SaveChangesAsync();
        return priority;
    }
}
