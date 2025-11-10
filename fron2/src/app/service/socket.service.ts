import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket!: Socket;
  // La URL de tu backend
  private readonly socketUrl = "http://localhost:3000"; 

  constructor() { }

  connect(): void {
    this.socket = io(this.socketUrl);
  }

  // Función para "escuchar" cualquier evento del servidor
  listen(eventName: string): Observable<any> {
    return new Observable((subscriber) => {
      this.socket.on(eventName, (data) => {
        subscriber.next(data);
      });
    });
  }

  // Función para desconectar
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}