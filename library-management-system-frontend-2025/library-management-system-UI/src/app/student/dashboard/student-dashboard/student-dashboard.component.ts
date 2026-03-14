import { Component, OnInit } from '@angular/core';
import { BorrowServiceService } from '../../borrow-service/borrow-service.service';
import { PenaltyServiceService } from '../../penalty-service/penalty-service.service';
import { TokenStorageService } from 'src/app/shared/token-storage/token-storage.service';

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.scss']
})
export class StudentDashboardComponent implements OnInit {
  stats = {
    borrowed: 0,
    pending: 0,
    dueSoon: 0,
    penalties: 0
  };
  
  studentName: string = '';
  studentId: number = 0;
  isLoading: boolean = true;
  recentActivities: any[] = [];

  constructor(
    private borrowService: BorrowServiceService,
    private penaltyService: PenaltyServiceService,
    private tokenService: TokenStorageService
  ) {}

  ngOnInit(): void {
    const payload = this.tokenService.getTokenPayload();
    this.studentName = payload?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || 'Student';
    this.studentId = this.tokenService.getUserId();
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.isLoading = true;
    this.borrowService.getStudentRequests(this.studentId).subscribe({
      next: (requests: any[]) => {
        this.stats.borrowed = requests.filter(r => r.status === 1).length;
        this.stats.pending = requests.filter(r => r.status === 0).length;
        
        // Due Soon (e.g., within 3 days)
        const now = new Date();
        const threeDaysOut = new Date();
        threeDaysOut.setDate(now.getDate() + 3);
        
        this.stats.dueSoon = requests.filter(r => {
          if (r.status !== 1 || !r.dueDate) return false;
          const dueDate = new Date(r.dueDate);
          return dueDate >= now && dueDate <= threeDaysOut;
        }).length;

        // Recent Activity (last 5)
        this.recentActivities = requests
          .sort((a, b) => new Date(b.requestedOn).getTime() - new Date(a.requestedOn).getTime())
          .slice(0, 5);
          
        this.loadPenalties();
      },
      error: () => {
        this.isLoading = false;
        console.error('Failed to load dashboard data');
      }
    });
  }

  loadPenalties() {
    this.penaltyService.getPenalties().subscribe({
      next: (penalties: any[]) => {
        const studentPenalties = penalties.filter(p => p.studentId === this.studentId && !p.isPaid);
        this.stats.penalties = studentPenalties.reduce((sum, p) => sum + p.amount, 0);
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        console.error('Failed to load penalties');
      }
    });
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
}
