using LMS_API.Entities;

namespace LMS_API.Models
{
    public class Wishlist
    {
        public int Id { get; set; }
        public int BookId { get; set; }
        public int StudentId { get; set; }
        public DateTime CreatedOn { get; set; } = DateTime.Now;

        // Navigation properties
        public Book Book { get; set; }
        public User Student { get; set; }


    }
}
