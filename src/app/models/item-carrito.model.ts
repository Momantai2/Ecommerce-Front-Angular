import { productoResponseDTO } from "./producto.model";

export interface ItemCarrito {
  idItemCarrito: number;
  producto: productoResponseDTO;
  cantidad: number;
}
export interface ItemCarritoRequestDTO {
  idProducto: number;
  cantidad: number;
}
export interface itemCarritoResponseDTO {
  idItemCarrito: number;
  idCarrito: number;
  idProducto: number;
  cantidad: number;
  nombre: string;
  precio: number;
  estado: boolean;

descripcion: String;
imagenUrl:String;
}