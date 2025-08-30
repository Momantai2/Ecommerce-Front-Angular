import { Component, Input, ViewChild } from '@angular/core';
import { estadoRequestDTO, estadoResponseDTO } from '../../models/estado.model';
import { AlertModalComponent } from '../../shared/alert-modal/alert-modal.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ErrorHandlerService } from '../../services/error.handler.service';

@Component({
  selector: 'app-estado-modal',
  standalone: true,
  imports: [FormsModule, CommonModule, AlertModalComponent],
  templateUrl: './estado-modal.component.html',
  styleUrls: ['../../shared/crud-table/crud-modal.component.css'],
})
export class EstadoModalComponent {
  @Input() estado: any = {};
  @Input() readonly: boolean = false;
  @ViewChild('alertModal') alertModal!: AlertModalComponent;

  constructor(private errorHandler: ErrorHandlerService) {}

  mostrarError(error: any) {
    const errorData = this.errorHandler.getErrorData(error);
    this.alertModal.open(errorData.title, errorData.message, errorData.details);
  }
}
