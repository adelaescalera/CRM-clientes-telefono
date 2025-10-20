import { Component } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { ClientService } from '../../service/client.service';
import { ConsumoService } from '../../service/consumo.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cliente',
  imports: [],
  templateUrl: './cliente.component.html',
  styleUrl: './cliente.component.scss'
})
export class ClienteComponent {
  tablas: any[] = [];
  consumos: any[] = [];

  displayModal: boolean = false; 

  constructor(private clientService: ClientService, private consumoService: ConsumoService ) { }

  ngOnInit(): void {
    this.getData();
  }

  public getData(): void {
    this.clientService.getData().subscribe(res => {
      this.tablas = res.data;
      console.log(this.tablas);
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
}
