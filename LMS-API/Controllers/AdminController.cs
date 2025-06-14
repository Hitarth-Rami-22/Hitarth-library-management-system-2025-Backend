using LMS_API.DTOs;
using LMS_API.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace LMS_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;

        public AdminController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _adminService.GetAllUsers();
            return Ok(users);
        }

        [HttpPut("user/status")]
        public async Task<IActionResult> UpdateUserStatus(UpdateUserStatusDto dto)
        {
            var result = await _adminService.UpdateUserStatus(dto);
            return Ok(new { message = result });
        }

        [HttpPut("user/role")]
        public async Task<IActionResult> UpdateUserRole(UpdateUserRoleDto dto)
        {
            var result = await _adminService.UpdateUserRole(dto);
            return Ok(new { message = result });
        }
    }
}
