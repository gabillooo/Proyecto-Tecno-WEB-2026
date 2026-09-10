import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StatusBadgeComponent } from './status-badge.component';

/**
 * Módulo de piezas de UI reutilizables y consistentes con el Design System:
 * badges de estado, stepper genérico, tabla paginada, modal de confirmación, etc.
 * Se importa (no se provee) tanto en CiudadanoModule como en AdminModule.
 */
@NgModule({
  declarations: [StatusBadgeComponent,
    // TODO: EstadoBadgeComponent, StepperComponent, TablaPaginadaComponent, ModalConfirmacionComponent...
  ],
  imports: [CommonModule, RouterModule],
  exports: [CommonModule, RouterModule, StatusBadgeComponent],
})
export class SharedModule {}
