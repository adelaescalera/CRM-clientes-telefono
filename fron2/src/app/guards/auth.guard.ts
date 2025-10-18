import { inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  
  if (!authService.isAuthenticated()) {
    return router.createUrlTree(['/login']);
  }

  
  const allowedRoles = route.data['roles'] as number[] | undefined;
  console.log('Roles permitidos en esta ruta:', allowedRoles);
  if (allowedRoles && !authService.hasRole(allowedRoles)) {
    alert('No tienes permiso para acceder a esta página.');
    return router.createUrlTree(['/login']); 
  }

  return true;
};
