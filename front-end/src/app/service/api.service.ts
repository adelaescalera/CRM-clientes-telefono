import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../enviroment/enviroment";
import { IRespGeneric } from "../interface/response"

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private readonly apiUrl: string = environment.apiUrl;
    constructor(private http: HttpClient) { }

    public getData(): Observable<IRespGeneric> {
        return this.http.get<IRespGeneric>(`${this.apiUrl}/show-tables`);
    }

}