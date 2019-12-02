import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Farm } from './farm-data.model';
import { map } from 'rxjs/operators';

const BACKEND_URL = 'http://13.68.181.244:3000/api/farms/';

@Injectable({ providedIn: 'root' })
export class FarmService {
  farmsList: Farm[];
  private farmsListUpdated = new Subject<{ farms: Farm[] }>();
  constructor(private http: HttpClient) {}
  addFarm(formData: any) {
    this.http.post<{message: string, farm: Farm} > (BACKEND_URL, formData).subscribe((responseData) => {
      console.log(responseData);
    });
  }
  getAllFarms() {
    this.http.get<{message: string, farms: any, farmerCount: number} > (BACKEND_URL).subscribe((responseData) => {
      this.farmsList = responseData.farms.map(farm => {
        return {
          id: farm._id,
          ...farm
        };
      });
      this.farmsListUpdated.next({ farms: [...this.farmsList] });
    });
  }
  getFarmsListUpdateListener() {
    return this.farmsListUpdated.asObservable();
  }
}
