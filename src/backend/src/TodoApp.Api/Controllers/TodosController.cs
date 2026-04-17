using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TodoApp.Api.DTOs;
using TodoApp.Api.Models;
using TodoApp.Api.Services;
namespace TodoApp.Api.Controllers;

/// <summary>
/// TODOAPIコントローラー
/// </summary>
[ApiController]
[Route("api/todos")]
[Produces("application/json")]
[Authorize]
public class TodosController(ITodoService service) : ControllerBase
{
    /// <summary>
    /// タスク一覧を取得します。
    /// </summary>
    /// <param name="queryParams">フィルター・ソート条件</param>
    /// <returns>Todoリスト</returns>
    /// <response code="200">正常取得</response>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<Todo>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAllAsync([FromQuery] TodoQueryParams queryParams)
    {
        int userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!, System.Globalization.CultureInfo.InvariantCulture);
        IEnumerable<Todo> todos = await service.GetAllAsync(queryParams, userId);
        return Ok(todos);
    }

    /// <summary>
    /// タスクを作成します。
    /// </summary>
    /// <param name="request">作成内容</param>
    /// <returns>作成されたTodo</returns>
    /// <response code="201">作成成功</response>
    /// <response code="400">バリデーションエラー</response>
    [HttpPost]
    [ProducesResponseType(typeof(Todo), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateAsync([FromBody] CreateTodoRequest request)
    {
        int userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!, System.Globalization.CultureInfo.InvariantCulture);
        Todo todo = await service.CreateAsync(request, userId);
        return Created("/api/todos", todo);
    }

    /// <summary>
    /// 指定したIDのタスクを更新します。
    /// </summary>
    /// <param name="id">TodoのID</param>
    /// <param name="request">更新内容</param>
    /// <returns>更新後のTodo</returns>
    /// <response code="200">更新成功</response>
    /// <response code="400">バリデーションエラー</response>
    /// <response code="404">対象Todoが存在しない</response>
    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(Todo), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateAsync(int id, [FromBody] UpdateTodoRequest request)
    {
        int userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!, System.Globalization.CultureInfo.InvariantCulture);
        Todo? todo = await service.UpdateAsync(id, request, userId);
        if (todo is null) return NotFound();
        return Ok(todo);
    }

    /// <summary>
    /// 完了済みタスクをすべて削除します。
    /// </summary>
    /// <response code="204">削除成功</response>
    [HttpDelete("completed")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> DeleteCompletedAsync()
    {
        int userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!, System.Globalization.CultureInfo.InvariantCulture);
        await service.DeleteCompletedAsync(userId);
        return NoContent();
    }

    /// <summary>
    /// 指定したIDのタスクを削除します。
    /// </summary>
    /// <param name="id">TodoのID</param>
    /// <response code="204">削除成功</response>
    /// <response code="404">対象Todoが存在しない</response>
    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteAsync(int id)
    {
        int userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!, System.Globalization.CultureInfo.InvariantCulture);
        bool deleted = await service.DeleteAsync(id, userId);
        if (!deleted) return NotFound();
        return NoContent();
    }
}
