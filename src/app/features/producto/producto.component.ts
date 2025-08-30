import { Component, Input, OnInit, signal, ViewChild } from '@angular/core';
import { ModalFormComponent } from '../../shared/modal-form/modal-form.component';
import { ConfirmModalComponent } from '../../shared/confirm-modal/confirm-modal.component';
import { NgClass, NgFor } from '@angular/common';
import { ProductoModalComponent } from './producto-modal.component';
import {
  productoRequestDTO,
  productoResponseDTO,
} from '../../models/producto.model';
import {
  TableColumn,
  DataTableComponent,
} from '../../shared/crud-table/data-table.component';
import { CrudService } from '../../shared/crud-table/crud.service';
import { FormsModule } from '@angular/forms';
import { categoriaResponseDTO } from '../../models/categoria.model';
import { UnidadMedidaResponseDTO } from '../../models/unidadMedida.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-producto',
  imports: [
    ProductoModalComponent,
    ModalFormComponent,
    ConfirmModalComponent,
    FormsModule,
    DataTableComponent,
  ],
  templateUrl: './producto.component.html',
  styleUrls: ['../../shared/crud-table/crud-table.component.css'],
})
export class ProductoComponent {
  lista = signal<productoResponseDTO[]>([]);
  paginacion = signal({ page: 0, size: 10, totalPages: 0 });
  seleccionado = signal<productoResponseDTO | null>(null);

  itemSeleccionado: productoRequestDTO = this.nuevoRegistro();
  modalTitulo: string = '';
  soloLectura: boolean = false;
  itemSeleccionadoId: number | null = null;

  columns: TableColumn[] = [];
  data: any[] = [];
  totalElements = 0;
  currentPage = 0;
  pageSize = 10;
  loading = false;
  filtroNombre = '';
  filtroEstado: boolean | null = null;

  productos: productoResponseDTO[] = [];
  categorias: categoriaResponseDTO[] = [];
  unidades: UnidadMedidaResponseDTO[] = [];

  crudService: CrudService<productoResponseDTO>;
  categoriaService: CrudService<categoriaResponseDTO>;
  unidadMedidaService: CrudService<UnidadMedidaResponseDTO>;

  @ViewChild(ProductoModalComponent) categoriaModal!: ProductoModalComponent;
  @ViewChild('modal') modal!: ModalFormComponent;
  @ViewChild('confirmModal') confirmModal!: ConfirmModalComponent;

  constructor(private http: HttpClient) {
    this.crudService = new CrudService<productoResponseDTO>(this.http);
    this.crudService.setEndpoint('productos');

    this.categoriaService = new CrudService<categoriaResponseDTO>(this.http);
    this.categoriaService.setEndpoint('categorias');

    this.unidadMedidaService = new CrudService<UnidadMedidaResponseDTO>(
      this.http
    );
    this.unidadMedidaService.setEndpoint('unidades-medida');
  }

  ngOnInit(): void {
    this.columns = [
      { key: 'idProducto', header: 'ID' },
      { key: 'nombre', header: 'Nombre' },
      { key: 'stock', header: 'Stock' },
      { key: 'precio', header: 'Precio' },
      {
        key: 'imagenUrl',
        header: 'Imagen',
        type: 'image',
        imageConfig: {
          altText: 'Producto',
          defaultImage: 'uploads/img/default-product.png', // puedes cambiar esto
          style: {
            width: '60px',
            height: '60px',
            borderRadius: '8px',
            objectFit: 'cover',
          },
        },
      },

      { key: 'nombreUnidadMedida', header: 'UnidadMedida' },
      { key: 'nombreCategoria', header: 'Categoria' },
      {
        key: 'estado',
        header: 'Estado',
        type: 'badge',
        badgeMap: {
          true: { class: 'badge-success', text: 'Activo' },
          false: { class: 'badge-error', text: 'Inactivo' },
        },
      },
      { key: 'actions', header: 'Acciones', type: 'actions' },
    ];

    this.obtenerListado();
    this.cargarListas(); // <-- agrega esto
  }

  obtenerListado() {
    this.loading = true;

    this.crudService
      .getPagedResponse(this.paginacion().page, this.paginacion().size)
      .subscribe((res) => {
        const estadosConAcciones = res.content.map((item) => ({
          ...item,
          imagenUrl: item.imagenUrl
            ? `http://localhost:8080${item.imagenUrl}`
            : 'assets/default-product.png',
          actions: [
            { type: 'editar', icon: '✏️', label: 'Editar' },
            { type: 'eliminar', icon: '🗑️', label: 'Eliminar' },
            { type: 'visualizar', icon: '👁️', label: 'Visualizar' },
          ],
        }));

        this.lista.set(estadosConAcciones);
        this.data = estadosConAcciones;
        this.totalElements = res.totalElements;
        this.loading = false;

        this.paginacion.update((prev) => ({
          ...prev,
          totalPages: res.totalPages,
        }));
      });
  }

  abrirModalCrear() {
    this.itemSeleccionado = this.nuevoRegistro();
    this.itemSeleccionadoId = null;
    this.modalTitulo = 'Registrar Producto';
    this.soloLectura = false;
    this.modal.open();
  }

  abrirModalEditar(producto: productoResponseDTO) {
    this.itemSeleccionado = { ...producto };
    this.itemSeleccionadoId = producto.idProducto;
    this.modalTitulo = 'Editar Producto';
    this.soloLectura = false;
    this.modal.open();
  }

  abrirModalDetalle(producto: productoResponseDTO) {
    this.itemSeleccionado = { ...producto };
    this.itemSeleccionadoId = producto.idProducto;
    this.modalTitulo = 'Detalle Producto';
    this.soloLectura = true;
    this.modal.open();
  }

  async eliminarEstado(id: number) {
    const confirmado = await this.confirmModal.open(
      '¿Está seguro que desea eliminar?',
      'eliminar'
    );
    if (confirmado) {
      this.crudService.delete(id).subscribe(() => this.obtenerListado());
    }
  }

  guardar() {
    if (this.soloLectura) return;
    let imagenUrl = this.itemSeleccionado.imagenUrl;
    if (imagenUrl && imagenUrl.startsWith('http://localhost:8080')) {
      const urlObj = new URL(imagenUrl);
      imagenUrl = urlObj.pathname;
    }
    const payload: productoRequestDTO = {
      nombre: this.itemSeleccionado.nombre,
      descripcion: this.itemSeleccionado.descripcion,
      precio: this.itemSeleccionado.precio,
      stock: this.itemSeleccionado.stock,
      imagenUrl: imagenUrl, // Usar la URL relativa
      idUnidadMedida: this.itemSeleccionado.idUnidadMedida,
      idCategoria: this.itemSeleccionado.idCategoria,
      estado: this.itemSeleccionado.estado,
    };
    if (this.itemSeleccionadoId) {
      this.crudService.update(this.itemSeleccionadoId, payload).subscribe({
        next: () => {
          this.obtenerListado();
          this.modal.close();
          this.itemSeleccionado = this.nuevoRegistro();
          this.itemSeleccionadoId = null;
        },
        error: (err) => this.categoriaModal?.mostrarError(err),
      });
    } else {
      this.crudService.create(payload).subscribe({
        next: () => {
          this.obtenerListado();
          this.modal.close();
          this.itemSeleccionado = this.nuevoRegistro();
        },
        error: (err) => this.categoriaModal?.mostrarError(err),
      });
    }
  }

  confirmarEliminar(id: number) {
    this.itemSeleccionadoId = id;
    this.confirmModal.open('¿Está seguro que desea eliminar esta Producto?');
  }

  eliminar() {
    if (this.itemSeleccionadoId != null) {
      this.crudService.delete(this.itemSeleccionadoId).subscribe(() => {
        this.obtenerListado();
        this.itemSeleccionadoId = null;
      });
    }
  }

  cambiarPagina(delta: number) {
    this.paginacion.update((prev) => {
      const nuevaPagina = prev.page + delta;
      return {
        ...prev,
        page: Math.max(0, Math.min(nuevaPagina, prev.totalPages - 1)),
      };
    });
    this.obtenerListado();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.paginacion.update((prev) => ({ ...prev, page }));
    this.obtenerListado();
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.paginacion.update((prev) => ({ ...prev, size, page: 0 }));
    this.obtenerListado();
  }

  onRowAction(event: { action: string; item: productoResponseDTO }): void {
    if (event.action === 'editar') {
      this.abrirModalEditar(event.item);
    } else if (event.action === 'eliminar') {
      this.eliminarEstado(event.item.idProducto);
    } else if (event.action === 'visualizar') {
      this.abrirModalDetalle(event.item);
    }
  }

  private nuevoRegistro(): productoRequestDTO {
    return {
      nombre: '',
      descripcion: '',
      precio: 0,
      stock: 0,
      imagenUrl: '',
      idCategoria: 0,
      idUnidadMedida: 0,
      estado: true,
    };
  }

  buscar(): void {
    const filtros: any = {};

    if (this.filtroNombre?.trim()) {
      filtros.nombre = this.filtroNombre.trim();
    }

    if (this.filtroEstado !== null && this.filtroEstado !== undefined) {
      filtros.estado = this.filtroEstado;
    }

    const { page, size } = this.paginacion();

    this.loading = true;

    this.crudService.search(filtros, page, size).subscribe((response) => {
      const filtro = response.content.map((item) => ({
        ...item,
        imagenUrl: item.imagenUrl
          ? `http://localhost:8080${item.imagenUrl}`
          : 'uploads/default-product.png',
        actions: [
          { type: 'editar', icon: '✏️', label: 'Editar' },
          { type: 'eliminar', icon: '🗑️', label: 'Eliminar' },
          { type: 'visualizar', icon: '👁️', label: 'Visualizar' },
        ],
      }));

      this.lista.set(filtro);
      this.data = filtro;
      this.totalElements = response.totalElements;
      this.loading = false;

      this.paginacion.update((prev) => ({
        ...prev,
        totalPages: response.totalPages,
      }));
    });
  }

  quitarFiltros() {
    this.filtroNombre = '';
    this.buscar(); // opcional, para recargar sin filtros
  }

  private cargarListas(): void {
    this.categoriaService.getAll().subscribe({
      next: (data) => (this.categorias = data),
      error: (err) => console.error('Error cargando categorías:', err),
    });

    this.unidadMedidaService.getAll().subscribe({
      next: (data) => (this.unidades = data),
      error: (err) => console.error('Error cargando unidades de medida:', err),
    });
  }
}
