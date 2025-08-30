import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartType } from 'chart.js';
import { NgChartsModule, BaseChartDirective } from 'ng2-charts';
import { DashboardResumen, DashboardService } from '../../services/dashboardresumen.service';
import { DecimalPipe, CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-dashboardresumen',
  standalone: true,
  imports: [NgChartsModule, DecimalPipe, CommonModule,NgIf],
  templateUrl: './dashboardresumen.component.html',
  styleUrl: './dashboardresumen.component.css'
})
export class DashboardresumenComponent implements OnInit {
  resumen: DashboardResumen = {
  totalUsuarios: 0,
  totalProductos: 0,
  totalPedidos: 0,
  totalIngresos: 0,
  lowStockProducts: [],
  ventasMensuales: {},
  productosMasVendidos: [],
  pedidosPorEstado: {},
  categoriasMasVendidas: []
};

  

  @ViewChild('ventasChart') ventasChart?: BaseChartDirective;
  @ViewChild('productosChart') productosChart?: BaseChartDirective;
  @ViewChild('estadoChart') estadoChart?: BaseChartDirective;
  @ViewChild('categoriasChart') categoriasChart?: BaseChartDirective;

  // Ventas por mes
  public barChartOptions: ChartConfiguration['options'] = { responsive: true };
  public barChartType: ChartType = 'bar';
  
  public barChartData: any = {
    labels: [],
    datasets: [{ data: [], label: 'Ventas por mes (S/.)'}],

  };

  // Productos más vendidos
  public productosChartType: ChartType = 'bar';
  public productosChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    indexAxis: 'y' // horizontal
  };
  public productosChartData: any = {
    labels: [],
    datasets: [{ data: [], label: 'Cantidad vendida',  }]
  };

  // Pedidos por estado
  public estadoChartType: ChartType = 'doughnut';
  public estadoChartOptions: ChartConfiguration['options'] = { responsive: true };
  public estadoChartData: any = {
    labels: [],
    datasets: [{ data: [], label: 'Pedidos por estado' }]
  };

  // Categorías más vendidas
  public categoriasChartType: ChartType = 'bar';
  public categoriasChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    indexAxis: 'y'
  };
  public categoriasChartData: any = {
    labels: [],
    datasets: [{ data: [], label: 'Categorías más vendidas' }]
  };

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.obtenerResumen().subscribe({
      next: (data) => {
        this.resumen = data;

        // Ventas mensuales
        this.barChartData = {
          labels: Object.keys(data.ventasMensuales),
          datasets: [{
            data: Object.values(data.ventasMensuales),
            label: 'Ventas por mes (S/.)'
          }]
        };

        // Productos más vendidos
        const productos = data.productosMasVendidos || [];
        this.productosChartData = {
          labels: productos.map(p => p.nombre),
          datasets: [{
            data: productos.map(p => p.cantidadVendida),
            label: 'Cantidad vendida'
          }]
        };

        // Pedidos por estado
        this.estadoChartData = {
          labels: Object.keys(data.pedidosPorEstado),
          datasets: [{
            data: Object.values(data.pedidosPorEstado),
            label: 'Pedidos por estado'
          }]
        };

        // Categorías más vendidas
         const categorias = data.categoriasMasVendidas || [];
        this.categoriasChartData = {
          labels: categorias.map(c => c.nombre),
          datasets: [{
            data: categorias.map(c => c.cantidadVendida),
             label: 'Categorías más vendidas'
          }]
        };
      },
      error: (err) => console.error('Error cargando el resumen del dashboard', err)
    });
  }
}
