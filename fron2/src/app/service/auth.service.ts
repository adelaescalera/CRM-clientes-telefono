import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly USER_KEY = 'user';
  private readonly TOKEN_KEY = 'token';

  constructor() {}

  // Guardar usuario y token al hacer login
  login(user: any, token: string) {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  logout() {
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.TOKEN_KEY);
  }

  // Comprobar si el usuario está autenticado
  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.USER_KEY) && !!localStorage.getItem(this.TOKEN_KEY);
  }

  // Obtener rol del usuario
  getUserRole(): number | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    if (!userStr) return null;
    const user = JSON.parse(userStr);
    return user.rol && user.rol.id ? Number(user.rol.id) : null;
  }

  // Obtener token JWT
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Obtener usuario completo
  getUser(): any | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    if (!userStr) return null;
    return JSON.parse(userStr);
  }
}
