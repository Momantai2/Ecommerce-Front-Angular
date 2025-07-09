import { Component, ViewChild } from '@angular/core';
import { ModalFormComponent } from '../../shared/modal-form/modal-form.component';
import { ConfirmModalComponent } from '../../shared/confirm-modal/confirm-modal.component';
import { NgClass, NgFor } from '@angular/common';
import { CategoriaModalComponent } from './categoria-modal.component';
import { categoriaRequestDTO, categoriaResponseDTO } from '../../models/categoria.model';
import { CategoriaService } from '../../services/categoria.service';

@Component({
  selector: 'app-categoria',
  imports: [CategoriaModalComponent, ModalFormComponent, ConfirmModalComponent,NgFor,NgClass],
  templateUrl: './categoria.component.html',
})
export class CategoriaComponent {

    categoria: categoriaResponseDTO[] = [];
    itemSeleccionado: categoriaRequestDTO = this.nuevoRegistro();
    modalTitulo: string = '';
    soloLectura: boolean = false;
    itemSeleccionadoId: number | null = null;

    @ViewChild(CategoriaModalComponent) categoriaModal!: CategoriaModalComponent;
    @ViewChild('modal') modal!: ModalFormComponent;
    @ViewChild('confirmModal') confirmModal!: ConfirmModalComponent;

    constructor(private Service: CategoriaService ) {}

    ngOnInit(): void {
      this.obtenerListado();

}
//listar
    obtenerListado() {
      this.Service.getAll().subscribe(categoria => this.categoria = categoria);  
    }

    abrirModalCrear() {

      this.itemSeleccionado = this.nuevoRegistro();
      this.itemSeleccionadoId = null;  // <-- limpiar el id para crear nuevo
      this.modalTitulo = 'Registrar Categoria';
      this.soloLectura = false;
      this.modal.open();
    }

    abrirModalEditar(categoria: categoriaResponseDTO) {
      this.itemSeleccionado = { ...categoria };
      this.itemSeleccionadoId = categoria.idCategoria;    // <-- Setear id para editar
      this.modalTitulo = 'Editar Categoria';
      this.soloLectura = false;
      this.modal.open();
    }

    abrirModalDetalle(categoria: categoriaResponseDTO) {
      this.itemSeleccionado = { ...categoria };
      this.itemSeleccionadoId = categoria.idCategoria;    // <-- Setear id para editar

      this.modalTitulo = 'Detalle Categoria';
      this.soloLectura = true;
      this.modal.open();
    }

  
   guardar() {
  if (this.soloLectura) return;

  const payload: categoriaRequestDTO = {
    nombre: this.itemSeleccionado.nombre,
    descripcion: this.itemSeleccionado.descripcion,
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
        this.categoriaModal?.mostrarError(err);  // <- Aquí se muestra la alerta
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
        this.categoriaModal?.mostrarError(err);  // <- Aquí también
      }
    });
  }
}

   

    confirmarEliminar(id: number) {
      this.itemSeleccionadoId = id;
      this.confirmModal.open('¿Está seguro que desea eliminar esta categoria?');
    }

    eliminar() {
      if (this.itemSeleccionadoId != null) {
        this.Service.delete(this.itemSeleccionadoId).subscribe(() => {
          this.obtenerListado();
          this.itemSeleccionadoId = null;
        });
      }
    }

    private nuevoRegistro(): categoriaRequestDTO {
      return {
        nombre: '',
         descripcion: '',
        estado: true,
      };
    }
  }
