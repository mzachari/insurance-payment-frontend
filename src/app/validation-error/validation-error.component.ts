import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import {  FormGroup, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-validation-error',
  templateUrl: './validation-error.component.html',
  styleUrls: ['./validation-error.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ValidationErrorComponent implements OnInit {
  @Input() errors: ValidationErrors;
  constructor() { }

  ngOnInit() {
  }

}
