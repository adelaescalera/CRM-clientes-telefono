import { Routes } from '@angular/router';
import { RegistroComponent } from './pages/registro/registro.component';
import { HomeComponent } from './pages/home/home.component';
import { ClienteComponent } from './pages/cliente/cliente.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: 'login', component: RegistroComponent },

  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [1] } // Solo rol 1 (admin)
  },

  {
    path: 'cliente',
    component: ClienteComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [2] } // Solo rol 2 (cliente)
  },

  { path: '**', redirectTo: '/login' }
];
