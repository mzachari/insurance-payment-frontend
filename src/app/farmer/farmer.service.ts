import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Farmer } from './farmer-data.model';
import { map } from 'rxjs/operators';

const BACKEND_URL = 'http://localhost:3000/api/farmers/';

@Injectable({ providedIn: 'root' })
export class FarmerService {
  private farmerDetailsUpdated = new Subject<{farmerData: Farmer}>();
  private farmer: Farmer;
  constructor(private http: HttpClient) {}

  getFarmerDetails() {
    return this.http.get<{message: string, farmer: any}>(BACKEND_URL);
  }
  getFarmerUpdateListener() {
    return this.farmerDetailsUpdated.asObservable();
  }
}

