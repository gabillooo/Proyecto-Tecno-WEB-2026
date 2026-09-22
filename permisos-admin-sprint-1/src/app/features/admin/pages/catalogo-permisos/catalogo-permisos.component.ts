import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { PermisosService } from '../../../../core/services/permisos.service';
import { TipoPermiso } from '../../../../core/models/permiso.model';

/**
 * CRUD del catálogo de tipos de permiso: nombre, descripción, requisitos, tarifas, plazos.
 * TODO: modal/formulario reactivo de alta y edición, FormArray de requisitos.
 */
@Component({
  selector: 'app-catalogo-permisos',
  templateUrl: './catalogo-permisos.component.html',
})
export class CatalogoPermisosComponent implements OnInit {
  tiposPermiso$!: Observable<TipoPermiso[]>;

  constructor(private readonly permisosService: PermisosService) {}

  ngOnInit(): void {
    this.tiposPermiso$ = this.permisosService.listar(false);
  }
}
