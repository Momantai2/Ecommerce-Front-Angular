import { Component, Input, ViewChild } from '@angular/core';
import { ModalFormComponent } from '../../shared/modal-form/modal-form.component';
import { ConfirmModalComponent } from '../../shared/confirm-modal/confirm-modal.component';
import { NgClass, NgFor } from '@angular/common';
import { UsuarioRequestDTO, UsuarioResponseDTO } from '../../models/usuario.model';
import { UsuarioModalComponent } from './usuario-modal.component';
import { UsuarioService } from '../../services/usuario.service';
import { Persona } from '../../models/persona.model';
import { RolResponseDTO } from '../../models/rol.model';
import { PersonaService } from '../../services/persona.service';
import { RolService } from '../../services/rol.service';

@Component({
  selector: 'app-usuario',
  imports: [UsuarioModalComponent, ModalFormComponent, ConfirmModalComponent,NgFor,NgClass],
  templateUrl: './usuario.component.html',
})
export class UsuarioComponent {

    usuario: UsuarioResponseDTO[] = [];
    itemSeleccionado: UsuarioRequestDTO = this.nuevoRegistro();
    modalTitulo: string = '';
    soloLectura: boolean = false;
    itemSeleccionadoId: number | null = null;

    @ViewChild(UsuarioModalComponent) usuarioModal!: UsuarioModalComponent;
    @ViewChild('modal') modal!: ModalFormComponent;
    @ViewChild('confirmModal') confirmModal!: ConfirmModalComponent;

        @Input() personas: Persona[] = [];

        
        @Input() roles: RolResponseDTO[] = [];

    constructor(private Service: UsuarioService , private personaService: PersonaService, private rolService: RolService) {}

    ngOnInit(): void {
      this.obtenerListado();

  if (this.personas.length === 0) {
    this.personaService.getAll().subscribe({
      next: (data) => this.personas = data,
      error: (err) => console.error('Error cargando personas:', err)
    });
  }
  
  if (this.roles.length === 0) {
    this.rolService.getAll().subscribe({
      next: (data) => this.roles = data,
      error: (err) => console.error('Error cargando roles:', err)
    });
  }
}

//listar
    obtenerListado() {
      this.Service.getAll().subscribe(usuario => this.usuario = usuario);  
    }

    abrirModalCrear() {

      this.itemSeleccionado = this.nuevoRegistro();
      this.itemSeleccionadoId = null;  // <-- limpiar el id para crear nuevo
      this.modalTitulo = 'Registrar Usuario';
      this.soloLectura = false;
      this.modal.open();
    }

    abrirModalEditar(usuario: UsuarioResponseDTO) {
      this.itemSeleccionado = { ...usuario };
      this.itemSeleccionadoId = usuario.idUsuario;    // <-- Setear id para editar
      this.modalTitulo = 'Editar Usuario';
      this.soloLectura = false;
      this.modal.open();
    }

    abrirModalDetalle(usuario: UsuarioResponseDTO) {
      this.itemSeleccionado = { ...usuario };
      this.itemSeleccionadoId = usuario.idUsuario;    // <-- Setear id para editar

      this.modalTitulo = 'Detalle Usuario';
      this.soloLectura = true;
      this.modal.open();
    }
   guardar() {
  if (this.soloLectura) return;

  const payload: UsuarioRequestDTO = {
    idPersona: this.itemSeleccionado.idPersona,
    nombreUsuario: this.itemSeleccionado.nombreUsuario,
    password: this.itemSeleccionado.password,
    idRol: this.itemSeleccionado.idRol,
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
        this.usuarioModal?.mostrarError(err);  // <- Aquí se muestra la alerta
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
        this.usuarioModal?.mostrarError(err);  // <- Aquí también
      }
    });
  }
}

    confirmarEliminar(id: number) {
      this.itemSeleccionadoId = id;
      this.confirmModal.open('¿Está seguro que desea eliminar este usuario?');
    }

    eliminar() {
      if (this.itemSeleccionadoId != null) {
        this.Service.delete(this.itemSeleccionadoId).subscribe(() => {
          this.obtenerListado();
          this.itemSeleccionadoId = null;
        });
      }
    }

  obtenerNombrePersonas(id: number): string {
  const persona = this.personas.find(s => s.idPersona === id);
  return persona ? persona.primerNombre : 'Desconocido';
}
   obtenerNombreRoles(id: number): string {
  const rol = this.roles.find(s => s.idRol === id);
  return rol ? rol.nombre : 'Desconocido';
}

    private nuevoRegistro(): UsuarioRequestDTO {
      return {
        idPersona: 0,
        nombreUsuario: '',
        password: '',
        idRol: 0,
        estado: true,
      };
    }
  }
