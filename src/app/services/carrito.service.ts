// src/app/services/carrito.service.ts
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CarritoResponseDTO } from '../models/carrito.model';
import { ItemCarritoRequestDTO } from '../models/item-carrito.model';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
private apiUrl = `${environment.apispirngUrl}/carritos`;

  constructor(private http: HttpClient) {}

  getCarritoPorUsuario(): Observable<CarritoResponseDTO> {
    const token = localStorage.getItem('token'); // o donde lo guardes
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<CarritoResponseDTO>(`${this.apiUrl}/usuario`, { headers });
  }

  agregarAlCarrito(producto: { idProducto: number, precio: number, nombre: string }): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  const item: ItemCarritoRequestDTO = {
    idProducto: producto.idProducto,
    cantidad: 1 // Puedes permitir que el usuario seleccione cantidad más adelante
  };

  return this.http.post(`${this.apiUrl}/usuario/agregar`, item, { headers });
}
}
