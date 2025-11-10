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
  private busMarkersLayer = L.layerGroup();
  paradas: any[] = [];
  lineas: any[] = [];
  lineaSeleccionada: any = null;

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

  ngAfterViewInit() {
    this.cargarLineas();
    this.initMap();
    this.busMarkersLayer.addTo(this.map);
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
    const codLinea = event.target.value;
    this.lineaSeleccionada = codLinea;

    this.busService.getParadasByLinea(codLinea).subscribe({
      next: (res) => {
        this.paradas = res.data;
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
    let tiempoDeLlegada: any = null;
    // Añadir marcadores de cada parada
    this.paradas.forEach((parada) => {
      if (parada.lat && parada.lon) {
        const marker = L.marker([parada.lat, parada.lon], {
          icon: this.emoji_busStop
        })
          .addTo(this.map)
          .bindPopup(
            `<b>${parada.nombreParada}</b><br>${parada.direccion || ''}   `
          );
        this.markers.push(marker);

      }
    });

    const grupo = L.featureGroup(this.markers);
    this.map.fitBounds(grupo.getBounds().pad(0.3));

    this.colocarBuses(this.lineaSeleccionada);
  }



  public colocarBuses(codLinea: number) {
    this.busMarkersLayer.clearLayers();
    this.busService.getUbiBuses(codLinea).subscribe(
      respuesta => {

        if (respuesta && respuesta.success && Array.isArray(respuesta.data)) {
          respuesta.data.forEach((bus: any) => {
            if (bus.lat && bus.lon) {
              console.log("linea115");
              const popupInfo = `<b>Bus:</b> ${bus.codBus}<br><b>Sentido:</b> ${bus.sentido}`;

              L.marker([bus.lat, bus.lon], {
                icon: this.emoji_bus
              })
                .bindPopup(popupInfo)
                .addTo(this.busMarkersLayer);
            }
          });
          console.log(this.busMarkersLayer);
          console.log("finalizado colocarBuses");
        } else {
          console.log("No se recibieron buses o la respuesta no es válida.");
        }
      }
      , error => {
        console.error("Error al obtener la ubicación de los buses:", error);
      }
    );
  }





  limpiarMarkers(): void {
    this.markers.forEach(marker => this.map.removeLayer(marker));
    this.markers = [];
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

