import { Component, OnInit } from '@angular/core';
import { PenaltyServiceService } from '../penalty-service/penalty-service.service';
import { Penalty } from 'src/app/models/penalty.model';

@Component({
  selector: 'app-penalties',
  templateUrl: './penalties.component.html',
  styleUrls: ['./penalties.component.scss']
})
export class PenaltiesComponent implements OnInit {
  outstandingPenalties: any[] = [];
  penaltyHistory: any[] = [];
  isLoading: boolean = true;

  constructor(private penaltyService: PenaltyServiceService) {}

  ngOnInit(): void {
    this.loadPenalties();
  }

  loadPenalties(): void {
    this.isLoading = true;
    this.penaltyService.getPenalties().subscribe({
      next: (data: any[]) => {
        // Outstanding: penalty > 0 and book NOT yet returned (status !== 3)
        this.outstandingPenalties = data.filter(p =>
          p.penaltyAmount > 0 && p.status !== 3
        );
        // History: book returned (status === 3) and had a penalty
        this.penaltyHistory = data.filter(p =>
          p.status === 3 && p.penaltyAmount > 0
        );
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load penalties:', err);
        this.isLoading = false;
      }
    });
  }

  getTotalOutstanding(): number {
    return this.outstandingPenalties.reduce((t, p) => t + p.penaltyAmount, 0);
  }

  getAccentColor(id: number): string {
    const colors = ['#ef4444', '#f59e0b', '#6366f1', '#3b82f6'];
    return colors[id % colors.length];
  }
}
