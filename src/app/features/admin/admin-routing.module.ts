import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatalogoPermisosComponent } from './pages/catalogo-permisos/catalogo-permisos.component';
import { SolicitudesComponent } from './pages/solicitudes/solicitudes.component';
import { EstadisticasComponent } from './pages/estadisticas/estadisticas.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'solicitudes' },
  { path: 'solicitudes', component: SolicitudesComponent },
  { path: 'catalogo', component: CatalogoPermisosComponent },
  { path: 'estadisticas', component: EstadisticasComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
