import { Component, ViewChild } from '@angular/core';
import { SexoRequestDTO, SexoResponseDTO } from '../../models/sexo.model';
import { ModalFormComponent } from '../../shared/modal-form/modal-form.component';
import { ConfirmModalComponent } from '../../shared/confirm-modal/confirm-modal.component';
import { SexoService } from '../../services/sexo.service';
import { SexoModalComponent } from "./sexo-modal.component";
import { NgClass, NgFor } from '@angular/common';

@Component({
  selector: 'app-sexo',
  imports: [SexoModalComponent, ModalFormComponent, ConfirmModalComponent,NgFor,NgClass],
  templateUrl: './sexo.component.html',
})
export class SexoComponent {
    sexo: SexoResponseDTO[] = [];
    itemSeleccionado: SexoRequestDTO = this.nuevoRegistro();
    modalTitulo: string = '';
    soloLectura: boolean = false;
    itemSeleccionadoId: number | null = null;

    @ViewChild(SexoModalComponent) sexoModal!: SexoModalComponent;
    @ViewChild('modal') modal!: ModalFormComponent;
    @ViewChild('confirmModal') confirmModal!: ConfirmModalComponent;

    constructor(private Service: SexoService ) {}
    
    ngOnInit(): void {
      this.obtenerListado();

}
    obtenerListado() {
      this.Service.getAll().subscribe(sexo => this.sexo = sexo);  
    }

    abrirModalCrear() {

      this.itemSeleccionado = this.nuevoRegistro();
      this.itemSeleccionadoId = null;  // <-- limpiar el id para crear nuevo
      this.modalTitulo = 'Registrar Sexo';
      this.soloLectura = false;
      this.modal.open()
;
    }

    abrirModalEditar(sexo: SexoResponseDTO) {
      this.itemSeleccionado = { ...sexo };
      this.itemSeleccionadoId = sexo.idSexo;    // <-- Setear id para editar
      this.modalTitulo = 'Editar Persona';
      this.soloLectura = false;
      this.modal.open();
    }

    abrirModalDetalle(sexo: SexoResponseDTO) {
      this.itemSeleccionado = { ...sexo };
          this.itemSeleccionadoId = sexo.idSexo;    // <-- Setear id para editar

      this.modalTitulo = 'Detalle de Persona';
      this.soloLectura = true;
      this.modal.open();
    }

  
   guardar() {
  if (this.soloLectura) return;

  const payload: SexoRequestDTO = {
    nombre: this.itemSeleccionado.nombre,
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
        this.sexoModal?.mostrarError(err);  // <- Aquí se muestra la alerta
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
        this.sexoModal?.mostrarError(err);  // <- Aquí también
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

    private nuevoRegistro(): SexoRequestDTO {
      return {    
        nombre: '',
        estado: true,
      };
    }
  }
