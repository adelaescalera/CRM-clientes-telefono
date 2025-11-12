import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiService } from "./api.service";


@Injectable({
  providedIn: 'root'
})

export class BusesService {

  constructor(private api: ApiService) { }

  public getParadas(): Observable<any> {
    return this.api.get(`buses/paradas`);
  }


  public getLineas(): Observable<any> {
    return this.api.get(`buses/todasLineas`);
  }

  public getParadasByLinea(codLinea: string): Observable<any> {
    return this.api.get(`buses/paradasDeLinea/${codLinea}`);
  }

  public getTiempoLLegada(codLinea: Number, codParada: Number): Observable<any> {
    return this.api.get(`buses/tiempoLlegada/${codLinea}/${codParada}`);
  }

  public getUbiBuses(codLinea: Number): Observable<any> {
    return this.api.get(`buses/ubiBuses/${codLinea}`);
  }

  public getLineasDeParada(codParada: Number): Observable<any>{
    return this.api.get(`buses/lineaPorParada/${codParada}`)
  }

  public getEstadisticaHorasPunta(fecha: string, codLinea?: number): Observable<any> {
    let path = `buses/horas-punta/${fecha}`;
    if (codLinea) {
      path += `?codLinea=${codLinea}`;
    }
    return this.api.get(path);
  }

  public getFechasDisponibles(): Observable<any> {
    return this.api.get(`buses/fechas-disponibles`);
  }
  // public getDatosHeatmap(codLinea?: number): Observable<any> {
  //   let path = `buses/heatmap`;
  //   if (codLinea) {
  //     path += `?codLinea=${codLinea}`;
  //   }
  //   return this.api.get(path);
  // }
}
