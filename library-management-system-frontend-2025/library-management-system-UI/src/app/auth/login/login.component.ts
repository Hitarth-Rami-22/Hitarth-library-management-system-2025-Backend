import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { TokenStorageService } from 'src/app/shared/token-storage/token-storage.service';
import { ToastService } from 'src/app/shared/toast/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form = { email: '', password: '' };
  showPassword = false;
  userList: any[] = [];

  constructor(
    private auth: AuthService,
    private router: Router,
    private tokenStore: TokenStorageService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.auth.getAdminsAndLibrarians().subscribe({
      next: (res: any) => this.userList = res,
      error: (err) => console.error('Failed to load users', err)
    });

    if (this.tokenStore.getToken()) {
      this.router.navigate(['/dashboard']);
      return;
    }
  }

  isFieldInvalid(value: string): boolean {
    return !value || value.trim() === '';
  }

  login() {
    // Validation: Empty or whitespace check
    if (this.isFieldInvalid(this.form.email) || this.isFieldInvalid(this.form.password)) {
      this.toast.error('Email and password cannot be empty or whitespace.');
      return;
    }

    this.auth.login(this.form).subscribe({
      next: (res: any) => {
        this.tokenStore.saveToken(res.token);
        this.toast.success('Login successful! Redirecting...');

        const role = this.tokenStore.getUserRole();

        setTimeout(() => {
          if (role === 'Admin') {
            this.router.navigate(['/dashboard']);
          } else if (role === 'Librarian') {
            this.router.navigate(['/librarian-dashboard']);
          } else if (role === 'Student') {
            this.router.navigate(['/student-dashboard']);
          } else {
            this.toast.error('Invalid account role.');
          }
        }, 1500);
      },
      error: (err) => {
        this.toast.error('Login failed: Invalid credentials');
      }
    });
  }
}
