using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace StarWarsShipsBFF.Server.Controllers;

[ApiController]
[Route("[controller]")]
public class AuthController : ControllerBase
{
    private readonly string? _user;
    private readonly string? _pass;

    public AuthController(IConfiguration config)
    {
        _user = config["Auth:Username"];
        _pass = config["Auth:Password"];

        if (string.IsNullOrWhiteSpace(_user))
            throw new InvalidOperationException("Missing Auth:Username in configuration");
        if (string.IsNullOrWhiteSpace(_pass))
            throw new InvalidOperationException("Missing Auth:Password in configuration");
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        if (dto.User != _user || dto.Pass != _pass) return Unauthorized();

        var claims = new[] { new Claim(ClaimTypes.Name, _user) };
        var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
        
        await HttpContext.SignInAsync(
            CookieAuthenticationDefaults.AuthenticationScheme,
            new ClaimsPrincipal(identity));

        return Ok();
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        return Ok();
    }
}

public class LoginDto
{
    public string User { get; set; } = string.Empty;
    public string Pass { get; set; } = string.Empty;
}