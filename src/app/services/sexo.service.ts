import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {  SexoRequestDTO, SexoResponseDTO } from '../models/sexo.model';
import { environment } from '../environment/environment';

@Injectable({ providedIn: 'root' })
export class SexoService {
private apiUrl = `${environment.apispirngUrl}/sexo`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<SexoResponseDTO[]> {
    return this.http.get<SexoResponseDTO[]>(this.apiUrl);
  }

  create(sexo: SexoRequestDTO): Observable<SexoResponseDTO> {
    return this.http.post<SexoResponseDTO>(this.apiUrl, sexo);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  update(id: number, sexo: SexoRequestDTO): Observable<SexoResponseDTO> {
    return this.http.put<SexoResponseDTO>(`${this.apiUrl}/${id}`, sexo);
  }

  getById(id: number): Observable<SexoResponseDTO> {
    return this.http.get<SexoResponseDTO>(`${this.apiUrl}/${id}`);
  }
}
