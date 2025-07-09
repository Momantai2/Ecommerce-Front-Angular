import { Component, ViewChild } from '@angular/core';
import { RolRequestDTO, RolResponseDTO } from '../../models/rol.model';
import { RolModalComponent } from './rol-modal.component';
import { ModalFormComponent } from '../../shared/modal-form/modal-form.component';
import { ConfirmModalComponent } from '../../shared/confirm-modal/confirm-modal.component';
import { RolService } from '../../services/rol.service';
import { NgClass, NgFor } from '@angular/common';

@Component({
  selector: 'app-rol',
  imports: [RolModalComponent, ModalFormComponent, ConfirmModalComponent,NgFor,NgClass],
  templateUrl: './rol.component.html',
})
export class RolComponent {

    rol: RolResponseDTO[] = [];
    itemSeleccionado: RolRequestDTO = this.nuevoRegistro();
    modalTitulo: string = '';
    soloLectura: boolean = false;
    itemSeleccionadoId: number | null = null;

    @ViewChild(RolModalComponent) rolModal!: RolModalComponent;
    @ViewChild('modal') modal!: ModalFormComponent;
    @ViewChild('confirmModal') confirmModal!: ConfirmModalComponent;

    constructor(private Service: RolService ) {}
    
    ngOnInit(): void {
      this.obtenerListado();

}
//listar
    obtenerListado() {
      this.Service.getAll().subscribe(rol => this.rol = rol);  
    }

    abrirModalCrear() {

      this.itemSeleccionado = this.nuevoRegistro();
      this.itemSeleccionadoId = null;  // <-- limpiar el id para crear nuevo
      this.modalTitulo = 'Registrar Rol';
      this.soloLectura = false;
      this.modal.open()
;
    }

    abrirModalEditar(rol: RolResponseDTO) {
      this.itemSeleccionado = { ...rol };
      this.itemSeleccionadoId = rol.idRol;    // <-- Setear id para editar
      this.modalTitulo = 'Editar Rol';
      this.soloLectura = false;
      this.modal.open();
    }

    abrirModalDetalle(rol: RolResponseDTO) {
      this.itemSeleccionado = { ...rol };
          this.itemSeleccionadoId = rol.idRol;    // <-- Setear id para editar

      this.modalTitulo = 'Detalle Roles';
      this.soloLectura = true;
      this.modal.open();
    }

  
   guardar() {
  if (this.soloLectura) return;

  const payload: RolRequestDTO = {
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
        this.rolModal?.mostrarError(err);  // <- Aquí se muestra la alerta
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
        this.rolModal?.mostrarError(err);  // <- Aquí también
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

    private nuevoRegistro(): RolRequestDTO {
      return {    
        nombre: '',
         descripcion: '',
        estado: true,
      };
    }
  }
