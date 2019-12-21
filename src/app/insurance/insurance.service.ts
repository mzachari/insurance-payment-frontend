import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Insurance } from './insurance-data.model';
import { map } from 'rxjs/operators';
import { stringify } from 'querystring';

const BACKEND_URL = 'http://localhost:3000/api/insurance/';

@Injectable({ providedIn: 'root' })
export class InsuranceService {
  insuranceList: Insurance[];
  private insuranceListUpdated = new Subject<{ insuranceList: Insurance[] }>();
  constructor(private http: HttpClient) {}
  uploadInsuranceImg(
    image: File | string,
    fileName: string,
    insuranceId: string
  ) {
    let insuranceData;
    if (typeof image === 'object') {
      insuranceData = new FormData();
      insuranceData.append('isFormComplete', '1');
      insuranceData.append('image', image, fileName);
    } else {
      insuranceData = {
        isFormComplete: 1,
        imagePath: image
      };
    }
    if (insuranceId === '') {
      return this.http.post<{ message: string; insurance: Insurance }>(
        BACKEND_URL,
        insuranceData
      );
    } else {
    //  console.log("from put",insuranceId);
      return this.http.put<{ message: string; insurance: Insurance }>(
        BACKEND_URL + insuranceId,
        insuranceData
      );
    }
  }
  getAllInsurances() {
    this.http
      .get<{ message: string; insuranceList: any; insuranceCount: number }>(
        BACKEND_URL
      )
      .subscribe(responseData => {
        this.insuranceList = responseData.insuranceList.map(insurance => {
          return {
            id: insurance._id,
            ...insurance
          };
        });
        this.insuranceListUpdated.next({
          insuranceList: [...this.insuranceList]
        });
      });
  }
  getInsuranceById(insId: string) {
    return this.http.get<Insurance>(BACKEND_URL + insId);
  }
  getInsuranceListUpdateListener() {
    return this.insuranceListUpdated.asObservable();
  }
  editInsuranceDetails(insId: string, insuranceData: any) {
    return this.http.put<{ message: string; insurance: Insurance }>(BACKEND_URL + insId, insuranceData);
  }
  submitInsuranceDetails(insId: string) {
    const insuranceData = {
      isFormComplete: 3
    };
    return this.http.post<{ message: string; insurance: Insurance }>(BACKEND_URL + insId + '/submit', insuranceData);
  }
}
