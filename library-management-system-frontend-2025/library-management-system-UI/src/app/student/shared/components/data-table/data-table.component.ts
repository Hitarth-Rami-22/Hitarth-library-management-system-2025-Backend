import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent {
  @Input() headers: string[] = [];
  @Input() loading: boolean = false;
  @Input() emptyMessage: string = 'No records found';
}
