namespace TodoApp.Api.DTOs;

/// <summary>
/// Todo一覧取得クエリパラメーター
/// </summary>
public class TodoQueryParams
{
    /// <summary>
    /// 期限日フィルター。null = フィルターなし。
    /// 指定可能な値: today | overdue | this_week | has_due_date | no_due_date
    /// </summary>
    public string? Filter { get; set; }

    /// <summary>
    /// ソートキー。null = 作成日時昇順（デフォルト）。
    /// 指定可能な値: due_date
    /// </summary>
    public string? Sort { get; set; }
}
