import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './auth/auth.guard';
import { HomeComponent } from './home/home.component';
import { FarmerDetailsComponent } from './farmer/farmer-details/farmer-details.component';
import { InsuranceProviderDetailsComponent } from './insuranceProvider/insurance-provider-details/insurance-provider-details.component';

const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'profile', component: FarmerDetailsComponent, canActivate: [AuthGuard]},
  { path: 'insurancePortal', component: InsuranceProviderDetailsComponent, canActivate: [AuthGuard]}
];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [AuthGuard]
})
export class AppRoutingModule {}
