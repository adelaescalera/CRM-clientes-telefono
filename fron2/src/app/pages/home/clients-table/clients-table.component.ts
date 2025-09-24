import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-clients-table',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule],
  templateUrl: './clients-table.component.html',
  styleUrls: ['./clients-table.component.scss']
})
export class ClientsTableComponent {
  @Input() tablas: any[] = [];

  // Expandir o colapsar todas las filas
  expandAll() {
    this.tablas.forEach(c => c.expanded = true);
  }

  collapseAll() {
    this.tablas.forEach(c => c.expanded = false);
  }
}
