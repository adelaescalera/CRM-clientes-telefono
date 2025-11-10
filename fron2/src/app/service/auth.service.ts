import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userKey = 'authUser';
  private tokenKey = 'authToken';

  constructor() { }

  login(user: any, token: string): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
    localStorage.setItem(this.tokenKey, token);
  }

  logout(): void {
    localStorage.removeItem(this.userKey);
    localStorage.removeItem(this.tokenKey);
    location.reload();
  }


  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  getUser(): any | null {
    const user = localStorage.getItem(this.userKey);
    // const DNI=localStorage.getItem('dni');
    // console.log('getUser -> DNI almacenado:', DNI);
    // console.log('getUser -> user almacenado:', user); // LLEGA SIN DNI PQQQQ
    return user ? JSON.parse(user) : null;
  }

  getUserRole(): number | null {
    const user = localStorage.getItem(this.userKey);
    if (!user) return null;
    return JSON.parse(user).rol?.id || null;
  }


  hasRole(allowedRoles: number[]): boolean {
    const role = this.getUserRole();
    if (!role) return false;
    return allowedRoles.includes(role);
  }
}




