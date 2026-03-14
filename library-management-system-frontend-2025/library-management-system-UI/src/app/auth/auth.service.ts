import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TokenStorageService } from '../shared/token-storage/token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'https://localhost:7255/api';
  constructor(private http: HttpClient, private tokenStore: TokenStorageService) { }
  login(data: any) {
    return this.http.post(`${this.baseUrl}/Auth/login`, data);
  }

  register(data: any) {
    return this.http.post(`${this.baseUrl}/Auth/register`, data);
  }

  logout() {
    this.tokenStore.clear();
  }

  isLoggedIn() {
    return !!this.tokenStore.getToken();
  }
  autoLogin() {
    const token = this.tokenStore.getToken();
    if (token) {
    // Optionally decode or validate here
    return true;
  }
    return false;
  }
  getRole() {
    return this.tokenStore.getUserRole();
  }
  getAdminsAndLibrarians() {
    return this.http.get(`${this.baseUrl}/Auth/admins-librarians`);
  }
}
