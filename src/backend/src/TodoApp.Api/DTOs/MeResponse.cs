namespace TodoApp.Api.DTOs;

/// <summary>
/// ログイン中ユーザー情報レスポンス
/// </summary>
public class MeResponse
{
    /// <summary>
    /// ユーザーID
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// ユーザー名
    /// </summary>
    public required string Username { get; set; }
}
