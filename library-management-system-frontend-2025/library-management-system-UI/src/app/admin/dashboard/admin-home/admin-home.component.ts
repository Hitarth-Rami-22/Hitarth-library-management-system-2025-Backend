import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/admin/service/admin.service';
import { Router } from '@angular/router';
import { TokenStorageService } from 'src/app/shared/token-storage/token-storage.service';
import { BorrowServiceService } from 'src/app/student/borrow-service/borrow-service.service';
import { BookServiceService } from 'src/app/book/book/book/book-service/book-service.service';
import { PenaltyServiceService } from 'src/app/student/penalty-service/penalty-service.service';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.scss']
})
export class AdminHomeComponent implements OnInit {
  // Hero
  adminName: string = 'Admin';
  greeting: string = 'Good Morning';
  currentDate: string = '';

  // Stats (sourced from APIs)
  totalUsers:       number = 0;
  studentCount:     number = 0;
  librarianCount:   number = 0;
  activeUsers:      number = 0;
  blockedUsers:     number = 0;
  totalBooks:       number = 0;
  totalBorrows:     number = 0;
  pendingBorrows:   number = 0;
  outstandingPenalty: number = 0;
  statsLoading = true;

  // Recent activity
  recentUsers: any[] = [];
  recentRequests: any[] = [];

  quickLinks = [
    { label: 'Manage Users',    icon: 'users',  color: 'indigo', desc: 'Add, block, and manage user roles',        route: '/dashboard/users' },
    { label: 'Manage Books',    icon: 'book',   color: 'blue',   desc: 'Add, edit or remove books from library',  route: '/dashboard/books' },
    { label: 'Borrow Requests', icon: 'inbox',  color: 'green',  desc: 'View all student borrow activity',        route: '/dashboard/requests' },
    { label: 'View Penalties',  icon: 'alert',  color: 'amber',  desc: 'Review and manage outstanding penalties', route: '/dashboard/penalties' },
  ];

  constructor(
    private adminService: AdminService,
    private tokenService: TokenStorageService,
    private borrowService: BorrowServiceService,
    private bookService: BookServiceService,
    private penaltyService: PenaltyServiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.setGreeting();
    try {
      const payload = this.tokenService.getTokenPayload();
      this.adminName = payload?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']
        || payload?.['name'] || payload?.['unique_name'] || payload?.['email'] || 'Admin';
    } catch {}
    this.loadStats();
  }

  setGreeting(): void {
    const h = new Date().getHours();
    this.greeting = h < 12 ? 'Good Morning' : h < 17 ? 'Good Afternoon' : 'Good Evening';
    this.currentDate = new Date().toLocaleDateString('en-IN', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
  }

  loadStats(): void {
    this.statsLoading = true;

    // Users
    this.adminService.getAllUsers().subscribe({
      next: (res: any) => {
        const users: any[] = res as any[];
        this.totalUsers     = users.length;
        this.studentCount   = users.filter(u => u.userType === 'Student').length;
        this.librarianCount = users.filter(u => u.userType === 'Librarian').length;
        this.activeUsers    = users.filter(u => !u.isBlocked).length;
        this.blockedUsers   = users.filter(u => u.isBlocked).length;
        this.recentUsers    = [...users].slice(-5).reverse();
      },
      error: () => {}
    });

    // Books
    this.bookService.getAll().subscribe({
      next: (b: any) => { this.totalBooks = (b as any[]).length; },
      error: () => {}
    });

    // Penalties
    this.penaltyService.getPenalties().subscribe({
      next: (data: any[]) => {
        this.outstandingPenalty = data.filter((p: any) => p.status !== 3)
          .reduce((s: number, p: any) => s + (p.penaltyAmount || 0), 0);
      },
      error: () => {}
    });

    // Borrows
    this.borrowService.getAllRequests().subscribe({
      next: (res: any[]) => {
        this.totalBorrows   = res.length;
        this.pendingBorrows = res.filter(r => r.status === 0).length;
        
        // Parity with Librarian: Recent 5 requests
        this.recentRequests = [...res]
          .sort((a, b) => new Date(b.requestedOn || 0).getTime() - new Date(a.requestedOn || 0).getTime())
          .slice(0, 5);

        this.statsLoading   = false;
      },
      error: () => { this.statsLoading = false; }
    });
  }

  getStatusText(status: number): string {
    return ({ 0: 'Pending', 1: 'Approved', 2: 'Rejected', 3: 'Returned', 4: 'Return Req.' } as any)[status] || 'Unknown';
  }

  getStatusClass(status: number): string {
    return ({ 0: 'pill-amber', 1: 'pill-green', 2: 'pill-red', 3: 'pill-blue', 4: 'pill-violet' } as any)[status] || '';
  }

  navigate(route: string): void { this.router.navigate([route]); }

  getRoleClass(role: string): string { return ({ Student:'rp-student', Librarian:'rp-librarian', Admin:'rp-admin' } as any)[role] || ''; }
  getRoleColor(role: string): string { return ({ Student:'av-green',   Librarian:'av-indigo',    Admin:'av-violet' } as any)[role] || 'av-indigo'; }
}
