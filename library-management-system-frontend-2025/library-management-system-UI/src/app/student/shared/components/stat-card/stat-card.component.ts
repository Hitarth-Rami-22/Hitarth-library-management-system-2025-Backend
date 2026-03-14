import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  templateUrl: './stat-card.component.html',
  styleUrls: ['./stat-card.component.scss']
})
export class StatCardComponent {
  @Input() label: string = '';
  @Input() value: string | number | null = 0;
  @Input() trend: string = '';
  @Input() trendType: 'up' | 'down' | 'neutral' = 'neutral';
  @Input() color: string = 'indigo'; // indigo, green, amber, red
}
