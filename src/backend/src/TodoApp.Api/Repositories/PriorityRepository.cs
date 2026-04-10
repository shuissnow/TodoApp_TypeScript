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
    /// 論理削除されていない優先度一覧を表示順で取得します。
    /// </summary>
    /// <returns>優先度リスト</returns>
    public async Task<IEnumerable<Priority>> GetAllActiveAsync() =>
        await context.Priorities
            .Where(p => !p.IsDeleted)
            .OrderBy(p => p.DisplayOrder)
            .ToListAsync();
}
