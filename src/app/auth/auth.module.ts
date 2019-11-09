import { NgModule } from '@angular/core';
import { AngularMaterialModule } from '../app-material.module';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AuthMenuComponent } from './auth-menu/auth-menu.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';

@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent,
    AuthMenuComponent
  ],
  imports: [
    FormsModule,
    AngularMaterialModule,
    CommonModule,
    AuthRoutingModule
  ]
})
export class AuthModule {
}
