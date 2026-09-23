import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, of } from 'rxjs';
import { TipoPermiso, TipoPermisoFormDto } from '../models/permiso.model';
import { TipoPermisoCategoria } from '../enums/estado-solicitud.enum';

const TIPOS: TipoPermiso[] = [
  {
    id: 'patente',
    nombre: 'Patente comercial',
    categoria: TipoPermisoCategoria.PATENTE_COMERCIAL,
    descripcion: 'Autoriza actividades comerciales en un local establecido.',
    requisitos: [
      { id: 'r1', descripcion: 'RUT del solicitante', obligatorio: true },
      { id: 'r2', descripcion: 'Certificado de uso de suelo', obligatorio: true }
    ],
    tarifa: 25000,
    plazoEstimadoDias: 5,
    vigenteDesde: '2026-01-01',
    activo: true
  },
  {
    id: 'evento',
    nombre: 'Autorización de eventos',
    categoria: TipoPermisoCategoria.AUTORIZACION_EVENTO,
    descripcion: 'Para eventos públicos o privados en espacios municipales.',
    requisitos: [
      { id: 'r3', descripcion: 'Plan de seguridad', obligatorio: true }
    ],
    tarifa: 15000,
    plazoEstimadoDias: 7,
    vigenteDesde: '2026-01-01',
    activo: true
  },
  {
    id: 'via',
    nombre: 'Ocupación de vía pública',
    categoria: TipoPermisoCategoria.OCUPACION_VIA_PUBLICA,
    descripcion: 'Instalaciones temporales, ferias y obras menores.',
    requisitos: [
      { id: 'r4', descripcion: 'Croquis de ubicación', obligatorio: true }
    ],
    tarifa: 18000,
    plazoEstimadoDias: 3,
    vigenteDesde: '2026-01-01',
    activo: true
  }
];

@Injectable({ providedIn: 'root' })
export class PermisosService {
  private readonly tipos = new BehaviorSubject<TipoPermiso[]>(TIPOS);

  listar(soloActivos = true): Observable<TipoPermiso[]> {
    return this.tipos.pipe(
      map((items) => (soloActivos ? items.filter((x) => x.activo) : items))
    );
  }

  obtener(id: string): Observable<TipoPermiso> {
    return this.tipos.pipe(
      map((items) => items.find((x) => x.id === id) ?? items[0])
    );
  }

  crear(dto: TipoPermisoFormDto): Observable<TipoPermiso> {
    const nuevo: TipoPermiso = {
      ...dto,
      id: crypto.randomUUID(),
      vigenteDesde: new Date().toISOString(),
      requisitos: dto.requisitos.map((r) => ({
        ...r,
        id: crypto.randomUUID()
      }))
    };

    this.tipos.next([...this.tipos.value, nuevo]);
    return of(nuevo);
  }

  actualizar(id: string, dto: TipoPermisoFormDto): Observable<TipoPermiso> {
    const previo = this.tipos.value.find((x) => x.id === id)!;
    const actual: TipoPermiso = {
      ...previo,
      ...dto,
      requisitos: dto.requisitos.map((r) => ({
        ...r,
        id: crypto.randomUUID()
      }))
    };

    this.tipos.next(
      this.tipos.value.map((x) => (x.id === id ? actual : x))
    );
    return of(actual);
  }

  cambiarEstadoActivo(id: string, activo: boolean): Observable<void> {
    this.tipos.next(
      this.tipos.value.map((x) => (x.id === id ? { ...x, activo } : x))
    );
    return of(void 0);
  }
}