import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  categoriaRequestDTO,
  categoriaResponseDTO,
} from '../models/categoria.model';
import { environment } from '../environment/environment';

@Injectable({ providedIn: 'root' })
export class CategoriaService {
  private apiUrl = `${environment.apispirngUrl}/categorias`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<categoriaResponseDTO[]> {
    return this.http.get<categoriaResponseDTO[]>(`${this.apiUrl}/${'todo'}`);
  }

  create(categoria: categoriaRequestDTO): Observable<categoriaResponseDTO> {
    return this.http.post<categoriaResponseDTO>(this.apiUrl, categoria);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  update(
    id: number,
    categoria: categoriaRequestDTO
  ): Observable<categoriaResponseDTO> {
    return this.http.put<categoriaResponseDTO>(
      `${this.apiUrl}/${id}`,
      categoria
    );
  }

  getById(id: number): Observable<categoriaResponseDTO> {
    return this.http.get<categoriaResponseDTO>(`${this.apiUrl}/${id}`);
  }
}
