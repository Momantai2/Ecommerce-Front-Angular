import { CommonModule, NgFor } from '@angular/common';
import { Component, Input, NgModule, ViewChild, } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { AlertModalComponent } from '../../shared/alert-modal/alert-modal.component';
import { ErrorHandlerService } from '../../services/error.handler.service';
import { Persona } from '../../models/persona.model';
import { RolResponseDTO } from '../../models/rol.model';


@Component({
  selector: 'app-modal-usuario',
  templateUrl: './usuario-modal.component.html',
  standalone: true,
  imports: [FormsModule, CommonModule, AlertModalComponent,NgFor],
})
export class UsuarioModalComponent {
  @Input() usuario: any = {};
  @Input() readonly: boolean = false;
  @Input() personas: Persona[] = [];
  @Input() roles: RolResponseDTO[] = [];
@Input() ocultarCamposRelacionados: boolean = false;
@Input() esRegistro: boolean = false;

  @ViewChild('alertModal') alertModal!: AlertModalComponent;


  constructor(private errorHandler: ErrorHandlerService) {}

  mostrarError(error: any) {
    const errorData = this.errorHandler.getErrorData(error);
    this.alertModal.open(errorData.title, errorData.message, errorData.details);
  }
  ngOnChanges() {
  console.log('personas en modal:', this.personas);
  console.log('roles en modal:', this.roles);
}

}


