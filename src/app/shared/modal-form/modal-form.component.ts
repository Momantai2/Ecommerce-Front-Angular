import { NgIf } from '@angular/common';
import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-form',
  templateUrl: './modal-form.component.html',
  standalone: true,
  imports: [NgIf]
})
export class ModalFormComponent {
  @Input() title = 'Formulario';
  @Output() onSave = new EventEmitter<void>();

  @ViewChild('modalTemplate') modalTemplate: any;
  modalRef!: NgbModalRef;

  constructor(private modalService: NgbModal) {}

  open() {
    this.modalRef = this.modalService.open(this.modalTemplate);
  }

  close() {
    this.modalRef.close();
  }

  @Input() hideSave: boolean = false;


}
