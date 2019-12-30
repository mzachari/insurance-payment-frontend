import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

const BACKEND_URL = 'http://localhost:3000/api/insuranceProvider/';

@Injectable({ providedIn: 'root' })
export class InsuranceProviderService {
  private insuranceProviderDetailsUpdated = new Subject<{insuranceProviderData: any}>();
  private insuranceProvider: any;
  constructor(private http: HttpClient) {}

  getInsuranceProviderDetails() {
    return this.http.get<{message: string, insuranceProvider: any}>(BACKEND_URL);
  }
  getFarmerUpdateListener() {
    return this.insuranceProviderDetailsUpdated.asObservable();
  }
}

