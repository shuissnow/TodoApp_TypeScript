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
    /// <param name="userId">ログイン中のユーザーID</param>
    /// <returns>Todoリスト</returns>
    public async Task<IEnumerable<Todo>> GetAllAsync(TodoQueryParams queryParams, int userId)
    {
        DateOnly today = DateOnly.FromDateTime(DateTime.UtcNow);

        IQueryable<Todo> query = context.Todos.Include(t => t.Priority).Where(t => t.UserId == userId);

        query = queryParams.Filter switch
        {
            "today" => query.Where(t => t.DueDate == today),
            "overdue" => query.Where(t => t.DueDate != null && t.DueDate < today),
            "this_week" => query.Where(t => t.DueDate >= today && t.DueDate <= today.AddDays(6)),
            "has_due_date" => query.Where(t => t.DueDate != null),
            "no_due_date" => query.Where(t => t.DueDate == null),
            _ => query,
        };

        query = queryParams.Sort switch
        {
            "due_date" => query.OrderBy(t => t.DueDate == null).ThenBy(t => t.DueDate).ThenBy(t => t.CreatedAt),
            _ => query.OrderBy(t => t.CreatedAt),
        };

        return await query.ToListAsync();
    }

    /// <summary>
    /// 指定したIDのタスクを取得します。
    /// </summary>
    /// <param name="id">TodoのID</param>
    /// <param name="userId">ログイン中のユーザーID</param>
    /// <returns>該当するTodo。存在しない場合は null。</returns>
    public async Task<Todo?> GetByIdAsync(int id, int userId)
        => await context.Todos.Include(t => t.Priority).FirstOrDefaultAsync(t => t.UserId == userId && t.Id == id);

    /// <summary>
    /// タスクを保存します。
    /// </summary>
    /// <param name="todo">保存するTodo</param>
    /// <param name="userId">ログイン中のユーザーID</param>
    /// <returns>保存されたTodo</returns>
    public async Task<Todo> CreateAsync(Todo todo, int userId)
    {
        todo.UserId = userId;
        context.Todos.Add(todo);
        await context.SaveChangesAsync();
        return todo;
    }

    /// <summary>
    /// タスクを更新します。
    /// </summary>
    /// <param name="todo">更新するTodo</param>
    /// <param name="userId">ログイン中のユーザーID</param>
    /// <returns>更新後のTodo</returns>
    public async Task<Todo> UpdateAsync(Todo todo, int userId)
    {
        context.Todos.Update(todo);
        await context.SaveChangesAsync();
        return todo;
    }

    /// <summary>
    /// 指定したIDのタスクを削除します。
    /// </summary>
    /// <param name="id">TodoのID</param>
    /// <param name="userId">ログイン中のユーザーID</param>
    /// <returns>削除できた場合は true。存在しない場合は false。</returns>
    public async Task<bool> DeleteAsync(int id, int userId)
    {
        int affectedRows = await context.Todos.Where(t => t.UserId == userId && t.Id == id).ExecuteDeleteAsync();
        return affectedRows > 0;
    }

    /// <summary>
    /// 完了済みタスクをすべて削除します。
    /// </summary>
    /// <param name="userId">ログイン中のユーザーID</param>
    public async Task DeleteCompletedAsync(int userId)
    {
        await context.Todos.Where(t => t.UserId == userId && t.Completed).ExecuteDeleteAsync();
    }
}
