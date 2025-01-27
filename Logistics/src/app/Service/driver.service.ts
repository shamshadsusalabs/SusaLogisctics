import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Driver, DriverResponse } from '../Modals/driver';
// driver-response.interface.ts
export interface DriverCount {
  message: string;  // The message string
  data: {
    count: number; // The count of drivers
  };
}

@Injectable({
  providedIn: 'root'
})
export class DriverService {

  private apiUrl = 'http://localhost:3000/api/v1/driver'; // Replace with your actual backend URL

  constructor(private http: HttpClient) { }

  // Sign up a driver
  signUpDriver(driverData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, driverData);
  }

  // Send OTP to driver
  sendOTP(phoneNumber: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/send-otp`, { phoneNumber });
  }

  // Verify OTP and log in the driver
  verifyOTPAndLogin(otpData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, otpData);
  }

  // Refresh the access token using the refresh token
  refreshToken(refreshToken: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/refresh-token`, { refreshToken });
  }

  // Update driver details (with file upload)
  updateDriver(driverId: string, formData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${driverId}`, formData);
  }

  // Log out the driver
  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {});
  }

  //getAll
    getAllDrivers(): Observable<DriverResponse> {
    return this.http.get< DriverResponse>(`${this.apiUrl}/getAll`);
  }


  updateApprovalStatus(_id: string, isApproved: boolean): Observable<any> {
    const url = `${this.apiUrl}/approval/${_id}`;
    return this.http.put(url, { isApproved });
  }

  getTotalDriverCount(): Observable<DriverCount> {
    return this.http.get<DriverCount>(`${this.apiUrl}/total-count`); // Return an Observable of DriverResponse
  }
}
