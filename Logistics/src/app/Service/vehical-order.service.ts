import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { VehicleOrder, VehicleOrderResponse } from '../Modals/vehicalorder';

@Injectable({
  providedIn: 'root'
})
export class VehicalOrderService {

  private baseUrl = 'http://localhost:3000/api/v1/vehicalorder'; // Backend API base URL

  constructor(private http: HttpClient) {}



  // Get all vehicle orders
  getAllVehicleOrders(): Observable<VehicleOrderResponse> {
    return this.http.get<VehicleOrderResponse>(`${this.baseUrl}/getAll`);
  }

  // Get a vehicle order by ID
  getVehicleOrderById(id: string): Observable<VehicleOrder> {
    return this.http.get<VehicleOrder>(`${this.baseUrl}/getById/${id}`);
  }

  // Update a vehicle order by ID
  updateVehicleOrder(id: string, orderData: Partial<VehicleOrder>): Observable<VehicleOrder> {
    return this.http.put<VehicleOrder>(`${this.baseUrl}/updateById/${id}`, orderData);
  }

  // Delete a vehicle order by ID
  deleteVehicleOrder(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/deletById/${id}`);
  }

}
