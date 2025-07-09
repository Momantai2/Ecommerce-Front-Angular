import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UnidadMedidaRequestDTO, UnidadMedidaResponseDTO } from '../models/unidadMedida.model';
import { environment } from '../environment/environment';

@Injectable({ providedIn: 'root' })
export class UnidadMedidaService {
private apiUrl = `${environment.apispirngUrl}/unidades-medida`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<UnidadMedidaResponseDTO[]> {
    return this.http.get<UnidadMedidaResponseDTO[]>(this.apiUrl);
  }

  create(unidadmedida: UnidadMedidaRequestDTO): Observable<UnidadMedidaResponseDTO> {
    return this.http.post<UnidadMedidaResponseDTO>(this.apiUrl, unidadmedida);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  update(id: number, unidadmedida: UnidadMedidaRequestDTO): Observable<UnidadMedidaResponseDTO> {
    return this.http.put<UnidadMedidaResponseDTO>(`${this.apiUrl}/${id}`, unidadmedida);
  }

  getById(id: number): Observable<UnidadMedidaResponseDTO> {
    return this.http.get<UnidadMedidaResponseDTO>(`${this.apiUrl}/${id}`);
  }
}
