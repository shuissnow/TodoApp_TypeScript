using System.Text.Json.Serialization;

namespace TodoApp.Api.Models;

/// <summary>
/// 優先度エンティティ
/// </summary>
public class Priority
{
    /// <summary>
    /// 一意識別子（連番3桁: "001", "002", ...）
    /// </summary>
    public string Id { get; set; } = string.Empty;

    /// <summary>
    /// 優先度名（例: 高, 中, 低）
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// 文字色（hex形式: "#EF4444"）
    /// </summary>
    public string ForegroundColor { get; set; } = string.Empty;

    /// <summary>
    /// 背景色（hex形式: "#FEE2E2"）
    /// </summary>
    public string BackgroundColor { get; set; } = string.Empty;

    /// <summary>
    /// 表示順（昇順）
    /// </summary>
    public int DisplayOrder { get; set; }

    /// <summary>
    /// 論理削除フラグ
    /// </summary>
    public bool IsDeleted { get; set; }

    /// <summary>
    /// 作成日時（UTC）
    /// </summary>
    public DateTime CreatedAt { get; set; }

    /// <summary>
    /// この優先度を持つTodoのコレクション
    /// </summary>
    [JsonIgnore]
    public ICollection<Todo> Todos { get; set; } = [];
}
