import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiService } from "./api.service";

import { Usuario } from "../interface/response";

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private api: ApiService) { }

  public getData(): Observable<any> {
    return this.api.get(`usuario/usuarios`);
  }

  public addUsuario(usuario: Usuario): Observable<any> {
    return this.api.post(`usuario/add-usuario`, usuario);
  }

  public login(usuario: Usuario): Observable<any> {
    return this.api.post(`usuario/login`, usuario);
  }
}





