import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { AuthMenuComponent } from '../auth/auth-menu/auth-menu.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private authListenerSubs: Subscription;
  isAuthenticated = false;
  constructor(private authService: AuthService, private dialog: MatDialog) {}

  ngOnInit() {
    this.isAuthenticated = this.authService.isAuth();
    this.authListenerSubs = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.isAuthenticated = isAuthenticated;
    });
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }

  onLogout() {
    this.authService.logout();
  }
  openAuthMenu() {
    this.dialog.open(AuthMenuComponent, {panelClass: 'my-panel'});
  }
}
