export interface SexoResponseDTO {
  idSexo: number;
  nombre: string;
  estado: boolean;
}

export interface SexoRequestDTO {
  nombre: string;
  estado: boolean;
}