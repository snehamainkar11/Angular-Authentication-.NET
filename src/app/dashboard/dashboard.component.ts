import { Component } from '@angular/core';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  constructor( private router : Router) { }

  OnLogout(){
    localStorage.removeItem('token');
    this.router.navigateByUrl('/signin');
  }
}
