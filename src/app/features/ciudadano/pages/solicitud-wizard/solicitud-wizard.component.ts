import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PasoSolicitud } from '../../../../core/models/solicitud.model';
import { SolicitudesService } from '../../../../core/services/solicitudes.service';

/**
 * Flujo guiado multi-paso: Datos del trámite -> Documentación -> Pago -> Confirmación.
 * Cada paso valida antes de permitir avanzar (ver PasoSolicitud).
 * TODO: implementar cada paso como sub-componente independiente con su propio
 * FormGroup, y persistir el avance vía SolicitudesService.avanzarPaso().
 */
@Component({
  selector: 'app-solicitud-wizard',
  templateUrl: './solicitud-wizard.component.html',
})
export class SolicitudWizardComponent implements OnInit {
  readonly PasoSolicitud = PasoSolicitud;
  pasoActual: PasoSolicitud = PasoSolicitud.DATOS_TRAMITE;
  tipoPermisoId!: string;
  solicitudId: string | null = null;
  nombreLocal = '';
  direccion = '';
  archivoNombre = '';
  mensaje = '';
  @ViewChild('archivoInput') archivoInput?: ElementRef<HTMLInputElement>;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly solicitudesService: SolicitudesService
  ) {}

  ngOnInit(): void {
    this.tipoPermisoId = this.route.snapshot.paramMap.get('tipoPermisoId')!;
    this.solicitudId = this.route.snapshot.paramMap.get('solicitudId');
    if (!this.solicitudId) {
      this.solicitudesService.iniciarSolicitud(this.tipoPermisoId).subscribe((s) => this.solicitudId = s.id);
    }
  }

  irAPaso(paso: PasoSolicitud): void {
    // TODO: no permitir saltar a un paso no habilitado aún
    this.pasoActual = paso;
  }

  siguiente(): void {
    if (this.pasoActual === PasoSolicitud.DATOS_TRAMITE && (!this.nombreLocal || !this.direccion)) { this.mensaje = 'Completa nombre y dirección antes de avanzar.'; return; }
    if (this.pasoActual === PasoSolicitud.DOCUMENTACION && !this.archivoNombre) { this.mensaje = 'Adjunta un documento simulado.'; return; }
    if (this.pasoActual === PasoSolicitud.PAGO && this.solicitudId) { this.solicitudesService.pagarSimulado(this.solicitudId).subscribe(); }
    if (this.solicitudId) { this.solicitudesService.avanzarPaso({ solicitudId: this.solicitudId, paso: this.pasoActual, datos: { nombreLocal: this.nombreLocal, direccion: this.direccion } }).subscribe(); }
    this.mensaje = '';
    this.pasoActual = Math.min(this.pasoActual + 1, PasoSolicitud.CONFIRMACION) as PasoSolicitud;
  }
  seleccionarArchivo(): void { this.archivoInput?.nativeElement.click(); }
  archivoSeleccionado(evento: Event): void { const archivo = (evento.target as HTMLInputElement).files?.[0]; if (archivo && this.solicitudId) { this.archivoNombre = archivo.name; this.solicitudesService.adjuntarDocumento(this.solicitudId, 'requisito', archivo).subscribe(); } }
}
