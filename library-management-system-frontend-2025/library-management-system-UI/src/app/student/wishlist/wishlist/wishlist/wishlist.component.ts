import { Component, OnInit } from '@angular/core';
import { WishlistServiceService } from '../../service/wishlist/wishlist-service.service';
import { TokenStorageService } from 'src/app/shared/token-storage/token-storage.service';
import { ToastService } from 'src/app/shared/toast/toast.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit {

  studentId = 0;
  wishlist: any[] = [];
  bookIdInput = '';

  constructor(
    private wishlistServiceService: WishlistServiceService,
    private tokenService: TokenStorageService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.studentId = this.tokenService.getUserId();
    this.loadWishlist();
  }

  loadWishlist() {
    this.wishlistServiceService.getWishlist(this.studentId).subscribe({
      next: res => this.wishlist = res,
      error: () => this.toast.error('Failed to load wishlist')
    });
  }

  addToWishlist() {
    if (!this.bookIdInput.trim()) return this.toast.warning('Please enter a Book ID');
    const payload = { studentId: this.studentId, bookId: +this.bookIdInput };
    this.wishlistServiceService.addToWishlist(payload).subscribe({
      next: () => {
        this.bookIdInput = '';
        this.loadWishlist();
        this.toast.success('Book added to wishlist');
      },
      error: () => this.toast.error('Failed to add to wishlist')
    });
  }

  removeFromWishlist(id: number) {
    this.wishlistServiceService.removeFromWishlist(id).subscribe({
      next: () => this.loadWishlist(),
      error: () => this.toast.error('Failed to remove from wishlist')
    });
  }
}
