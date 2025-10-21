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

  //  public login(userData: any): Observable<GenResponse> {
  //       return this.http.post<GenResponse>(`${this.authURL}/login`, userData).pipe(
  //           tap(response => {
  //               localStorage.setItem('token', response.data.token);
  //               // Convert object to string
  //               const user = response.data.user;
  //               localStorage.setItem('user', JSON.stringify(user));

  //               if (user && user.rol) {
  //                   this.router.navigate(['/home']);
  //               } else {
  //                   this.router.navigate(['']);
  //               }
  //           }));
  //   }

  //   public isAuthenticated(): boolean {
  //       return localStorage.getItem('token') ? true : false;
  //   }

    // public logOut(): void {
    //     localStorage.removeItem("token");
    //     localStorage.removeItem("user");
    //     this.router.navigate(['']);
    // }

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
    console.log('hasRole -> role del usuario:', role, 'roles permitidos:', allowedRoles);
    return allowedRoles.includes(role);
  }
}




