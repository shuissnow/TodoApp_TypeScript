using Microsoft.EntityFrameworkCore;
using TodoApp.Api.Data;
using TodoApp.Api.DTOs;
using TodoApp.Api.Models;

namespace TodoApp.Api.Repositories;

/// <summary>
/// Todoリポジトリの実装
/// </summary>
public class TodoRepository(AppDbContext context) : ITodoRepository
{
    /// <summary>
    /// クエリパラメーターに基づいてタスク一覧を取得します。
    /// </summary>
    /// <param name="queryParams">フィルター・ソート条件</param>
    /// <returns>Todoリスト</returns>
    public async Task<IEnumerable<Todo>> GetAllAsync(TodoQueryParams queryParams)
    {
        DateOnly today = DateOnly.FromDateTime(DateTime.UtcNow);

        IQueryable<Todo> query = context.Todos;

        query = queryParams.Filter switch
        {
            "today"        => query.Where(t => t.DueDate == today),
            "overdue"      => query.Where(t => t.DueDate != null && t.DueDate < today),
            "this_week"    => query.Where(t => t.DueDate >= today && t.DueDate <= today.AddDays(6)),
            "has_due_date" => query.Where(t => t.DueDate != null),
            "no_due_date"  => query.Where(t => t.DueDate == null),
            _              => query,
        };

        query = queryParams.Sort switch
        {
            "due_date" => query.OrderBy(t => t.DueDate == null).ThenBy(t => t.DueDate).ThenBy(t => t.CreatedAt),
            _          => query.OrderBy(t => t.CreatedAt),
        };

        return await query.ToListAsync();
    }

    /// <summary>
    /// 指定したIDのタスクを取得します。
    /// </summary>
    /// <param name="id">TodoのID</param>
    /// <returns>該当するTodo。存在しない場合は null。</returns>
    public async Task<Todo?> GetByIdAsync(int id) => await context.Todos.FindAsync(id);

    /// <summary>
    /// タスクを保存します。
    /// </summary>
    /// <param name="todo">保存するTodo</param>
    /// <returns>保存されたTodo</returns>
    public async Task<Todo> CreateAsync(Todo todo)
    {
        context.Todos.Add(todo);
        await context.SaveChangesAsync();
        return todo;
    }

    /// <summary>
    /// タスクを更新します。
    /// </summary>
    /// <param name="todo">更新するTodo</param>
    /// <returns>更新後のTodo</returns>
    public async Task<Todo> UpdateAsync(Todo todo)
    {
        context.Todos.Update(todo);
        await context.SaveChangesAsync();
        return todo;
    }

    /// <summary>
    /// 指定したIDのタスクを削除します。
    /// </summary>
    /// <param name="id">TodoのID</param>
    /// <returns>削除できた場合は true。存在しない場合は false。</returns>
    public async Task<bool> DeleteAsync(int id)
    {
        int affectedRows = await context.Todos.Where(t => t.Id == id).ExecuteDeleteAsync();
        return affectedRows > 0;
    }

    /// <summary>
    /// 完了済みタスクをすべて削除します。
    /// </summary>
    public async Task DeleteCompletedAsync()
    {
        await context.Todos.Where(t => t.Completed).ExecuteDeleteAsync();
    }
}
