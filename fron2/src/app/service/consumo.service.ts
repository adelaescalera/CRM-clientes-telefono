import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiService } from "./api.service";


import { AddConsumo } from "../interface/response";

@Injectable({
  providedIn: 'root'
})

export class ConsumoService {

  constructor(private api: ApiService) { }

  public getData(): Observable<any> {
    return this.api.get(`consumo/consumos`);
  }

  public addConsumo(consumo: AddConsumo): Observable<any> {
    return this.api.post(`consumo/add-consumo`, consumo);
  }

  deleteConsumo(id: number): Observable<any> {
    return this.api.delete(`consumo/${id}`);
  }

  public updateConsumo(id: number, consumo: any): Observable<any> {
    return this.api.put(`consumo/${id}`, consumo);
  }

  public getConsumo(id: number): Observable<any> {
    return this.api.get(`consumo/${id}`);
  }
}
