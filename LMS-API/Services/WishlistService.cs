using LMS_API.Data;
using LMS_API.Models;
using Microsoft.EntityFrameworkCore;
using System;

namespace LMS_API.Services
{
    public class WishlistService
    {
        private readonly LibraryDbContext _context;

        public WishlistService(LibraryDbContext context)
        {
            _context = context;
        }

        public async Task<bool> IsAlreadyWishlisted(int studentId, int bookId)
        {
            return await _context.Wishlists
                .AnyAsync(w => w.StudentId == studentId && w.BookId == bookId);
        }

        public async Task<List<Wishlist>> GetWishlistByStudent(int studentId)
        {
            return await _context.Wishlists
                .Where(w => w.StudentId == studentId)
                .Include(w => w.Book)
                .ToListAsync();
        }

        public async Task AddWishlist(Wishlist wish)
        {
            _context.Wishlists.Add(wish);
            await _context.SaveChangesAsync();
        }

        public async Task RemoveWishlist(int id)
        {
            var w = await _context.Wishlists.FindAsync(id);
            if (w != null)
            {
                _context.Wishlists.Remove(w);
                await _context.SaveChangesAsync();
            }
        }
    }
}