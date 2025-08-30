import { Component, ViewChild, effect, signal } from '@angular/core';
import { EstadoModalComponent } from './estado-modal.component';
import { estadoRequestDTO, estadoResponseDTO } from '../../models/estado.model';
import { ConfirmModalComponent } from '../../shared/confirm-modal/confirm-modal.component';
import {
  DataTableComponent,
  TableColumn,
} from '../../shared/crud-table/data-table.component';
import { ModalFormComponent } from '../../shared/modal-form/modal-form.component';
import { CrudService } from '../../shared/crud-table/crud.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-estado',
  standalone: true,
  templateUrl: './estado.component.html',
  styleUrls: ['../../shared/crud-table/crud-table.component.css'],
  imports: [
    EstadoModalComponent,
    DataTableComponent,
    ModalFormComponent,
    ConfirmModalComponent,
    FormsModule,
  ],
})
export class EstadoComponent {
  lista = signal<estadoResponseDTO[]>([]);
  paginacion = signal({ page: 0, size: 10, totalPages: 0 });
  seleccionado = signal<estadoResponseDTO | null>(null);

  itemSeleccionado: estadoRequestDTO = this.nuevoRegistro();
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
  filtroDescripcion = '';

  @ViewChild(EstadoModalComponent) categoriaModal!: EstadoModalComponent;
  @ViewChild('modal') modal!: ModalFormComponent;
  @ViewChild('confirmModal') confirmModal!: ConfirmModalComponent;

  constructor(private crudService: CrudService<estadoResponseDTO>) {
    this.crudService.setEndpoint('estados'); // <--- Establece la entidad del CRUD
  }

  ngOnInit(): void {
    this.columns = [
      { key: 'idEstado', header: 'ID' },
      { key: 'nombre', header: 'Nombre' },
      { key: 'descripcion', header: 'Descripcion' },
      { key: 'actions', header: 'Acciones', type: 'actions' },
    ];
    this.obtenerEstados();
  }

  obtenerEstados() {
    this.loading = true;

    this.crudService
      .getPagedResponse(this.paginacion().page, this.paginacion().size)
      .subscribe((res) => {
        const estadosConAcciones = res.content.map((item) => ({
          ...item,
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
    this.modalTitulo = 'Registrar Estado';
    this.soloLectura = false;
    this.modal.open();
  }

  abrirModalEditar(estado: estadoResponseDTO) {
    this.itemSeleccionado = { ...estado };
    this.itemSeleccionadoId = estado.idEstado;
    this.modalTitulo = 'Editar Estado';
    this.soloLectura = false;
    this.modal.open();
  }

  abrirModalDetalle(estado: estadoResponseDTO) {
    this.itemSeleccionado = { ...estado };
    this.itemSeleccionadoId = estado.idEstado;
    this.modalTitulo = 'Detalle Estado';
    this.soloLectura = true;
    this.modal.open();
  }

  async eliminarEstado(id: number) {
    const confirmado = await this.confirmModal.open(
      '¿Está seguro que desea eliminar?',
      'eliminar'
    );
    if (confirmado) {
      this.crudService.delete(id).subscribe(() => this.obtenerEstados());
    }
  }

  guardar() {
    if (this.soloLectura) return;

    const payload: estadoRequestDTO = {
      nombre: this.itemSeleccionado.nombre,
      descripcion: this.itemSeleccionado.descripcion,
    };

    if (this.itemSeleccionadoId) {
      this.crudService.update(this.itemSeleccionadoId, payload).subscribe({
        next: () => {
          this.obtenerEstados();
          this.modal.close();
          this.itemSeleccionado = this.nuevoRegistro();
          this.itemSeleccionadoId = null;
        },
        error: (err) => this.categoriaModal?.mostrarError(err),
      });
    } else {
      this.crudService.create(payload).subscribe({
        next: () => {
          this.obtenerEstados();
          this.modal.close();
          this.itemSeleccionado = this.nuevoRegistro();
        },
        error: (err) => this.categoriaModal?.mostrarError(err),
      });
    }
  }

  confirmarEliminar(id: number) {
    this.itemSeleccionadoId = id;
    this.confirmModal.open('¿Está seguro que desea eliminar esta estado?');
  }

  eliminar() {
    if (this.itemSeleccionadoId != null) {
      this.crudService.delete(this.itemSeleccionadoId).subscribe(() => {
        this.obtenerEstados();
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
    this.obtenerEstados();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.paginacion.update((prev) => ({ ...prev, page }));
    this.obtenerEstados();
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.paginacion.update((prev) => ({ ...prev, size, page: 0 }));
    this.obtenerEstados();
  }

  onRowAction(event: { action: string; item: estadoResponseDTO }): void {
    if (event.action === 'editar') {
      this.abrirModalEditar(event.item);
    } else if (event.action === 'eliminar') {
      this.eliminarEstado(event.item.idEstado);
    } else if (event.action === 'visualizar') {
      this.abrirModalDetalle(event.item);
    }
  }

  private nuevoRegistro(): estadoRequestDTO {
    return {
      nombre: '',
      descripcion: '',
    };
  }

  buscar(): void {
    const filtros: any = {};

    if (this.filtroNombre?.trim()) {
      filtros.nombre = this.filtroNombre.trim();
    }

    if (this.filtroDescripcion?.trim()) {
      filtros.descripcion = this.filtroDescripcion.trim();
    }

    const { page, size } = this.paginacion();

    this.loading = true;

    this.crudService.search(filtros, page, size).subscribe((response) => {
      const estadosConAcciones = response.content.map((item) => ({
        ...item,
        actions: [
          { type: 'editar', icon: '✏️', label: 'Editar' },
          { type: 'eliminar', icon: '🗑️', label: 'Eliminar' },
          { type: 'visualizar', icon: '👁️', label: 'Visualizar' },
        ],
      }));

      this.lista.set(estadosConAcciones);
      this.data = estadosConAcciones;
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
    this.filtroDescripcion = '';
    this.buscar(); // opcional, para recargar sin filtros
  }
}
