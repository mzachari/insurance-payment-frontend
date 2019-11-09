import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './auth/auth.guard';
import { HomeComponent } from './home/home.component';
import { FarmerDetailsComponent } from './farmer/farmer-details/farmer-details.component';

const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'profile', component: FarmerDetailsComponent, canActivate: [AuthGuard]}
];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [AuthGuard]
})
export class AppRoutingModule {}
