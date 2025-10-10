import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";

@Injectable({
  providedIn: 'root'
})

export class EmailService {
  constructor(private api: ApiService) { }

  public sendEmailWithAttachment(to: string, message: string, pdfBase64: string): Observable<any> {
    return this.api.post('email/enviar-pdf', { to, message, pdfBase64 });
  }

}


