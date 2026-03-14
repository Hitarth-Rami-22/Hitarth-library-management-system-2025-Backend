import { Component, OnInit } from '@angular/core';
import { BorrowServiceService } from 'src/app/student/borrow-service/borrow-service.service';
import { TokenStorageService } from 'src/app/shared/token-storage/token-storage.service';
import { BookServiceService } from 'src/app/book/book/book/book-service/book-service.service';
import { WishlistServiceService } from '../../wishlist/service/wishlist/wishlist-service.service';
import { ToastService } from 'src/app/shared/toast/toast.service';


@Component({
  selector: 'app-borrow',
  templateUrl: './borrow.component.html',
  styleUrls: ['./borrow.component.scss']
})
export class BorrowComponent implements OnInit{
   books: any[] = [];
  studentId: number = 0;
  searchText: string = '';


  constructor(
    private bookServiceService: BookServiceService,
    private borrowServiceService: BorrowServiceService,
    private tokenStore: TokenStorageService,
    private wishlistService: WishlistServiceService,
    private toast: ToastService
  ) {}

 ngOnInit(): void {
  const token = this.tokenStore.getToken();

  if (token) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const rawId = payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];

    if (!rawId) {
      this.toast.error('User ID not found in token!');
    } else {
      this.studentId = +rawId;
    }

  } else {
    this.toast.error('No session found. Please login.');
  }

  this.loadBooks();
}

  loadBooks() {
    this.bookServiceService.getAll().subscribe({
      next: (res: any) => this.books = res,
      error: () => this.toast.error('Failed to load books')
    });
  }


borrow(bookId: number) {
  this.studentId = this.tokenStore.getUserId();
  const payload = { bookId, studentId: this.studentId };

  this.borrowServiceService.requestBorrow(payload).subscribe({
    next: (res: any) => this.toast.success(res.message || 'Borrow request submitted'),
    error: (err) => {
      this.toast.error(err.error?.message || 'Borrow failed!');
    }
  });
}
updateStatus(id: number, newStatus: number) {
  this.borrowServiceService.updateStatus({ requestId: id, newStatus }).subscribe({
    next: () => {
      this.toast.success('Status updated');
      this.loadRequests();
    },
    error: (err) => this.toast.error(err.error?.message || 'Failed to update')
  });
}

loadRequests(): void {
  // Implement logic if needed
}


addToWishlist(bookId: number) {
  const studentId = this.tokenStore.getUserId();

  if (!studentId || !bookId) {
    this.toast.error('Missing student or book ID');
    return;
  }

  const payload = {
    StudentId: studentId,  
    BookId: bookId         
  };

  this.wishlistService.addToWishlist(payload).subscribe({
    next: () => {
      this.toast.success('Book added to wishlist');
    },
    error: (err) => {
      this.toast.error(err.error?.message || 'Failed to add to wishlist');
    }
  });
}
  filteredBooks() {
    const search = this.searchText.trim().toLowerCase();
    return this.books.filter(book =>
      book.title.toLowerCase().includes(search) ||
      book.author.toLowerCase().includes(search)
    );
  }

  getAccentColor(id: number): string {
    const colors = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
    return colors[id % colors.length];
  }
}
