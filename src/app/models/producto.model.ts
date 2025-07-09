export interface productoResponseDTO {
  idProducto: number;
   nombre: string;
  descripcion: string;
  precio: number;
  imagenUrl: string;
  idCategoria: number;
  idUnidadMedida: number;
  stock: number;
  estado: boolean;
}

export interface productoRequestDTO {
  nombre: string;
  descripcion: string;
  precio: number;
  imagenUrl: string;
  idCategoria: number;
  idUnidadMedida: number;
  stock: number;
  estado: boolean;}