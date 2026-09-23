import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, of } from 'rxjs';
import {
  AvanzarPasoDto,
  ComprobantePago,
  FiltroSolicitudes,
  ResolverSolicitudDto,
  Solicitud
} from '../models/solicitud.model';
import { EstadoSolicitud } from '../enums/estado-solicitud.enum';

@Injectable({ providedIn: 'root' })
export class SolicitudesService {
  private readonly datos = new BehaviorSubject<Solicitud[]>([
    {
      id: 'sol-1',
      folio: 'SOL-2026-000123',
      tipoPermisoId: 'patente',
      tipoPermisoNombre: 'Patente comercial',
      solicitanteId: 'María Fernanda Rojas',
      estado: EstadoSolicitud.EN_REVISION,
      datosFormulario: { direccion: 'Av. Siempre Viva 123' },
      documentos: [],
      observaciones: [],
      fechaCreacion: '2026-09-01',
      fechaActualizacion: '2026-09-05'
    },
    {
      id: 'sol-2',
      folio: 'SOL-2026-000124',
      tipoPermisoId: 'evento',
      tipoPermisoNombre: 'Autorización de eventos',
      solicitanteId: 'Carlos Andrés Muñoz',
      estado: EstadoSolicitud.APROBADA,
      datosFormulario: {
        direccion: 'Plaza Central s/n',
        nombreEvento: 'Feria de emprendedores',
        fechaEvento: '2026-10-12'
      },
      documentos: [],
      observaciones: [],
      fechaCreacion: '2026-08-20',
      fechaActualizacion: '2026-08-28'
    },
    {
      id: 'sol-3',
      folio: 'SOL-2026-000125',
      tipoPermisoId: 'via',
      tipoPermisoNombre: 'Ocupación de vía pública',
      solicitanteId: 'Javiera Ignacia Soto',
      estado: EstadoSolicitud.RECHAZADA,
      datosFormulario: {
        direccion: 'Calle Los Robles 456',
        motivo: 'Instalación de andamios'
      },
      documentos: [],
      observaciones: [
        {
          id: 'obs-1',
          fecha: '2026-08-19',
          autor: 'Admin',
          mensaje:
            'No cumple con las medidas de seguridad exigidas para vías con alto tránsito.',
          resuelta: false
        }
      ],
      fechaCreacion: '2026-08-15',
      fechaActualizacion: '2026-08-19'
    },
    {
      id: 'sol-4',
      folio: 'SOL-2026-000126',
      tipoPermisoId: 'patente',
      tipoPermisoNombre: 'Patente comercial',
      solicitanteId: 'Rodrigo Esteban Vargas',
      estado: EstadoSolicitud.EMITIDA,
      datosFormulario: { direccion: 'Av. Providencia 2200' },
      documentos: [],
      observaciones: [],
      fechaCreacion: '2026-07-10',
      fechaActualizacion: '2026-07-22'
    },
    {
      id: 'sol-5',
      folio: 'SOL-2026-000127',
      tipoPermisoId: 'evento',
      tipoPermisoNombre: 'Autorización de eventos',
      solicitanteId: 'Antonia Belén Herrera',
      estado: EstadoSolicitud.OBSERVACION,
      datosFormulario: {
        direccion: 'Parque Municipal',
        nombreEvento: 'Concierto benéfico'
      },
      documentos: [],
      observaciones: [
        {
          id: 'obs-2',
          fecha: '2026-09-14',
          autor: 'Admin',
          mensaje:
            'Falta certificado de seguridad del recinto. Debe adjuntarlo para continuar.',
          resuelta: false
        }
      ],
      fechaCreacion: '2026-09-10',
      fechaActualizacion: '2026-09-14'
    },
    {
      id: 'sol-6',
      folio: 'SOL-2026-000128',
      tipoPermisoId: 'via',
      tipoPermisoNombre: 'Ocupación de vía pública',
      solicitanteId: 'Diego Alonso Fuentes',
      estado: EstadoSolicitud.BORRADOR,
      datosFormulario: {},
      documentos: [],
      observaciones: [],
      fechaCreacion: '2026-09-18',
      fechaActualizacion: '2026-09-18'
    },
    {
      id: 'sol-7',
      folio: 'SOL-2026-000129',
      tipoPermisoId: 'patente',
      tipoPermisoNombre: 'Patente comercial',
      solicitanteId: 'Camila Paz Contreras',
      estado: EstadoSolicitud.EN_REVISION,
      datosFormulario: { direccion: 'Camino La Vinilla 88' },
      documentos: [],
      observaciones: [],
      fechaCreacion: '2026-09-19',
      fechaActualizacion: '2026-09-20'
    }
  ]);

  iniciarSolicitud(tipoPermisoId: string): Observable<Solicitud> {
    const nombres: Record<string, string> = {
      patente: 'Patente comercial',
      evento: 'Autorización de eventos',
      via: 'Ocupación de vía pública'
    };

    const s: Solicitud = {
      id: crypto.randomUUID(),
      folio: `SOL-2026-${String(this.datos.value.length + 124).padStart(6, '0')}`,
      tipoPermisoId,
      tipoPermisoNombre: nombres[tipoPermisoId] ?? 'Permiso municipal',
      solicitanteId: 'u-001',
      estado: EstadoSolicitud.BORRADOR,
      datosFormulario: {},
      documentos: [],
      observaciones: [],
      fechaCreacion: new Date().toISOString(),
      fechaActualizacion: new Date().toISOString()
    };

    this.datos.next([...this.datos.value, s]);
    return of(s);
  }

  avanzarPaso(d: AvanzarPasoDto): Observable<Solicitud> {
    return this.cambiar(d.solicitudId, (s) => ({
      ...s,
      datosFormulario: { ...s.datosFormulario, ...d.datos },
      estado: d.paso === 3 ? EstadoSolicitud.EN_REVISION : s.estado
    }));
  }

  adjuntarDocumento(
    id: string,
    requisitoId: string,
    archivo: File
  ): Observable<Solicitud> {
    return this.cambiar(id, (s) => ({
      ...s,
      documentos: [
        ...s.documentos,
        {
          id: crypto.randomUUID(),
          requisitoId,
          nombreArchivo: archivo.name,
          urlSimulada: '#',
          fechaCarga: new Date().toISOString()
        }
      ]
    }));
  }

  pagarSimulado(id: string): Observable<ComprobantePago> {
    const p = {
      id: crypto.randomUUID(),
      monto: 25000,
      fecha: new Date().toISOString(),
      numeroTransaccionSimulado: 'TX-' + Date.now()
    };

    this.cambiar(id, (s) => ({ ...s, comprobantePago: p })).subscribe();
    return of(p);
  }

  misSolicitudes(
    _: FiltroSolicitudes | undefined = undefined
  ): Observable<Solicitud[]> {
    return this.datos.asObservable();
  }

  listarTodas(
    _: FiltroSolicitudes | undefined = undefined
  ): Observable<Solicitud[]> {
    return this.datos.asObservable();
  }

  obtener(id: string): Observable<Solicitud> {
    return this.datos.pipe(map((x) => x.find((s) => s.id === id)!));
  }

  descargarComprobante(_: string): Observable<Blob> {
    return of(new Blob(['Comprobante simulado']));
  }

  resolver(d: ResolverSolicitudDto): Observable<Solicitud> {
    const e =
      d.accion === 'APROBAR'
        ? EstadoSolicitud.APROBADA
        : d.accion === 'RECHAZAR'
        ? EstadoSolicitud.RECHAZADA
        : d.accion === 'EMITIR'
        ? EstadoSolicitud.EMITIDA
        : EstadoSolicitud.OBSERVACION;

    return this.cambiar(d.solicitudId, (s) => ({ ...s, estado: e }));
  }

  estadisticas(): Observable<{
    porEstado: Record<string, number>;
    porTipo: Record<string, number>;
  }> {
    return this.datos.pipe(
      map((a) => ({
        porEstado: a.reduce(
          (r, s) => ({ ...r, [s.estado]: (r[s.estado] ?? 0) + 1 }),
          {} as Record<string, number>
        ),
        porTipo: a.reduce(
          (r, s) => ({
            ...r,
            [s.tipoPermisoNombre]: (r[s.tipoPermisoNombre] ?? 0) + 1
          }),
          {} as Record<string, number>
        )
      }))
    );
  }

  private cambiar(
    id: string,
    fn: (s: Solicitud) => Solicitud
  ): Observable<Solicitud> {
    const n = fn(this.datos.value.find((s) => s.id === id)!);
    this.datos.next(this.datos.value.map((s) => (s.id === id ? n : s)));
    return of(n);
  }
}