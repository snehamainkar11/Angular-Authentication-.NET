import { Component } from '@angular/core';
import { AppComponent } from '../app.component';
import { RegistrationComponent } from './registration/registration.component';
import { ChildrenOutletContexts, RouterOutlet } from '@angular/router';
import { animate, query, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-user',
  imports: [RouterOutlet],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  animations: [
    trigger('routerFadeIn', [
      transition('* <=> *', [
        query(':enter', [
          style({ opacity: 0 }),
          animate('1s ease-in-out', style({ opacity: 1 }))
        ],{optional :true})
      ])
    ])
  ]
})
export class UserComponent {
constructor(private context: ChildrenOutletContexts) {}
 
  getRouteUrl() {
    return this.context.getContext('primary')?.route?.url;
  }
}
