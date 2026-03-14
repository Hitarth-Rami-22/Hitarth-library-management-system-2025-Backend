import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-status-badge',
  templateUrl: './status-badge.component.html',
  styleUrls: ['./status-badge.component.scss']
})
export class StatusBadgeComponent {
  @Input() label: string = '';
  @Input() type: 'success' | 'warning' | 'error' | 'info' | 'neutral' = 'neutral';
}
