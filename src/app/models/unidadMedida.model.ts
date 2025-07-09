export interface UnidadMedidaResponseDTO {
  idUnidadMedida: number;
  nombre: string;
  abreviatura: string ;
  estado: boolean;
}
export interface UnidadMedidaRequestDTO {
  nombre: String;
  abreviatura : String ;
  estado: boolean;
}