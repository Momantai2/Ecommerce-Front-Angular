import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ListadoproductosComponent } from "../../featuresPages/listadoproductos/listadoproductos.component";
import { categoriaResponseDTO } from '../../models/categoria.model';
import { CategoriaService } from '../../services/categoria.service';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone:true,
  imports: [ListadoproductosComponent, NgFor],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{

 categorias: categoriaResponseDTO[] = [];
  categoriaSeleccionadaId: number | null = null;

  constructor(private categoriaService: CategoriaService) {}

  ngOnInit() {
    this.categoriaService.getAll().subscribe({
      next: (data) => this.categorias = data,
      error: (err) => console.error('Error cargando categorías', err)
    });
  }

  seleccionarCategoria(id: number | null) {
    this.categoriaSeleccionadaId = id;
  }
}