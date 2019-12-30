import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl : './signup.component.html',
  styleUrls : ['./signup.component.css']
})

export class SignupComponent implements OnInit, OnDestroy {
  isLoading =  false;
  private authStatusSub: Subscription;
  role = '';
  constructor(public authService: AuthService) {}

  onSignup(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading =  true;
    // console.log("role", this.role);
    this.authService.createUser(form.value, this.role);
  }
  ngOnInit(): void {
  this.authStatusSub = this.authService.getAuthStatusListener().subscribe(authStatus => {
    this.isLoading =  false;
  });
  }
  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }
}
