import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { SelectModule } from 'primeng/select';
import { ChartConfiguration } from 'chart.js';
import { ConsumoService } from '../../service/consumo.service';
import { AddConsumo } from '../../interface/response';
import { ChartComponent } from '../chart/chart.component';


interface ConsumoForm {
  id?: number;
  telefono: string;
  phone_id: string;
  mes: number;
  anio: number;
  total_mensual: number;
}

@Component({
  selector: 'app-consumo-table',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    ReactiveFormsModule,
    FormsModule,
    SelectModule,
    ChartComponent
  ],
  templateUrl: './consumo-table.component.html',
  styleUrls: ['./consumo-table.component.scss']
})
export class ConsumoTableComponent implements OnChanges {
  @Input() cliente: any;
  @Input() telefonoSeleccionado: any;

  consumos: ConsumoForm[] = [];
  formNuevoConsumo: FormGroup;

  meses = Array.from({ length: 12 }, (_, i) => ({ label: `${i + 1}`, value: i + 1 }));
  anioSeleccionado: number = new Date().getFullYear();
  phoneIdSeleccionado!: number;

  //Historico
  chartData!: ChartConfiguration['data'];
  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Consumo mensual (€)' }
    }
  };

  constructor(private consumoService: ConsumoService, private fb: FormBuilder) {
    this.formNuevoConsumo = this.fb.group({
      mes: [null],
      anio: [new Date().getFullYear()],
      consumo: [null]
    });
  }

  ngOnChanges() {
    if (this.telefonoSeleccionado) {
      this.phoneIdSeleccionado = this.telefonoSeleccionado.phoneId;
      this.cargarConsumos();
    } else {
      this.consumos = [];
      this.chartData = { labels: [], datasets: [] };
    }
  }

  cargarConsumos() {
    const t = this.telefonoSeleccionado;
    this.consumoService.getConsumo(t.phoneId).subscribe({
      next: (res: any) => {
        const data = res?.data || [];
        this.consumos = data.map((c: any) => ({
          id: c.id,
          telefono: t.numero,
          phone_id: t.phoneId,
          mes: c.mes,
          anio: c.anio,
          total_mensual: Number(c.total_mensual)
        }));
        this.updateChartData(); 
      },
      error: (err) => console.error('Error cargando consumos', err)
    });
  }

  updateChartData() {
    const consumosOrdenados = [...this.consumos].sort((a, b) => a.mes - b.mes);
    const labels = consumosOrdenados.map(c => `Mes ${c.mes} (${c.anio})`); //etiqueta eje X
    const data = consumosOrdenados.map(c => c.total_mensual);

    this.chartData = {
      labels,
      datasets: [
        {
          label: 'Consumo',
          data,
          backgroundColor: '#42A5F5'
        }
      ]
    };
  }

  agregarConsumo() {
    if (!this.telefonoSeleccionado) return alert('No hay teléfono seleccionado');
    const { mes, anio, consumo } = this.formNuevoConsumo.value;
    if (!mes || !anio || consumo == null) return alert('Completa todos los campos');

    const nuevo: AddConsumo = {
      phone_id: this.telefonoSeleccionado.phoneId,
      mes,
      anio,
      consumo
    };

    this.consumoService.addConsumo(nuevo).subscribe({
      next: (res: any) => {
        this.consumos = [
          ...this.consumos,
          {
            id: res.id,
            telefono: this.telefonoSeleccionado.numero,
            phone_id: this.telefonoSeleccionado.phoneId,
            mes,
            anio,
            total_mensual: consumo
          }
        ];
        this.updateChartData(); 
        this.formNuevoConsumo.reset({ anio: new Date().getFullYear() });
      },
      error: (err) => alert('Error al agregar consumo: ' + err.message)
    });
  }

  onDeleteConsumo(id: number) {
    if (!confirm('¿Seguro que quieres eliminar este consumo?')) return;
    this.consumoService.deleteConsumo(id).subscribe({
      next: () => {
        this.consumos = this.consumos.filter(c => c.id !== id);
        this.updateChartData();
      },
      error: err => alert('Error al eliminar el consumo: ' + err.message)
    });
  }
}
