import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { PermisosService } from '../../../../core/services/permisos.service';
import { TipoPermiso } from '../../../../core/models/permiso.model';

/**
 * Lista el catálogo público de tipos de permiso (nombre, requisitos, plazos, tarifas)
 * y permite iniciar una solicitud para el tipo elegido.
 * TODO: filtros por categoría, buscador, tarjetas con detalle expandible.
 */
@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.component.html',
})
export class CatalogoComponent implements OnInit {
  tiposPermiso$!: Observable<TipoPermiso[]>;

  constructor(private readonly permisosService: PermisosService) {}

  ngOnInit(): void {
    this.tiposPermiso$ = this.permisosService.listar(true);
  }
}
