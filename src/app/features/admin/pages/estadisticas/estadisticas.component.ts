import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SolicitudesService } from '../../../../core/services/solicitudes.service';

/**
 * Estadísticas básicas: volumen de solicitudes por tipo y por estado.
 * TODO: gráficos (barras/torta) con una librería liviana, ej. ngx-charts.
 */
@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.component.html',
})
export class EstadisticasComponent implements OnInit {
  estadisticas$!: Observable<{ porEstado: Record<string, number>; porTipo: Record<string, number> }>;

  constructor(private readonly solicitudesService: SolicitudesService) {}

  ngOnInit(): void {
    this.estadisticas$ = this.solicitudesService.estadisticas();
  }
}
