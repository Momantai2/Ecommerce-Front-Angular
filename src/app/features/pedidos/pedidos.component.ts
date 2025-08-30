import { Component, OnInit, ViewChild } from '@angular/core';
import { PedidoResponseDTO, ItemPedidoResponseDTO } from '../../models/pedido.model';
import { PedidoService } from '../../services/pedido.service';
import { CurrencyPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { AlertModalComponent } from '../../shared/alert-modal/alert-modal.component';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../environment/environment';
import { PedidoModalDetallesComponent } from './pedidomodaldetalles.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModalComponent } from '../../shared/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [NgIf, NgFor, DatePipe, AlertModalComponent,ConfirmModalComponent],
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css']
})
export class PedidosComponent implements OnInit {
  pedidos: PedidoResponseDTO[] = [];
  error: string | null = null;
  idRol: number | null = null;
public apiUrl = environment.apispirngUrl.replace('/api', ''); 

  @ViewChild(AlertModalComponent) alertModal!: AlertModalComponent;
    @ViewChild(ConfirmModalComponent) confirModal!: ConfirmModalComponent;


constructor(private pedidoService: PedidoService, private authService: AuthService, private modalService: NgbModal) {}

  ngOnInit(): void {
      this.authService.rol$.subscribe(rol => {
    this.idRol = rol;
  });
  
    this.pedidoService.getPedidos().subscribe({
      next: (data) => this.pedidos = data,
      error: (err) => this.error = 'Debe ingresar con su cuenta o registrarse  '
    });
    
  }

verBoleta(pedido: PedidoResponseDTO) {
  this.pedidoService.descargarBoleta(pedido.idPedido).subscribe({
    next: (blob) => {
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
    },
    error: (err) => {
      console.error('Error al descargar la boleta', err);
      this.alertModal.open('Error', '', ['No se pudo descargar la boleta.']);
    }
  });
}

cancelarPedido(pedido: PedidoResponseDTO) {
  if (pedido.estado === 'Cancelado') {
    this.alertModal.open('Pedido ya cancelado', '', ['Este pedido ya fue cancelado anteriormente.']);
    return;
  }

  this.confirModal.open(`¿Está seguro de cancelar el pedido #${pedido.idPedido}?`).then(
    (confirmed: boolean) => {
      if (confirmed) {
        this.pedidoService.actualizarEstadoPedido(pedido.idPedido, 'Cancelado').subscribe({
          next: () => {
            pedido.estado = 'Cancelado';
            this.alertModal.open('Pedido Cancelado', '', [`El pedido #${pedido.idPedido} fue cancelado exitosamente.`]);
          },
          error: (err) => {
            console.error(err);
            this.alertModal.open('Error', '', ['No se pudo cancelar el pedido. Intente más tarde.']);
          }
        });
      }
    }
  ).catch(() => {});
}


// método para abrir modal detalles
verDetalles(pedido: PedidoResponseDTO) {
  const modalRef = this.modalService.open(PedidoModalDetallesComponent, { size: 'lg' });
  modalRef.componentInstance.pedido = pedido;
  console.log('Enviando al modal pedido:', pedido);

}


  
  isAdmin(): boolean {
  return this.idRol === 1;
}

isUser(): boolean {
  return this.idRol === 2;
}
}
