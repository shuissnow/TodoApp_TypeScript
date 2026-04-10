using System.ComponentModel.DataAnnotations;

namespace TodoApp.Api.DTOs;

/// <summary>
/// タスク作成リクエスト
/// </summary>
public class CreateTodoRequest
{
    /// <summary>
    /// タスクの内容（必須・最大200文字）
    /// </summary>
    [Required]
    [MinLength(1)]
    [MaxLength(200)]
    public string Text { get; set; } = string.Empty;

    /// <summary>
    /// 期限日（省略可）
    /// </summary>
    public DateOnly? DueDate { get; set; }

    /// <summary>
    /// 優先度ID（省略可）
    /// </summary>
    public string? PriorityId { get; set; }
}
