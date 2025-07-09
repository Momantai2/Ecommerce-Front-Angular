// src/app/services/itemcarrito.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { itemCarritoResponseDTO } from '../models/item-carrito.model';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class ItemCarritoService {
private apiUrl = `${environment.apispirngUrl}/itemcarrito`;

  constructor(private http: HttpClient) {}

  aumentarCantidad(id: number): Observable<itemCarritoResponseDTO> {
    return this.http.post<itemCarritoResponseDTO>(`${this.apiUrl}/aumentar/${id}`, {});
  }

  disminuirCantidad(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/disminuir/${id}`, {});
  }

  eliminarItem(id: number) {
  return this.http.delete<void>(`${this.apiUrl}/eliminar/${id}`);
}

}
