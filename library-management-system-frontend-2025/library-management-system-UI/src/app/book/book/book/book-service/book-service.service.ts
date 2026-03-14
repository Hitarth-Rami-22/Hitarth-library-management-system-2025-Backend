import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BookServiceService {
private baseUrl = 'https://localhost:7255/api/Books'
  constructor(private http: HttpClient) { }
  getAll() {
    return this.http.get(this.baseUrl);
  }

  add(book: any) {
    return this.http.post(this.baseUrl, book);
  }

  update(id: number, book: any) {
    return this.http.put(`${this.baseUrl}/${id}`, book);
  }

  delete(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
