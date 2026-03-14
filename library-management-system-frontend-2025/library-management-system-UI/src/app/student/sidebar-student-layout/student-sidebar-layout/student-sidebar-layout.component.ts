import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStorageService } from 'src/app/shared/token-storage/token-storage.service';

@Component({
  selector: 'app-student-sidebar-layout',
  templateUrl: './student-sidebar-layout.component.html',
  styleUrls: ['./student-sidebar-layout.component.scss']
})
export class StudentSidebarLayoutComponent implements OnInit {

  @Input() menuItems: { label: string, route: string }[] = [];
  
  studentName: string = 'Student';
  isMenuOpen: boolean = false;

  constructor(private tokenService: TokenStorageService, private router: Router) {}

  ngOnInit(): void {
    try {
      const payload = this.tokenService.getTokenPayload();
      // Try to find name in common JWT claim keys
      this.studentName = payload?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] 
                      || payload?.['name'] 
                      || payload?.['unique_name'] 
                      || payload?.['email'] 
                      || 'Student';
    } catch (e) {
      console.error('Error parsing token payload', e);
    }
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  logout() {
    this.tokenService.clear();
    this.router.navigate(['/']);
  }
}
