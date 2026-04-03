using TodoApp.Api.DTOs;
using TodoApp.Api.Models;

namespace TodoApp.Api.Services;

/// <summary>
/// Todoサービスのインターフェース
/// </summary>
public interface ITodoService
{
    /// <summary>
    /// 全タスクを取得します。
    /// </summary>
    /// <returns>Todoリスト</returns>
    Task<IEnumerable<Todo>> GetAllAsync();

    /// <summary>
    /// タスクを作成します。
    /// </summary>
    /// <param name="request">作成内容</param>
    /// <returns>作成されたTodo</returns>
    Task<Todo> CreateAsync(CreateTodoRequest request);

    /// <summary>
    /// 指定したIDのタスクを更新します。
    /// </summary>
    /// <param name="id">TodoのID</param>
    /// <param name="request">更新内容</param>
    /// <returns>更新後のTodo。存在しない場合は null。</returns>
    Task<Todo?> UpdateAsync(Guid id, UpdateTodoRequest request);

    /// <summary>
    /// 指定したIDのタスクを削除します。
    /// </summary>
    /// <param name="id">TodoのID</param>
    /// <returns>削除できた場合は true。存在しない場合は false。</returns>
    Task<bool> DeleteAsync(Guid id);

    /// <summary>
    /// 完了済みタスクをすべて削除します。
    /// </summary>
    Task DeleteCompletedAsync();
}
