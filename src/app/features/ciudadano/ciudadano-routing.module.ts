import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatalogoComponent } from './pages/catalogo/catalogo.component';
import { SolicitudWizardComponent } from './pages/solicitud-wizard/solicitud-wizard.component';
import { MisTramitesComponent } from './pages/mis-tramites/mis-tramites.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'catalogo' },
  { path: 'catalogo', component: CatalogoComponent },
  { path: 'solicitud/:tipoPermisoId', component: SolicitudWizardComponent },
  { path: 'solicitud/:tipoPermisoId/:solicitudId', component: SolicitudWizardComponent },
  { path: 'mis-tramites', component: MisTramitesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CiudadanoRoutingModule {}
