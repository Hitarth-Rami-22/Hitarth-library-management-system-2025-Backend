import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../../token-storage/token-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar-layout',
  templateUrl: './sidebar-layout.component.html',
  styleUrls: ['./sidebar-layout.component.scss']
})
export class SidebarLayoutComponent implements OnInit {
  librarianName: string = 'Librarian';
  menuOpen = false;
  pendingRequestsBadge = 0;

  constructor(
    private tokenService: TokenStorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    try {
      const payload = this.tokenService.getTokenPayload();
      this.librarianName =
        payload?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']
        || payload?.['name'] || payload?.['unique_name'] || payload?.['email'] || 'Librarian';
    } catch {}
  }

  toggleMenu(): void { this.menuOpen = !this.menuOpen; }
  closeMenu():  void { this.menuOpen = false; }

  logout(): void {
    this.tokenService.clear();
    this.router.navigate(['/']);
  }
}
