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
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';


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

generarPDF() {
  if (!this.consumosFiltrados.length) {
    return alert('No hay consumos para generar el PDF');
  }

  const doc = new jsPDF('p', 'mm', 'a4');

  // Título del documento
  const titulo = `Consumo ${this.telefonoSeleccionado?.numero || ''} - ${this.yearSeleccionado}`;
  doc.setFontSize(16);
  doc.text(titulo, 10, 15);

  // Subtítulo
  doc.setFontSize(12);
  doc.text(`Cliente: ${this.cliente?.nombre || 'Desconocido'}`, 10, 25);
  doc.text(`Teléfono: ${this.telefonoSeleccionado?.numero || ''}`, 10, 32);
  doc.text(`Año: ${this.yearSeleccionado}`, 10, 39);

  // Espacio antes de la tabla
  doc.text('Consumos mensuales (€):', 10, 50);

  // Tabla con los consumos del año seleccionado
  (doc as any).autoTable({
    startY: 55,
    head: [['Mes', 'Total mensual (€)']],
    body: this.consumosFiltrados.map(c => [
      this.getNombreMes(c.mes),
      c.total_mensual.toFixed(2)
    ]),
  });

  // Agregar estadísticas si existen
  if (this.estadisticaActual) {
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.text('Estadísticas anuales:', 10, finalY);

    (doc as any).autoTable({
      startY: finalY + 5,
      head: [['Año', 'Media anual (€)', 'Máximo mensual (€)', 'Mínimo mensual (€)']],
      body: [[
        this.estadisticaActual.anio,
        parseFloat(this.estadisticaActual.media_anual).toFixed(2),
        parseFloat(this.estadisticaActual.max_mensual).toFixed(2),
        parseFloat(this.estadisticaActual.min_mensual).toFixed(2)
      ]]
    });
  }

  // Descargar PDF
  doc.save(`consumo_${this.telefonoSeleccionado?.numero}_${this.yearSeleccionado}.pdf`);
}exportToPDF() {
  if (!this.consumosFiltrados.length) {
    alert('No hay consumos para generar el PDF');
    return;
  }

  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;
  let currentY = 20;

  // ====================
  // Encabezado
  // ====================
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('Informe de Consumos Telefónicos', pageWidth / 2, currentY, { align: 'center' });
  currentY += 10;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.text(`Titular de la línea: ${this.cliente?.nombre || 'Desconocido'}`, margin, currentY);
  currentY += 6;
  doc.text(`Teléfono: ${this.telefonoSeleccionado?.numero || ''}`, margin, currentY);
  currentY += 6;
  doc.text(`Consumo correspondiente al año: ${this.yearSeleccionado}`, margin, currentY);
  currentY += 6;
  doc.text(`Fecha de generación del informe: ${new Date().toLocaleDateString()}`, margin, currentY);
  currentY += 10;

  // Línea divisoria
  doc.setLineWidth(0.5);
  doc.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 10;

  // ====================
  // Gráficos (si existen)
  // ====================
  const chartCanvas = document.querySelector('#consumoChart canvas') as HTMLCanvasElement;
  const barChartCanvas = document.querySelector('#estadisticaChart canvas') as HTMLCanvasElement;

  if (chartCanvas) {
    const chartImage = chartCanvas.toDataURL('image/png', 1.0);
    doc.addImage(chartImage, 'PNG', margin, currentY, pageWidth - 2 * margin, 60);
    currentY += 70;
  }

  if (barChartCanvas) {
    const barChartImage = barChartCanvas.toDataURL('image/png', 1.0);
    doc.addImage(barChartImage, 'PNG', margin, currentY, pageWidth - 2 * margin, 60);
    currentY += 70;
  }

  // ====================
  // Tabla de consumos
  // ====================
  const tableData = this.consumosFiltrados.map(c => [
    this.getNombreMes(c.mes),
    c.total_mensual.toFixed(2) + ' €'
  ]);

  autoTable(doc, {
    startY: currentY,
    head: [['Mes', 'Consumo (€)']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    styles: { fontSize: 10, halign: 'center' },
    margin: { left: margin, right: margin },
  });

  currentY = (doc as any).lastAutoTable.finalY + 10;

  // ====================
  // Resumen estadístico
  // ====================
  if (this.estadisticaActual) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Resumen estadístico', margin, currentY);
    currentY += 6;

    const statsTable = [
      ['Año', 'Media anual (€)', 'Máximo mensual (€)', 'Mínimo mensual (€)'],
      [
        this.estadisticaActual.anio,
        parseFloat(this.estadisticaActual.media_anual).toFixed(2),
        parseFloat(this.estadisticaActual.max_mensual).toFixed(2),
        parseFloat(this.estadisticaActual.min_mensual).toFixed(2)
      ]
    ];

    autoTable(doc, {
      startY: currentY,
      head: [statsTable[0]],
      body: [statsTable[1]],
      theme: 'grid',
      headStyles: { fillColor: [39, 174, 96], textColor: 255 },
      styles: { fontSize: 10, halign: 'center' },
      margin: { left: margin, right: margin },
    });

    currentY = (doc as any).lastAutoTable.finalY + 10;
  }

  // ====================
  // Pie de página
  // ====================
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setFontSize(9);
  doc.setTextColor(100);
  doc.text(
    'Documento generado automáticamente - CRM Telefonía \u00AE TDconsulting',
    pageWidth / 2,
    pageHeight - 10,
    { align: 'center' }
  );

  // ====================
  // Guardar PDF
  // ====================
  doc.save(`Consumos_${this.telefonoSeleccionado?.numero}_${this.yearSeleccionado}.pdf`);
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
