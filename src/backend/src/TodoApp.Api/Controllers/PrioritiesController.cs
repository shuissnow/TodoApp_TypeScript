using Microsoft.AspNetCore.Mvc;
using TodoApp.Api.Models;
using TodoApp.Api.Repositories;

namespace TodoApp.Api.Controllers;

/// <summary>
/// 優先度APIコントローラー
/// </summary>
[ApiController]
[Route("api/priorities")]
[Produces("application/json")]
public class PrioritiesController(IPriorityRepository repository) : ControllerBase
{
    /// <summary>
    /// 優先度一覧を取得します。
    /// </summary>
    /// <returns>論理削除されていない優先度リスト（表示順昇順）</returns>
    /// <response code="200">正常取得</response>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<Priority>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAllAsync()
    {
        IEnumerable<Priority> priorities = await repository.GetAllActiveAsync();
        return Ok(priorities);
    }
}
