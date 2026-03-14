import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStorageService } from 'src/app/shared/token-storage/token-storage.service';
import { BorrowServiceService } from 'src/app/student/borrow-service/borrow-service.service';
import { BookServiceService } from 'src/app/book/book/book/book-service/book-service.service';
import { PenaltyServiceService } from 'src/app/student/penalty-service/penalty-service.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  userName: string = 'Librarian';
  greeting: string = 'Good Morning';
  currentDate: string = '';

  // Core stats
  totalBooks: number = 0;
  pendingRequests: number = 0;
  approvedBorrows: number = 0;
  returnRequests: number = 0;
  totalRejected: number = 0;
  totalReturned: number = 0;
  totalPenalties: number = 0;
  outstandingPenaltyAmount: number = 0;

  // Derived insights
  approvalRate: number = 0;
  totalRequests: number = 0;

  // Recent activity (last 5 borrow requests)
  recentRequests: any[] = [];

  // Top borrowed books
  topBooks: { title: string; author: string; count: number; }[] = [];

  allRequests: any[] = [];
  isLoading = true;

  quickLinks = [
    { label: 'Borrow Requests',  route: '/librarian-dashboard/requests',        desc: 'Approve or reject student book requests',     color: 'indigo' },
    { label: 'Return Approvals', route: '/librarian-dashboard/return-approvals', desc: 'Mark returned books and close borrow cycles',   color: 'green'  },
    { label: 'Manage Books',     route: '/librarian-dashboard/books',            desc: 'Add, edit or remove books from the library',  color: 'blue'   },
    { label: 'View Penalties',   route: '/librarian-dashboard/penalties',        desc: 'Review outstanding penalties for late returns',color: 'amber'  },
  ];

  constructor(
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
      const name = payload?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']
        || payload?.['name'] || payload?.['unique_name'] || payload?.['email'] || '';
      this.userName = name || 'Librarian';
    } catch { this.userName = 'Librarian'; }
    this.loadStats();
  }

  setGreeting(): void {
    const h = new Date().getHours();
    this.greeting = h < 12 ? 'Good Morning' : h < 17 ? 'Good Afternoon' : 'Good Evening';
    this.currentDate = new Date().toLocaleDateString('en-IN', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  }

  loadStats(): void {
    this.isLoading = true;

    // Books
    this.bookService.getAll().subscribe({
      next: (books: any) => { this.totalBooks = (books as any[]).length; },
      error: () => {}
    });

    // Penalties
    this.penaltyService.getPenalties().subscribe({
      next: (data: any[]) => {
        this.totalPenalties = data.length;
        this.outstandingPenaltyAmount = data
          .filter((p: any) => p.status !== 3)
          .reduce((sum: number, p: any) => sum + (p.penaltyAmount || 0), 0);
      },
      error: () => {}
    });

    // All borrow requests
    this.borrowService.getAllRequests().subscribe({
      next: (res: any[]) => {
        this.allRequests    = res;
        this.totalRequests  = res.length;
        this.pendingRequests  = res.filter(r => r.status === 0).length;
        this.approvedBorrows  = res.filter(r => r.status === 1).length;
        this.totalRejected    = res.filter(r => r.status === 2).length;
        this.totalReturned    = res.filter(r => r.status === 3).length;
        this.returnRequests   = res.filter(r => r.status === 4).length;

        // Approval rate (approved out of decided)
        const decided = this.approvedBorrows + this.totalRejected + this.totalReturned;
        this.approvalRate = decided > 0 ? Math.round((this.approvedBorrows + this.totalReturned) / decided * 100) : 0;

        // Recent 5 requests sorted by date desc
        this.recentRequests = [...res]
          .sort((a, b) => new Date(b.requestedOn || b.approvedOn || 0).getTime()
                       -  new Date(a.requestedOn || a.approvedOn || 0).getTime())
          .slice(0, 5);

        // Top 5 most borrowed books
        const bookCount: { [key: string]: { title: string; author: string; count: number } } = {};
        res.forEach(r => {
          const title = r.book?.title;
          if (!title) return;
          if (!bookCount[title]) bookCount[title] = { title, author: r.book?.author || '', count: 0 };
          bookCount[title].count++;
        });
        this.topBooks = Object.values(bookCount).sort((a, b) => b.count - a.count).slice(0, 5);

        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

  getStatusText(status: number): string {
    switch (status) {
      case 0: return 'Pending';
      case 1: return 'Approved';
      case 2: return 'Rejected';
      case 3: return 'Returned';
      case 4: return 'Return Req.';
      default: return 'Unknown';
    }
  }

  getStatusClass(status: number): string {
    switch (status) {
      case 0: return 'pill-amber';
      case 1: return 'pill-green';
      case 2: return 'pill-red';
      case 3: return 'pill-blue';
      case 4: return 'pill-violet';
      default: return '';
    }
  }

  navigate(route: string): void { this.router.navigate([route]); }
}
