using Microsoft.EntityFrameworkCore;
using TodoApp.Api.Data;
using TodoApp.Api.Models;

namespace TodoApp.Api.Repositories;

/// <summary>
/// Todoリポジトリの実装
/// </summary>
public class TodoRepository(AppDbContext context) : ITodoRepository
{
    /// <summary>
    /// 全タスクを取得します。
    /// </summary>
    /// <returns>Todoリスト（作成日時昇順）</returns>
    public async Task<IEnumerable<Todo>> GetAllAsync() => await context.Todos.OrderBy(t => t.CreatedAt).ToListAsync();

    /// <summary>
    /// 指定したIDのタスクを取得します。
    /// </summary>
    /// <param name="id">TodoのID</param>
    /// <returns>該当するTodo。存在しない場合は null。</returns>
    public async Task<Todo?> GetByIdAsync(Guid id) => await context.Todos.FindAsync(id);

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
    /// タスクを削除します。
    /// </summary>
    /// <param name="todo">削除するTodo</param>
    public async Task DeleteAsync(Todo todo)
    {
        context.Todos.Remove(todo);
        await context.SaveChangesAsync();
    }

    /// <summary>
    /// 完了済みタスクをすべて削除します。
    /// </summary>
    public async Task DeleteCompletedAsync()
    {
        List<Todo> completed = await context.Todos.Where(t => t.Completed).ToListAsync();
        context.Todos.RemoveRange(completed);
        await context.SaveChangesAsync();
    }
}
