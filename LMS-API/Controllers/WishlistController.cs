using LMS_API.Models;
using System;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using LMS_API.Data;
using Microsoft.EntityFrameworkCore;
using LMS_API.Services;
using LMS_API.DTOs;


namespace LMS_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WishlistController : ControllerBase
    {
        private readonly WishlistService _service;

        public WishlistController(WishlistService service)
        {
            _service = service;
        }

        

        [HttpPost]
        public async Task<IActionResult> AddToWishlist([FromBody] WishlistDto dto)
        {
            if (dto == null)
                return BadRequest("Payload is null");

            if (dto.StudentId <= 0 || dto.BookId <= 0)
                return BadRequest("Invalid StudentId or BookId");

            bool exists = await _service.IsAlreadyWishlisted(dto.StudentId, dto.BookId);
            if (exists)
                return BadRequest("Already in wishlist.");

            var wishlist = new Wishlist
            {
                StudentId = dto.StudentId,
                BookId = dto.BookId
            };

            await _service.AddWishlist(wishlist);
            return Ok(new { message = "Added to wishlist" });

        }

        [HttpGet("student/{studentId}")]
        public async Task<IActionResult> GetWishlist(int studentId)
        {
            var data = await _service.GetWishlistByStudent(studentId);
            return Ok(data);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> RemoveWishlist(int id)
        {
            await _service.RemoveWishlist(id);
            return Ok(new { message = "Removed from wishlist" });
        }
    }
}