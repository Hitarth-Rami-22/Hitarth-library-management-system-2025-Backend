using LMS_API.Data;
using LMS_API.DTOs;
using LMS_API.Entities;
using LMS_API.Interfaces;
using LMS_API.Models;
using Microsoft.EntityFrameworkCore;



namespace LMS_API.Services
{
    public class BorrowService : IBorrowService
    {
        private readonly LibraryDbContext _context;
        private readonly NotificationService _notificationService;
        private readonly WishlistService _wishlistService;
        private readonly EmailService _emailService;

        public BorrowService(LibraryDbContext context, NotificationService notificationService, WishlistService wishlistService, EmailService emailService)
        {
            _context = context;
            _notificationService = notificationService;
            _wishlistService = wishlistService;
            _emailService = emailService;
        }

        public async Task<string> RequestBorrow(BorrowRequestDto dto)
        {
            var book = await _context.Books.FindAsync(dto.BookId);
            if (book == null) throw new Exception("Book not found");

            var student = await _context.Users.FirstOrDefaultAsync(u => u.Id == dto.StudentId && u.UserType == UserType.Student);
            if (student == null) throw new Exception("Student not found");

            int activeBorrowCount = await _context.BorrowRequests
                .CountAsync(r => r.StudentId == dto.StudentId &&
                                 (r.Status == BorrowStatus.Approved || r.Status == BorrowStatus.Pending));

            if (activeBorrowCount >= 3)
                throw new Exception("Borrow limit reached. Return a book to borrow a new one.");

            var request = new BorrowRequest
            {
                BookId = dto.BookId,
                StudentId = dto.StudentId,
                Status = BorrowStatus.Pending
            };

            _context.BorrowRequests.Add(request);
            await _context.SaveChangesAsync();

            return "Borrow request submitted.";
        }

        public async Task<List<BorrowRequest>> GetAllRequests()
        {
            return await _context.BorrowRequests
                .Include(b => b.Book)
                .Include(b => b.Student)
                .ToListAsync();
        }

        public async Task<List<BorrowRequest>> GetRequestsByStudent(int studentId)
        {
            return await _context.BorrowRequests
                .Where(r => r.StudentId == studentId)
                .Include(r => r.Book)
                .OrderByDescending(r => r.RequestedOn)
                .ToListAsync();
        }



        public async Task<string> UpdateBorrowStatus(UpdateBorrowStatusDto dto)
        {
            var request = await _context.BorrowRequests.Include(r => r.Book).FirstOrDefaultAsync(r => r.Id == dto.RequestId);
            if (request == null) throw new Exception("Request not found");

            request.Status = dto.NewStatus;

            if (dto.NewStatus == BorrowStatus.Approved)
            {
                if (request.Book.Quantity <= 0)
                    throw new Exception("Book is out of stock");

                request.Book.Quantity--;
                request.ApprovedOn = DateTime.UtcNow;

                await _context.SaveChangesAsync();
                return "Status updated successfully.";
            }

            if (dto.NewStatus == BorrowStatus.Returned)
            {
                request.Book.Quantity++;
                request.ReturnedOn = DateTime.UtcNow;

                // ✅ Notify all students who had wishlisted this book
                if (request.Book.Quantity > 0)
                {
                    var wishlistedStudents = await _context.Wishlists
                        .Where(w => w.BookId == request.BookId)
                        .Select(w => w.StudentId)
                        .Distinct()
                        .ToListAsync();

                    foreach (var studentId in wishlistedStudents)
                    {
                        var message = $"The book \"{request.Book.Title}\" is now available.";
                        try
                        {
                            await _notificationService.SendNotificationAsync(studentId, request.BookId, message);
                        }
                        catch (Exception ex)
                        {
                            Console.WriteLine($"❌ Notification failed: {ex.Message}");
                            // Optionally log or rethrow
                        }
                    }
                }

                await _context.SaveChangesAsync();
                return "Status updated successfully.";
            }

            // If status is neither Approved nor Returned
            await _context.SaveChangesAsync();
            return "Status updated successfully.";
        }

        //public async Task<string> UpdateBorrowStatus(UpdateBorrowStatusDto dto)
        //{
        //    var request = await _context.BorrowRequests.Include(r => r.Book).FirstOrDefaultAsync(r => r.Id == dto.RequestId);
        //    if (request == null) throw new Exception("Request not found");

        //    request.Status = dto.NewStatus;

        //    if (dto.NewStatus == BorrowStatus.Approved)
        //    {
        //        if (request.Book.Quantity <= 0) throw new Exception("Book is out of stock");
        //        request.Book.Quantity--;
        //        request.ApprovedOn = DateTime.UtcNow;
        //    }

        //    //if (dto.NewStatus == BorrowStatus.Returned)
        //    //{
        //    //    request.Book.Quantity++;
        //    //    request.ReturnedOn = DateTime.UtcNow;
        //    //}
        //    if (dto.NewStatus == BorrowStatus.Returned)
        //    {
        //        request.Book.Quantity++;
        //        request.ReturnedOn = DateTime.UtcNow;

        //        // Notify all students who had wishlisted this book
        //        if (request.Book.Quantity > 0)
        //        {
        //            var wishlistedStudents = await _context.Wishlists
        //                .Where(w => w.BookId == request.BookId)
        //                .Select(w => w.StudentId)
        //                .Distinct()
        //                .ToListAsync();

        //            foreach (var studentId in wishlistedStudents)
        //            {
        //                var message = $"The book \"{request.Book.Title}\" is now available.";
        //                await _notificationService.SendNotificationAsync(studentId, request.BookId, message);
        //            }
        //            await _context.SaveChangesAsync();
        //            return "Status updated successfully.";
        //        }
        //    }
        //}
        //public async Task ApplyPenaltiesAsync()
        //{
        //    var overdueRequests = await _context.BorrowRequests
        //        .Where(r => r.Status == BorrowStatus.Approved &&
        //                    r.ApprovedOn != null &&
        //                    r.ReturnedOn == null &&
        //                    EF.Functions.DateDiffDay(r.ApprovedOn.Value, DateTime.UtcNow) > 7)
        //        .ToListAsync();

        //    foreach (var request in overdueRequests)
        //    {
        //        var daysOverdue = (DateTime.UtcNow - request.ApprovedOn.Value).Days;
        //        var penaltyDays = daysOverdue - 1;
        //        request.PenaltyAmount = 100 + (penaltyDays * 50);
        //    }

        //    await _context.SaveChangesAsync();
        //}
        public async Task ApplyPenaltiesAsync()
        {
            var overdueRequests = await _context.BorrowRequests
                .Include(r => r.Student)
                .Include(r => r.Book)
                .Where(r => r.Status == BorrowStatus.Approved && r.ApprovedOn != null)
                .ToListAsync();

            foreach (var request in overdueRequests)
            {
                //var overdueDays = (DateTime.UtcNow - request.ApprovedOn.Value).Days - 0;
                var overdueDays = (DateTime.UtcNow - request.ApprovedOn.Value).TotalDays - 0;


                //Console.WriteLine($"📅 Student {request.StudentId} has overdueDays = {overdueDays}");
                Console.WriteLine($"DEBUG: Borrow ID {request.Id}, OverdueDays = {overdueDays}");
                if (overdueDays > 0)
                {
                    var penalty = 100 + (overdueDays - 1) * 50;
                    request.PenaltyAmount = (int)penalty;

                    Console.WriteLine($"💰 Applying ₹{penalty} to Student ID {request.StudentId}");

                    if (!string.IsNullOrWhiteSpace(request.Student?.Email))
                    {
                        var subject = $"📚 Penalty Notice - {request.Book.Title}";
                        var body = $"Dear {request.Student.Email},<br/><br/>" +
                                   $"You have not returned the book <b>{request.Book.Title}</b> issued on <b>{request.ApprovedOn.Value.ToShortDateString()}</b>.<br/>" +
                                   $"Your current penalty is <b>₹{request.PenaltyAmount}</b>.<br/><br/>" +
                                   $"Please return the book as soon as possible to stop the penalty increase.";

                        await _emailService.SendEmailAsync(request.Student.Email, subject, body);
                    }
                }
            }

            await _context.SaveChangesAsync();
        }
        public async Task<List<BorrowRequest>> GetPenaltiesAsync(string role, int userId)
        {
            var query = _context.BorrowRequests
                .Include(r => r.Book)
                .Include(r => r.Student)
                .Where(r => r.PenaltyAmount > 0 && r.Status == BorrowStatus.Approved);

            if (role == "Student")
            {
                query = query.Where(r => r.StudentId == userId);
            }

            return await query.OrderByDescending(r => r.ApprovedOn).ToListAsync();
        }


    }
}