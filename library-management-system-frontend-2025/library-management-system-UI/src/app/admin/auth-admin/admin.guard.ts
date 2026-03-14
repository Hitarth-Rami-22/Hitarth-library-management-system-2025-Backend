import { CanActivateFn } from '@angular/router';
import { inject, Injectable } from '@angular/core';
import { TokenStorageService } from 'src/app/shared/token-storage/token-storage.service';
import { Router } from '@angular/router';
import { Inject } from '@angular/core';

export const adminGuard: CanActivateFn = (route, state) => {
 const tokenService = inject(TokenStorageService);
  const router = inject(Router);
  const role = tokenService.getUserRole();

  if (role === 'Admin') return true;

  // Redirect non-admins
  if (role === 'Librarian') router.navigate(['/librarian-dashboard']);
  else if (role === 'Student') router.navigate(['/student-dashboard']);
  else router.navigate(['/login']);

    return false;
};
