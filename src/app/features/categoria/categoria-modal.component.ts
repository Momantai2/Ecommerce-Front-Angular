import { CommonModule } from '@angular/common';
import { Component, Input, NgModule, ViewChild, } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { AlertModalComponent } from '../../shared/alert-modal/alert-modal.component';
import { ErrorHandlerService } from '../../services/error.handler.service';


@Component({
  selector: 'app-modal-categoria',
  templateUrl: './categoria-modal.component.html',
  standalone: true,
  imports: [FormsModule, CommonModule, AlertModalComponent],
})
export class CategoriaModalComponent {
  @Input() categoria: any = {};
  @Input() readonly: boolean = false;
 @ViewChild('alertModal') alertModal!: AlertModalComponent;

  constructor(private errorHandler: ErrorHandlerService) {}

  mostrarError(error: any) {
    const errorData = this.errorHandler.getErrorData(error);
    this.alertModal.open(errorData.title, errorData.message, errorData.details);
  }
}


