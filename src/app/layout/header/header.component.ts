import { NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [RouterLink, NgIf] ,
  templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']

})
export class HeaderComponent implements OnInit, OnDestroy {
  username: string | null = null;
  rol: string | null = null;
  isLoggedIn = false;

  private subs: Subscription[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.subs.push(
      this.authService.loggedIn$.subscribe(status => this.isLoggedIn = status),
      this.authService.username$.subscribe(name => this.username = name),
this.authService.rol$.subscribe(role => {
  console.log('Rol actual:', role);

  
})
    );
  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
  }
}