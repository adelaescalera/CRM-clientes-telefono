import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import * as L from 'leaflet';
import { BusesService } from '../../service/buses.service';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-buses-table',
  imports: [CardModule, SelectModule, FormsModule, CommonModule, FormsModule],
  templateUrl: './buses-table.component.html',
  styleUrl: './buses-table.component.scss'
})
export class BusesTableComponent implements AfterViewInit {
  private map!: L.Map;
  private markers: L.Marker[] = [];
  paradas: any[] = [];
  lineas: any[] = [];
  lineaSeleccionada: any = null;

  constructor(private busService: BusesService) { }

  ngAfterViewInit() {

    this.cargarLineas();
    this.initMap();
    // this.loadAllLines();
  }

  private initMap(): void {
    // Crear el mapa y centrarlo
    this.map = L.map('map', {
      center: [36.7215, -4.42493], //  Málaga
      zoom: 13
    });

    // Capa base gratuita, no usamos api key <------ ---------------- podemos buscar uno mejor
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);
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
    console.log('Línea seleccionada:', event.target.value);
    const codLinea = event.target.value; // valor seleccionado
    this.lineaSeleccionada = codLinea;

    this.busService.getParadasByLinea(codLinea).subscribe({
      next: (res) => {
        this.paradas = res.data; // depende de cómo devuelva tu backend
        console.log('Paradas:', this.paradas);
        this.actualizarMapaConParadas();
      },
      error: (err) => console.error('Error obteniendo paradas', err)
    });
  }

  private actualizarMapaConParadas(): void {
    // Limpiar marcadores previos
    this.limpiarMarkers();
    if (!this.paradas.length) return;

    // Añadir marcadores de cada parada
    this.paradas.forEach((parada) => {
      if (parada.lat && parada.lon) {
        const marker = L.marker([parada.lat, parada.lon])
          .addTo(this.map)
          .bindPopup(
            `<b>${parada.nombreParada}</b><br>${parada.direccion || ''}`
          );
        this.markers.push(marker);
      }
    });

    // Centrar mapa en las paradas
    const grupo = L.featureGroup(this.markers);
    this.map.fitBounds(grupo.getBounds().pad(0.3));
  }

   limpiarMarkers(): void {
    this.markers.forEach(marker => this.map.removeLayer(marker));
    this.markers = [];
  }



}




