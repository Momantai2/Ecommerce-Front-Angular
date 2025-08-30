// src/app/services/dashboard.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environment/environment';
import { Observable } from 'rxjs';



export interface ProductoStockDTO {
  nombre: string;
  stock: number;
}

export interface CategoriaVendidaDTO {
  nombre: string;
  cantidadVendida: number;
}

export interface ProductoMasVendidoDTO {
  nombre: string;
  cantidadVendida: number;
}

export interface DashboardResumen {
  totalUsuarios: number;
  totalProductos: number;
  totalPedidos: number;
  totalIngresos: number;
  pedidosPorEstado: { [estado: string]: number };
  ventasMensuales: { [mes: string]: number };

  productosMasVendidos: ProductoMasVendidoDTO[];
  lowStockProducts: ProductoStockDTO[];
  categoriasMasVendidas: CategoriaVendidaDTO[];
}



@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = `${environment.apispirngUrl}/dashboard/resumen`;

  constructor(private http: HttpClient) {}

  obtenerResumen(): Observable<DashboardResumen> {
    return this.http.get<DashboardResumen>(this.apiUrl);
  }
  
}
