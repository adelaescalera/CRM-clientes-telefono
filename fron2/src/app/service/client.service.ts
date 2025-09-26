import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../enviroment/enviroment";
import { AddClient } from "../interface/response";

@Injectable({
    providedIn: 'root'
})

export class ClientService {
    private readonly apiUrl: string = environment.apiUrl;
    constructor(private http: HttpClient) { }

    public getData(): Observable<any> {
        return this.http.get(`${this.apiUrl}/cliente/clientes`);
    }

    public addClient(client: AddClient): Observable<any> {  //new???
        return this.http.post(`${this.apiUrl}/cliente/add-cliente`, client);
    }

      deleteClient(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/cliente/${id}`);
  }

  public updateClient(id: number, cliente: any): Observable<any> {
  return this.http.put(`${this.apiUrl}/cliente/${id}`, cliente);
}

}
