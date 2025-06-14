using Microsoft.SqlServer.Server;

namespace LMS_API.Entities
{
    public enum UserType { Admin, Librarian, Student }
    public class User
    {
        public int Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty ;
        public UserType UserType { get; set; }
        public bool IsBlocked { get; set; } = false;

    }
}