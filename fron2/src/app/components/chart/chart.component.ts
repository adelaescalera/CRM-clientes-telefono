import { Component, Input, OnInit, OnDestroy, OnChanges, SimpleChanges, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-chart',
  standalone: true,
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;

  @Input() chartId: string = 'defaultChart';
  @Input() chartType: ChartType = 'bar';
  @Input() chartData!: ChartConfiguration['data'];
  @Input() chartOptions: ChartConfiguration['options'] = {}; 

  private chart!: Chart;

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (this.chartData) {
      this.createChart();
    }
  }
ngOnChanges(changes: SimpleChanges): void {
  if (changes['chartData'] && !changes['chartData'].firstChange) {
    if (this.chart) {
      this.chart.data = this.chartData;
      this.chart.update();
    } else if (this.chartCanvas) {
      this.createChart();
    }
  }

  if (changes['chartOptions'] && !changes['chartOptions'].firstChange) {
    if (this.chart) {
      this.chart.options = this.chartOptions ?? {};
      this.chart.update();
    }
  }
}

createChart(): void {
  if (this.chart) {
    this.chart.destroy();
  }

  this.chart = new Chart(this.chartCanvas.nativeElement, {
    type: this.chartType,
    data: this.chartData,
    options: this.chartOptions ?? {}
  });
}


  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}
