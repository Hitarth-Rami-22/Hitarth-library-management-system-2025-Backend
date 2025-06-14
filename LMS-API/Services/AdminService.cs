using LMS_API.Data;
using LMS_API.DTOs;
using LMS_API.Entities;
using LMS_API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace LMS_API.Services
{
    public class AdminService : IAdminService
    {
        private readonly LibraryDbContext _context;

        public AdminService(LibraryDbContext context)
        {
            _context = context;
        }

        public async Task<List<User>> GetAllUsers()
        {
            return await _context.Users.ToListAsync();
        }

        public async Task<string> UpdateUserStatus(UpdateUserStatusDto dto)
        {
            var user = await _context.Users.FindAsync(dto.UserId);
            if (user == null) throw new Exception("User not found");

            user.IsBlocked = dto.IsBlocked;
            await _context.SaveChangesAsync();
            return "User status updated";
        }

        public async Task<string> UpdateUserRole(UpdateUserRoleDto dto)
        {
            var user = await _context.Users.FindAsync(dto.UserId);
            if (user == null) throw new Exception("User not found");

            user.UserType = dto.IsLibrarian ? UserType.Librarian : UserType.Student;
            await _context.SaveChangesAsync();
            return "User role updated";
        }

    }
}
