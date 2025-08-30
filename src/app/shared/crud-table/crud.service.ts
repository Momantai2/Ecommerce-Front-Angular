import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

export interface Action {
  type: string;
  icon: string;
  label: string;
}

@Injectable({
  providedIn: 'root',
})
export class CrudService<T> {
  private apiUrl = '';

  setEndpoint(endpoint: string): void {
    this.apiUrl = `http://localhost:8080/api/${endpoint}`;
  }

  constructor(private http: HttpClient) {}

  setApiUrl(url: string): void {
    this.apiUrl = url;
  }

  getAll(): Observable<T[]> {
    return this.http.get<T[]>(`${this.apiUrl}/${'todo'}`);
  }

  getPagedResponse(
    page: number = 0,
    size: number = 10
  ): Observable<{ content: T[]; totalElements: number; totalPages: number }> {
    return this.http.get<any>(`${this.apiUrl}?page=${page}&size=${size}`).pipe(
      map((response) => ({
        content: response.content as T[],
        totalElements: response.totalElements,
        totalPages: response.totalPages,
      }))
    );
  }

  getAllWithActions(
    page: number = 0,
    size: number = 10
  ): Observable<(T & { actions: Action[] })[]> {
    return this.http.get<any>(`${this.apiUrl}?page=${page}&size=${size}`).pipe(
      map((response) =>
        (response.content as T[]).map((item: T) => ({
          ...item,
          actions: [
            { type: 'edit', icon: 'edit', label: 'Editar' },
            { type: 'delete', icon: 'delete', label: 'Eliminar' },
          ],
        }))
      )
    );
  }

  getById(id: number): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}/${id}`);
  }

  create(item: any): Observable<T> {
    return this.http.post<T>(this.apiUrl, item);
  }

  update(id: number, item: any): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}/${id}`, item);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  search(
    params: { [key: string]: any },
    page: number = 0,
    size: number = 10
  ): Observable<{ content: T[]; totalElements: number; totalPages: number }> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        queryParams.append(key, value.toString());
      }
    });
    queryParams.append('page', page.toString());
    queryParams.append('size', size.toString());

    return this.http
      .get<any>(`${this.apiUrl}/search?${queryParams.toString()}`)
      .pipe(
        map((response) => ({
          content: response.content as T[],
          totalElements: response.totalElements,
          totalPages: response.totalPages,
        }))
      );
  }
}
