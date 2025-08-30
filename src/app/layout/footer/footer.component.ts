import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-footer',
 templateUrl: './footer.component.html',
     styleUrls: ['./footer.component.css'],
     imports :[RouterLink]

})
export class FooterComponent {}
