import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { DashboardComponent } from '../dashboard/dashboard.component';


@Component({
  standalone: true,
  selector: 'app-main-layout',

  imports: [RouterOutlet, HeaderComponent ,FooterComponent,DashboardComponent],

  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent {}
