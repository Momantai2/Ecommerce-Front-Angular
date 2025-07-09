import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  standalone: true,
  imports: [],
})
export class ConfirmModalComponent {
  @Output() onConfirm = new EventEmitter<void>();
  modalRef!: NgbModalRef;
  message: string = '¿Está seguro que desea continuar?';

  @ViewChild('confirmTemplate') confirmTemplate: any;

  constructor(private modalService: NgbModal) {}

 open(message: string = '¿Está seguro que desea continuar?'): Promise<boolean> {
  this.message = message;

  return new Promise<boolean>((resolve) => {
    this.modalRef = this.modalService.open(this.confirmTemplate);

    this.modalRef.result
      .then(() => resolve(true))     // Confirmación
      .catch(() => resolve(false));  // Cancelado o cerrada con X
  });
}


  confirm() {
    this.onConfirm.emit();
    this.modalRef.close();
  }

  cancel() {
    this.modalRef.dismiss();
  }
}
