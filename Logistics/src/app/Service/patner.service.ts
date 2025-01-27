import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PatnerRegistaionForm, PatnerResponse, PatnerResponseUpdate } from '../Modals/Partner';
import { PatnerLogin } from '../Modals/login';

@Injectable({
  providedIn: 'root'
})
export class PatnerService {
 private apiUrl = 'http://localhost:3000/api/v1/patner'; // Replace with your actual backend URL

  constructor(private http: HttpClient) {}

  signup(data: PatnerRegistaionForm): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, data);
  }


  login(data: PatnerLogin): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data);
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {});
  }

  refreshToken(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/refresh-token`, data);
  }



    // Fetch all Patners
    getAllPatners(): Observable<PatnerResponse> {
      return this.http.get<PatnerResponse>(`${this.apiUrl}/getAlls`);
    }

    updateApprovalStatus(_id: string, isApproved: boolean): Observable<any> {
      const url = `${this.apiUrl}/approval/${_id}`;
      return this.http.put(url, { isApproved });
    }


    getPatnerById(_id: string): Observable<PatnerResponseUpdate> {
      return this.http.get<PatnerResponseUpdate>(`${this.apiUrl}/getbyId/${_id}`);
    }


    updatePatner(formData: FormData,_id: string): Observable<PatnerResponseUpdate> {
      return this.http.put<PatnerResponseUpdate>(`${this.apiUrl}/updatePatner/${_id}`, formData);
    }

}


