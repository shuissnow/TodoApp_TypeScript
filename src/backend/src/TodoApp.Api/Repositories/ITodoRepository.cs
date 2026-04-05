using TodoApp.Api.Models;

namespace TodoApp.Api.Repositories;

/// <summary>
/// Todoリポジトリのインターフェース
/// </summary>
public interface ITodoRepository
{
    /// <summary>
    /// 全タスクを取得します。
    /// </summary>
    /// <returns>Todoリスト</returns>
    Task<IEnumerable<Todo>> GetAllAsync();

    /// <summary>
    /// 指定したIDのタスクを取得します。
    /// </summary>
    /// <param name="id">TodoのID</param>
    /// <returns>該当するTodo。存在しない場合は null。</returns>
    Task<Todo?> GetByIdAsync(Guid id);

    /// <summary>
    /// タスクを保存します。
    /// </summary>
    /// <param name="todo">保存するTodo</param>
    /// <returns>保存されたTodo</returns>
    Task<Todo> CreateAsync(Todo todo);

    /// <summary>
    /// タスクを更新します。
    /// </summary>
    /// <param name="todo">更新するTodo</param>
    /// <returns>更新後のTodo</returns>
    Task<Todo> UpdateAsync(Todo todo);

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
