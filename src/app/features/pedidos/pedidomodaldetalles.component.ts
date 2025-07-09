import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PedidoResponseDTO } from '../../models/pedido.model';
import { CurrencyPipe, NgFor } from '@angular/common';

@Component({
  selector: 'app-pedido-detalles-modal',
  imports :[NgFor],
  templateUrl: './pedidomodaldetalles.component.html',
  standalone: true,
})
export class PedidoModalDetallesComponent {
  @Input() pedido!: PedidoResponseDTO;
  apiUrl: string = 'http://localhost:8080'; // o la url base de tu api imágenes

  constructor(public activeModal: NgbActiveModal) {}

  getTotal(): number {
    return this.pedido.items.reduce(
      (acc, item) => acc + item.cantidad * item.precioUnitario,
      0
    );
  }
}
