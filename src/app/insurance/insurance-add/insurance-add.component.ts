import { Component, OnInit, Input } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import { mimeType } from '../../mime-type.validator';
import { InsuranceService } from '../insurance.service';
import { FarmService } from 'src/app/farms/farm.service';
import { Farm } from 'src/app/farms/farm-data.model';
import { Insurance } from '../insurance-data.model';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-insurance-add',
  templateUrl: './insurance-add.component.html',
  styleUrls: ['./insurance-add.component.css']
})
export class InsuranceAddComponent implements OnInit {
  dataLoaded = false;
  signed = false;
  farmsLoaded = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  imagePreview: string;
  formStatus = 0;
  farmsList: Farm[] = [];
  insuranceFileName = 'insurance-plan-doc';
  insuranceDoc: Insurance = null;
  insFarmName = '';
  @Input() insuranceId: string;
  constructor(
    private formBuilder: FormBuilder,
    private insuranceService: InsuranceService,
    private farmService: FarmService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.farmService.getAllFarms();
    this.farmService.getFarmsListUpdateListener().subscribe(farmsList => {
      this.farmsList = farmsList.farms;
      console.log(farmsList);
      this.farmsLoaded = true;

      this.firstFormGroup = new FormGroup({
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });
      this.secondFormGroup = new FormGroup({
      insurancePlanId: new FormControl(null, {
        validators: [Validators.required]
      }),
      sumInsured: new FormControl(null),
      premium: new FormControl(null),
      inStartDate: new FormControl(null),
      inEndDate: new FormControl(null),
      farmId: new FormControl(null)
    });
      console.log(this.insuranceId);
      this.updateInsuranceDetails();
  });
  }

  updateInsuranceDetails() {
    if (this.insuranceId !== '') {

      this.insuranceService
        .getInsuranceById(this.insuranceId)
        .subscribe(responseData => {
          this.dataLoaded = false;
          this.insuranceDoc = responseData;
          console.log(responseData);
          if (this.insuranceDoc != null) {
            this.firstFormGroup.setValue({
              image: this.insuranceDoc.imagePath
            });
            this.secondFormGroup.setValue({
              insurancePlanId: this.insuranceDoc.insuranceId,
              sumInsured: this.insuranceDoc.insuredAmount,
              premium: this.insuranceDoc.premiumPercentage,
              inStartDate: this.insuranceDoc.insuranceStartDate,
              inEndDate: this.insuranceDoc.insuranceEndDate,
              farmId: this.insuranceDoc.farmId != null ? this.insuranceDoc.farmId : ''
            });
            this.imagePreview = this.insuranceDoc.imagePath;
            if (this.secondFormGroup.value.farmId !== '') {
            this.insFarmName = this.farmsList.filter(farm => this.insuranceDoc.farmId === farm.id)[0].name;
            }
            this.formStatus = this.insuranceDoc.isFormComplete;
            this.dataLoaded = true;
            console.log(this.insuranceDoc, this.imagePreview, this.formStatus);
        }
        });

    }
    if (this.insuranceId === '') {
      this.dataLoaded = true;
    }
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
    this.dataLoaded = false;
    this.insuranceService.uploadInsuranceImg(
      this.firstFormGroup.value.image,
      this.insuranceFileName,
      this.insuranceId
    ).subscribe( responseData => {
      this.insuranceId = responseData.insurance.id;
      if(this.insuranceId !== ''){
      this.updateInsuranceDetails();
      }
      this.dataLoaded = true;
    });
  }

  onBackFromVerifyTab() {

  }

  onDetailsVerified() {
  //  console.log(this.secondFormGroup.value);
    const patchBody = {
      ...this.secondFormGroup.value,
      isFormComplete: 2
    };
    console.log(patchBody);
    this.insuranceService.editInsuranceDetails(this.insuranceId, patchBody).subscribe( () => {
      this.insuranceService
      .getInsuranceById(this.insuranceId)
      .subscribe(responseData => {
        this.dataLoaded = false;
        this.insuranceDoc = responseData;
      });
    });

  }
  convertDate(inputFormat) {
    function pad(s) { return (s < 10) ? '0' + s : s; }
    const d = new Date(inputFormat);
    return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear().toString().substr(-2)].join('/');
  }
  openSnackBar() {
    this.snackBar.open('Smart Contract added!', 'Close', {
      duration: 1000,
    });
  }
}
