import { EstadoSolicitud } from '../enums/estado-solicitud.enum';

export interface DocumentoAdjunto {
  id: string;
  requisitoId: string;
  nombreArchivo: string;
  urlSimulada: string;
  fechaCarga: string; // ISO date
}

export interface ObservacionTramite {
  id: string;
  fecha: string; // ISO date
  autor: string; // nombre del administrador
  mensaje: string;
  resuelta: boolean;
}

export interface ComprobantePago {
  id: string;
  monto: number;
  fecha: string; // ISO date
  numeroTransaccionSimulado: string;
}

/** Entidad principal: una solicitud concreta de un ciudadano para un tipo de permiso */
export interface Solicitud {
  id: string;
  folio: string; // correlativo visible al usuario, ej. "SOL-2026-000123"
  tipoPermisoId: string;
  tipoPermisoNombre: string;
  solicitanteId: string;
  estado: EstadoSolicitud;
  datosFormulario: Record<string, unknown>; // respuestas del paso "Datos del trámite"
  documentos: DocumentoAdjunto[];
  comprobantePago?: ComprobantePago;
  observaciones: ObservacionTramite[];
  fechaCreacion: string; // ISO date
  fechaActualizacion: string; // ISO date
  fechaEmision?: string; // ISO date
}

/** Los 4 pasos estándar del flujo guiado de solicitud (ciudadano) */
export enum PasoSolicitud {
  DATOS_TRAMITE = 0,
  DOCUMENTACION = 1,
  PAGO = 2,
  CONFIRMACION = 3,
}

/** Payload enviado al backend al avanzar cada paso del wizard */
export interface AvanzarPasoDto {
  solicitudId: string;
  paso: PasoSolicitud;
  datos: Record<string, unknown>;
}

/** DTO que usa el Administrador para resolver una solicitud */
export interface ResolverSolicitudDto {
  solicitudId: string;
  accion: 'APROBAR' | 'RECHAZAR' | 'OBSERVAR' | 'EMITIR';
  mensaje?: string; // requerido si accion === 'OBSERVAR' o 'RECHAZAR'
}

/** Filtros para listar solicitudes (panel admin y "mis trámites" del ciudadano) */
export interface FiltroSolicitudes {
  estado?: EstadoSolicitud;
  tipoPermisoId?: string;
  texto?: string;
  desde?: string;
  hasta?: string;
}
