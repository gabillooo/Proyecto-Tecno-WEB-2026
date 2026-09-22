import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { RolUsuario } from '../enums/estado-solicitud.enum';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private readonly auth: AuthService, private readonly router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    const rolesPermitidos: RolUsuario[] = route.data['rolesPermitidos'] ?? [];
    const usuario = this.auth.usuarioActual;

    if (!usuario) {
      return this.router.createUrlTree(['/auth/login']);
    }
    if (rolesPermitidos.length === 0 || rolesPermitidos.includes(usuario.rol)) {
      return true;
    }
    // Usuario autenticado pero sin permiso para esta sección -> redirigir a su home
    const home = usuario.rol === RolUsuario.ADMINISTRADOR ? '/admin' : '/ciudadano';
    return this.router.createUrlTree([home]);
  }
}
