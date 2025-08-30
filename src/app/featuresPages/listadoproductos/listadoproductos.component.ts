import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { productoResponseDTO } from '../../models/producto.model';
import { CarritoService } from '../../services/carrito.service';
import { AlertModalComponent } from '../../shared/alert-modal/alert-modal.component';
import { CrudService } from '../../shared/crud-table/crud.service';
import { categoriaResponseDTO } from '../../models/categoria.model';

@Component({
  standalone: true,
  selector: 'app-listadoproductos',
  imports: [CommonModule, AlertModalComponent],
  templateUrl: './listadoproductos.component.html',
  styleUrl: './listadoproductos.component.css',
})
export class ListadoproductosComponent implements OnInit, OnChanges {
  productos: productoResponseDTO[] = [];
  productosFiltrados: productoResponseDTO[] = []; // <--- Declárala aquí
  estado = true;
  @Input() categorias: categoriaResponseDTO[] = [];

  @Input() categoriaSeleccionadaId: number | null = null;
  constructor(
    private productoService: CrudService<productoResponseDTO>,
    private carritoService: CarritoService
  ) {}
  @ViewChild(AlertModalComponent) alertModal!: AlertModalComponent;

  ngOnInit(): void {
    this.productoService.setEndpoint('productos'); // <<-- agregar esto

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
        this.productos = data.filter((p) => p.estado === true); // Filtrar solo estado=1
        this.filtrarProductos();
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
      },
    });
  }

  filtrarProductos() {
    if (this.categoriaSeleccionadaId) {
      this.productosFiltrados = this.productos.filter(
        (p) => p.idCategoria === this.categoriaSeleccionadaId
      );
    } else {
      this.productosFiltrados = [...this.productos];
    }
  }
  agregarAlCarrito(producto: productoResponseDTO) {
    const token = localStorage.getItem('token');

    if (token) {
      // Usuario logueado: usar backend
      this.carritoService.agregarAlCarrito(producto).subscribe({
        next: () =>
          this.alertModal.open('Éxito', 'Producto agregado al carrito'),
        error: (err) => console.error('Error al agregar al carrito:', err),
      });
    } else {
      // No hay token: usar localStorage
      const carrito = this.carritoService.getLocalCarrito();
      const index = carrito.findIndex(
        (i) => i.idProducto === producto.idProducto
      );

      if (index >= 0) {
        carrito[index].cantidad += 1;
      } else {
        carrito.push({
          idItemCarrito: -1,
          idCarrito: -1,
          idProducto: producto.idProducto,
          nombre: producto.nombre,
          precio: producto.precio,
          cantidad: 1,
          imagenUrl: producto.imagenUrl,
          descripcion: producto.descripcion ?? '', // si la tienes
          estado: true,
        });
      }
      this.carritoService.setLocalCarrito(carrito);
      this.alertModal.open('Éxito', 'Producto agregado al carrito ');
    }
  }

  ordenarPorPrecio(orden: string) {
    if (orden === 'asc' || orden === 'desc') {
      this.productosFiltrados.sort((a, b) => {
        return orden === 'asc' ? a.precio - b.precio : b.precio - a.precio;
      });
    }
  }
}
