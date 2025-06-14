using LMS_API.Data;
using LMS_API.DTOs;
using LMS_API.Entities;
using LMS_API.Helpers;
using LMS_API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace LMS_API.Services
{
    public class AuthService : IAuthService
    {
        private readonly LibraryDbContext _context;
        private readonly IConfiguration _config;

        public AuthService(LibraryDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        public async Task<string> Register(RegisterDto dto)
        {
            if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
                throw new Exception("User already exists");

            var user = new User
            {
                FullName = dto.FullName,
                Email = dto.Email,
                PasswordHash = dto.Password, 
                UserType = Enum.Parse<UserType>(dto.UserType, true)
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return "User registered successfully.";
        }

        //public async Task<string> Login(LoginDto dto)
        //{
        //    var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
        //    if (user == null || user.PasswordHash != dto.Password)
        //        throw new Exception("Invalid credentials");


        //    return JwtHelper.GenerateToken(user, _config);
        //}
        public async Task<string> Login(LoginDto dto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);

            if (user == null || user.PasswordHash != dto.Password)
                throw new Exception("Invalid credentials");

            if (user.IsBlocked)
                throw new Exception("Your account is blocked. Please contact admin.");

            return JwtHelper.GenerateToken(user, _config);
        }

        public async Task<List<UserDto>> GetAdminsAndLibrarians()
        {
            var users = await _context.Users
                .Where(u => u.UserType == UserType.Admin || u.UserType == UserType.Librarian)
                .Select(u => new UserDto
                {
                    FullName = u.FullName,
                    Email = u.Email,
                    UserType = u.UserType.ToString()
                })
                .ToListAsync();

            return users;
        }

    }
}