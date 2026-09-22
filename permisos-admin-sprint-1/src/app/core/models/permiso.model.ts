import { TipoPermisoCategoria } from '../enums/estado-solicitud.enum';

/** Requisito documental o de datos que exige un tipo de permiso */
export interface RequisitoPermiso {
  id: string;
  descripcion: string;
  obligatorio: boolean;
}

/**
 * Define un TIPO de permiso dentro del catálogo (gestionado por el Administrador).
 * No confundir con Solicitud, que es una instancia concreta pedida por un ciudadano.
 */
export interface TipoPermiso {
  id: string;
  nombre: string;
  categoria: TipoPermisoCategoria;
  descripcion: string;
  requisitos: RequisitoPermiso[];
  tarifa: number;
  plazoEstimadoDias: number;
  vigenteDesde: string; // ISO date
  activo: boolean;
}

/** DTO para crear/editar un tipo de permiso desde el panel de administración */
export interface TipoPermisoFormDto {
  nombre: string;
  categoria: TipoPermisoCategoria;
  descripcion: string;
  requisitos: Omit<RequisitoPermiso, 'id'>[];
  tarifa: number;
  plazoEstimadoDias: number;
  activo: boolean;
}
