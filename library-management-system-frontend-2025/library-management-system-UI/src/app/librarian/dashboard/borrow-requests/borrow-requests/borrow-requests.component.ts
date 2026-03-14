import { Component, OnInit } from '@angular/core';
import { BorrowServiceService } from 'src/app/student/borrow-service/borrow-service.service';
import { ToastService } from 'src/app/shared/toast/toast.service';

@Component({
  selector: 'app-borrow-requests',
  templateUrl: './borrow-requests.component.html',
  styleUrls: ['./borrow-requests.component.scss']
})
export class BorrowRequestsComponent implements OnInit {
  requests: any[] = [];
  filteredRequests: any[] = [];
  searchTerm: string = '';
  isLoading: boolean = true;
  activeFilter: number | null = null;

  constructor(
    private borrowServiceService: BorrowServiceService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests() {
    this.isLoading = true;
    this.borrowServiceService.getAllRequests().subscribe({
      next: (res: any) => {
        this.requests = res;
        this.applyFilter();
        this.isLoading = false;
      },
      error: () => {
        this.toast.error('Error loading requests');
        this.isLoading = false;
      }
    });
  }

  setFilter(status: number | null): void {
    this.activeFilter = status;
    this.applyFilter();
  }

  applyFilter() {
    let filtered = [...this.requests];

    // Apply status tab filter
    if (this.activeFilter !== null) {
      filtered = filtered.filter(r => r.status === this.activeFilter);
    }

    // Apply search filter
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(r =>
        r.book.title.toLowerCase().includes(term) ||
        r.student.fullName.toLowerCase().includes(term)
      );
    }

    this.filteredRequests = filtered;
  }

  updateStatus(id: number, newStatus: number) {
    this.borrowServiceService.updateStatus({ requestId: id, newStatus }).subscribe({
      next: () => {
        this.toast.success(`Request ${this.getStatusText(newStatus).toLowerCase()} successfully`);
        this.loadRequests();
      },
      error: (err) => this.toast.error(err.error?.message || 'Failed to update')
    });
  }

  getStatusText(status: number): string {
    switch (status) {
      case 0: return 'Pending';
      case 1: return 'Approved';
      case 2: return 'Rejected';
      case 3: return 'Returned';
      default: return 'Unknown';
    }
  }

  getStatusClass(status: number): string {
    switch (status) {
      case 0: return 'status-pending';
      case 1: return 'status-approved';
      case 2: return 'status-rejected';
      case 3: return 'status-returned';
      default: return '';
    }
  }

  getCountByStatus(status: number): number {
    return this.requests.filter(r => r.status === status).length;
  }
}
