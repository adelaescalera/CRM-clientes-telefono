import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiService } from "./api.service";
import { AddClient } from "../interface/response";

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private api: ApiService) { }

  public getData(): Observable<any> {
    return this.api.get('cliente/clientes');
  }

  public addClient(client: AddClient): Observable<any> {
    return this.api.post('cliente/add-cliente', client);
  }

  public deleteClient(id: number): Observable<any> {
    return this.api.delete(`cliente/${id}`);
  }

  public updateClient(id: number, cliente: any): Observable<any> {
    return this.api.put(`cliente/${id}`, cliente);
  }
}
