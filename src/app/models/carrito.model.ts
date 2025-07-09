// src/app/models/carrito.model.ts

export interface ItemCarritoResponseDTO {
  idItemCarrito: number;
  idCarrito: number;
  idProducto: number;
  estado: boolean;
  cantidad: number;
  nombre: string;
  precio: number;
  descripcion: String;
imagenUrl:String;
}

export interface CarritoResponseDTO {
  idCarrito: number;
  idUsuario: number;
  estado: boolean;
  items: ItemCarritoResponseDTO[];
}
