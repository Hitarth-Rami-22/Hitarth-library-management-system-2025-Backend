import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Toast } from '../toast.service';

@Component({
  selector: 'app-toast',
  template: `
    <div class="toast-card" [ngClass]="toast.type">
      <div class="toast-icon">
        <ng-container [ngSwitch]="toast.type">
          <!-- Success -->
          <svg *ngSwitchCase="'success'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <!-- Error -->
          <svg *ngSwitchCase="'error'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
          <!-- Info -->
          <svg *ngSwitchCase="'info'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <!-- Warning -->
          <svg *ngSwitchCase="'warning'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </ng-container>
      </div>
      
      <div class="toast-body">
        <span class="toast-msg">{{ toast.message }}</span>
      </div>

      <button class="toast-close" (click)="close.emit()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      <div class="toast-progress" [style.animationDuration.ms]="toast.duration"></div>
    </div>
  `,
  styles: [`
    .toast-card {
      min-width: 320px;
      max-width: 420px;
      padding: 16px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
      border: 1px solid rgba(0, 0, 0, 0.05);
      display: flex;
      align-items: center;
      gap: 12px;
      position: relative;
      overflow: hidden;
      animation: bounceIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    .toast-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      
      svg {
        width: 22px;
        height: 22px;
      }
    }

    /* Types */
    .success .toast-icon { background: #ecfdf5; color: #10b981; }
    .error .toast-icon { background: #fef2f2; color: #ef4444; }
    .info .toast-icon { background: #eff6ff; color: #3b82f6; }
    .warning .toast-icon { background: #fffbeb; color: #f59e0b; }

    .toast-body {
      flex: 1;
      .toast-msg {
        font-size: 0.95rem;
        font-weight: 600;
        color: #1f2937;
        line-height: 1.4;
      }
    }

    .toast-close {
      background: transparent;
      border: none;
      color: #9ca3af;
      cursor: pointer;
      padding: 4px;
      border-radius: 6px;
      transition: all 0.2s;
      
      svg { width: 18px; height: 18px; }
      &:hover { background: #f3f4f6; color: #1f2937; }
    }

    .toast-progress {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 3px;
      background: rgba(0, 0, 0, 0.05);
      width: 100%;
      animation: shrink linear forwards;
    }

    .success .toast-progress { background: #10b981; }
    .error .toast-progress { background: #ef4444; }
    .info .toast-progress { background: #3b82f6; }
    .warning .toast-progress { background: #f59e0b; }

    @keyframes shrink {
      from { width: 100%; }
      to { width: 0%; }
    }

    @keyframes bounceIn {
      0% { opacity: 0; transform: scale(0.3) translateY(20px); }
      70% { transform: scale(1.05); }
      100% { opacity: 1; transform: scale(1) translateY(0); }
    }
  `]
})
export class ToastComponent {
  @Input() toast!: Toast;
  @Output() close = new EventEmitter<void>();
}
