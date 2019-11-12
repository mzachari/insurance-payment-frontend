import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { mimeType } from '../../mime-type.validator';
import { InsuranceService } from '../insurance.service';

@Component({
  selector: 'app-insurance-add',
  templateUrl: './insurance-add.component.html',
  styleUrls: ['./insurance-add.component.css']
})
export class InsuranceAddComponent implements OnInit {
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  imagePreview: string;
  insuranceFileName = 'insurance-plan-doc';
  constructor(private formBuilder: FormBuilder, private insuranceService: InsuranceService) { }

  ngOnInit() {
    this.firstFormGroup =  new FormGroup({
      image: new FormControl(null, { validators: [Validators.required], asyncValidators: [mimeType] })
    });
    this.secondFormGroup = this.formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.firstFormGroup.patchValue({ image: file });
    this.firstFormGroup.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onImageUpload() {
    console.log(this.insuranceFileName);
    this.insuranceService.uploadInsuranceImg(this.firstFormGroup.value.image, this.insuranceFileName);
  }

}
