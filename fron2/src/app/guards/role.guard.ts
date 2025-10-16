import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root'
})

export class RoleGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRoles = route.data['roles'] as number[]; // Ej: [1] o [2,3]
    const userRole = this.authService.getUserRole();
    console.log("RoleGuard -> userRole:", userRole, "expectedRoles:", expectedRoles);

    if (userRole && expectedRoles.includes(userRole)) {
      return true;
    } else {
      this.router.navigate(['/forbidden']); 
      return false;
    }
  }
}
