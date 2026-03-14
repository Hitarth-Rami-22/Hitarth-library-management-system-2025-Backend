
import { Component, OnInit } from '@angular/core';
import { BorrowServiceService } from 'src/app/student/borrow-service/borrow-service.service';
import { ToastService } from 'src/app/shared/toast/toast.service';

@Component({
  selector: 'app-return-approvals',
  templateUrl: './return-approvals.component.html',
  styleUrls: ['./return-approvals.component.scss']
})
export class ReturnApprovalsComponent implements OnInit {
  returnRequests: any[] = [];
  isLoading: boolean = true;

  constructor(
    private borrowService: BorrowServiceService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.loadReturnRequests();
  }

  loadReturnRequests() {
    this.isLoading = true;
    this.borrowService.getAllRequests().subscribe({
      next: (res: any[]) => {
        this.returnRequests = res.filter(r => r.status === 4); // 4 = Return Requested
        this.isLoading = false;
      },
      error: () => {
        this.toast.error('Failed to load return requests');
        this.isLoading = false;
      }
    });
  }

  approveReturn(borrowId: number) {
    this.borrowService.updateStatus({ requestId: borrowId, newStatus: 3 }).subscribe({
      next: () => {
        this.toast.success('Book successfully marked as returned!');
        this.loadReturnRequests();
      },
      error: () => this.toast.error('Failed to approve return')
    });
  }
}