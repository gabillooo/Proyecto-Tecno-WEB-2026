import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Solicitud } from '../../../../core/models/solicitud.model';
import { SolicitudesService } from '../../../../core/services/solicitudes.service';

/**
 * Bandeja de solicitudes para el administrador: filtrar por estado/tipo,
 * y resolver (aprobar / rechazar / observar / emitir).
 * TODO: filtros reactivos, modal de resolución con mensaje obligatorio para observar/rechazar.
 */
@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.component.html',
})
export class SolicitudesComponent implements OnInit {
  solicitudes$!: Observable<Solicitud[]>;

  constructor(private readonly solicitudesService: SolicitudesService) {}

  ngOnInit(): void {
    this.solicitudes$ = this.solicitudesService.listarTodas();
  }
  aprobar(id: string): void { this.solicitudesService.resolver({ solicitudId: id, accion: 'APROBAR' }).subscribe(); }
  rechazar(id: string): void { this.solicitudesService.resolver({ solicitudId: id, accion: 'RECHAZAR', mensaje: 'Faltan antecedentes obligatorios.' }).subscribe(); }
}
