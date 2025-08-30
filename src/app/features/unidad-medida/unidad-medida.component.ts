import { Component, signal, ViewChild } from '@angular/core';
import { ModalFormComponent } from '../../shared/modal-form/modal-form.component';
import { ConfirmModalComponent } from '../../shared/confirm-modal/confirm-modal.component';
import { UnidadMedidaModalComponent } from './unidad-medida-modal.component';
import {
  UnidadMedidaRequestDTO,
  UnidadMedidaResponseDTO,
} from '../../models/unidadMedida.model';
import { CrudService } from '../../shared/crud-table/crud.service';
import {
  TableColumn,
  DataTableComponent,
} from '../../shared/crud-table/data-table.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-unidad-medida',
  imports: [
    UnidadMedidaModalComponent,
    ModalFormComponent,
    ConfirmModalComponent,
    FormsModule,
    DataTableComponent,
  ],
  templateUrl: './unidad-medida.component.html',
  styleUrls: ['../../shared/crud-table/crud-table.component.css'],
})
export class UnidadMedidaComponent {
  lista = signal<UnidadMedidaResponseDTO[]>([]);
  paginacion = signal({ page: 0, size: 10, totalPages: 0 });
  seleccionado = signal<UnidadMedidaResponseDTO | null>(null);

  itemSeleccionado: UnidadMedidaRequestDTO = this.nuevoRegistro();
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

  @ViewChild(UnidadMedidaModalComponent)
  unidadModal!: UnidadMedidaModalComponent;
  @ViewChild('modal') modal!: ModalFormComponent;
  @ViewChild('confirmModal') confirmModal!: ConfirmModalComponent;

  constructor(private crudService: CrudService<UnidadMedidaResponseDTO>) {
    this.crudService.setEndpoint('unidades-medida'); // <--- Establece la entidad del CRUD
  }

  ngOnInit(): void {
    this.columns = [
      { key: 'idUnidadMedida', header: 'ID' },
      { key: 'nombre', header: 'Nombre' },
      { key: 'abreviatura', header: 'Abreviatura' },
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
  }

  obtenerListado() {
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
    this.modalTitulo = 'Registrar Categoria';
    this.soloLectura = false;
    this.modal.open();
  }

  abrirModalEditar(unidad: UnidadMedidaResponseDTO) {
    this.itemSeleccionado = { ...unidad };
    this.itemSeleccionadoId = unidad.idUnidadMedida;
    this.modalTitulo = 'Editar Categoria';
    this.soloLectura = false;
    this.modal.open();
  }

  abrirModalDetalle(unidad: UnidadMedidaResponseDTO) {
    this.itemSeleccionado = { ...unidad };
    this.itemSeleccionadoId = unidad.idUnidadMedida;
    this.modalTitulo = 'Detalle Categoria';
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

    const payload: UnidadMedidaRequestDTO = {
      nombre: this.itemSeleccionado.nombre,
      abreviatura: this.itemSeleccionado.abreviatura,
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
        error: (err) => this.unidadModal?.mostrarError(err),
      });
    } else {
      this.crudService.create(payload).subscribe({
        next: () => {
          this.obtenerListado();
          this.modal.close();
          this.itemSeleccionado = this.nuevoRegistro();
        },
        error: (err) => this.unidadModal?.mostrarError(err),
      });
    }
  }

  confirmarEliminar(id: number) {
    this.itemSeleccionadoId = id;
    this.confirmModal.open('¿Está seguro que desea eliminar esta Categoria?');
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

  onRowAction(event: { action: string; item: UnidadMedidaResponseDTO }): void {
    if (event.action === 'editar') {
      this.abrirModalEditar(event.item);
    } else if (event.action === 'eliminar') {
      this.eliminarEstado(event.item.idUnidadMedida);
    } else if (event.action === 'visualizar') {
      this.abrirModalDetalle(event.item);
    }
  }

  private nuevoRegistro(): UnidadMedidaRequestDTO {
    return {
      nombre: '',
      abreviatura: '',
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
}
