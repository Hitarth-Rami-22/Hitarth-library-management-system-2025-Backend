import { Component, OnInit } from '@angular/core';
import { ToastService, Toast } from '../toast.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-toast-container',
  template: `
    <div class="toast-container">
      <div *ngFor="let toast of (toasts$ | async); trackBy: trackById" class="toast-wrapper">
        <app-toast [toast]="toast" (close)="remove(toast.id)"></app-toast>
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 24px;
      right: 24px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 12px;
      pointer-events: none;
    }
    .toast-wrapper {
      pointer-events: auto;
      animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }
    @keyframes slideIn {
      from { opacity: 0; transform: translateX(30px); }
      to { opacity: 1; transform: translateX(0); }
    }
  `]
})
export class ToastContainerComponent implements OnInit {
  toasts$!: Observable<Toast[]>;

  constructor(private toastService: ToastService) {}

  ngOnInit() {
    this.toasts$ = this.toastService.toasts;
  }

  remove(id: number) {
    this.toastService.remove(id);
  }

  trackById(index: number, toast: Toast) {
    return toast.id;
  }
}
