import { Component, Input, ViewChild } from '@angular/core';
import { ModalFormComponent } from '../../shared/modal-form/modal-form.component';
import { ConfirmModalComponent } from '../../shared/confirm-modal/confirm-modal.component';
import { NgClass, NgFor } from '@angular/common';
import { ProductoModalComponent } from './producto-modal.component';
import { productoRequestDTO, productoResponseDTO } from '../../models/producto.model';
import { categoriaResponseDTO } from '../../models/categoria.model';
import { UnidadMedidaResponseDTO } from '../../models/unidadMedida.model';
import { ProductoService } from '../../services/producto.service';
import { CategoriaService } from '../../services/categoria.service';
import { UnidadMedidaService } from '../../services/unidadMedida.service';
import { environment } from '../../environment/environment';

@Component({
  selector: 'app-producto',
  imports: [ProductoModalComponent, ModalFormComponent, ConfirmModalComponent,NgFor,NgClass ],
  templateUrl: './producto.component.html',
})
export class ProductoComponent {
public apiUrl = environment.apispirngUrl.replace('/api', ''); 

    producto: productoResponseDTO[] = [];
    itemSeleccionado: productoRequestDTO = this.nuevoRegistro();
    modalTitulo: string = '';
    soloLectura: boolean = false;
    itemSeleccionadoId: number | null = null;

    @ViewChild(ProductoModalComponent) productoModal!: ProductoModalComponent;
    @ViewChild('modal') modal!: ModalFormComponent;
    @ViewChild('confirmModal') confirmModal!: ConfirmModalComponent;

        @Input() categorias: categoriaResponseDTO[] = [];


        @Input() medidas: UnidadMedidaResponseDTO []= [];

    constructor(private Service: ProductoService , private categoriaService: CategoriaService, private unidadMedidaService: UnidadMedidaService) {}

    ngOnInit(): void {
      this.obtenerListado();

  if (this.categorias.length === 0) {
    this.categoriaService.getAll().subscribe({
      next: (data) => this.categorias = data,
      error: (err) => console.error('Error cargando categorias:', err)
    });
  }

  if (this.medidas.length === 0) {
    this.unidadMedidaService.getAll().subscribe({
      next: (data) => this.medidas = data,
      error: (err) => console.error('Error cargando medidas:', err)
    });
  }
}

//listar
    obtenerListado() {
      this.Service.getAll().subscribe(producto => this.producto = producto);
    }

    abrirModalCrear() {

      this.itemSeleccionado = this.nuevoRegistro();
      this.itemSeleccionadoId = null;  // <-- limpiar el id para crear nuevo
      this.modalTitulo = 'Registrar Producto';
      this.soloLectura = false;
      this.modal.open();
    }

    abrirModalEditar(producto: productoResponseDTO) {
      this.itemSeleccionado = { ...producto };
      this.itemSeleccionadoId = producto.idProducto;    // <-- Setear id para editar
      this.modalTitulo = 'Editar Producto';
      this.soloLectura = false;
      this.modal.open();
    }

    abrirModalDetalle(producto: productoResponseDTO) {
      this.itemSeleccionado = { ...producto };
      this.itemSeleccionadoId = producto.idProducto;    // <-- Setear id para editar

      this.modalTitulo = 'Detalle Producto';
      this.soloLectura = true;
      this.modal.open();
    }
   guardar() {
  if (this.soloLectura) return;

  const payload: productoRequestDTO = {
    nombre: this.itemSeleccionado.nombre,
    descripcion: this.itemSeleccionado.descripcion,
    precio: this.itemSeleccionado.precio,
    imagenUrl: this.itemSeleccionado.imagenUrl,
    stock: this.itemSeleccionado.stock,
    idCategoria: this.itemSeleccionado.idCategoria,
    idUnidadMedida: this.itemSeleccionado.idUnidadMedida,
    estado: this.itemSeleccionado.estado
  };

  if (this.itemSeleccionadoId) {
    this.Service.update(this.itemSeleccionadoId, payload).subscribe({
      next: () => {
        this.obtenerListado();
        this.modal.close();
        this.itemSeleccionado = this.nuevoRegistro();
        this.itemSeleccionadoId = null;
      },
      error: err => {
        console.error('Error al actualizar', err);
        this.productoModal?.mostrarError(err);  // <- Aquí se muestra la alerta
      }
    });
  } else {
    this.Service.create(payload).subscribe({
      next: () => {
        this.obtenerListado();
        this.modal.close();
        this.itemSeleccionado = this.nuevoRegistro();
      },
      error: err => {
        console.error('Error al crear', err);
        this.productoModal?.mostrarError(err);  // <- Aquí también
      }
    });
  }
}

    confirmarEliminar(id: number) {
      this.itemSeleccionadoId = id;
      this.confirmModal.open('¿Está seguro que desea eliminar este producto?');
    }

    eliminar() {
      if (this.itemSeleccionadoId != null) {
        this.Service.delete(this.itemSeleccionadoId).subscribe(() => {
          this.obtenerListado();
          this.itemSeleccionadoId = null;
        });
      }
    }

  obtenerNombreCategorias(id: number): string {
  const categoria = this.categorias.find(s => s.idCategoria === id);
  return categoria ? categoria.nombre : 'Desconocido';
}

 obtenerNombreUnidadMedidas(id: number): string {
  const unidadMedida = this.medidas.find(s => s.idUnidadMedida === id);
  return unidadMedida ? unidadMedida.nombre : 'Desconocido';
}

    private nuevoRegistro(): productoRequestDTO {
      return {
        nombre: '',
        descripcion: '',
        precio: 0,
        imagenUrl: '',
        stock: 0,
        idCategoria: 0,
        idUnidadMedida: 0,
        estado: true,
      };
    }
  }
