using TodoApp.Api.DTOs;
using TodoApp.Api.Models;

namespace TodoApp.Api.Repositories;

/// <summary>
/// Todoリポジトリのインターフェース
/// </summary>
public interface ITodoRepository
{
    /// <summary>
    /// クエリパラメーターに基づいてタスク一覧を取得します。
    /// </summary>
    /// <param name="queryParams">フィルター・ソート条件</param>
    /// <param name="userId">ログイン中のユーザーID</param>
    /// <returns>Todoリスト</returns>
    Task<IEnumerable<Todo>> GetAllAsync(TodoQueryParams queryParams, int userId);

    /// <summary>
    /// 指定したIDのタスクを取得します。
    /// </summary>
    /// <param name="id">TodoのID</param>
    /// <param name="userId">ログイン中のユーザーID</param>
    /// <returns>該当するTodo。存在しない場合は null。</returns>
    Task<Todo?> GetByIdAsync(int id, int userId);

    /// <summary>
    /// タスクを保存します。
    /// </summary>
    /// <param name="todo">保存するTodo</param>
    /// <param name="userId">ログイン中のユーザーID</param>
    /// <returns>保存されたTodo</returns>
    Task<Todo> CreateAsync(Todo todo, int userId);

    /// <summary>
    /// タスクを更新します。
    /// </summary>
    /// <param name="todo">更新するTodo</param>
    /// <param name="userId">ログイン中のユーザーID</param>
    /// <returns>更新後のTodo</returns>
    Task<Todo> UpdateAsync(Todo todo, int userId);

    /// <summary>
    /// 指定したIDのタスクを削除します。
    /// </summary>
    /// <param name="id">TodoのID</param>
    /// <param name="userId">ログイン中のユーザーID</param>
    /// <returns>削除できた場合は true。存在しない場合は false。</returns>
    Task<bool> DeleteAsync(int id, int userId);

    /// <summary>
    /// 完了済みタスクをすべて削除します。
    /// </summary>
    /// <param name="userId">ログイン中のユーザーID</param>
    Task DeleteCompletedAsync(int userId);


}
