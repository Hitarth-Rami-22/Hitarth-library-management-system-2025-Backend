
import { Component, OnInit } from '@angular/core';
import { NotificationServiceService } from '../../notification/notification-service.service'; 
import { TokenStorageService } from 'src/app/shared/token-storage/token-storage.service';
import { ToastService } from 'src/app/shared/toast/toast.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  studentId = 0;
  notifications: any[] = [];
  isLoading = true;

  constructor(
    private notificationService: NotificationServiceService,
    private tokenService: TokenStorageService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.studentId = this.tokenService.getUserId();
    this.loadNotifications();
  }

  loadNotifications() {
    this.isLoading = true;
    this.notificationService.getStudentNotifications(this.studentId).subscribe({
      next: res => {
        this.notifications = res;
        this.isLoading = false;
      },
      error: () => {
        this.toast.error('Failed to load notifications');
        this.isLoading = false;
      }
    });
  }

  markAsRead(notificationId: number) {
    this.notificationService.markAsRead(notificationId).subscribe({
      next: () => {
        // Optimistically update UI
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification) {
          notification.isRead = true;
        }
      },
      error: () => this.toast.error('Failed to mark as read')
    });
  }

  getAccentColor(id: number): string {
    const colors = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
    return colors[id % colors.length];
  }
}