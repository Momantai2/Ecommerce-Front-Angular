import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './paginacion.component.html',
  styleUrls: ['./paginacion.component.css']
})
export class PaginacionComponent {
  @Input() currentPage: number = 0;
  @Input() pageSize: number = 10;
  @Input() totalElements: number = 0;

  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();

  get totalPages(): number {
    return Math.ceil(this.totalElements / this.pageSize);
  }

  get firstItem(): number {
    return this.totalElements === 0 ? 0 : this.currentPage * this.pageSize + 1;
  }

  get lastItem(): number {
    const end = (this.currentPage + 1) * this.pageSize;
    return end > this.totalElements ? this.totalElements : end;
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.pageChange.emit(this.currentPage);
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.pageChange.emit(this.currentPage);
    }
  }

  onPageSizeChange(event: Event): void {
    const newSize = parseInt((event.target as HTMLSelectElement).value, 10);
    this.pageSize = newSize;
    this.pageSizeChange.emit(this.pageSize);
  }
}