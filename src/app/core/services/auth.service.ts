import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, delay, of, tap, throwError } from 'rxjs';
import { LoginDto, SesionDto, Usuario } from '../models/usuario.model';
import { RolUsuario } from '../enums/estado-solicitud.enum';

const STORAGE_KEY = 'permisos_sesion';
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly usuarioSubject = new BehaviorSubject<Usuario | null>(this.leer()?.usuario ?? null);
  readonly usuario$ = this.usuarioSubject.asObservable();
  login(dto: LoginDto): Observable<SesionDto> {
    if (dto.email.toLowerCase() !== 'admin@municipal.cl' || dto.password !== 'Admin123!') {
      return throwError(() => new Error('Credenciales inválidas'));
    }
    const sesion: SesionDto = { token: 'demo-token-2026', usuario: { id: 'u-admin', nombre: 'María Administradora', email: dto.email, rol: RolUsuario.ADMINISTRADOR } };
    return of(sesion).pipe(delay(350), tap((value) => this.guardar(value)));
  }
  perfil(): Promise<Usuario | null> { return Promise.resolve(this.usuarioActual); }
  logout(): void { localStorage.removeItem(STORAGE_KEY); this.usuarioSubject.next(null); }
  get usuarioActual(): Usuario | null { return this.usuarioSubject.value; }
  get token(): string | null { return this.leer()?.token ?? null; }
  esRol(rol: RolUsuario): boolean { return this.usuarioActual?.rol === rol; }
  private guardar(sesion: SesionDto): void { localStorage.setItem(STORAGE_KEY, JSON.stringify(sesion)); this.usuarioSubject.next(sesion.usuario); }
  private leer(): SesionDto | null { try { const raw = localStorage.getItem(STORAGE_KEY); return raw ? JSON.parse(raw) as SesionDto : null; } catch { return null; } }
}
