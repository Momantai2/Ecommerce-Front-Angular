export interface Persona {
  idPersona?: number;
  dni: string;
  primerNombre: string;
  segundoNombre?: string;
  tercernombre?: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  fechaNacimiento: string; // formato 'YYYY-MM-DD'
  idSexo: number;
  telefono: string;
  email: string;
}
