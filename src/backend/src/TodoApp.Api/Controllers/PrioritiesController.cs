using Microsoft.AspNetCore.Mvc;
using TodoApp.Api.DTOs;
using TodoApp.Api.Models;
using TodoApp.Api.Services;

namespace TodoApp.Api.Controllers;

/// <summary>
/// 優先度APIコントローラー
/// </summary>
[ApiController]
[Route("api/priorities")]
[Produces("application/json")]
public class PrioritiesController(IPriorityService service) : ControllerBase
{
    /// <summary>
    /// 優先度一覧を取得します（削除済み含む）。
    /// </summary>
    /// <returns>全優先度リスト（表示順昇順）</returns>
    /// <response code="200">正常取得</response>
    [HttpGet("all")]
    [ProducesResponseType(typeof(IEnumerable<Priority>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAllAsync()
    {
        IEnumerable<Priority> priorities = await service.GetAllAsync();
        return Ok(priorities);
    }

    /// <summary>
    /// 有効な優先度一覧を取得します。
    /// </summary>
    /// <returns>論理削除されていない優先度リスト（表示順昇順）</returns>
    /// <response code="200">正常取得</response>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<Priority>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAllActiveAsync()
    {
        IEnumerable<Priority> priorities = await service.GetAllActiveAsync();
        return Ok(priorities);
    }

    [HttpPost]
    [ProducesResponseType(typeof(Priority), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateAsync([FromBody] CreatePriorityRequest request)
    {
        Priority priority = await service.CreateAsync(request);
        return Created("/api/priorities", priority);
    }

    /// <summary>
    /// 指定したIDの優先度を更新します。
    /// </summary>
    /// <param name="id">優先度のID</param>
    /// <param name="request">更新内容</param>
    /// <returns>更新後のPriority</returns>
    /// <response code="200">正常更新</response>
    /// <response code="404">対象の優先度が存在しない</response>
    [HttpPut("{id}")]
    [ProducesResponseType(typeof(Priority), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateAsync(string id, UpdatePriorityRequest request)
    {
        Priority? priority = await service.UpdateAsync(id, request);
        if (priority is null) return NotFound();
        return Ok(priority);
    }
}
