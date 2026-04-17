using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TodoApp.Api.DTOs;
using TodoApp.Api.Models;
using TodoApp.Api.Services;

namespace TodoApp.Api.Controllers;

[ApiController]
[Route("api/auth")]
[Produces("application/json")]
public class AuthController(IAuthService authService) : ControllerBase
{
    /// <summary>
    /// ログインします。
    /// </summary>
    /// <param name="request">ログインリクエスト（ユーザー名・パスワード）</param>
    /// <returns>ログイン中ユーザー情報</returns>
    /// <response code="200">認証成功。Set-Cookie ヘッダーにセッション Cookie が付与されます。</response>
    /// <response code="401">認証失敗。ユーザー名またはパスワードが誤っています。</response>
    [HttpPost("login")]
    [ProducesResponseType(typeof(MeResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> LoginAsync([FromBody] LoginRequest request)
    {
        // ユーザー名とパスワードを検証します。一致しない場合は 401 を返します。
        User? user = await authService.ValidateAsync(request.Username, request.Password);
        if (user == null) return Unauthorized();

        // Cookie に保存するユーザー情報（Claim）を組み立てます。
        List<Claim> claims =
        [
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString(System.Globalization.CultureInfo.InvariantCulture)),
            new Claim(ClaimTypes.Name, user.Username)
        ];

        // Claim に「Cookie 認証で確認済み」という証明を付与します。
        ClaimsIdentity identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
        // Identity をラップした認証オブジェクトです。[Authorize] はこのオブジェクトを参照して認証済みか判断します。
        ClaimsPrincipal principal = new ClaimsPrincipal(identity);

        // principal の情報を暗号化して Cookie に書き込みます。以降のリクエストでブラウザが自動送信します。
        await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal);

        return Ok(new MeResponse { Id = user.Id, Username = user.Username });
    }

    /// <summary>
    /// ログアウトします。
    /// </summary>
    /// <response code="204">ログアウト成功。セッション Cookie が削除されます。</response>
    [Authorize]
    [HttpPost("logout")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> LogoutAsync()
    {
        // セッション Cookie を削除します。以降のリクエストは未認証扱いになります。
        await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);

        return NoContent();
    }

    /// <summary>
    /// ログイン中のユーザー情報を取得します。
    /// </summary>
    /// <returns>ログイン中ユーザー情報</returns>
    /// <response code="200">取得成功</response>
    [Authorize]
    [HttpGet("me")]
    [ProducesResponseType(typeof(MeResponse), StatusCodes.Status200OK)]
    public IActionResult Me()
    {
        // Cookie 内の Claim からユーザーID とユーザー名を取得します。
        string? userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        string? username = User.FindFirstValue(ClaimTypes.Name);
        return Ok(new MeResponse { Id = int.Parse(userId!, System.Globalization.CultureInfo.InvariantCulture), Username = username! });
    }
}
