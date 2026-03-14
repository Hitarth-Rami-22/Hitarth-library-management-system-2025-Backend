import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationServiceService {
private baseUrl = 'https://localhost:7255/api/Notifications';

  constructor(private http: HttpClient) {}

  getStudentNotifications(studentId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/student/${studentId}`);
  }

  markAsRead(notificationId: number): Observable<any> {
      return this.http.put(`${this.baseUrl}/${notificationId}/read`, {}); 
    // return this.http.put(`${this.baseUrl}/mark-read/${notificationId}`, {});
  }
}
