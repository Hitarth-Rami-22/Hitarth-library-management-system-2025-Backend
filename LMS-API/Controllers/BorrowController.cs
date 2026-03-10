using LMS_API.DTOs;
using LMS_API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace LMS_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BorrowController : ControllerBase
    {
        private readonly IBorrowService _service;

        public BorrowController(IBorrowService service)
        {
            _service = service;
        }

        [HttpPost]
        [Authorize(Roles = "Student")]
        public async Task<IActionResult> RequestBorrow(BorrowRequestDto dto)
        {
            var result = await _service.RequestBorrow(dto);
            return Ok(new { message = result });
        }

        [HttpGet("all")]
        [Authorize(Roles = "Admin,Librarian")]
        public async Task<IActionResult> GetAll()
        {
            var data = await _service.GetAllRequests();
            return Ok(data);
        }

        [HttpGet("student/{id}")]
        [Authorize(Roles = "Student")]
        public async Task<IActionResult> GetStudentRequests(int id)
        {
            var data = await _service.GetRequestsByStudent(id);
            return Ok(data);
        }

        [HttpPut("status")]
        [Authorize(Roles = "Admin,Librarian,Student")]
        public async Task<IActionResult> UpdateStatus(UpdateBorrowStatusDto dto)
        {
            var result = await _service.UpdateBorrowStatus(dto);
            return Ok(new { message = result });
        }

        [HttpPost("apply-penalties")]
        [Authorize(Roles = "Admin,Librarian,Student")]
        public async Task<IActionResult> ApplyPenalties()
        {
            await _service.ApplyPenaltiesAsync();
            return Ok("Penalties calculated and emails sent.");
        }

        [HttpGet("penalties")]
        [Authorize(Roles = "Admin,Librarian,Student")]
        public async Task<IActionResult> GetPenalties()
        {
            var role = User.FindFirst(ClaimTypes.Role)?.Value;
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            

            if (string.IsNullOrEmpty(userIdClaim)) return Unauthorized("Missing user identity.");
            int userId = int.Parse(userIdClaim);

            var data = await _service.GetPenaltiesAsync(role, userId);
            return Ok(data);
        }


    }
}
