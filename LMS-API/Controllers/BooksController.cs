using LMS_API.DTOs;
using LMS_API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using LMS_API.Services;
using LMS_API.Data;
using System;
using LMS_API.Models;
using Microsoft.EntityFrameworkCore;

namespace LMS_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BooksController : ControllerBase
    {
        private readonly IBookService _bookService;
        private readonly LibraryDbContext _context;
        private readonly EmailService _emailService;

        public BooksController(IBookService bookService, LibraryDbContext context, EmailService emailService)
        {
            _bookService = bookService;
            _context = context;
            _emailService = emailService;
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
        public async Task<IActionResult> Update(int id, Book updatedBook)
        {
            var book = await _context.Books.FindAsync(id);
            if (book == null) return NotFound();

            int oldQuantity = book.Quantity;

            // Update fields
            book.Title = updatedBook.Title;
            book.Author = updatedBook.Author;
            book.Quantity = updatedBook.Quantity;

            await _context.SaveChangesAsync();

            //  Check if quantity changed from 0 to >0
            if (oldQuantity == 0 && book.Quantity > 0)
            {
                var wishlistedStudents = await _context.Wishlists
                    .Include(w => w.Student)
                    .Where(w => w.BookId == id)
                    .Select(w => w.Student)
                    .ToListAsync();

                foreach (var student in wishlistedStudents)
                {
                    // 1️ Save notification
                    var notification = new Notification
                    {
                        StudentId = student.Id,
                        BookId = book.Id,
                        Message = $"📚 Good news! The book \"{book.Title}\" is now available.",
                        CreatedAt = DateTime.UtcNow
                    };
                    _context.Notifications.Add(notification);

                    // 2 Send email if student has a valid email
                    if (!string.IsNullOrWhiteSpace(student.Email))
                    {
                        string subject = "📚 Book Available - Library Notification";
                        string body = $"Hello {student.FullName},<br><br>The book \"{book.Title}\" is now available in the library. Hurry and borrow it now!<br><br>Thanks,<br>Library System";

                        await _emailService.SendEmailAsync(student.Email, subject, body);
                    }
                }

                await _context.SaveChangesAsync();
            }

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
