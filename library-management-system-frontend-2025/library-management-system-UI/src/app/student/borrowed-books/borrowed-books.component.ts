import { Component, OnInit } from '@angular/core';
import { BorrowServiceService } from 'src/app/student/borrow-service/borrow-service.service';
import { TokenStorageService } from 'src/app/shared/token-storage/token-storage.service';
import { ToastService } from 'src/app/shared/toast/toast.service';

@Component({
  selector: 'app-borrowed-books',
  templateUrl: './borrowed-books.component.html',
  styleUrls: ['./borrowed-books.component.scss']
})
export class BorrowedBooksComponent implements OnInit {
  borrowedBooks: any[] = [];
  studentId: number = 0;
  isLoading: boolean = true;

  constructor(
    private borrowService: BorrowServiceService,
    private tokenService: TokenStorageService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.studentId = this.tokenService.getUserId();
    this.loadBorrowedBooks();
  }

  loadBorrowedBooks() {
    this.isLoading = true;
    this.borrowService.getStudentRequests(this.studentId).subscribe({
      next: (res: any[]) => {
        // Status 1 = Approved (Active Loan)
        this.borrowedBooks = res.filter(r => r.status === 1);
        this.isLoading = false;
      },
      error: () => {
        console.error('Failed to load borrowed books');
        this.isLoading = false;
      }
    });
  }

  returnBook(borrowId: number) {
    const payload = {
      requestId: borrowId,
      newStatus: 4  // 4 = Return Requested
    };
    this.borrowService.updateStatus(payload).subscribe({
      next: () => {
        this.toast.success('Return request sent successfully!');
        this.loadBorrowedBooks();
      },
      error: (err) => this.toast.error(err.error?.message || 'Failed to send return request')
    });
  }

  getAccentColor(id: number): string {
    const colors = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
    return colors[id % colors.length];
  }
}
