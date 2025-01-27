import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfirmOrder } from '../Modals/confirmorder';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VendorInvoiceService {

  private apiUrl = 'http://localhost:3000/api/v1/vendorInvoice'; // Replace PORT with your actual port number

   constructor(private http: HttpClient) {}

   // Method to create a new confirm order
   createConfirmOrder(order: ConfirmOrder): Observable<any> {
     return this.http.post(`${this.apiUrl}/create`, order);
   }
}
