// alert-modal.component.ts
import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Output, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef,  } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-alert-modal',
  templateUrl: './alert-modal.component.html',
      styleUrls: ['./alert-modal.component.css'],

   imports: [NgIf, NgFor],
  standalone: true,
})
export class AlertModalComponent {
   @ViewChild('alertTemplate') alertTemplate!: TemplateRef<any>;
  modalRef!: NgbModalRef;
  title: string = 'Error';
  message: string = '';
  details: string[] = [];

  constructor(private modalService: NgbModal) {}

  open(title: string, message: string, details: string[] = []) {
    this.title = title;
    this.message = message;
    this.details = details;
    this.modalRef = this.modalService.open(this.alertTemplate);
  }

  close() {
    this.modalRef.close();
  }
}