import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfirmOrderResponse, VendorInvoice } from '../Modals/confirmorder';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  private apiUrl = 'http://localhost:3000/api/v1/confirmorder/getAlls';  // Replace with your actual API URL

  constructor(private http: HttpClient) {}

  // Method to fetch sorted orders (orderDate and invoiceUrl)
  getSortedOrders(): Observable<ConfirmOrderResponse []> {
    return this.http.get<ConfirmOrderResponse []>(this.apiUrl);
  }
  private apiUrl1 = 'http://localhost:3000/api/v1/vendorInvoice/invoices/by-vendor/';
   // Method to fetch invoices by vendorId
   getInvoicesByVendorId(vendorId: string): Observable<VendorInvoice[]> {
    return this.http.get<VendorInvoice[]>(`${this.apiUrl1}${vendorId}`);
  }
}
