using System.ComponentModel.DataAnnotations;

namespace TodoApp.Api.DTOs;

/// <summary>
/// ログインリクエスト
/// </summary>
public class LoginRequest
{
    /// <summary>
    /// ユーザー名（必須）
    /// </summary>
    [Required]
    public required string Username { get; set; }

    /// <summary>
    /// パスワード（必須）
    /// </summary>
    [Required]
    public required string Password { get; set; }
}
