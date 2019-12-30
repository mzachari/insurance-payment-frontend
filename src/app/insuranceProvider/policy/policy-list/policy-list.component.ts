import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { PolicyService } from '../policy.service';

@Component({
  selector: 'app-policy-list',
  templateUrl: './policy-list.component.html',
  styleUrls: ['./policy-list.component.css']
})
export class PolicyListComponent implements OnInit {

  @Input() insuranceProviderId: string;
  @Input() listAll: boolean;
  @Output() policyClicked = new EventEmitter();
  policyList: any[] = [];
  policyClickedVal = '';
  constructor(private policyService: PolicyService) { }

  ngOnInit() {
    this.policyService.getAllPolicy(this.listAll);
    this.policyService.getPolicyListUpdateListener().subscribe(policyList => {
      this.policyList =  policyList.policyList;
   });
  }

  onPolicyClicked(policyId) {
    this.policyClicked.emit(policyId);
    document.getElementById(policyId).style.border = "2px solid green";
    if(document.getElementById(this.policyClickedVal) != null){
      document.getElementById(this.policyClickedVal).style.border = null;
    }
    this.policyClickedVal = policyId;
  }

}
