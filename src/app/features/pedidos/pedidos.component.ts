import { Component, OnInit, ViewChild } from '@angular/core';
import { PedidoResponseDTO, ItemPedidoResponseDTO } from '../../models/pedido.model';
import { PedidoService } from '../../services/pedido.service';
import { CurrencyPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { AlertModalComponent } from '../../shared/alert-modal/alert-modal.component';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../environment/environment';
import { PedidoModalDetallesComponent } from './pedidomodaldetalles.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [NgIf, NgFor, DatePipe, AlertModalComponent,PedidoModalDetallesComponent],
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css']
})
export class PedidosComponent implements OnInit {
  pedidos: PedidoResponseDTO[] = [];
  error: string | null = null;
  idRol: number | null = null;
public apiUrl = environment.apispirngUrl.replace('/api', ''); 

  @ViewChild(AlertModalComponent) alertModal!: AlertModalComponent;

constructor(private pedidoService: PedidoService, private authService: AuthService, private modalService: NgbModal) {}

  ngOnInit(): void {
      this.authService.rol$.subscribe(rol => {
    this.idRol = rol;
  });
  
    this.pedidoService.getPedidos().subscribe({
      next: (data) => this.pedidos = data,
      error: (err) => this.error = 'Error al cargar pedidos: ' + err.message
    });
    
  }

// verDetalles(pedido: PedidoResponseDTO) {
//   const detalles = pedido.items.map(item => {
//     const nombre = item.nombreProducto?.trim() || 'Producto desconocido';
//     return `${nombre} - Cantidad: ${item.cantidad} - Precio unitario: $${item.precioUnitario.toFixed(2)} - imagen: ${this.apiUrl + item.imagenUrl}`;
//   });

//   const total = pedido.items.reduce((acc, item) => acc + item.cantidad * item.precioUnitario, 0);
//   detalles.push(`Total del pedido: $${total.toFixed(2)}`);

//   this.alertModal.open(
//     `Pedido #${pedido.idPedido}`,
//     `Productos del pedido de ${pedido.nombreUsuario}`,
//     detalles
//   );
// }

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
