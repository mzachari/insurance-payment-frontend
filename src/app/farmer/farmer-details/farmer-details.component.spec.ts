import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmerDetailsComponent } from './farmer-details.component';

describe('FarmerDetailsComponent', () => {
  let component: FarmerDetailsComponent;
  let fixture: ComponentFixture<FarmerDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FarmerDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FarmerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
