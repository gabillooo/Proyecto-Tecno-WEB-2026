import { RolUsuario } from '../enums/estado-solicitud.enum';

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rut?: string;
  rol: RolUsuario;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface SesionDto {
  token: string;
  usuario: Usuario;
}
