import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RolRequestDTO, RolResponseDTO } from '../models/rol.model';
import { environment } from '../environment/environment';

@Injectable({ providedIn: 'root' })
export class RolService {
private apiUrl = `${environment.apispirngUrl}/roles`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<RolResponseDTO[]> {
    return this.http.get<RolResponseDTO[]>(this.apiUrl);
  }

  create(rol: RolRequestDTO): Observable<RolResponseDTO> {
    return this.http.post<RolResponseDTO>(this.apiUrl, rol);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  update(id: number, rol: RolRequestDTO): Observable<RolResponseDTO> {
    return this.http.put<RolResponseDTO>(`${this.apiUrl}/${id}`, rol);
  }

  getById(id: number): Observable<RolResponseDTO> {
    return this.http.get<RolResponseDTO>(`${this.apiUrl}/${id}`);
  }
}
