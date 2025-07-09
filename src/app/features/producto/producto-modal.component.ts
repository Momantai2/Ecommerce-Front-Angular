import { CommonModule, NgFor } from '@angular/common';
import { Component, Input, NgModule, ViewChild, } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { AlertModalComponent } from '../../shared/alert-modal/alert-modal.component';
import { ErrorHandlerService } from '../../services/error.handler.service';

import { categoriaResponseDTO } from '../../models/categoria.model';
import { UnidadMedidaResponseDTO } from '../../models/unidadMedida.model';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-modal-producto',
  templateUrl: './producto-modal.component.html',
  standalone: true,
  imports: [FormsModule, CommonModule, AlertModalComponent,NgFor],
})
export class ProductoModalComponent {
  @Input() producto: any = {};
  @Input() readonly: boolean = false;
  @Input() categorias: categoriaResponseDTO[] = [];
  @Input() medidas: UnidadMedidaResponseDTO[] = [];

  @ViewChild('alertModal') alertModal!: AlertModalComponent;


  constructor(private errorHandler: ErrorHandlerService ,     private http: HttpClient // ✅ Agregado
) {}

  mostrarError(error: any) {
    const errorData = this.errorHandler.getErrorData(error);
    this.alertModal.open(errorData.title, errorData.message, errorData.details);
  }
  ngOnChanges() {
  console.log('categorias en modal:', this.categorias);
  console.log('medidas en modal:', this.medidas);
}

onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      this.http.post('http://localhost:8080/api/uploads', formData, {
          responseType: 'text',
        })
        .subscribe({
          next: (imageUrl: string) => {
            this.producto.imagenUrl = imageUrl;
          },
          error: (err) => {
            this.mostrarError(err);
          },
        });
    }
  }


}


