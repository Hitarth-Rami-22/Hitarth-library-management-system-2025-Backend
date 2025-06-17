namespace LMS_API.DTOs
{
    public class UpdateStatusDto
    {
        public int RequestId { get; set; }
        public int NewStatus { get; set; } // e.g., "ReturnRequested", "Returned"
    }
}
