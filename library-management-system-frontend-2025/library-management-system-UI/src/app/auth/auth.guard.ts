import { CanActivateFn } from '@angular/router';
import { Injectable } from '@angular/core';
import { TokenStorageService } from '../shared/token-storage/token-storage.service';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { inject } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
export const authGuard: CanActivateFn = (route, state) => {
   const tokenStore = inject(TokenStorageService);
  const router = inject(Router);
  
  if (tokenStore.getToken()) {
  return true;
  }
  router.navigate(['/login']);
  return false;
};
