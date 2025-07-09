import { Component, OnInit, ViewChild } from '@angular/core';
import { CarritoService } from '../../services/carrito.service';
import { CarritoResponseDTO } from '../../models/carrito.model';
import { NgFor, NgIf } from '@angular/common';
import { itemCarritoResponseDTO } from '../../models/item-carrito.model';
import { ItemCarritoService } from '../../services/item-carrito.service';
import { environment } from '../../environment/environment';
import { PagoService } from '../../services/pago.service';
import { AlertModalComponent } from '../../shared/alert-modal/alert-modal.component';
import { ConfirmModalComponent } from '../../shared/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-carrito',
  standalone : true,
  imports: [NgIf, NgFor, AlertModalComponent, ConfirmModalComponent],
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {
  carrito: CarritoResponseDTO | null = null;
public apiUrl = environment.apispirngUrl.replace('/api', ''); 

  constructor(private carritoService: CarritoService, private itemService: ItemCarritoService , private pagoService: PagoService)  {}
@ViewChild(AlertModalComponent) alertModal!: AlertModalComponent;
  @ViewChild('confirmModal') confirmModal!: ConfirmModalComponent;

  ngOnInit(): void {
    this.obtenerCarrito();
  }

  obtenerCarrito(): void {
    this.carritoService.getCarritoPorUsuario().subscribe({
      next: (data) => {
        this.carrito = data;
      },
      error: (err) => {
        console.error('Error obteniendo el carrito', err);
      }
    });
  }

aumentar(item: itemCarritoResponseDTO) {
  this.itemService.aumentarCantidad(item.idItemCarrito).subscribe({
    next: (actualizado) => {
      item.cantidad = actualizado.cantidad;
    },
    error: (err) => {
    if (err.status === 400 && err.error) {
  this.alertModal.open('Error de stock', err.error);
}
 else {
        console.error('Error al aumentar cantidad:', err);
      }
    }
  });
}

 async disminuir(item: itemCarritoResponseDTO) {
  if (item.cantidad === 1) {
    // Confirmar eliminación cuando la cantidad es 1 y se intenta disminuir
    const confirmado = await this.confirmModal.open(`¿Seguro que deseas eliminar "${item.nombre}" del carrito?`);
    if (!confirmado) {
      return; // si cancela, no sigue
    }
    // Si confirma, elimina directamente
    this.itemService.eliminarItem(item.idItemCarrito).subscribe({
      next: () => {
        this.carrito!.items = this.carrito!.items.filter(i => i.idItemCarrito !== item.idItemCarrito);
      },
      error: (err) => this.alertModal.open('Error', 'No se pudo eliminar el producto.'),
    });
  } else {
    // Si cantidad > 1, simplemente disminuir sin confirmación
    this.itemService.disminuirCantidad(item.idItemCarrito).subscribe({
      next: (actualizado) => {
        if (actualizado && actualizado.cantidad !== undefined) {
          item.cantidad = actualizado.cantidad;
        }
      },
      error: (err) => this.alertModal.open('Error', 'No se pudo disminuir la cantidad.'),
    });
  }
}


  calcularTotal(): number {
  return this.carrito?.items.reduce((sum, item) => sum + (item.precio * item.cantidad), 0) ?? 0;
}
async eliminar(item: itemCarritoResponseDTO) {
  const confirmado = await this.confirmModal.open(`¿Seguro que deseas eliminar "${item.nombre}" del carrito?`);

  if (confirmado) {
    this.itemService.eliminarItem(item.idItemCarrito).subscribe({
      next: () => {
        this.carrito!.items = this.carrito!.items.filter(i => i.idItemCarrito !== item.idItemCarrito);
      },
      error: err => console.error('Error al eliminar item', err)
    });
  }
}

pagar() {
  const items = this.carrito?.items.map(item => ({
    nombre: item.nombre,
    precio: item.precio,      // asegúrate de que esté en dólares
    cantidad: item.cantidad
  })) || [];

  this.pagoService.checkout(items);
}



}
