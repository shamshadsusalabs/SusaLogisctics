import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vendor, VendorRegistaionForm, VendorResponse, VendorResponseUpdate, VendorUpdate} from '../Modals/vendor';
import { VendorLogin } from '../Modals/login';

@Injectable({
  providedIn: 'root'
})
export class VendorService {
  private apiUrl = 'http://localhost:3000/api/v1/vendor'; // Replace with your actual backend URL

  constructor(private http: HttpClient) {}

  signup(data: VendorRegistaionForm): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, data);
  }


  login(data: VendorLogin): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data);
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {});
  }

  refreshToken(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/refresh-token`, data);
  }



    // Fetch all vendors
    getAllVendors(): Observable<VendorResponse> {
      return this.http.get<VendorResponse>(`${this.apiUrl}/getAlls`);
    }

    updateApprovalStatus(_id: string, isApproved: boolean): Observable<any> {
      const url = `${this.apiUrl}/approval/${_id}`;
      return this.http.put(url, { isApproved });
    }


    getVendorById(_id: string): Observable<VendorResponseUpdate> {
      return this.http.get<VendorResponseUpdate>(`${this.apiUrl}/getbyId/${_id}`);
    }


    updateVendor(formData: FormData,_id: string): Observable<VendorResponseUpdate> {
      return this.http.put<VendorResponseUpdate>(`${this.apiUrl}/updateVendor/${_id}`, formData);
    }

}
