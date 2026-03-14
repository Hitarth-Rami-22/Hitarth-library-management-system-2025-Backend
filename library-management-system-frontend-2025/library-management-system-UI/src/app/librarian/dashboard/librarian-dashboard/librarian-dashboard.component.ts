import { Component } from '@angular/core';

@Component({
  selector: 'app-librarian-dashboard',
  templateUrl: './librarian-dashboard.component.html',
  styleUrls: ['./librarian-dashboard.component.scss']
})
export class LibrarianDashboardComponent {
librarianMenu = [
  
  { label: '📖 Manage Books', route: '/books' }        // external route
];



}
