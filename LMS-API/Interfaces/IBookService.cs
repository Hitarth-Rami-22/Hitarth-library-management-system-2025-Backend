using LMS_API.DTOs;
using LMS_API.Models;

namespace LMS_API.Interfaces
{
    public interface IBookService
    {
        Task<List<Book>> GetAllBooks();
        Task<Book> GetBookById(int id);
        Task<Book> AddBook(BookDto dto);
        Task<Book> UpdateBook(int id, BookDto dto);
        Task<bool> DeleteBook(int id);
    }
}
