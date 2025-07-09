  import { Component, Input, OnInit, ViewChild } from '@angular/core';
  import { ModalFormComponent } from '../../shared/modal-form/modal-form.component';
  import { PersonaModalComponent } from './persona-modal.component';
  import { ConfirmModalComponent } from '../../shared/confirm-modal/confirm-modal.component';
  import { Persona } from '../../models/persona.model';
  import { PersonaService } from '../../services/persona.service';
  import { CommonModule } from '@angular/common';
  import { SexoResponseDTO } from '../../models/sexo.model';
import { SexoService } from '../../services/sexo.service';

  @Component({
    selector: 'app-persona',
    standalone: true,
    imports: [ModalFormComponent, PersonaModalComponent, ConfirmModalComponent, CommonModule],
    templateUrl: './persona.component.html',
    styleUrl: './persona.component.css'
  })
  export class PersonaComponent implements OnInit {
    personas: Persona[] = [];
    personaSeleccionada: Persona = this.nuevaPersona();
    modalTitulo: string = '';
    soloLectura: boolean = false;

    @Input() sexos: SexoResponseDTO[] = [];

    @ViewChild('modal') modal!: ModalFormComponent;
    @ViewChild('confirmModal') confirmModal!: ConfirmModalComponent;

    constructor(private personaService: PersonaService    , private sexoService: SexoService // <-- Asegúrate de inyectarlo
) {}
    

    ngOnInit(): void {
      this.obtenerPersonas();

      if (this.sexos.length === 0) {
    this.sexoService.getAll().subscribe({
      next: (data) => this.sexos = data,
      error: (err) => console.error('Error cargando sexos:', err)
    });
  }
}
    obtenerPersonas() {
      this.personaService.getAll().subscribe(personas => this.personas = personas);
    }

    abrirModalCrear() {
      this.personaSeleccionada = this.nuevaPersona();
      this.modalTitulo = 'Registrar Persona';
      this.soloLectura = false;
      this.modal.open()
;
    }

    abrirModalEditar(persona: Persona) {
      this.personaSeleccionada = { ...persona };
      this.modalTitulo = 'Editar Persona';
      this.soloLectura = false;
      this.modal.open();
    }

    abrirModalDetalle(persona: Persona) {
      this.personaSeleccionada = { ...persona };
      this.modalTitulo = 'Detalle de Persona';
      this.soloLectura = true;
      this.modal.open();
    }

    obtenerNombreSexo(id: number): string {
  const sexo = this.sexos.find(s => s.idSexo === id);
  return sexo ? sexo.nombre : 'Desconocido';
}

    guardarPersona() {
      if (this.soloLectura) return; 

      if (this.personaSeleccionada.idPersona) {
        this.personaService.update(this.personaSeleccionada.idPersona, this.personaSeleccionada).subscribe({
          next: () => {
            this.obtenerPersonas();
            this.modal.close();
            this.personaSeleccionada = this.nuevaPersona();
          },
          error: err => console.error('Error al actualizar', err)
        });
      } else {
        this.personaService.create(this.personaSeleccionada).subscribe({
          next: () => {
            this.obtenerPersonas();
            this.modal.close();
            this.personaSeleccionada = this.nuevaPersona();
          },
          error: err => console.error('Error al crear', err)
        });
      }
    }

    personaSeleccionadaId: number | null = null;

    confirmarEliminar(id: number) {
      this.personaSeleccionadaId = id;
      this.confirmModal.open('¿Está seguro que desea eliminar esta persona?');
    }

    eliminar() {
      if (this.personaSeleccionadaId != null) {
        this.personaService.delete(this.personaSeleccionadaId).subscribe(() => {
          this.obtenerPersonas();
          this.personaSeleccionadaId = null;
        });
      }
    }

    private nuevaPersona(): Persona {
      return {
        idPersona: 0,
        dni: '',
        primerNombre: '',
        segundoNombre: '',
        tercernombre: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        fechaNacimiento: '',
        idSexo: 0,
        telefono: '',
        email: '',
      };
    }
  }
