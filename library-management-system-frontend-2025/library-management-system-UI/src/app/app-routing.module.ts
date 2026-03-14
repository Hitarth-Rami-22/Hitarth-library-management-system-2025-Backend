import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { DashboardComponent } from './admin/dashboard/dashboard/dashboard.component';
import { AdminHomeComponent } from './admin/dashboard/admin-home/admin-home.component';
import { AdminUsersComponent } from './admin/dashboard/admin-users/admin-users.component';
import { DashboardComponent as LibrarianDashboardHomeComponent } from './librarian/dashboard/dashboard/dashboard/dashboard.component';
import { authGuard } from './auth/auth.guard';
import { BookComponent } from './book/book/book/book.component';
import { LibrarianDashboardComponent } from './librarian/dashboard/librarian-dashboard/librarian-dashboard.component';
import { StudentDashboardComponent } from './student/dashboard/student-dashboard/student-dashboard.component';
import { StudentSidebarLayoutComponent } from './student/sidebar-student-layout/student-sidebar-layout/student-sidebar-layout.component';
import { BorrowRequestsComponent } from './librarian/dashboard/borrow-requests/borrow-requests/borrow-requests.component';
import { adminGuard } from './admin/auth-admin/admin.guard';
import { ReturnApprovalsComponent } from './librarian/dashboard/return-approvals/return-approvals/return-approvals.component';
import { PenaltyListComponent } from './student/penalty-list/penalty-list/penalty-list.component';
import { NotificationsComponent } from './student/notifications/notifications/notifications.component';

// SaaS Redesigned Student Components
import { BrowseBooksComponent } from './student/browse-books/browse-books.component';
import { BorrowedBooksComponent } from './student/borrowed-books/borrowed-books.component';
import { PenaltiesComponent } from './student/penalties/penalties.component';
import { StudentBorrowRequestsComponent } from './student/borrow-requests/borrow-requests.component';
import { LandingComponent } from './landing/landing.component';


const routes: Routes = [
  { path: '',         component: LandingComponent },
  { path: 'login',    component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // ── Admin ────────────────────────────────────────────────────────
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [adminGuard],
    children: [
      { path: '',          component: AdminHomeComponent },
      { path: 'users',     component: AdminUsersComponent },
      { path: 'books',     component: BookComponent },
      { path: 'requests',  component: BorrowRequestsComponent },
      { path: 'return-approvals', component: ReturnApprovalsComponent },
      { path: 'penalties', component: PenaltyListComponent },
    ]
  },

  // ── Student (SaaS Redesign) ──────────────────────────────────────
  {
    path: 'student-dashboard',
    component: StudentSidebarLayoutComponent, // Layout is now the parent
    canActivate: [authGuard],
    children: [
      { path: 'home',             component: StudentDashboardComponent },
      { path: 'browse',           component: BrowseBooksComponent },
      { path: 'borrowed-books',   component: BorrowedBooksComponent },
      { path: 'history',          component: StudentBorrowRequestsComponent },
      { path: 'notifications',    component: NotificationsComponent },
      { path: 'penalties',        component: PenaltiesComponent },
      { path: '',                 redirectTo: 'home', pathMatch: 'full' },
    ]
  },

  // ── Librarian ─────────────────────────────────────────────────────
  {
    path: 'librarian-dashboard',
    component: LibrarianDashboardComponent,
    canActivate: [authGuard],
    children: [
      { path: '',                  redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard',         component: LibrarianDashboardHomeComponent },
      { path: 'requests',          component: BorrowRequestsComponent },
      { path: 'return-approvals',  component: ReturnApprovalsComponent },
      { path: 'penalties',         component: PenaltyListComponent },
      { path: 'books',             component: BookComponent },
    ]
  },

  { path: '**',  redirectTo: '' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
