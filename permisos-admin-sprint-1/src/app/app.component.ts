import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  seccionAdmin = '';

  constructor(
    public auth: AuthService,
    private router: Router
  ) {
    this.actualizarSeccion();
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => this.actualizarSeccion());
  }

  private actualizarSeccion(): void {
    const segmento = this.router.url.split('?')[0].split('/')[2] || '';
    this.seccionAdmin = ['solicitudes', 'catalogo', 'estadisticas'].includes(segmento)
      ? segmento
      : '';
  }

  salir(): void {
    this.auth.logout();
    this.router.navigateByUrl('/auth/login');
  }
}
