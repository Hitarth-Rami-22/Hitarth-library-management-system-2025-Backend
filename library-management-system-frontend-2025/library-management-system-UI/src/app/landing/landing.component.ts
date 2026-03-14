import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStorageService } from 'src/app/shared/token-storage/token-storage.service';

import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

  systemStatus: 'checking' | 'operational' | 'offline' = 'checking';

  constructor(
    private router: Router,
    private tokenStore: TokenStorageService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    // Check backend health
    this.http.get('https://localhost:7255/api/Auth/admins-librarians')
      .pipe(
        catchError((err) => {
          // If status is 0, it means the server is completely unreachable (offline)
          // If status is 401/403 etc, it means the server is up but we are not authorized (operational)
          if (err.status === 0) {
            this.systemStatus = 'offline';
          } else {
            this.systemStatus = 'operational';
          }
          return of(null);
        })
      )
      .subscribe((res) => {
        if (res) {
          this.systemStatus = 'operational';
        }
      });

    // If already logged in, skip landing
    if (this.tokenStore.getToken()) {
      const role = this.tokenStore.getUserRole();
      if (role === 'Admin') this.router.navigate(['/dashboard']);
      else if (role === 'Librarian') this.router.navigate(['/librarian-dashboard']);
      else if (role === 'Student') this.router.navigate(['/student-dashboard']);
    }
  }

  scrollToFeatures() {
    const el = document.getElementById('features');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

}
