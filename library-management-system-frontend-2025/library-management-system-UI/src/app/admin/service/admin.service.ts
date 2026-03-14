import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TokenStorageService } from '../../shared/token-storage/token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
    private baseUrl = 'https://localhost:7255/api/Admin';

  constructor(private http: HttpClient, private tokenStore: TokenStorageService, private httpClient: HttpClient) { }

  registerUser(data: any) {
  return this.http.post('https://localhost:7255/api/auth/register', data);
}

  getAllUsers() {
    return this.http.get(`${this.baseUrl}/users`);
  }

  updateUserStatus(userId: number, isBlocked: boolean) {
    return this.http.put(`${this.baseUrl}/user/status`, { userId, isBlocked });
  }

  updateUserRole(userId: number, isLibrarian: boolean) {
    return this.http.put(`${this.baseUrl}/user/role`, { userId, isLibrarian });
  }
}
