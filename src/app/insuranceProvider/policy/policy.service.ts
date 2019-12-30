import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

const BACKEND_URL = 'http://localhost:3000/api/policy/';

@Injectable({ providedIn: 'root' })
export class PolicyService {
  policyList: any[];
  private policyListUpdated = new Subject<{ policyList: any[] }>();
  constructor(private http: HttpClient) {}
  addPolicy(formData: any) {
    return this.http.post<{message: string, policy: any} > (BACKEND_URL, formData);
  }
  getAllPolicy(listAll: boolean) {
    const getUrl = listAll ? BACKEND_URL + 'all': BACKEND_URL;
    this.http.get<{message: string, policyList: any, policyCount: number} > (getUrl).subscribe((responseData) => {
      this.policyList = responseData.policyList.map(policy => {
        return {
          id: policy._id,
          ...policy
        };
      });
      console.log(this.policyList);
      this.policyListUpdated.next({ policyList: [...this.policyList] });
    });
  }
  getPolicyListUpdateListener() {
    return this.policyListUpdated.asObservable();
  }
}
