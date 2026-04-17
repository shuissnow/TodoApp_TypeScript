namespace TodoApp.Api.Models;

/// <summary>
/// Todoエンティティ
/// </summary>
public class Todo
{
    /// <summary>
    /// 一意識別子
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// タスクの内容（最大200文字）
    /// </summary>
    public string Text { get; set; } = string.Empty;

    /// <summary>
    /// 完了状態
    /// </summary>
    public bool Completed { get; set; }

    /// <summary>
    /// 作成日時（UTC）
    /// </summary>
    public DateTime CreatedAt { get; set; }

    /// <summary>
    /// 期限日（省略可）
    /// </summary>
    public DateOnly? DueDate { get; set; }

    /// <summary>
    /// 優先度ID（省略可）
    /// </summary>
    public string? PriorityId { get; set; }

    /// <summary>
    /// 優先度（ナビゲーションプロパティ）
    /// </summary>
    public Priority? Priority { get; set; }

    /// <summary>
    /// ユーザーID（省略可）
    /// </summary>
    public int? UserId { get; set; }

    /// <summary>
    /// ユーザー（ナビゲーションプロパティ）
    /// </summary>
    public User? User { get; set; }
}
