/**
 * Estados posibles del ciclo de vida de una solicitud de permiso/licencia/patente.
 * El flujo típico es:
 * BORRADOR -> EN_REVISION -> (OBSERVADA -> EN_REVISION)* -> APROBADA -> EMITIDA
 *                          -> RECHAZADA
 */
export enum EstadoSolicitud {
  BORRADOR = 'BORRADOR',           // El ciudadano aún está completando el formulario (no enviado)
  EN_REVISION = 'EN_REVISION',     // Enviada, pendiente de revisión por un administrador
  OBSERVADA = 'OBSERVADA',         // El administrador solicitó correcciones al ciudadano
  APROBADA = 'APROBADA',           // Aprobada, pendiente de emisión formal del documento
  RECHAZADA = 'RECHAZADA',         // Rechazada definitivamente
  EMITIDA = 'EMITIDA',             // Permiso emitido, trámite finalizado
}

export const ESTADO_SOLICITUD_LABEL: Record<EstadoSolicitud, string> = {
  [EstadoSolicitud.BORRADOR]: 'Borrador',
  [EstadoSolicitud.EN_REVISION]: 'En revisión',
  [EstadoSolicitud.OBSERVADA]: 'Observada',
  [EstadoSolicitud.APROBADA]: 'Aprobada',
  [EstadoSolicitud.RECHAZADA]: 'Rechazada',
  [EstadoSolicitud.EMITIDA]: 'Emitida',
};

export enum TipoPermisoCategoria {
  PATENTE_COMERCIAL = 'PATENTE_COMERCIAL',
  PERMISO_CIRCULACION = 'PERMISO_CIRCULACION',
  PERMISO_CONSTRUCCION_MENOR = 'PERMISO_CONSTRUCCION_MENOR',
  AUTORIZACION_EVENTO = 'AUTORIZACION_EVENTO',
  OCUPACION_VIA_PUBLICA = 'OCUPACION_VIA_PUBLICA',
  OTRO = 'OTRO',
}

export enum RolUsuario {
  CIUDADANO = 'CIUDADANO',
  ADMINISTRADOR = 'ADMINISTRADOR',
}
