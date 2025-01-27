import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Vehicle, VehicleResponse } from '../Modals/vehical';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VehicalService {

  private apiUrl = 'http://localhost:3000/api/v1/vehical'; // Base API URL

  constructor(private http: HttpClient) {}

 // Method to create a vehicle
createVehicle(formData: FormData): Observable<{ message: string; vehicle: Vehicle }> {
  return this.http.post<{ message: string; vehicle: Vehicle }>(`${this.apiUrl}/add-vehical`, formData, {

  });
}


  // Method to get all vehicles
  getVehicles(): Observable<VehicleResponse> {
    return this.http.get<VehicleResponse>(`${this.apiUrl}/getAlls`);
  }

  getVehiclesAvaialable(): Observable<VehicleResponse> {
    return this.http.get<VehicleResponse>(`${this.apiUrl}/available`);
  }




  // Method to get vehicles by vendor ID
  getVehiclesByVendorId(vendorId: string): Observable<VehicleResponse> {
    return this.http.get<VehicleResponse>(`${this.apiUrl}/vendorID/${vendorId}`);
  }
  // Method to get a vehicle by ID
  getVehicleById(id: string): Observable<Vehicle> {
    return this.http.get<Vehicle>(`${this.apiUrl}/${id}`);
  }

  // Method to update a vehicle
  updateVehicle(id: string, vehicle: Vehicle): Observable<{ message: string; vehicle: Vehicle }> {
    return this.http.put<{ message: string; vehicle: Vehicle }>(`${this.apiUrl}/${id}`, vehicle, {

    });
  }

  // Method to delete a vehicle
  deleteVehicle(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}
