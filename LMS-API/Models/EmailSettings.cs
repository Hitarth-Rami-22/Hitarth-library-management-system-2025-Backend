namespace LMS_API.Models
{
    public class EmailSettings
    {
        public string FromEmail { get; set; }
        public string SmtpHost { get; set; }
        public int SmtpPort { get; set; }
        public bool EnableSsl { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string Mobilenumber { get;}
    }
}
