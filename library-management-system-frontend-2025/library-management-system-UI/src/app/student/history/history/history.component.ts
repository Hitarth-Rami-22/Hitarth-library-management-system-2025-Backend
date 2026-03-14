import { Component, OnInit } from '@angular/core';
import { BorrowServiceService } from 'src/app/student/borrow-service/borrow-service.service';
import { TokenStorageService } from 'src/app/shared/token-storage/token-storage.service';
import { ToastService } from 'src/app/shared/toast/toast.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  history: any[] = [];
  studentId: number = 0;
  isLoading: boolean = true;

  constructor(
    private borrowServiceService: BorrowServiceService,
    private tokenStore: TokenStorageService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.studentId = this.tokenStore.getUserId();

    if (!this.studentId) {
      this.toast.error('Student ID not found in token!');
      return;
    }

    this.loadHistory();
  }

  loadHistory() {
    this.isLoading = true;
    this.borrowServiceService.getStudentRequests(this.studentId).subscribe({
      next: (res: any) => {
        this.history = res;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load history:', err);
        this.toast.error('Failed to load history');
        this.isLoading = false;
      }
    });
  }

  getStatusLabel(status: number): string {
    switch (status) {
      case 1: return 'Pending';
      case 2: return 'Approved';
      case 12: return 'Returned';
      default: return 'Unknown';
    }
  }

  getStatusClass(status: number): string {
    switch (status) {
      case 1: return 'status-pending';
      case 2: return 'status-approved';
      case 12: return 'status-returned';
      default: return 'status-unknown';
    }
  }

  getCountByStatus(status: number): number {
    return this.history.filter(item => item.status === status).length;
  }

  getPercent(status: number): string {
    if (this.history.length === 0) return '0%';
    const count = this.getCountByStatus(status);
    return ((count / this.history.length) * 100) + '%';
  }

  getAccentColor(id: number): string {
    const colors = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
    return colors[id % colors.length];
  }
}