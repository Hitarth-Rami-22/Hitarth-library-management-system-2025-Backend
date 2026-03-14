import { Component, OnInit } from '@angular/core';
import { BookServiceService } from 'src/app/book/book/book/book-service/book-service.service';
import { BorrowServiceService } from 'src/app/student/borrow-service/borrow-service.service';
import { TokenStorageService } from 'src/app/shared/token-storage/token-storage.service';
import { WishlistServiceService } from 'src/app/student/wishlist/service/wishlist/wishlist-service.service';
import { ToastService } from 'src/app/shared/toast/toast.service';

@Component({
  selector: 'app-browse-books',
  templateUrl: './browse-books.component.html',
  styleUrls: ['./browse-books.component.scss']
})
export class BrowseBooksComponent implements OnInit {
  books: any[] = [];
  studentId: number = 0;
  searchText: string = '';
  isLoading: boolean = true;

  constructor(
    private bookService: BookServiceService,
    private borrowService: BorrowServiceService,
    private tokenStore: TokenStorageService,
    private wishlistService: WishlistServiceService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.studentId = this.tokenStore.getUserId();
    this.loadBooks();
  }

  loadBooks() {
    this.isLoading = true;
    this.bookService.getAll().subscribe({
      next: (res: any) => {
        this.books = res;
        this.isLoading = false;
      },
      error: () => {
        console.error('Failed to load books');
        this.isLoading = false;
      }
    });
  }

  borrow(bookId: number) {
    const payload = { bookId, studentId: this.studentId };
    this.borrowService.requestBorrow(payload).subscribe({
      next: (res: any) => this.toast.success(res.message || 'Borrow request sent!'),
      error: (err) => {
        console.error('Borrow failed:', err);
        this.toast.error(err.error?.message || 'Failed to send borrow request');
      }
    });
  }

  addToWishlist(bookId: number) {
    const payload = { StudentId: this.studentId, BookId: bookId };
    this.wishlistService.addToWishlist(payload).subscribe({
      next: () => this.toast.success('✅ Added to wishlist'),
      error: (err) => this.toast.error(err.error?.message || 'Failed to add to wishlist')
    });
  }

  get filteredBooks() {
    const term = this.searchText.trim().toLowerCase();
    return this.books.filter(b => 
      b.title.toLowerCase().includes(term) || 
      b.author.toLowerCase().includes(term)
    );
  }

  getAccentColor(id: number): string {
    const colors = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
    return colors[id % colors.length];
  }
}
