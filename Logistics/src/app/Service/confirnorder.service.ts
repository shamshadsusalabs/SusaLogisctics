import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfirmOrder } from '../Modals/confirmorder';
// order.model.ts
export interface Order {
  _id: string;
  invoiceUrl: string;
  orderDate: string;
}

export interface OrdersResponse {
  orders: Order[];
}


@Injectable({
  providedIn: 'root'
})
export class ConfirnorderService {
  private apiUrl = 'http://localhost:3000/api/v1/confirmorder'; // Replace PORT with your actual port number

  constructor(private http: HttpClient) {}

  // Method to create a new confirm order
  createConfirmOrder(order: ConfirmOrder): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, order);
  }



  // Method to fetch orders by partnerId
  getOrdersByPartnerId(partnerId: string): Observable<OrdersResponse> {
    return this.http.get<OrdersResponse>(`${this.apiUrl}/orders/${partnerId}`);
  }
}
