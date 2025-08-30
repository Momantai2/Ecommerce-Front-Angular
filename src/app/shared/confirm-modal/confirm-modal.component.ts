import { NgClass } from '@angular/common';
import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
      styleUrls: ['./confirm-modal.component.css'],

  standalone: true,
  imports: [NgClass],
})
export class ConfirmModalComponent {
  @Output() onConfirm = new EventEmitter<void>();
  modalRef!: NgbModalRef;
  message: string = '¿Está seguro que desea continuar?';
actionType: 'eliminar' | 'confirmar' = 'eliminar';

  @ViewChild('confirmTemplate') confirmTemplate: any;

  constructor(private modalService: NgbModal) {}

open(message: string = '¿Está seguro que desea continuar?', actionType: 'eliminar' | 'confirmar' = 'eliminar'): Promise<boolean> {
  this.message = message;
  this.actionType = actionType;

  return new Promise<boolean>((resolve) => {
    this.modalRef = this.modalService.open(this.confirmTemplate);

    this.modalRef.result
      .then(() => resolve(true))
      .catch(() => resolve(false));
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
