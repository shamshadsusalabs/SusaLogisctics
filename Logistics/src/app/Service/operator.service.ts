import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OperatorLogin, OperatorRegistaionForm, OperatorResponse } from '../Modals/operator';
import { Observable } from 'rxjs';
import { DriverCount } from './driver.service';

@Injectable({
  providedIn: 'root'
})
export class OperatorService {

  private apiUrl = 'http://localhost:3000/api/v1/operator'; // Replace with your actual backend URL

   constructor(private http: HttpClient) {}

   signup(data: OperatorRegistaionForm): Observable<any> {
     return this.http.post(`${this.apiUrl}/signup`, data);
   }


   login(data: OperatorLogin ): Observable<any> {
     return this.http.post(`${this.apiUrl}/login`, data);
   }

   logout(): Observable<any> {
     return this.http.post(`${this.apiUrl}/logout`, {});
   }

   refreshToken(data: any): Observable<any> {
     return this.http.post(`${this.apiUrl}/refresh-token`, data);
   }
   // Fetch all vendors
       getAllOperators(): Observable<OperatorResponse> {
         return this.http.get<OperatorResponse>(`${this.apiUrl}/getAlls`);
       }


       updateApprovalStatus(_id: string, isApproved: boolean): Observable<any> {
        const url = `${this.apiUrl}/approval/${_id}`;
        return this.http.put(url, { isApproved });
      }

       getTotalOperatorCount(): Observable<DriverCount> {
          return this.http.get<DriverCount>(`${this.apiUrl}/total-count`); // Return an Observable of DriverResponse
        }
}
