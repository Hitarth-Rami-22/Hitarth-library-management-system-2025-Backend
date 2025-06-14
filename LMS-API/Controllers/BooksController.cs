using LMS_API.DTOs;
using LMS_API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace LMS_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BooksController : ControllerBase
    {
        private readonly IBookService _bookService;

        public BooksController(IBookService bookService)
        {
            _bookService = bookService;
        }

        [HttpGet]
        [Authorize] // All roles can view
        public async Task<IActionResult> GetAll()
        {
            var books = await _bookService.GetAllBooks();
            return Ok(books);
        }

        [HttpPost]
        [Authorize(Roles = "Admin,Librarian")]
        public async Task<IActionResult> Add(BookDto dto)
        {
            var book = await _bookService.AddBook(dto);
            return Ok(book);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Librarian")]
        public async Task<IActionResult> Update(int id, BookDto dto)
        {
            var book = await _bookService.UpdateBook(id, dto);
            return Ok(book);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _bookService.DeleteBook(id);
            return success ? Ok(new { message = "Deleted" }) : NotFound("Book not found");
        }
    }
}
