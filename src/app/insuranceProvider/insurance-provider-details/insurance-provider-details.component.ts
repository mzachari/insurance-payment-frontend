import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';
import { InsuranceProviderService } from '../insurance-provider.service';

@Component({
  selector: 'app-insurance-provider-details',
  templateUrl: './insurance-provider-details.component.html',
  styleUrls: ['./insurance-provider-details.component.css']
})
export class InsuranceProviderDetailsComponent implements OnInit {
  private authListenerSubs: Subscription;
  isAuthenticated = false;
  insuranceProviderId = '';
  insuranceProvider = null;
  dataLoaded = false;
  mode = 'list';
  constructor(private authService: AuthService, private insuranceProviderService: InsuranceProviderService) { }

  ngOnInit() {
    this.isAuthenticated = this.authService.isAuth();
    if (this.isAuthenticated) {
      this.insuranceProviderId = this.authService.getUserId();
      this.insuranceProviderService.getInsuranceProviderDetails().subscribe(insuranceData => {
        this.insuranceProvider = {
          id: insuranceData.insuranceProvider._id,
          name: insuranceData.insuranceProvider.name,
          contactNumber: insuranceData.insuranceProvider.contactNumber,
          email: insuranceData.insuranceProvider.email
        };
        this.dataLoaded = true;
      });
    }
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.isAuthenticated = isAuthenticated;
        this.insuranceProviderId = this.authService.getUserId();
      });
  }
  onLogout() {
    this.authService.logout();
  }
  onPolicyAdded($event) {
    this.mode = 'list';
  }
  launchAddPolicy() {
    this.mode = 'add';
    console.log("launched")
  }

}
