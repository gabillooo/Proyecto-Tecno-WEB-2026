import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Solicitud } from '../../../../core/models/solicitud.model';
import { SolicitudesService } from '../../../../core/services/solicitudes.service';
import { EstadoSolicitud } from '../../../../core/enums/estado-solicitud.enum';

/**
 * Panel personal del ciudadano: estado de cada trámite, comprobantes descargables
 * y respuesta a observaciones del municipio.
 * TODO: filtro por estado, badge de estado con color, acción "responder observación".
 */
@Component({
  selector: 'app-mis-tramites',
  templateUrl: './mis-tramites.component.html',
})
export class MisTramitesComponent implements OnInit {
  solicitudes$!: Observable<Solicitud[]>;
  ultimoEstado: EstadoSolicitud | null = null;

  constructor(private readonly solicitudesService: SolicitudesService) {}

  ngOnInit(): void {
    this.solicitudes$ = this.solicitudesService.misSolicitudes();
  }
  seleccionarEstado(estado: EstadoSolicitud): void { this.ultimoEstado = estado; }
}
