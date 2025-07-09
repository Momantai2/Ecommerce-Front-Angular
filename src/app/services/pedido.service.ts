import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PedidoResponseDTO } from '../models/pedido.model';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
private apiUrl = `${environment.apispirngUrl}/pedidos`;

  constructor(private http: HttpClient) {}

  procesarPedido(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.apiUrl}/procesar`, {}, { headers });
  }

    getPedidos(): Observable<PedidoResponseDTO[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<PedidoResponseDTO[]>(`${this.apiUrl}`, { headers });
  }
}


