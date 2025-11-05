import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientService } from '../../service/client.service';
import { ClientsTableComponent } from '../../components/clients-table/clients-table.component';
import { FormularioComponent } from '../../components/formulario/formulario.component';
import { RouterLink } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ConsumoService } from '../../service/consumo.service';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { BusesTableComponent } from '../../components/buses-table/buses-table.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ClientsTableComponent, FormularioComponent, DialogModule, ButtonModule, SidebarComponent, BusesTableComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  tablas: any[] = [];
  consumos: any[] = [];

  displayModal: boolean = false;

  usuario: any = null;
  isAdmin = false;
  isCliente = false;

  
  selectedSection: string = 'clientes';


  constructor(private clientService: ClientService, private consumoService: ConsumoService, private authService: AuthService) { }

  ngOnInit(): void {
    this.usuario = this.authService.getUser();

    if (this.usuario?.rol?.id === 1) this.isAdmin = true;
    if (this.usuario?.rol?.id === 2) this.isCliente = true;


    console.log('Usuario logueado:', this.usuario);
    console.log('Es admin:', this.isAdmin);
    console.log('Es cliente:', this.isCliente);
    console.log('DNI del usuario:', this.usuario?.dni);
    console.log('nombre del usuario:', this.usuario?.username);

    if (this.isAdmin) {
      this.getData();
    } else if (this.isCliente) {
      this.getCliente(this.usuario?.cliente.dni);
    }


  }

    changeSection(section: string) {
    this.selectedSection = section;
  }


  public getData(): void {
    this.clientService.getData().subscribe(res => {
      this.tablas = res.data;
      console.log(this.tablas);
    });
  }

  public getCliente(dni: string): void {
    this.clientService.getCliente(dni).subscribe(res => {
      this.tablas = res.data;
    });
  }

  public addClienteToTable(nuevoCliente: any) {
    this.tablas.push(nuevoCliente);
    this.displayModal = false;
  }

  openModal() {
    this.displayModal = true;
  }

  logout() {
    const authService = new AuthService();
    authService.logout();
    const router = new Router();
    router.navigate(['/login']);
  }

  public UsuarioAgregado(nuevoUsuario: any) {
  this.displayModal = false;
}

}
