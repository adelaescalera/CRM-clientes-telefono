// // src/app/service/api.service.ts
// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { environment } from '../../enviroment/enviroment';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//   private readonly authUrl = environment.authUrl;

//   constructor(private http: HttpClient) {}

//   public get<T>(endpoint: string): Observable<T> {
//     return this.http.get<T>(`${this.authUrl}/${endpoint}`);
//   }

//   public post<T>(endpoint: string, body: any): Observable<T> {
//     return this.http.post<T>(`${this.authUrl}/${endpoint}`, body);
//   }

//   public put<T>(endpoint: string, body: any): Observable<T> {
//     return this.http.put<T>(`${this.authUrl}/${endpoint}`, body);
//   }

//   public delete<T>(endpoint: string): Observable<T> {
//     return this.http.delete<T>(`${this.authUrl}/${endpoint}`);
//   }
// }
