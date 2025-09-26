import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ClientService } from '../../service/client.service';
import { DialogModule } from 'primeng/dialog';  
import { InputTextModule } from 'primeng/inputtext'; 
import { FormsModule } from '@angular/forms'; 
@Component({
  selector: 'app-clients-table',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, ToastModule, DialogModule, InputTextModule, FormsModule],
  templateUrl: './clients-table.component.html',
  styleUrls: ['./clients-table.component.scss']
})
export class ClientsTableComponent {
  @Input() tablas: any[] = [];

    displayEditDialog: boolean = false;
  clienteSeleccionado: any = {};

  // Objeto para controlar filas expandidas
  expandedRows: { [key: string]: boolean } = {};

  constructor(private clienteS: ClientService) {}

  // Expandir todas las filas
  expandAll() {
    this.tablas.forEach(c => c.expanded = true);
    this.updateExpandedRows();
  }

  // Colapsar todas las filas
  collapseAll() {
    this.tablas.forEach(c => c.expanded = false);
    this.updateExpandedRows();
  }

  // Actualiza el objeto expandedRows
  updateExpandedRows() {
    this.expandedRows = {};
    this.tablas.forEach(c => {
      if (c.expanded) this.expandedRows[c.id] = true;
    });
  }

    abrirEditar(cliente: any) {
    this.clienteSeleccionado = { ...cliente };
    this.displayEditDialog = true;
  }

guardarCambios() {
  this.clienteS.updateClient(this.clienteSeleccionado.id, this.clienteSeleccionado).subscribe({
    next: (res: any) => {
      // actualizar en la tabla
      const index = this.tablas.findIndex(c => c.id === this.clienteSeleccionado.id);
      if (index !== -1) {
        this.tablas[index] = { ...this.clienteSeleccionado };
      }
      this.displayEditDialog = false;
    },
    error: (err: any) => {
      console.error("Error al actualizar cliente:", err);
    }
  });
}

  // Eliminar cliente
  onDeleteClient(id: number) {
    if (!confirm('¿Seguro que quieres eliminar este cliente?')) return;

    this.clienteS.deleteClient(id).subscribe({
      next: () => {
        this.tablas = this.tablas.filter(c => c.id !== id);
      },
      error: err => {
        alert('Error al eliminar el cliente: ' + err.message);
      }
    });
  }
}


/*

  // Eventos row expand/collapse
  onRowExpand(event: any) {
    event.data.expanded = true;
    this.updateExpandedRows();
  }

  onRowCollapse(event: any) {
    event.data.expanded = false;
    this.updateExpandedRows();
  }

*/