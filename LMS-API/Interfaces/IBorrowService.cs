using LMS_API.DTOs;
using LMS_API.Models;

namespace LMS_API.Interfaces
{
    public interface IBorrowService
    {
        Task<string> RequestBorrow(BorrowRequestDto dto);
        Task<List<BorrowRequest>> GetAllRequests();
        Task<List<BorrowRequest>> GetRequestsByStudent(int studentId);
        Task<string> UpdateBorrowStatus(UpdateBorrowStatusDto dto);
        Task ApplyPenaltiesAsync();
        Task<List<BorrowRequest>> GetPenaltiesAsync(string role, int userId);

    }
}
