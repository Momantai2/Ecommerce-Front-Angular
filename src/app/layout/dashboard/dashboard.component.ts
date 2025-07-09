import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  
  imports: [RouterLink,NgIf],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  idRol: number | null = null;

  showSubmenu = false;
  isLoggedIn = false;
  private subscription!: Subscription;

  constructor(private router: Router, private authService: AuthService) {}

  toggleSubmenu() {
    this.showSubmenu = !this.showSubmenu;
  }

  ngOnInit() {
    this.subscription = this.authService.loggedIn$.subscribe(status => {
      this.isLoggedIn = status;
       this.authService.rol$.subscribe(rol => {
      this.idRol = rol;
    });
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/home']);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  isAdmin(): boolean {
  return this.idRol === 1;
}

isUser(): boolean {
  return this.idRol === 2;
}


}
