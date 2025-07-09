import { Component, ViewChild } from '@angular/core';
import { ModalFormComponent } from '../../shared/modal-form/modal-form.component';
import { ConfirmModalComponent } from '../../shared/confirm-modal/confirm-modal.component';
import { NgClass, NgFor } from '@angular/common';
import { UnidadMedidaModalComponent } from './unidad-medida-modal.component';
import { UnidadMedidaRequestDTO, UnidadMedidaResponseDTO } from '../../models/unidadMedida.model';
import { UnidadMedidaService } from '../../services/unidadMedida.service';

@Component({
  selector: 'app-unidad-medida',
  imports: [UnidadMedidaModalComponent, ModalFormComponent, ConfirmModalComponent,NgFor,NgClass],
  templateUrl: './unidad-medida.component.html',
})
export class UnidadMedidaComponent {

    unidadMedida: UnidadMedidaResponseDTO[] = [];
    itemSeleccionado: UnidadMedidaRequestDTO = this.nuevoRegistro();
    modalTitulo: string = '';
    soloLectura: boolean = false;
    itemSeleccionadoId: number | null = null;

    @ViewChild(UnidadMedidaModalComponent) unidadMedidaModal!: UnidadMedidaModalComponent;
    @ViewChild('modal') modal!: ModalFormComponent;
    @ViewChild('confirmModal') confirmModal!: ConfirmModalComponent;

    constructor(private Service: UnidadMedidaService ) {}
    
    ngOnInit(): void {
      this.obtenerListado();

}
//listar
    obtenerListado() {
      this.Service.getAll().subscribe(unidadMedida => this.unidadMedida = unidadMedida);  
    }

    abrirModalCrear() {

      this.itemSeleccionado = this.nuevoRegistro();
      this.itemSeleccionadoId = null;  // <-- limpiar el id para crear nuevo
      this.modalTitulo = 'Registrar Unidad de Medida';
      this.soloLectura = false;
      this.modal.open();
    }

    abrirModalEditar(unidadMedida: UnidadMedidaResponseDTO) {
      this.itemSeleccionado = { ...unidadMedida };
      this.itemSeleccionadoId = unidadMedida.idUnidadMedida;    // <-- Setear id para editar
      this.modalTitulo = 'Editar Unidad de Medida';
      this.soloLectura = false;
      this.modal.open();
    }

    abrirModalDetalle(unidadMedida: UnidadMedidaResponseDTO) {
      this.itemSeleccionado = { ...unidadMedida };
      this.itemSeleccionadoId = unidadMedida.idUnidadMedida;    // <-- Setear id para editar

      this.modalTitulo = 'Detalle Unidad de Medida';
      this.soloLectura = true;
      this.modal.open();
    }

  
   guardar() {
  if (this.soloLectura) return;

  const payload: UnidadMedidaRequestDTO = {
    nombre: this.itemSeleccionado.nombre,
    abreviatura: this.itemSeleccionado.abreviatura,
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
        this.unidadMedidaModal?.mostrarError(err);  // <- Aquí se muestra la alerta
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
        this.unidadMedidaModal?.mostrarError(err);  // <- Aquí también
      }
    });
  }
}

   

    confirmarEliminar(id: number) {
      this.itemSeleccionadoId = id;
      this.confirmModal.open('¿Está seguro que desea eliminar esta sexo?');
    }

    eliminar() {
      if (this.itemSeleccionadoId != null) {
        this.Service.delete(this.itemSeleccionadoId).subscribe(() => {
          this.obtenerListado();
          this.itemSeleccionadoId = null;
        });
      }
    }

    private nuevoRegistro(): UnidadMedidaRequestDTO {
      return {    
        nombre: '',
        abreviatura: '',
        estado: true,
      };
    }
  }
