import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PaginacionComponent } from '../Paginacion/paginacion.component';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, PaginacionComponent],
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css'],
})
export class DataTableComponent {
  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];
  @Input() totalElements = 0;
  @Input() currentPage = 0;
  @Input() pageSize = 10;
  @Input() loading = false;

  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();
  @Output() rowAction = new EventEmitter<RowActionEvent>();

  onPageChange(page: number): void {
    this.pageChange.emit(page);
  }

  onPageSizeChange(size: number): void {
    this.pageSizeChange.emit(size);
  }

  onAction(action: string, item: any): void {
    this.rowAction.emit({ action, item });
  }
}

export interface TableColumn {
  key: string;
  header: string;
  type?: 'text' | 'badge' | 'actions' | 'image'; // Añade 'image'
  badgeMap?: { [key: string]: { class: string; text: string } };
  width?: string;
  imageConfig?: {
    // Configuración específica para imágenes
    altText?: string; // Texto alternativo
    defaultImage?: string; // Ruta a imagen por defecto
    style?: {
      // Estilos CSS para la imagen
      width?: string;
      height?: string;
      borderRadius?: string;
      objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
    };
  };
}

export interface RowActionEvent {
  action: string;
  item: any;
}
