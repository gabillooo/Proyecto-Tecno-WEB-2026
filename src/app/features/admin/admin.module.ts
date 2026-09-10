import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';

import { CatalogoPermisosComponent } from './pages/catalogo-permisos/catalogo-permisos.component';
import { SolicitudesComponent } from './pages/solicitudes/solicitudes.component';
import { EstadisticasComponent } from './pages/estadisticas/estadisticas.component';

@NgModule({
  declarations: [CatalogoPermisosComponent, SolicitudesComponent, EstadisticasComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SharedModule, AdminRoutingModule],
})
export class AdminModule {}
