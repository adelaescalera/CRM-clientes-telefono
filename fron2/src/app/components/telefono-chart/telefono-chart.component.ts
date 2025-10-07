import { Component, Input, OnChanges, SimpleChanges, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

interface Consumo {
  mes: number;
  anio: number;
  total_mensual: number;
}

@Component({
  selector: 'app-telefono-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './telefono-chart.component.html',
  styleUrls: ['./telefono-chart.component.scss']
})
export class TelefonoChartComponent implements OnChanges, AfterViewInit {
  @Input() consumos: Consumo[] = [];
  @Input() telefono: string = '';
  @Input() anioSeleccionado: number = new Date().getFullYear();

  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;

  chart: Chart | null = null;

  ngAfterViewInit() {
    // Aseguramos que el canvas esté disponible usando requestAnimationFrame
    requestAnimationFrame(() => this.renderChart());
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.chart && (changes['consumos'] || changes['anioSeleccionado'])) {
      requestAnimationFrame(() => this.renderChart());
    }
  }

  private renderChart() {
    if (!this.consumos || !this.canvas) return;

    const ctx = this.canvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const consumosFiltrados = this.consumos.filter(c => c.anio === this.anioSeleccionado);

    const data = Array(12).fill(0);
    consumosFiltrados.forEach(c => {
      data[c.mes - 1] = c.total_mensual;
    });

    if (this.chart) this.chart.destroy();

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [
          'Enero','Febrero','Marzo','Abril','Mayo','Junio',
          'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'
        ],
        datasets: [
          {
            label: `Consumo de ${this.telefono} en ${this.anioSeleccionado}`,
            data,
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true, position: 'top' },
          title: { display: true, text: `Consumo mensual ${this.telefono} - ${this.anioSeleccionado}` }
        },
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }
}
