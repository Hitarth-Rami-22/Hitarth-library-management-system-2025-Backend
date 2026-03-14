import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
   saveToken(token: string) {
    localStorage.setItem('token', token);
   }
getToken() {
    return localStorage.getItem('token');
  }

  clear() {
    localStorage.clear();
  }

  getUserRole(): string {
  const token = this.getToken();
  if (!token) return '';
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log('Decoded Payload:', payload);

    // ✅ Use correct role key
    const role = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    
    // ✅ Save to localStorage
    localStorage.setItem('role', role);

    return role;
  } catch (error) {
     localStorage.removeItem('role');
    console.error('Token decode failed', error);
    return '';
  }
}
getTokenPayload(): any {
  const token = this.getToken();
  if (!token) return null;
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (error) {
    console.error('Failed to decode token', error);
    return null;
  }
}

getUserId(): number {
  const token = this.getToken();
  if (!token) return 0;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log('Decoded Payload:', payload);

    const id = +payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
    return isNaN(id) ? 0 : id;
  } catch (error) {
    console.error('Token parsing failed:', error);
    return 0;
  }
}


  constructor() { }
}
