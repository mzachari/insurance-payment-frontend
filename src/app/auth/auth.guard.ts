import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthGuard implements CanActivate {
  isAuthenticated = false;
  constructor(private authService: AuthService, private router: Router) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    this.isAuthenticated = this.authService.isAuth();
    console.log('this is from auth-guard.. isAuth = ', this.isAuthenticated);
    if (!this.isAuthenticated) {
      this.router.navigate(['']);
    }
    return this.isAuthenticated;

  }
}
