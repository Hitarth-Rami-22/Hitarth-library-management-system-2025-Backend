import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/admin/service/admin.service';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/shared/toast/toast.service';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss']
})
export class AdminUsersComponent implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  isLoading = true;
  showDrawer = false;
  activeFilter = 'All';
  searchTerm = '';
  submitting = false;
  newUser = { fullName: '', email: '', password: '', userType: 'Librarian' };
  filterOptions = ['All', 'Student', 'Librarian', 'Admin', 'Blocked'];

  constructor(
    private adminService: AdminService, 
    private router: Router,
    private toast: ToastService
  ) {}

  ngOnInit(): void { this.loadUsers(); }

  loadUsers(): void {
    this.isLoading = true;
    this.adminService.getAllUsers().subscribe({
      next: (res: any) => { this.users = res; this.applyFilters(); this.isLoading = false; },
      error: () => { this.toast.error('Failed to load users.'); this.isLoading = false; }
    });
  }

  applyFilters(): void {
    let list = [...this.users];
    if (this.activeFilter === 'Blocked')  list = list.filter(u => u.isBlocked);
    else if (this.activeFilter !== 'All') list = list.filter(u => u.userType === this.activeFilter);
    if (this.searchTerm.trim()) {
      const t = this.searchTerm.toLowerCase();
      list = list.filter(u => u.fullName.toLowerCase().includes(t) || u.email.toLowerCase().includes(t));
    }
    this.filteredUsers = list;
  }

  setFilter(f: string): void { this.activeFilter = f; this.applyFilters(); }
  filterUsers(event: Event): void { this.searchTerm = (event.target as HTMLInputElement).value; this.applyFilters(); }

  toggleBlock(user: any): void {
    const newStatus = !user.isBlocked;
    this.adminService.updateUserStatus(user.id, newStatus).subscribe({
      next: () => { user.isBlocked = newStatus; this.applyFilters(); this.toast.success(`${user.fullName} ${newStatus ? 'blocked' : 'unblocked'}.`); },
      error: () => this.toast.error('Failed to update status.')
    });
  }

  toggleLibrarian(user: any): void {
    const isLib = user.userType === 'Librarian';
    this.adminService.updateUserRole(user.id, !isLib).subscribe({
      next: () => { user.userType = isLib ? 'Student' : 'Librarian'; this.applyFilters(); this.toast.info(`${user.fullName} is now ${user.userType}.`); },
      error: () => this.toast.error('Failed to update role.')
    });
  }

  registerUser(): void {
    if (!this.newUser.fullName.trim() || !this.validateEmail(this.newUser.email) || this.newUser.password.length < 6) return;
    this.submitting = true;
    this.adminService.registerUser(this.newUser).subscribe({
      next: (res: any) => {
        this.toast.success(res.message || 'User registered!');
        this.newUser = { fullName: '', email: '', password: '', userType: 'Librarian' };
        this.loadUsers(); this.submitting = false;
        setTimeout(() => this.closeDrawer(), 800);
      },
      error: (err) => { this.toast.error(err.error?.message || 'Registration failed.'); this.submitting = false; }
    });
  }

  validateEmail(email: string): boolean { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }
  openDrawer():  void { this.showDrawer = true; }
  closeDrawer(): void { this.showDrawer = false; this.newUser = { fullName: '', email: '', password: '', userType: 'Librarian' }; }

  countByRole(role: string): number { return this.users.filter(u => u.userType === role).length; }
  countBlocked():            number { return this.users.filter(u => u.isBlocked).length; }
  countActive():             number { return this.users.filter(u => !u.isBlocked).length; }

  getRoleClass(role: string): string { return ({ Student:'rp-student', Librarian:'rp-librarian', Admin:'rp-admin' } as any)[role] || ''; }
  getRoleColor(role: string): string { return ({ Student:'av-green', Librarian:'av-indigo', Admin:'av-violet' } as any)[role] || 'av-indigo'; }

}
