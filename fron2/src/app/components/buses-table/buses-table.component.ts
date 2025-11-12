import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import * as L from 'leaflet';
import { BusesService } from '../../service/buses.service';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { io, Socket } from 'socket.io-client';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-buses-table',
  imports: [CardModule, SelectModule, FormsModule, CommonModule, FormsModule, PanelModule, ButtonModule],
  templateUrl: './buses-table.component.html',
  styleUrl: './buses-table.component.scss'
})
export class BusesTableComponent implements AfterViewInit {
  private map!: L.Map;
  private markers: L.Marker[] = [];
  private busMarkersLayer = L.layerGroup();
  paradas: any[] = [];
  lineas: any[] = [];
  lineaSeleccionada: any = null;
  private socket!: Socket;

  paradaSeleccionadaData: any = null;
  lineasDeParada: any[] | null = null;

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

  private initSocket(): void {
    // Conecta al servidor de backend
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
    const codLinea = event.target.value;
    this.lineaSeleccionada = codLinea;

    this.busService.getParadasByLinea(codLinea).subscribe({
      next: (res) => {
        this.paradas = res.data;
        this.actualizarMapaConParadas();
      },
      error: (err) => console.error('Error obteniendo paradas', err)
    });
  }

  private actualizarMapaConParadas(): void {
    // Limpiar marcadores previos
    this.limpiarMarkers();
    if (!this.paradas.length) return;
    let tiempoDeLlegada: any = null;
    // Añadir marcadores de cada parada
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
  }

  ngOnDestroy() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }


}



// CUANDO SE ENCOGE SE ENCOGE RARO MIRAAR
// // CAMBIARLO PARA QUE SE VAYA ACTUALIZANDO
// private actualizarMapaConParadasAcambiar(): void {
//   // Limpiar marcadores previos
//   this.limpiarMarkers();
//   if (!this.paradas.length) return;
//   let tiempoDeLlegada: any = null;
//   // Añadir marcadores de cada parada
//   this.paradas.forEach((parada) => {
//     if (parada.lat && parada.lon) {
//       console.log("lina 77, la parada es", parada.codParada);
//       this.busService.getTiempoLLegada(this.lineaSeleccionada, parada.codParada).subscribe({
//         next: (resp) => {
//           if (resp.data) {
//             tiempoDeLlegada = resp.data.tiempoLlegada;
//             console.log("la parada es:", parada.codParada, "y su tiempo de llegada es", tiempoDeLlegada);

//             console.log(tiempoDeLlegada);
//           }
//           console.log("en linea 86");
//           const marker = L.marker([parada.lat, parada.lon])
//             .addTo(this.map)
//             .bindPopup(
//               `<b>${parada.nombreParada}</b><br>${parada.direccion || ''}
//                <b>Próxima llegada:</b> ${tiempoDeLlegada}
//               `
//             );
//           this.markers.push(marker);
//         }
//       })

//     }
//   });

//   const grupo = L.featureGroup(this.markers);
//   this.map.fitBounds(grupo.getBounds().pad(0.3));
// }

