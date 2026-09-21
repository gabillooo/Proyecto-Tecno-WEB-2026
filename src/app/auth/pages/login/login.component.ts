import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { RolUsuario } from '../../../core/enums/estado-solicitud.enum';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  cargando = false;
  errorMensaje: string | null = null;

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly auth: AuthService,
    private readonly router: Router
  ) {}

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.cargando = true;
    this.errorMensaje = null;

    this.auth.login(this.form.getRawValue()).subscribe({
      next: (sesion) => {
        this.cargando = false;
        this.router.navigateByUrl('/admin');
      },
      error: () => {
        this.cargando = false;
        this.errorMensaje = 'Credenciales inválidas. Intenta nuevamente.';
      },
    });
  }
}
