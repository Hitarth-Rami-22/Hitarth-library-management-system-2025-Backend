import { Component, OnInit } from '@angular/core';
import { BookServiceService } from 'src/app/book/book/book/book-service/book-service.service';
import { TokenStorageService } from 'src/app/shared/token-storage/token-storage.service'; 
import { BorrowServiceService } from '../../borrow-service/borrow-service.service';
import { ToastService } from 'src/app/shared/toast/toast.service';

@Component({
  selector: 'app-return-requests',
  templateUrl: './return-requests.component.html',
  styleUrls: ['./return-requests.component.scss']
})
export class ReturnRequestsComponent implements OnInit {
  approvedBooks: any[] = [];
  studentId: number = 0;
  isLoading: boolean = true;

  constructor(
    private borrowService: BorrowServiceService,
    private tokenService: TokenStorageService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    const token = this.tokenService.getToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.studentId = +payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
      this.loadApprovedBooks();
    }
  }

  loadApprovedBooks() {
    this.isLoading = true;
    this.borrowService.getStudentRequests(this.studentId).subscribe({
      next: (res: any[]) => {
        this.approvedBooks = res.filter(r => r.status === 1);
        this.isLoading = false;
      },
      error: () => {
        this.toast.error('Failed to load approved books');
        this.isLoading = false;
      }
    });
  }

  getAccentColor(id: number): string {
    const colors = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
    return colors[id % colors.length];
  }

  submitReturnRequest(borrowId: number) {
    const payload = {
      requestId: borrowId,
      newStatus: 4  // 4 = Return Requested
    };
    this.borrowService.updateStatus(payload).subscribe({
      next: () => {
        this.toast.success('Return request sent successfully!');
        this.loadApprovedBooks();
      },
      error: () => this.toast.error('Failed to send return request')
    });
  }
}