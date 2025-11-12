import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import * as L from 'leaflet';
import { BusesService } from '../../service/buses.service';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { io, Socket } from 'socket.io-client';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { ChartConfiguration } from 'chart.js';
import { ChartComponent } from '../chart/chart.component'; 

@Component({
  selector: 'app-buses-table',
  imports: [CardModule, SelectModule, FormsModule, CommonModule, FormsModule, PanelModule, ButtonModule, ChartComponent],
  templateUrl: './buses-table.component.html',
  styleUrl: './buses-table.component.scss'
})
export class BusesTableComponent implements AfterViewInit, OnDestroy { 
  private map!: L.Map;
  private markers: L.Marker[] = [];
  private busMarkersLayer = L.layerGroup();
  paradas: any[] = [];
  lineas: any[] = [];
  lineaSeleccionada: any = null;
  private socket!: Socket;
  ultimaHoraActualizado:any =null;

  paradaSeleccionadaData: any = null;
  lineasDeParada: any[] | null = null;

  // grafico
  public datosHorasPunta: ChartConfiguration['data'] | null = null;
  public opcionesHorasPunta: ChartConfiguration['options'] = {};
  public fechasDisponibles: any[] = [];
  public fechaSeleccionada: string | null = null;

  constructor(private busService: BusesService) { }

  emoji_busStop = L.icon({
    iconUrl: 'assets/imagenes/busStop_emoji.png',
    iconSize: [20, 20],
    iconAnchor: [10, 20],
    popupAnchor: [0, -20]
  });

  emoji_bus = L.icon({
    iconUrl: 'assets/imagenes/bus_emoji.png',
    iconSize: [20, 20],
    iconAnchor: [10, 20],
    popupAnchor: [0, -20]
  });

  emojiVuelta_bus = L.icon({
    iconUrl: 'assets/imagenes/busVuelta_emoji.png',
    iconSize: [20, 20],
    iconAnchor: [10, 20],
    popupAnchor: [0, -20]
  });

  ngAfterViewInit() {
    this.cargarLineas();
    this.initMap();
    this.busMarkersLayer.addTo(this.map);
    this.initSocket();
  this.cargarFechasDisponibles();
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [36.7215, -4.42493], //  Málaga
      zoom: 13
    });

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);
  }

  private initSocket(): void {
    this.socket = io('http://localhost:3000');
    this.socket.on('buses-actualizados', () => {
      if (this.lineaSeleccionada) {
        console.log('Socket dice: Buses actualizados...');
        this.colocarBuses(this.lineaSeleccionada);
      }
    });
  }

  cargarLineas(): void {
    this.busService.getLineas().subscribe({
      next: (res) => {
        this.lineas = res.data;
      },
      error: (err) => console.error('Error obteniendo líneas', err)
    });
  }


  onLineaChange(event: any) {
    const codLinea=this.lineaSeleccionada;
    if (!codLinea) {
        this.limpiarMarkers();
        this.datosHorasPunta = null;
        this.cargarDatosHorasPunta(); 
        return;
    }

    this.busService.getParadasByLinea(codLinea).subscribe({
      next: (res) => {
        this.paradas = res.data;
        this.actualizarMapaConParadas();
      },
      error: (err) => console.error('Error obteniendo paradas', err)
    });

    this.cargarDatosHorasPunta(codLinea); 
  }

  private actualizarMapaConParadas(): void {
    this.limpiarMarkers();
    if (!this.paradas.length) return;
    this.paradas.forEach((parada) => {
      if (parada.lat && parada.lon) {
        const marker = L.marker([parada.lat, parada.lon], {
          icon: this.emoji_busStop
        })
          .addTo(this.map)
          .on('click', () => {
            this.abrirPanelParada(parada);
          });
        this.markers.push(marker);
      }
    });

    const grupo = L.featureGroup(this.markers);
    this.map.fitBounds(grupo.getBounds().pad(0.3));

    this.colocarBuses(this.lineaSeleccionada);
  }

  abrirPanelParada(parada: any): void {
    this.paradaSeleccionadaData = parada;
    this.busService.getLineasDeParada(parada.codParada).subscribe({
      next: (res) => {
        if (res.success && Array.isArray(res.data)) {
          this.lineasDeParada = res.data;
        } else {
          this.lineasDeParada = [];
        }
      },
      error: (err) => {
        console.error("Error al obtener las líneas de la parada:", err);
        this.lineasDeParada = [];
      }
    });
  }
  
  public colocarBuses(codLinea: number) {
    this.busMarkersLayer.clearLayers();
    this.busService.getUbiBuses(codLinea).subscribe({
      next: respuesta => {
        if (respuesta && respuesta.success && Array.isArray(respuesta.data)) {
          respuesta.data.forEach((bus: any) => {
            if (bus.lat && bus.lon) {
              if (bus.sentido == 1) {
                const popupInfo = `<b>Bus:</b> ${bus.codBus}<br><b>Sentido:</b> ${bus.sentido}`;
                L.marker([bus.lat, bus.lon], {
                  icon: this.emoji_bus
                })
                  .bindPopup(popupInfo)
                  .addTo(this.busMarkersLayer);
              } else {
                const popupInfo = `<b>Bus:</b> ${bus.codBus}<br><b>Sentido:</b> ${bus.sentido}`;
                L.marker([bus.lat, bus.lon], {
                  icon: this.emojiVuelta_bus
                })
                  .bindPopup(popupInfo)
                  .addTo(this.busMarkersLayer);
              }
            }
          });
          this.ultimaHoraActualizado=new Date();
        } else {
          console.log("No se recibieron buses o la respuesta no es válida.");
        }
      }, error: error => {
        console.error("Error al obtener la ubicación de los buses:", error);
      }
    });
  }

  cerrarPanel(): void {
    this.paradaSeleccionadaData = null;
    this.lineasDeParada = null;
  }

  limpiarMarkers(): void {
    this.markers.forEach(marker => this.map.removeLayer(marker));
    this.markers = [];
    this.busMarkersLayer.clearLayers();
  }

  cargarFechasDisponibles(): void {
    this.busService.getFechasDisponibles().subscribe({
      next: (res) => {
        if (res.success && res.data.length > 0) {
          this.fechasDisponibles = res.data;
          this.fechaSeleccionada = res.data[0].fecha_dia; //hoy por defecto
          this.cargarDatosHorasPunta();
        } else {
          this.fechasDisponibles = [];
        }
      },
      error: (err) => console.error("Error al cargar fechas disponibles", err)
    });
  }

  resetearSeleccion(): void {
    this.limpiarMarkers(); 
    this.lineaSeleccionada = null; 
    this.cargarDatosHorasPunta();
    this.cerrarPanel();
  }
  
  onFechaChange(nuevaFecha: string): void {
    this.fechaSeleccionada = nuevaFecha;
    this.cargarDatosHorasPunta(this.lineaSeleccionada);
  }

  cargarDatosHorasPunta(codLinea?: number): void {
    if (!this.fechaSeleccionada) {
      return; 
    }
    const fecha = this.fechaSeleccionada; 
    
    this.datosHorasPunta = null;
    this.busService.getEstadisticaHorasPunta(fecha, codLinea).subscribe({
      next: (respuesta) => {
        if (respuesta && respuesta.success && Array.isArray(respuesta.data)) {
          const labels = respuesta.data.map((item: any) => `${item.hora}:00`);
          const data = respuesta.data.map((item: any) => item.total_buses);
          
          this.datosHorasPunta = {
            labels: labels,
            datasets: [
              {
                label: 'Buses Activos',
                data: data,
              }
            ]
          };
          
          this.opcionesHorasPunta = {
            responsive: true,
            maintainAspectRatio: false,
            scales: { 
              y: { beginAtZero: true, title: { display: true, text: 'Nº de Buses' }},
              x: { title: { display: true, text: 'Hora del Día' }}
            }
          };
        }
      },
      error: (err) => console.error("Error al cargar estadísticas", err)
    });
  }

  ngOnDestroy() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}