namespace TodoApp.Api.Models;

public class User
{
    /// <summary>
    /// ユーザーID
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// ユーザ名
    /// </summary>
    public required string Username { get; set; }

    /// <summary>
    /// ハッシュ済パスワード
    /// </summary>
    public required string PasswordHash { get; set; }

    /// <summary>
    /// 作成日時（UTC）
    /// </summary>
    public DateTime CreatedAt { get; set; }

    /// <summary>
    /// Userに紐づくTodoリスト
    /// </summary>
    public ICollection<Todo> Todos { get; set; } = [];
}
