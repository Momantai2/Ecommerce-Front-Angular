import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { productoRequestDTO, productoResponseDTO } from '../models/producto.model';
import { environment } from '../environment/environment';

@Injectable({ providedIn: 'root' })
export class ProductoService {
private apiUrl = `${environment.apispirngUrl}/productos`;

  constructor(private http: HttpClient) {}  

  getAll(): Observable<productoResponseDTO[]> {
    return this.http.get<productoResponseDTO[]>(this.apiUrl);
  }

  create(producto: productoRequestDTO): Observable<productoResponseDTO> {
    return this.http.post<productoResponseDTO>(this.apiUrl, producto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  update(id: number, producto: productoRequestDTO): Observable<productoResponseDTO> {
    return this.http.put<productoResponseDTO>(`${this.apiUrl}/${id}`, producto);
  }

  getById(id: number): Observable<productoResponseDTO> {
    return this.http.get<productoResponseDTO>(`${this.apiUrl}/${id}`);
  }
}
