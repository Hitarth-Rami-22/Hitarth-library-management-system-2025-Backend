import { Component, OnInit } from '@angular/core';
import { BorrowServiceService } from 'src/app/student/borrow-service/borrow-service.service';
import { TokenStorageService } from 'src/app/shared/token-storage/token-storage.service';

@Component({
  selector: 'app-student-borrow-requests',
  templateUrl: './borrow-requests.component.html',
  styleUrls: ['./borrow-requests.component.scss']
})
export class StudentBorrowRequestsComponent implements OnInit {
  requests: any[] = [];
  filteredRequests: any[] = [];
  studentId: number = 0;
  isLoading: boolean = true;
  activeFilter: number | null = null; // null = All

  constructor(
    private borrowService: BorrowServiceService,
    private tokenStore: TokenStorageService
  ) {}

  ngOnInit(): void {
    this.studentId = this.tokenStore.getUserId();
    this.loadRequests();
  }

  loadRequests() {
    this.isLoading = true;
    this.borrowService.getStudentRequests(this.studentId).subscribe({
      next: (res: any[]) => {
        this.requests = res.sort((a, b) => new Date(b.requestedOn).getTime() - new Date(a.requestedOn).getTime());
        this.applyFilter();
        this.isLoading = false;
      },
      error: () => {
        console.error('Failed to load requests');
        this.isLoading = false;
      }
    });
  }

  setFilter(status: number | null) {
    this.activeFilter = status;
    this.applyFilter();
  }

  applyFilter() {
    if (this.activeFilter === null) {
      this.filteredRequests = this.requests;
    } else {
      this.filteredRequests = this.requests.filter(r => r.status === this.activeFilter);
    }
  }

  getStatusLabel(status: number): string {
    switch (status) {
      case 0: return 'Pending';
      case 1: return 'Approved';
      case 2: return 'Rejected';
      case 3: return 'Returned';
      case 4: return 'Return Requested';
      default: return 'Unknown';
    }
  }

  getStatusType(status: number): 'success' | 'warning' | 'error' | 'info' | 'neutral' {
    switch (status) {
      case 0: return 'warning';
      case 1: return 'success';
      case 2: return 'error';
      case 3: return 'neutral';
      case 4: return 'info';
      default: return 'neutral';
    }
  }

  getAccentColor(id: number): string {
    const colors = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
    return colors[id % colors.length];
  }
}
