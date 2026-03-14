import { Component, OnInit } from '@angular/core';
import { PenaltyServiceService } from '../../penalty-service/penalty-service.service';
import { Penalty } from 'src/app/models/penalty.model';

@Component({
  selector: 'app-penalty-list',
  templateUrl: './penalty-list.component.html',
  styleUrls: ['./penalty-list.component.scss']
})
export class PenaltyListComponent implements OnInit {
  penalties: Penalty[] = [];

  /** Outstanding: penalty > 0 and book NOT yet returned (status !== 3) */
  outstandingPenalties: Penalty[] = [];

  /** History: book returned (status === 3) and had a penalty */
  penaltyHistory: Penalty[] = [];

  isLoading: boolean = true;

  constructor(private penaltyServiceService: PenaltyServiceService) {}

  ngOnInit(): void {
    this.loadPenalties();
  }

  loadPenalties(): void {
    this.isLoading = true;
    this.penaltyServiceService.getPenalties().subscribe({
      next: (data) => {
        this.penalties = data;
        // Split into outstanding vs history
        this.outstandingPenalties = data.filter(p =>
          p.penaltyAmount > 0 && p.status !== 3
        );
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

  getTotalHistory(): number {
    return this.penaltyHistory.reduce((t, p) => t + p.penaltyAmount, 0);
  }

  /** Keep for backward compat */
  getTotalPenalty(): number {
    return this.getTotalOutstanding();
  }
}