using LMS_API.Entities;

namespace LMS_API.Models
{  
    public enum BorrowStatus
    {
        Pending =  0,
        Approved = 1,
        Rejected = 2,
        Returned = 3,
        ReturnRequested = 4
    }
    public class BorrowRequest
    {
        public int Id { get; set; }

        public int BookId { get; set; }
        public Book Book { get; set; }

        public int StudentId { get; set; }
        public User Student { get; set; }

        public BorrowStatus Status { get; set; } = BorrowStatus.Pending;

        public DateTime RequestedOn { get; set; } = DateTime.UtcNow;
        public DateTime? ApprovedOn { get; set; }
        public DateTime? ReturnedOn { get; set; }
    }
}
