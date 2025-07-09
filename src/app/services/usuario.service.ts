import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsuarioRequestDTO, UsuarioResponseDTO } from '../models/usuario.model';
import { environment } from '../environment/environment';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
private apiUrl = `${environment.apispirngUrl}/usuarios`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<UsuarioResponseDTO[]> {
    return this.http.get<UsuarioResponseDTO[]>(this.apiUrl);
  }

  create(rol: UsuarioRequestDTO): Observable<UsuarioResponseDTO> {
    return this.http.post<UsuarioResponseDTO>(this.apiUrl, rol);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  update(id: number, usuario: UsuarioRequestDTO): Observable<UsuarioResponseDTO> {
    return this.http.put<UsuarioResponseDTO>(`${this.apiUrl}/${id}`, usuario);
  }

  getById(id: number): Observable<UsuarioResponseDTO> {
    return this.http.get<UsuarioResponseDTO>(`${this.apiUrl}/${id}`);
  }
}
