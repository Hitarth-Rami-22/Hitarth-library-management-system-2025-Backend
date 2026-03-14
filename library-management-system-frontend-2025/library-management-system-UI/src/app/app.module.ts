import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DashboardComponent } from './admin/dashboard/dashboard/dashboard.component';
import { DashboardComponent as LibrarianDashboardHomeComponent } from './librarian/dashboard/dashboard/dashboard/dashboard.component';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from 'src/app/shared/intercepter/auth.interceptor';
import { BookComponent } from './book/book/book/book.component';
import { TokenStorageService } from './shared/token-storage/token-storage.service';
import { AuthService } from './auth/auth.service';
import { AdminService } from './admin/service/admin.service';
import { Router } from '@angular/router';
import { LibrarianDashboardComponent } from './librarian/dashboard/librarian-dashboard/librarian-dashboard.component';
import { StudentDashboardComponent } from './student/dashboard/student-dashboard/student-dashboard.component';
import { BorrowComponent } from './student/borrow/borrow/borrow.component';
import { HistoryComponent } from './student/history/history/history.component';
import { BorrowRequestsComponent } from './librarian/dashboard/borrow-requests/borrow-requests/borrow-requests.component';
import { SidebarLayoutComponent } from './shared/sidebar-layout/sidebar-layout/sidebar-layout.component';
import { ReturnRequestsComponent } from './student/student-book-request/return-requests/return-requests.component';
import { StudentSidebarLayoutComponent } from './student/sidebar-student-layout/student-sidebar-layout/student-sidebar-layout.component';
import { ReturnApprovalsComponent } from './librarian/dashboard/return-approvals/return-approvals/return-approvals.component';
import { WishlistComponent } from './student/wishlist/wishlist/wishlist/wishlist.component';
import { NotificationsComponent } from './student/notifications/notifications/notifications.component';
import { PenaltyListComponent } from './student/penalty-list/penalty-list/penalty-list.component';
import { AdminHomeComponent } from './admin/dashboard/admin-home/admin-home.component';
import { AdminUsersComponent } from './admin/dashboard/admin-users/admin-users.component';
import { LandingComponent } from './landing/landing.component';

// SaaS Student Shared Components
import { PageHeaderComponent } from './student/shared/components/page-header/page-header.component';
import { StatCardComponent } from './student/shared/components/stat-card/stat-card.component';
import { DataTableComponent } from './student/shared/components/data-table/data-table.component';
import { StatusBadgeComponent } from './student/shared/components/status-badge/status-badge.component';
import { BookCardComponent } from './student/shared/components/book-card/book-card.component';

// SaaS Student Redesigned Pages
import { BrowseBooksComponent } from './student/browse-books/browse-books.component';
import { BorrowedBooksComponent } from './student/borrowed-books/borrowed-books.component';
import { PenaltiesComponent } from './student/penalties/penalties.component';
import { StudentBorrowRequestsComponent } from './student/borrow-requests/borrow-requests.component';
import { ToastModule } from './shared/toast/toast.module';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    BookComponent,
    LibrarianDashboardComponent,
    StudentDashboardComponent,
    BorrowComponent,
    HistoryComponent,
    BorrowRequestsComponent,
    SidebarLayoutComponent,
    ReturnRequestsComponent,
    StudentSidebarLayoutComponent,
    ReturnApprovalsComponent,
    WishlistComponent,
    NotificationsComponent,
    PenaltyListComponent,
    AdminHomeComponent,
    AdminUsersComponent,
    LibrarianDashboardHomeComponent,
    LandingComponent,
    
    // SaaS Components
    PageHeaderComponent,
    StatCardComponent,
    DataTableComponent,
    StatusBadgeComponent,
    BookCardComponent,
    BrowseBooksComponent,
    BorrowedBooksComponent,
    PenaltiesComponent,
    StudentBorrowRequestsComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ToastModule
  ],
  providers: [
     { provide: HTTP_INTERCEPTORS, 
      useClass: AuthInterceptor, 
      multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
