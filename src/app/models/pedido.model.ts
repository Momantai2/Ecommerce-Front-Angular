export interface ItemPedidoResponseDTO {
  idItemPedido: number;
  cantidad: number;
  precioUnitario: number;
  idProducto: number;
  nombreProducto: string;
    imagenUrl: string;  // agregar esto para que coincida con el backend
}



export interface PedidoResponseDTO {
  idPedido: number;
  fecha: string;
  total: number;
  estado: string;
  nombreUsuario: string;  // agregar esto para que coincida con el backend
    imagenUrl: string;  // agregar esto para que coincida con el backend

  items: ItemPedidoResponseDTO[];
}



