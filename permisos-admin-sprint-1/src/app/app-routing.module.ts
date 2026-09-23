import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';
import { RolUsuario } from './core/enums/estado-solicitud.enum';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'auth/login'
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./auth/auth.module').then((m) => m.AuthModule)
  },
  {
    path: 'admin',
    canActivate: [AuthGuard, RoleGuard],
    data: {
      rolesPermitidos: [RolUsuario.ADMINISTRADOR]
    },
    loadChildren: () =>
      import('./features/admin/admin.module').then((m) => m.AdminModule)
  },
  {
    path: '**',
    redirectTo: 'auth/login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}