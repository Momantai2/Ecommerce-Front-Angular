export interface RolResponseDTO {
  idRol: number;
  nombre: string;
  descripcion: string;
  estado: boolean;
}

export interface RolRequestDTO {
  nombre: string;
  descripcion: string;
  estado: boolean;
}