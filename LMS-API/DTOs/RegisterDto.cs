namespace LMS_API.DTOs
{
    public class RegisterDto
    {
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string UserType { get; set; } // "Student", "Admin", "Librarian"
    }
}
