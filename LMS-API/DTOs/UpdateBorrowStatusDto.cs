using LMS_API.Models;

namespace LMS_API.DTOs
{
    public class UpdateBorrowStatusDto
    {
        public int RequestId { get; set; }
        public BorrowStatus NewStatus { get; set; }
    }
}
