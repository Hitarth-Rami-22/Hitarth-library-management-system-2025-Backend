import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/shared/toast/toast.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  form = { fullName: '', email: '', password: '', userType: 'Student' };
  showPassword = false;

  constructor(
    private auth: AuthService, 
    private router: Router,
    private toast: ToastService
  ) {}

  ngOnInit() {}

  register() {
    const hasWhitespace = (val: string) => val.trim().length !== val.length;

    // Trim values
    const fullName = this.form.fullName.trim();
    const email = this.form.email.trim();
    const password = this.form.password.trim();

    // Basic validation
    if (!fullName || !email || !password) {
      this.toast.error('All fields are required.');
      return;
    }

    if (hasWhitespace(this.form.fullName) || hasWhitespace(this.form.email)) {
      this.toast.error('Leading/trailing whitespaces are not allowed.');
      return;
    }

    // Submit form with trimmed values
    const trimmedForm = {
      fullName,
      email,
      password,
      userType: this.form.userType
    };

    this.auth.register(trimmedForm).subscribe({
      next: (res: any) => {
        this.toast.success(res.message || 'Registration successful!');
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => {
        if (
          typeof err.error === 'string' &&
          (err.error.toLowerCase().includes('user already exists') ||
           err.error.toLowerCase().includes('email already exists'))
        ) {
          this.toast.error('Email is already registered. Please use a different one.');
        } else {
          this.toast.error('Registration failed. Please try again.');
        }
      }
    });
  }
}
