using System.ComponentModel.DataAnnotations;

namespace TodoApp.Api.DTOs;

/// <summary>
/// タスク更新リクエスト
/// </summary>
public class UpdateTodoRequest
{
    /// <summary>
    /// タスクの内容（省略可・最大200文字）
    /// </summary>
    [MinLength(1)]
    [MaxLength(200)]
    public string? Text { get; set; }

    /// <summary>
    /// 完了状態（省略可）
    /// </summary>
    public bool? Completed { get; set; }

    /// <summary>
    /// 期限日（省略可）
    /// </summary>
    public DateOnly? DueDate { get; set; }

    /// <summary>
    /// true のとき期限日を null にリセットする
    /// </summary>
    public bool? ResetDueDate { get; set; }

    /// <summary>
    /// 優先度ID（省略可）
    /// </summary>
    public string? PriorityId { get; set; }
}
