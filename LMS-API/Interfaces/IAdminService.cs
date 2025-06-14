using LMS_API.DTOs;
using LMS_API.Entities;


namespace LMS_API.Interfaces
{
    public interface IAdminService
    {
        Task<List<User>> GetAllUsers();
        Task<string> UpdateUserStatus(UpdateUserStatusDto dto);
        Task<string> UpdateUserRole(UpdateUserRoleDto dto);
    }
}
