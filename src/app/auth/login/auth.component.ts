import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-auth',
    imports: [FormsModule, RouterLink],            // ✅ Aquí importas FormsModule

  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  username = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) {}

onLogin() {
  this.authService.login(this.username, this.password).subscribe({
    next: (res) => {
      localStorage.setItem('token', res.token);
      localStorage.setItem('rol', res.rol.toString());

      const carritoLocal = JSON.parse(localStorage.getItem('carrito') || '[]');

      if (res.rol === 1) {
        this.router.navigate(['/dashresumen']);
        return;
      }

      if (carritoLocal.length > 0) {
        this.authService.transferirCarritoAlIniciarSesion(carritoLocal).subscribe({
          next: () => {
            localStorage.removeItem('carrito');
            this.router.navigate(['/carrito']);
          },
          error: (err) => {
            console.error('Error al transferir carrito', err);
            this.router.navigate(['/carrito']);
          }
        });
      } else {
        this.router.navigate(['/home']);
      }
    },
    error: () => {
      alert('Credenciales incorrectas');
    }
  });
}




}
