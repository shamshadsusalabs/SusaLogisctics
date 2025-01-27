import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PartnerVehicleOrder, VehicleOrder } from '../Modals/patnervehicalorder';
import { DriverCount } from './driver.service';

@Injectable({
  providedIn: 'root'
})
export class PatnerVehicalOrderService {

  private apiUrl = 'http://localhost:3000/api/v1/patnerVehicalOrder';

  constructor(private http: HttpClient) {}


  createVehicleOrder(order: PartnerVehicleOrder): Observable<PartnerVehicleOrder> {
    return this.http.post<PartnerVehicleOrder>(`${this.apiUrl}/create`, order);
  }


  getAllPartnerVehicleOrders(): Observable<PartnerVehicleOrder[]> {
    return this.http.get<PartnerVehicleOrder[]>(`${this.apiUrl}/getAll`);
  }

  getPartnerVehicleOrderById(id: string): Observable<PartnerVehicleOrder> {
    return this.http.get<PartnerVehicleOrder>(`${this.apiUrl}/${id}`);
  }

  updatePartnerVehicleOrder(id: string, order: PartnerVehicleOrder): Observable<PartnerVehicleOrder> {
    return this.http.put<PartnerVehicleOrder>(`${this.apiUrl}/${id}`, order);
  }

  deletePartnerVehicleOrder(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }


 getTotalorderCount(): Observable<DriverCount> {
          return this.http.get<DriverCount>(`${this.apiUrl}/total-count`); // Return an Observable of DriverResponse
        }




        getVehicleOrdersByPartnerId(partnerId: string): Observable<VehicleOrder[]> {
          return this.http.get<VehicleOrder[]>(`${this.apiUrl}/partner/${partnerId}`);
        }}
