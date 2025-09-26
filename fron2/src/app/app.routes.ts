import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { FormularioComponent

 } from './components/formulario/formulario.component';
export const routes: Routes = [
    {path: '',component: HomeComponent},
    
  { path: 'nuevo-cliente', component: FormularioComponent }
];

