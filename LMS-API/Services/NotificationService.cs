using LMS_API.Data;
using LMS_API.Models;
using Microsoft.EntityFrameworkCore;

namespace LMS_API.Services
{
    public class NotificationService
    {
        private readonly LibraryDbContext _context;
        private readonly EmailService _emailService;
        public NotificationService(LibraryDbContext context, EmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        public async Task SendNotificationAsync(int studentId, int bookId, string message)
        {
            var notification = new Notification
            {
                StudentId = studentId,
                BookId = bookId,
                Message = message,
                CreatedAt = DateTime.UtcNow,
                IsRead = false
            };

            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();
            
            // Fetch Student Email
            var student = await _context.Users.FirstOrDefaultAsync(u => u.Id == studentId);
            if (student != null && !string.IsNullOrEmpty(student.Email))
            {
                // Send Email Notification
                var subject = "Book Now Available in Library 📚";
                await _emailService.SendEmailAsync(student.Email, subject, message);
            }
        }
    }
}
