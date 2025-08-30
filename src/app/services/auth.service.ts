import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../environment/environment';
import { ItemCarritoRequestDTO } from '../models/item-carrito.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
private apiUrl = `${environment.apispirngUrl}/auth`;

  // Estado login y username
  private loggedIn = new BehaviorSubject<boolean>(!!localStorage.getItem('token'));
  loggedIn$ = this.loggedIn.asObservable();

  private username = new BehaviorSubject<string | null>(localStorage.getItem('username'));
  username$ = this.username.asObservable();

  private rol = new BehaviorSubject<number | null>(localStorage.getItem('idRol') ? Number(localStorage.getItem('idRol')) : null);
   rol$ = this.rol.asObservable();

  constructor(private http: HttpClient) {}

 login(username: string, password: string): Observable<{ token: string, rol: number }> {
  return this.http.post<{ token: string, rol: number }>(`${this.apiUrl}/login`, { username, password }).pipe(
    tap(res => {
      localStorage.setItem('token', res.token);
      localStorage.setItem('username', username);
      localStorage.setItem('idRol', res.rol.toString()); // ✅ guardar el rol

      this.loggedIn.next(true);
      this.username.next(username);
      this.rol.next(res.rol); // ✅ actualizar el BehaviorSubject
    })
  );
}

transferirCarritoAlIniciarSesion(items: ItemCarritoRequestDTO[]): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.post(`${environment.apispirngUrl}/carritos/usuario/transferir`, items, { headers });
}


  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
      localStorage.removeItem('idRol');

    this.loggedIn.next(false);
    this.username.next(null);
      this.rol.next(null);

  }
}
