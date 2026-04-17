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
    /// クエリパラメーターに基づいてタスク一覧を取得します。
    /// </summary>
    /// <param name="queryParams">フィルター・ソート条件</param>
    /// <param name="userId">ログイン中のユーザーID</param>
    /// <returns>Todoリスト</returns>
    public Task<IEnumerable<Todo>> GetAllAsync(TodoQueryParams queryParams, int userId) => repository.GetAllAsync(queryParams, userId);

    /// <summary>
    /// タスクを作成します。
    /// </summary>
    /// <param name="request">作成内容</param>
    /// <param name="userId">ログイン中のユーザーID</param>
    /// <returns>作成されたTodo</returns>
    public async Task<Todo> CreateAsync(CreateTodoRequest request, int userId)
    {
        Todo todo = new()
        {
            Text = request.Text.Trim(),
            Completed = false,
            CreatedAt = DateTime.UtcNow,
            DueDate = request.DueDate,
            PriorityId = request.PriorityId,
        };
        return await repository.CreateAsync(todo, userId);
    }

    /// <summary>
    /// 指定したIDのタスクを更新します。
    /// </summary>
    /// <param name="id">TodoのID</param>
    /// <param name="request">更新内容</param>
    /// <param name="userId">ログイン中のユーザーID</param>
    /// <returns>更新後のTodo。存在しない場合は null。</returns>
    public async Task<Todo?> UpdateAsync(int id, UpdateTodoRequest request, int userId)
    {
        Todo? todo = await repository.GetByIdAsync(id, userId);
        if (todo is null) return null;

        if (request.Text is not null) todo.Text = request.Text.Trim();
        if (request.Completed is not null) todo.Completed = request.Completed.Value;
        if (request.ResetDueDate == true) todo.DueDate = null;
        else if (request.DueDate is not null) todo.DueDate = request.DueDate;
        if (request.PriorityId is not null) todo.PriorityId = request.PriorityId;

        return await repository.UpdateAsync(todo, userId);
    }

    /// <summary>
    /// 指定したIDのタスクを削除します。
    /// </summary>
    /// <param name="id">TodoのID</param>
    /// <param name="userId">ログイン中のユーザーID</param>
    /// <returns>削除できた場合は true。存在しない場合は false。</returns>
    public Task<bool> DeleteAsync(int id, int userId) => repository.DeleteAsync(id, userId);

    /// <summary>
    /// 完了済みタスクをすべて削除します。
    /// </summary>
    /// <param name="userId">ログイン中のユーザーID</param>
    public Task DeleteCompletedAsync(int userId) => repository.DeleteCompletedAsync(userId);
}
