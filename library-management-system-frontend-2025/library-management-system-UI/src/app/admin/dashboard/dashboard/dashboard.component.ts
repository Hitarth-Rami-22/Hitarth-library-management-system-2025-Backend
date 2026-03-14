import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from 'src/app/shared/token-storage/token-storage.service';
import { BorrowServiceService } from 'src/app/student/borrow-service/borrow-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  adminName: string = 'Admin';
  pendingBorrows: number = 0;
  users: any[] = [];

  constructor(
    private tokenService: TokenStorageService,
    private borrowService: BorrowServiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    try {
      const payload = this.tokenService.getTokenPayload();
      this.adminName = payload?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']
        || payload?.['name'] || payload?.['unique_name'] || payload?.['email'] || 'Admin';
    } catch {}
    this.borrowService.getAllRequests().subscribe({
      next: (res: any[]) => { this.pendingBorrows = res.filter((r: any) => r.status === 0).length; },
      error: () => {}
    });
  }

  closeMenu(): void {}  // no-op on desktop; mobile sidebar will close via CSS

  logout(): void { this.tokenService.clear(); this.router.navigate(['/']); }
}