import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientService } from '../../service/client.service';
import { ClientsTableComponent } from '../../components/clients-table/clients-table.component';
import { FormularioComponent } from '../../components/formulario/formulario.component';
import { RouterLink } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ClientsTableComponent, FormularioComponent ,  DialogModule, ButtonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  tablas: any[] = [];

   displayModal: boolean = false; //modal

  constructor(private clientService: ClientService) { }

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

openModal(){
  this.displayModal= true;
}


}
