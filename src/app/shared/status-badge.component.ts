import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EstadoSolicitud, ESTADO_SOLICITUD_LABEL } from '../core/enums/estado-solicitud.enum';
@Component({selector:'app-status-badge',template:`<button type="button" class="secondary" (click)="seleccionado.emit(estado)">{{ etiqueta }}</button>`})
export class StatusBadgeComponent { @Input() estado!: EstadoSolicitud; @Output() seleccionado = new EventEmitter<EstadoSolicitud>(); get etiqueta(): string { return ESTADO_SOLICITUD_LABEL[this.estado]; } }
