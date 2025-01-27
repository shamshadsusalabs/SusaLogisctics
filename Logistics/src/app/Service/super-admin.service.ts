import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SuperAdminLogin } from '../Modals/login';

@Injectable({
  providedIn: 'root'
})
export class SuperAdminService {

  private apiUrl = 'http://localhost:3000/api/v1/superAdmin'; // Replace with your API URL

  constructor(private http: HttpClient) {}



  // Login
  login(credentials: SuperAdminLogin): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  // Signup
  signup(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, userData);
  }



  // Refresh Token
  refreshToken(): Observable<any> {
    return this.http.post(`${this.apiUrl}/refresh-token`, {});
  }

  // Logout
  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {});
  }



}
