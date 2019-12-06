import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { AgmMap } from '@agm/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'farmers-app';
  constructor( private authService: AuthService, private router: Router) {}
  ngOnInit(): void {
    this.authService.autoAuthUser();
    if (this.authService.isAuth()) {
      this.router.navigate(['/profile']);
    }
  }
}
