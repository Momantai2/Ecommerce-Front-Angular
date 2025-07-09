import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../../services/producto.service';
import { productoResponseDTO } from '../../models/producto.model';
import { CarritoService } from '../../services/carrito.service';
import { UnidadMedidaResponseDTO } from '../../models/unidadMedida.model';
import { categoriaResponseDTO } from '../../models/categoria.model';
import { CategoriaService } from '../../services/categoria.service';
import { UnidadMedidaService } from '../../services/unidadMedida.service';
import { AlertModalComponent } from "../../shared/alert-modal/alert-modal.component";

@Component({
  standalone: true,
  selector: 'app-listadoproductos',
  imports: [CommonModule, AlertModalComponent],
  templateUrl: './listadoproductos.component.html',
  styleUrl: './listadoproductos.component.css'
})
export class ListadoproductosComponent implements OnInit,OnChanges {

  productos: productoResponseDTO[] = [];
  productosFiltrados: productoResponseDTO[] = [];  // <--- Declárala aquí

  @Input() unidades: UnidadMedidaResponseDTO[] = [];
    @Input() categorias: categoriaResponseDTO[] = [];
  @Input() categoriaSeleccionadaId: number | null = null;
  constructor(private productoService: ProductoService ,  private carritoService: CarritoService , private categoriaservice: CategoriaService , private unidadService: UnidadMedidaService) {}
  @ViewChild(AlertModalComponent) alertModal!: AlertModalComponent;

  ngOnInit(): void {
    this.cargarDatos();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['categoriaSeleccionadaId']) {
      this.filtrarProductos();
    }
  }

  cargarDatos() {
    this.productoService.getAll().subscribe({
      next: (data) => {
        this.productos = data;
        this.filtrarProductos();
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
      }
    });

    if (this.categorias.length === 0) {
      this.categoriaservice.getAll().subscribe({
        next: (data) => this.categorias = data,
        error: (err) => console.error('Error cargando categorias:', err)
      });
    }

    if (this.unidades.length === 0) {
      this.unidadService.getAll().subscribe({
        next: (data) => this.unidades = data,
        error: (err) => console.error('Error cargando unidades:', err)
      });
    }
  }

  filtrarProductos() {
    if (this.categoriaSeleccionadaId) {
      this.productosFiltrados = this.productos.filter(p => p.idCategoria === this.categoriaSeleccionadaId);
    } else {
      this.productosFiltrados = [...this.productos];
    }
  }
 agregarAlCarrito(producto: productoResponseDTO) {
  this.carritoService.agregarAlCarrito(producto).subscribe({
next: () => this.alertModal.open('Éxito', 'Producto agregado al carrito'),
    error: (err) => console.error('Error al agregar al carrito:', err)
  });
}
  obtenerNombreCategoria(id: number): string {
  const categoria = this.categorias.find(s => s.idCategoria === id);
  return categoria ? categoria.nombre : 'Desconocido';
}
  obtenerNombreUnidad(id: number): string {
  const unidad = this.unidades.find(s => s.idUnidadMedida === id);
  return unidad ? unidad.nombre : 'Desconocido';
}

 ordenarPorPrecio(orden: string) {
    if (orden === 'asc' || orden === 'desc') {
      this.productosFiltrados.sort((a, b) => {
        return orden === 'asc' ? a.precio - b.precio : b.precio - a.precio;
      });
    }
  }

}