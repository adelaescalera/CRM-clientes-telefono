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
  consumosFiltrados: ConsumoForm[] = [];

  estadisticasAnuales: any[] = [];
  estadisticaActual: any = null;

  formNuevoConsumo: FormGroup;

  meses = Array.from({ length: 12 }, (_, i) => ({ label: this.getNombreMes(i + 1), value: i + 1 }));
  yearsAvailable: number[] = [];
  yearsOptions: { label: string, value: number }[] = [];
  yearSeleccionado: number = new Date().getFullYear();

  phoneIdSeleccionado!: number;

  // Gráfica del histórico mensual
  chartData!: ChartConfiguration['data'];
  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Consumo mensual (€)' }
    }
  };

  // Gráfica de estadísticas anuales
  chartDataEstadistica!: ChartConfiguration['data'];
  chartOptionsEstadistica: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Promedios' }
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
      this.cargarEstadisticas();
    } else {
      this.consumos = [];
      this.estadisticasAnuales = [];
      this.chartData = { labels: [], datasets: [] };
      this.chartDataEstadistica = { labels: [], datasets: [] };
    }
  }

  //Carga de consumos del teléfono
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
        this.actualizarYears();
        this.filtrarPorYear();
      },
      error: (err) => console.error('Error cargando consumos', err)
    });
  }

  //Carga de estadísticas anuales
  cargarEstadisticas() {
    this.consumoService.getEstadistica(this.telefonoSeleccionado.phoneId).subscribe({
      next: (res: any) => {
        this.estadisticasAnuales = res?.data || [];
        this.actualizarGraficaEstadistica();
      },
      error: (err) => console.error('Error cargando estadísticas', err)
    });
  }

  actualizarYears() {
    this.yearsAvailable = [...new Set(this.consumos.map(c => c.anio))];
    this.yearsOptions = this.yearsAvailable.map(y => ({ label: y.toString(), value: y }));
    if (!this.yearsAvailable.includes(this.yearSeleccionado)) {
      this.yearSeleccionado = this.yearsAvailable[0] || new Date().getFullYear();
    }
  }

  filtrarPorYear() {
    this.consumosFiltrados = this.consumos.filter(c => c.anio === this.yearSeleccionado);
    this.updateChartData();
    this.actualizarGraficaEstadistica();
  }

  onYearChange(year: number) {
    this.yearSeleccionado = year;
    this.filtrarPorYear();
  }

  // Actualiza la gráfica del histórico mensual
  updateChartData() {
    const consumosOrdenados = [...this.consumosFiltrados].sort((a, b) => a.mes - b.mes);
    const labels = consumosOrdenados.map(c => this.getNombreMes(c.mes));
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

  // Actualiza la gráfica de estadísticas anuales
  actualizarGraficaEstadistica() {
    this.estadisticaActual = this.estadisticasAnuales.find(e => e.anio === this.yearSeleccionado);

    if (!this.estadisticaActual) {
      this.chartDataEstadistica = { labels: [], datasets: [] };
      return;
    }

    const labels = ['Media anual', 'Máximo mensual', 'Mínimo mensual'];
    const data = [
      parseFloat(this.estadisticaActual.media_anual),
      parseFloat(this.estadisticaActual.max_mensual),
      parseFloat(this.estadisticaActual.min_mensual)
    ];

    this.chartDataEstadistica = {
      labels,
      datasets: [
        {
          label: `Estadísticas ${this.yearSeleccionado}`,
          data,
          backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726']
        }
      ]
    };
  }

  agregarConsumo() {
    if (!this.telefonoSeleccionado) return alert('No hay teléfono seleccionado');
    const { mes, anio, consumo } = this.formNuevoConsumo.value;
    if (!mes || !anio || consumo == null) return alert('Completa todos los campos');
    if (this.consumos.find(c => c.mes === mes && c.anio === anio)) {
      return alert('Ya existe un consumo para este mes y año');
    }

    const nuevo: AddConsumo = {
      phone_id: this.telefonoSeleccionado.phoneId,
      mes,
      anio,
      consumo
    };

    this.consumoService.addConsumo(nuevo).subscribe({
      next: (res: any) => {
        this.consumos.push({
          id: res.id,
          telefono: this.telefonoSeleccionado.numero,
          phone_id: this.telefonoSeleccionado.phoneId,
          mes,
          anio,
          total_mensual: consumo
        });
        this.actualizarYears();
        this.filtrarPorYear();
        this.cargarEstadisticas();
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
        this.actualizarYears();
        this.filtrarPorYear();
        this.cargarEstadisticas(); 
      },
      error: err => alert('Error al eliminar el consumo: ' + err.message)
    });
  }

  getNombreMes(mes: number) {
    const nombres = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return nombres[mes - 1] || '';
  }
}
