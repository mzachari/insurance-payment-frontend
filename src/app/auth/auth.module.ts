import { NgModule } from '@angular/core';
import { AngularMaterialModule } from '../app-material.module';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';

@NgModule({
  declarations: [
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
