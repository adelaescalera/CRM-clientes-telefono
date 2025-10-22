import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { ClientService } from '../../service/client.service';
import { EditClientComponent } from '../edit-client/edit-client.component';
import { ConsumoTableComponent } from '../consumo-table/consumo-table.component';

@Component({
  selector: 'app-clients-table',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    ToastModule,
    DialogModule,
    EditClientComponent,
    ConsumoTableComponent
  ],
  templateUrl: './clients-table.component.html',
  styleUrls: ['./clients-table.component.scss']
})
export class ClientsTableComponent {
  @Input() tablas: any[] = [];

  displayEditDialog = false;
  displayConsumoDialog = false;
  displaySeleccionTelefono = false;

  clienteSeleccionado: any = null;
  telefonoSeleccionado: any = null;
  telefonosDelCliente: any[] = [];

  //conseguimos rol
  rol_user=localStorage.getItem('authUser') ? JSON.parse(localStorage.getItem('authUser')!).rol.id : null;
  isAdmin=this.rol_user===1;
  
  expandedRows: { [key: string]: boolean } = {};

  constructor(private clienteS: ClientService) {}

  abrirModal(cliente: any) {
    this.clienteSeleccionado = { ...cliente };
    this.displayEditDialog = true;
  }

  abrirSeleccionTelefono(cliente: any) {
    if (!cliente.telefonos || cliente.telefonos.length === 0) return;
    this.clienteSeleccionado = { ...cliente };
    this.telefonosDelCliente = cliente.telefonos;
    this.displaySeleccionTelefono = true;
  }

  seleccionarTelefonoYAbrirConsumo(telefono: any) {
    this.telefonoSeleccionado = { ...telefono }; 
    this.displaySeleccionTelefono = false;
    this.displayConsumoDialog = true;
  }

  actualizarCliente(clienteActualizado: any) {
    const index = this.tablas.findIndex(c => c.id === clienteActualizado.id);
    if (index !== -1) this.tablas[index] = clienteActualizado;
    this.displayEditDialog = false;
  }

  onDeleteClient(id: number) {
    if (!confirm('¿Seguro que quieres eliminar este cliente?')) return;
    this.clienteS.deleteClient(id).subscribe({
      next: () => {
        this.tablas = this.tablas.filter(c => c.id !== id);
      },
      error: err => alert('Error al eliminar el cliente: ' + err.message)
    });
  }

  expandAll() {
    this.tablas.forEach(c => c.expanded = true);
    this.updateExpandedRows();
  }

  collapseAll() {
    this.tablas.forEach(c => c.expanded = false);
  }

  updateExpandedRows() {
    this.expandedRows = {};
    this.tablas.forEach(c => {
      if (c.expanded) this.expandedRows[c.id] = true;
    });
  }
}
