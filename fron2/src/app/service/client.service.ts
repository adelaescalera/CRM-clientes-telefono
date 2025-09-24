import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core"; 
import { Observable } from "rxjs";
import { environment } from "../../enviroment/enviroment";

@Injectable({
    providedIn: 'root'
})

export class ClientService {
    private readonly apiUrl: string = environment.apiUrl;
    constructor(private http: HttpClient) { }

    public getData(): Observable<any> {
        return this.http.get(`${this.apiUrl}/cliente/clientes`);
    }

}
