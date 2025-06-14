using LMS_API.DTOs;

namespace LMS_API.Interfaces
{
    public interface IAuthService
    {
        Task<string> Register(RegisterDto dto);
        Task<string> Login(LoginDto dto);
        Task<List<UserDto>> GetAdminsAndLibrarians();

    }
}
