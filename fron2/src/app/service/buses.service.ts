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

}
