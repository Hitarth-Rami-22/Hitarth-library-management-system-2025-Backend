using Microsoft.SqlServer.Server;

namespace LMS_API.Models
{
    public class Book
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Author { get; set; } = string.Empty;
        public string ISBN { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public DateTime AddedOn { get; set; } = DateTime.UtcNow;
    }
}
