import { Component, OnInit } from '@angular/core';
import { ListadoproductosComponent } from '../../featuresPages/listadoproductos/listadoproductos.component';
import { categoriaResponseDTO } from '../../models/categoria.model';
import { NgFor } from '@angular/common';
import { CrudService } from '../../shared/crud-table/crud.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ListadoproductosComponent, NgFor],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  categorias: categoriaResponseDTO[] = [];
  categoriaSeleccionadaId: number | null = null;
  constructor(private crudService: CrudService<categoriaResponseDTO>) {}

  ngOnInit() {
    this.crudService.setEndpoint('categorias');

    this.crudService.getAll().subscribe({
      next: (data) => {
        this.categorias = data.filter((cat) => cat.estado === true);
      },
      error: (err) => console.error('Error cargando categorías', err),
    });
  }

  seleccionarCategoria(id: number | null) {
    this.categoriaSeleccionadaId = id;
  }
}
