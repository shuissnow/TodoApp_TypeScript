using TodoApp.Api.DTOs;
using TodoApp.Api.Models;


namespace TodoApp.Api.Services;

/// <summary>
/// Todoサービスのインターフェース
/// </summary>
public interface ITodoService
{
    /// <summary>
    /// クエリパラメーターに基づいてタスク一覧を取得します。
    /// </summary>
    /// <param name="queryParams">フィルター・ソート条件</param>
    /// <returns>Todoリスト</returns>
    Task<IEnumerable<Todo>> GetAllAsync(TodoQueryParams queryParams);

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
    Task<Todo?> UpdateAsync(int id, UpdateTodoRequest request);

    /// <summary>
    /// 指定したIDのタスクを削除します。
    /// </summary>
    /// <param name="id">TodoのID</param>
    /// <returns>削除できた場合は true。存在しない場合は false。</returns>
    Task<bool> DeleteAsync(int id);

    /// <summary>
    /// 完了済みタスクをすべて削除します。
    /// </summary>
    Task DeleteCompletedAsync();
}
