import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';
import { FarmerService } from '../farmer.service';
import { Farmer } from '../farmer-data.model';
@Component({
  selector: 'app-farmer-details',
  templateUrl: './farmer-details.component.html',
  styleUrls: ['./farmer-details.component.css']
})
export class FarmerDetailsComponent implements OnInit {
  farmerId: string;
  farmerData: Farmer = null;
  private authListenerSubs: Subscription;
  isAuthenticated = false;
  mode = 'list';
  dataLoaded = false;
  private farmerDetailsSub: Subscription;
  constructor(private authService: AuthService, private farmerService: FarmerService) { }

  ngOnInit() {

    this.isAuthenticated = this.authService.isAuth();
    if (this.isAuthenticated) {
      this.farmerId = this.authService.getUserId();
      this.farmerService.getFarmerDetails().subscribe(farmerData => {
        this.farmerData = {
          id: farmerData.farmer._id,
          name: farmerData.farmer.name,
          contactNumber: farmerData.farmer.contactNumber,
          email: farmerData.farmer.email
        };
        this.dataLoaded = true;
      });
    }
    this.authListenerSubs = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.isAuthenticated = isAuthenticated;
      this.farmerId = this.authService.getUserId();
    });

  }

  showAddFarmForm() {
    this.mode = 'farm-add';
  }

  onFarmAdded(addStatus) {
    console.log(addStatus);
    this.mode = 'list';
  }

  showAddInsuranceForm() {
    this.mode = 'ins-add';
  }
  showList(){
    this.mode = 'list';
  }


}
