import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PolicyService } from '../policy.service';


@Component({
  selector: 'app-policy-add',
  templateUrl: './policy-add.component.html',
  styleUrls: ['./policy-add.component.css']
})
export class PolicyAddComponent implements OnInit {
  form: FormGroup;
  @Output() policyAdded = new EventEmitter();
  constructor(private policyService: PolicyService) { }

  ngOnInit() {
    this.form = new FormGroup({
      policyName: new FormControl(null, { validators: [Validators.required] }),
      premiumPercentage: new FormControl(null, { validators: [Validators.required] }),
      durationDays: new FormControl(null,  { validators: [Validators.required] }),
      minimumAmount: new FormControl(null,  { validators: [Validators.required] }),
  });
}
  onPolicyAdd() {
    if (this.form.invalid) { return; }
    this.policyService.addPolicy(this.form.value).subscribe((responseData) => {
      this.form.reset();
      this.policyAdded.emit('added');
    });
  }
  onPolicyAddCancel() {
    this.policyAdded.emit('cancel');
  }
}


