using TodoApp.Api.DTOs;
using TodoApp.Api.Models;
using TodoApp.Api.Repositories;

namespace TodoApp.Api.Services;

/// <summary>
/// Todoサービスの実装
/// </summary>
public class TodoService(ITodoRepository repository) : ITodoService
{
    /// <summary>
    /// 全タスクを取得します。
    /// </summary>
    /// <returns>Todoリスト</returns>
    public Task<IEnumerable<Todo>> GetAllAsync() => repository.GetAllAsync();

    /// <summary>
    /// タスクを作成します。
    /// </summary>
    /// <param name="request">作成内容</param>
    /// <returns>作成されたTodo</returns>
    public async Task<Todo> CreateAsync(CreateTodoRequest request)
    {
        Todo todo = new()
        {
            Id = Guid.NewGuid(),
            Text = request.Text.Trim(),
            Completed = false,
            CreatedAt = DateTime.UtcNow,
        };
        return await repository.CreateAsync(todo);
    }

    /// <summary>
    /// 指定したIDのタスクを更新します。
    /// </summary>
    /// <param name="id">TodoのID</param>
    /// <param name="request">更新内容</param>
    /// <returns>更新後のTodo。存在しない場合は null。</returns>
    public async Task<Todo?> UpdateAsync(Guid id, UpdateTodoRequest request)
    {
        Todo? todo = await repository.GetByIdAsync(id);
        if (todo is null) return null;

        if (request.Text is not null) todo.Text = request.Text.Trim();
        if (request.Completed is not null) todo.Completed = request.Completed.Value;

        return await repository.UpdateAsync(todo);
    }

    /// <summary>
    /// 指定したIDのタスクを削除します。
    /// </summary>
    /// <param name="id">TodoのID</param>
    /// <returns>削除できた場合は true。存在しない場合は false。</returns>
    public Task<bool> DeleteAsync(Guid id) => repository.DeleteAsync(id);

    /// <summary>
    /// 完了済みタスクをすべて削除します。
    /// </summary>
    public Task DeleteCompletedAsync() => repository.DeleteCompletedAsync();
}
