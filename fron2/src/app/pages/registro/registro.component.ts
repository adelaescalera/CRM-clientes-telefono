import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../../service/usuario.service';
import { Usuario } from '../../interface/response';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent {

  usuario: Usuario = {
    username: '',
    password: ''
  };

  errorMessage: string = '';

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private authService: AuthService
  ) { }

  login() {
    this.usuarioService.login(this.usuario).subscribe({
      next: (res: any) => {
        const user = res.data.user;
        const token = res.data.token;

        if (!user) {
          this.errorMessage = 'Usuario o contraseña incorrectos';
          return;
        }

        if (!token) {
          this.errorMessage = 'Token no proporcionado';
          return;
        }

        this.authService.login(user, token);

         this.router.navigate(['/home']);

        
       // const rol = user.rol.id;   console.log('Rol del usuario:', rol);
      },
      error: () => {
        this.errorMessage = 'Usuario o contraseña incorrectos';
      }
    });
  }
}
