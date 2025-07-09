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

      this.router.navigate(['/carrito']);
    },
    error: () => {
      alert('Credenciales incorrectas');
    }
  });
}

}
