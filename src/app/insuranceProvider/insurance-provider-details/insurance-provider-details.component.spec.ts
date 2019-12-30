import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceProviderDetailsComponent } from './insurance-provider-details.component';

describe('InsuranceProviderDetailsComponent', () => {
  let component: InsuranceProviderDetailsComponent;
  let fixture: ComponentFixture<InsuranceProviderDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsuranceProviderDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceProviderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
