export interface categoriaResponseDTO {
  idCategoria: number;
  nombre: string;
  descripcion: string;
  estado: boolean;

    showMenu?: boolean;
    
}

export interface categoriaRequestDTO {
  nombre: string;
  descripcion: string;
  estado: boolean;          
}