import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Insurance } from './insurance-data.model';
import { map } from 'rxjs/operators';

const BACKEND_URL = 'http://localhost:3000/api/insurance/';

@Injectable({ providedIn: 'root' })
export class InsuranceService {
  insuranceList: Insurance[];
  private insuranceListUpdated = new Subject<{ insuranceList: Insurance[] }>();
  constructor(private http: HttpClient) {}
  uploadInsuranceImg(image: File, fileName: string) {
    const insuranceData = new FormData();
    insuranceData.append('isFormComplete', '1');
    insuranceData.append('image', image, fileName);
    this.http.post<{message: string, insurance: Insurance} > (BACKEND_URL, insuranceData).subscribe((responseData) => {
      console.log(responseData);
    });
  }
  getAllInsurances() {
    this.http.get<{message: string, insuranceList: any, insuranceCount: number} > (BACKEND_URL).subscribe((responseData) => {
      this.insuranceList = responseData.insuranceList.map(insurance => {
        return {
          id: insurance._id,
          ...insurance
        };
      });
      this.insuranceListUpdated.next({ insuranceList: [...this.insuranceList] });
    });
  }
  getInsuranceListUpdateListener() {
    return this.insuranceListUpdated.asObservable();
  }
}
