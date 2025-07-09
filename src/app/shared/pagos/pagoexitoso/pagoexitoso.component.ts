import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PedidoService } from '../../../services/pedido.service';

@Component({
  selector: 'app-pagoexitoso',
  imports: [RouterLink],
  templateUrl: './pagoexitoso.component.html',
  styleUrl: './pagoexitoso.component.css'
})
export class PagoexitosoComponent implements OnInit {
  constructor(private pedidoService: PedidoService) {}

mensaje: string = '';

ngOnInit(): void {
  this.pedidoService.procesarPedido().subscribe({
    next: (res) => {
      this.mensaje = res.mensaje;
      console.log('✅ Pedido procesado exitosamente:', this.mensaje);
    },
    error: err => {
      this.mensaje = 'Ocurrió un error al procesar el pedido.';
      console.error('❌ Error al procesar el pedido:', err);
    }
  });
}

 }