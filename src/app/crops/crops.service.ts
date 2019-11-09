import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Crop } from './crops-data.model';

const BACKEND_URL = 'http://localhost:3000/api/crops/';

@Injectable({ providedIn: 'root' })
export class CropService {
  private cropsListUpdated = new Subject<{ crops: Crop[] }>();
  private cropsList: Crop[];
  constructor(private http: HttpClient) { }

  getCropsList() {
    return this.http.get<{ message: string, crops: any }>(BACKEND_URL).subscribe(cropsList => {
      this.cropsList = cropsList.crops.map(crop => {
        return {
          id: crop._id,
          name: crop.name
        };
      });
      this.cropsListUpdated.next({ crops: [...this.cropsList] });
    });
  }
  getCropsListUpdateListener() {
    return this.cropsListUpdated.asObservable();
  }

}

