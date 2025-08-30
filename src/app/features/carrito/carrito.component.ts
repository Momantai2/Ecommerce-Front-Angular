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
  const token = localStorage.getItem('token');
  if (token) {
    this.obtenerCarrito();
  } else {
    this.obtenerCarritoLocal();
  }
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
  const token = localStorage.getItem('token');
  if (token) {
    this.itemService.aumentarCantidad(item.idItemCarrito).subscribe({
      next: actualizado => item.cantidad = actualizado.cantidad,
      error: err => console.error('Error al aumentar cantidad:', err)
    });
  } else {
    item.cantidad++;
    this.actualizarLocalCarrito();
  }
}


 disminuir(item: itemCarritoResponseDTO) {
  const token = localStorage.getItem('token');
  if (token) {
    this.itemService.disminuirCantidad(item.idItemCarrito).subscribe({
      next: actualizado => {
        if (actualizado?.cantidad !== undefined) {
          item.cantidad = actualizado.cantidad;
        } else {
          this.carrito!.items = this.carrito!.items.filter(i => i.idProducto !== item.idProducto);
        }
      },
      error: err => console.error('Error al disminuir cantidad:', err)
    });
  } else {
    if (item.cantidad === 1) {
      this.carrito!.items = this.carrito!.items.filter(i => i.idProducto !== item.idProducto);
    } else {
      item.cantidad--;
    }
    this.actualizarLocalCarrito();
  }
}



  calcularTotal(): number {
  return this.carrito?.items.reduce((sum, item) => sum + (item.precio * item.cantidad), 0) ?? 0;
}
eliminar(item: itemCarritoResponseDTO) {
  const token = localStorage.getItem('token');
  if (token) {
    this.itemService.eliminarItem(item.idItemCarrito).subscribe({
      next: () => {
        this.carrito!.items = this.carrito!.items.filter(i => i.idItemCarrito !== item.idItemCarrito);
      },
      error: err => console.error('Error al eliminar item', err)
    });
  } else {
    this.carrito!.items = this.carrito!.items.filter(i => i.idProducto !== item.idProducto);
    this.actualizarLocalCarrito();
  }
}


async pagar() {
  const token = localStorage.getItem('token');

  if (token) {
    // Usuario autenticado → continuar con el pago
    const items = this.carrito?.items.map(item => ({
      nombre: item.nombre,
      precio: item.precio,
      cantidad: item.cantidad
    })) || [];

    this.pagoService.checkout(items);

  } else {
    // Usuario no autenticado → mostrar confirmación
const confirmado = await this.confirmModal.open(
  'Necesitas iniciar sesión para continuar con el pago. ¿Deseas ir al login?',
  'confirmar'
);


    if (confirmado) {
      // Guardar el carrito en localStorage como respaldo temporal
      this.carritoService.setLocalCarrito(this.carrito!.items);

      // Redirigir al formulario de registro
      window.location.href = '/login'; // Ajusta según tu ruta real
    }
  }
}


 //carrito local
  obtenerCarritoLocal(): void {
  const items = this.carritoService.getLocalCarrito();

  this.carrito = {
    idCarrito: -1,
    idUsuario: -1,
    estado: true,
    items: items
  };
}
private actualizarLocalCarrito() {
  this.carritoService.setLocalCarrito(this.carrito!.items);
}





}
