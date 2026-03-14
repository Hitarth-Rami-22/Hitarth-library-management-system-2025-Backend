import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WishlistServiceService {
   private baseUrl = 'https://localhost:7255/api/Wishlist';
  constructor(private http: HttpClient) { }
  getWishlist(studentId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/student/${studentId}`);
  }

  addToWishlist(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, data);
  }

  removeFromWishlist(wishlistId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${wishlistId}`);
  }
}
