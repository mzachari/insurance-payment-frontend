import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

const BACKEND_URL = 'http://localhost:3000/api/';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient, private router: Router) { }
  private token: string;
  private authStatusListener = new Subject<boolean>();
  private isAuthenticated = false;
  private tokenTimer: any;
  private userId: string;
  private role: string;

  getRole() {
    return this.role;
  }
  getToken() {
    return this.token;
  }

  getUserId() {
    return this.userId;
  }
  isAuth() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(formData: any, role: string) {
    console.log(formData);
    this.http.post('http://localhost:3000/api/' + role + '/signup', formData)
      .subscribe(response => {
        console.log(response);
        this.authStatusListener.next(false);
      }, error => {
        this.authStatusListener.next(false);
      });
  }

  login(contactNumber: string, password: string, role: string) {
    const authData: AuthData = { contactNumber, password };
    // tslint:disable-next-line: max-line-length
    this.http.post<{ token: string, expiresIn: number, userId: string,role: string }>('http://localhost:3000/api/' + role + '/login', authData)
      .subscribe(response => {
        const token = response.token;
        const userId = response.userId;
        const expiresInDuration = response.expiresIn;
        if (token) {
          this.token = token;
          this.isAuthenticated = true;
          this.userId = userId;
          this.role = response.role;
          this.setAuthTimer(expiresInDuration);
          const now =  new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          this.saveAuthData(token, expirationDate, userId, response.role);
          this.authStatusListener.next(true);
          if (response.role === 'farmer') {
            this.router.navigate(['/profile']);
          } else {
            this.router.navigate(['/insurancePortal']);
          }

        }
      }, error => {
        this.authStatusListener.next(false);
      });
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.userId = null;
    this.authStatusListener.next(false);
    this.clearAuthData();
    clearTimeout(this.tokenTimer);
    this.router.navigate(['/']);
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (authInformation) {
      const now = new Date();
      const expiresIn =  authInformation.expirationDate.getTime() - now.getTime();
      if (expiresIn > 0) {
        this.token = authInformation.token;
        this.userId = authInformation.userId;
        this.isAuthenticated = true;
        this.role = authInformation.role;
        this.setAuthTimer(expiresIn / 1000);
        this.authStatusListener.next(true);
      }
    }
  }

  private setAuthTimer(expiresInDuration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, expiresInDuration * 1000 );
  }
  private saveAuthData( token: string, expirationDate: Date, userId: string, role: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
    localStorage.setItem('role', role);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expiration = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    const role = localStorage.getItem('role');
    if (!token || !expiration) {
      return;
    }
    return {
      token,
      expirationDate: new Date(expiration),
      userId,
      role
    };
  }

}
