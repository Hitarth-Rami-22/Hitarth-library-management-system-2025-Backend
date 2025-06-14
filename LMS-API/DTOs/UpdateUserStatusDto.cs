namespace LMS_API.DTOs
{
    public class UpdateUserStatusDto
    {
        public int UserId { get; set; }
        public bool IsBlocked { get; set; }
    }
}
