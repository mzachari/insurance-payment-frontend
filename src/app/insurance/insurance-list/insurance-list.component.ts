import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { InsuranceService } from '../insurance.service';
import { Subscription } from 'rxjs';
import { Insurance } from '../insurance-data.model';

@Component({
  selector: 'app-insurance-list',
  templateUrl: './insurance-list.component.html',
  styleUrls: ['./insurance-list.component.css']
})
export class InsuranceListComponent implements OnInit {
  private insuranceSub: Subscription;
  insuranceList: Insurance[] = [];
  incompleteCount: number;
  completeCount: number;
  constructor(private insuranceService: InsuranceService) {}
  @Output() launchInsuranceAdd = new EventEmitter();


  ngOnInit() {
    this.insuranceService.getAllInsurances();
    this.insuranceSub = this.insuranceService
      .getInsuranceListUpdateListener()
      .subscribe((insuranceData: { insuranceList: Insurance[] }) => {
        this.insuranceList = insuranceData.insuranceList;
        this.incompleteCount = this.insuranceList.filter(insurance => {
          return insurance.isFormComplete < 3;
        }).length;
        this.completeCount = this.insuranceList.length - this.incompleteCount;
        console.log(this.insuranceList);
      });
  }

  onInsEdit(event: Event) {
    console.log(event);
    this.launchInsuranceAdd.emit((event.target as HTMLInputElement).id);
  }
}
