import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    
    const expectedRoles: number[] = route.data['roles'];
    const currentRol = Number(localStorage.getItem('idRol'));

    if (expectedRoles.includes(currentRol)) {
      return true;
    }

    // Redirige a acceso denegado o login
    this.router.navigate(['/acceso-denegado']); // crea esta ruta si quieres
    return false;
  }
}
