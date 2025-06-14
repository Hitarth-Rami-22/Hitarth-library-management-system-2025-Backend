using LMS_API.DTOs;
using LMS_API.Entities;
using LMS_API.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace LMS_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _auth;

        public AuthController(IAuthService auth)
        {
            _auth = auth;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            var result = await _auth.Register(dto);
            return Ok(new { message = result });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var token = await _auth.Login(dto);
            return Ok(new { token });


        }

        [HttpGet("admins-librarians")]
        public async Task<IActionResult> GetAdminsAndLibrarians()
        {
            var users = await _auth.GetAdminsAndLibrarians();
            return Ok(users);
        }

    }
}