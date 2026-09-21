import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { CiudadanoRoutingModule } from './ciudadano-routing.module';

import { CatalogoComponent } from './pages/catalogo/catalogo.component';
import { SolicitudWizardComponent } from './pages/solicitud-wizard/solicitud-wizard.component';
import { MisTramitesComponent } from './pages/mis-tramites/mis-tramites.component';

@NgModule({
  declarations: [CatalogoComponent, SolicitudWizardComponent, MisTramitesComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SharedModule, CiudadanoRoutingModule],
})
export class CiudadanoModule {}
