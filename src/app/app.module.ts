import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthInterceptor } from './auth/auth-interceptor';
import { ErrorComponent } from './error/error.component';
import { ErrorInterceptor } from './error-interceptor';
import { AngularMaterialModule } from './app-material.module';
import { AuthMenuComponent } from './auth/auth-menu/auth-menu.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { FarmerDetailsComponent } from './farmer/farmer-details/farmer-details.component';
import { FarmsListComponent } from './farms/farms-list/farms-list.component';
import { FarmAddComponent } from './farms/farm-add/farm-add.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';
import {MatNativeDateModule, MatRippleModule} from '@angular/material/core';
import { InsuranceAddComponent } from './insurance/insurance-add/insurance-add.component';
import { InsuranceListComponent } from './insurance/insurance-list/insurance-list.component';
import { MaterialElevationDirective } from './material-elevation.directive';
import { ValidationErrorComponent } from './validation-error/validation-error.component';
import { InsuranceProviderDetailsComponent } from './insuranceProvider/insurance-provider-details/insurance-provider-details.component';
import { PolicyListComponent } from './insuranceProvider/policy/policy-list/policy-list.component';
import { PolicyAddComponent } from './insuranceProvider/policy/policy-add/policy-add.component';

@NgModule({
  declarations: [
    AppComponent,
    ErrorComponent,
    HeaderComponent,
    AuthMenuComponent,
    LoginComponent,
    SignupComponent,
    HomeComponent,
    FarmerDetailsComponent,
    FarmsListComponent,
    FarmAddComponent,
    InsuranceAddComponent,
    InsuranceListComponent,
    MaterialElevationDirective,
    ValidationErrorComponent,
    InsuranceProviderDetailsComponent,
    PolicyListComponent,
    PolicyAddComponent
  ],
  imports: [
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDA8C5ajxqNc_umQDsU1wHlWf70ZQoOWsE',
      libraries: ['places', 'drawing', 'geometry']
    }),
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AngularMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    MatRippleModule

  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent, AuthMenuComponent]
})
export class AppModule {}
