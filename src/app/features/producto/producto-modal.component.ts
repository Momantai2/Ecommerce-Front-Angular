import { categoriaResponseDTO } from './../../models/categoria.model';
import { CommonModule, NgFor } from '@angular/common';
import { Component, Input, NgModule, ViewChild } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { AlertModalComponent } from '../../shared/alert-modal/alert-modal.component';
import { ErrorHandlerService } from '../../services/error.handler.service';

import { UnidadMedidaResponseDTO } from '../../models/unidadMedida.model';
import { HttpClient } from '@angular/common/http';
import { productoResponseDTO } from '../../models/producto.model';
import { CrudService } from '../../shared/crud-table/crud.service';

@Component({
  selector: 'app-modal-producto',
  templateUrl: './producto-modal.component.html',
  styleUrls: ['../../shared/crud-table/crud-modal.component.css'],

  standalone: true,
  imports: [FormsModule, CommonModule, AlertModalComponent, NgFor],
})
export class ProductoModalComponent {
  @Input() producto: any = {};
  @Input() readonly: boolean = false;
  categorias: categoriaResponseDTO[] = [];
  unidades: UnidadMedidaResponseDTO[] = [];

  ngOnInit(): void {
    this.cargarCategorias();
    this.cargarUnidades();
  }

  @ViewChild('alertModal') alertModal!: AlertModalComponent;

  constructor(
    private errorHandler: ErrorHandlerService,
    private http: HttpClient, // ✅ Agregado
    private categoriaService: CrudService<categoriaResponseDTO>,
    private unidadService: CrudService<UnidadMedidaResponseDTO>
  ) {}

  mostrarError(error: any) {
    const errorData = this.errorHandler.getErrorData(error);
    this.alertModal.open(errorData.title, errorData.message, errorData.details);
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      this.http
        .post('http://localhost:8080/api/uploads', formData, {
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

  cargarCategorias() {
    this.categoriaService.setEndpoint('categorias');
    this.categoriaService.getAll().subscribe({
      next: (data) => (this.categorias = data.filter((c) => c.estado === true)),
    });
  }

  cargarUnidades() {
    this.unidadService.setEndpoint('unidades-medida');

    this.unidadService.getAll().subscribe({
      next: (data) => (this.unidades = data.filter((u) => u.estado === true)),
    });
  }
  getImagenCompleta(imagenUrl: string): string {
    if (!imagenUrl) return '';
    return imagenUrl.startsWith('http')
      ? imagenUrl
      : `http://localhost:8080${imagenUrl}`;
  }
}
