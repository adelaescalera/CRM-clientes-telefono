import { Routes } from '@angular/router';
import { RegistroComponent } from './pages/registro/registro.component';
import { HomeComponent } from './pages/home/home.component';
import { ClienteComponent } from './pages/cliente/cliente.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: RegistroComponent },

  {
    path: 'home',
    component: HomeComponent,
    canActivate: [authGuard],
    data: { roles: [1] }
  },

  {
    path: 'cliente',
    component: ClienteComponent,
    canActivate: [authGuard],
    data: { roles: [2] } 
  },

  { path: '**', redirectTo: '/login' }
];
