export interface UsuarioResponseDTO {
  idUsuario: number;
  idPersona: number;
  nombreUsuario: string;
  password: string;
  idRol: number;
  estado: boolean;
}

export interface UsuarioRequestDTO {
  idPersona: number;
  nombreUsuario: string;
  password: string;
  idRol: number;
  estado: boolean;
}