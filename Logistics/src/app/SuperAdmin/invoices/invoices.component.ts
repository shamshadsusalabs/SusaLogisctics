import { Component } from '@angular/core';
import { InvoiceService } from '../../Service/invoice.service';
import { ConfirmOrderResponse } from '../../Modals/confirmorder';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-invoices',
  imports: [CommonModule],
  templateUrl: './invoices.component.html',
  styleUrl: './invoices.component.css'
})
export class InvoicesComponent {
  orders: ConfirmOrderResponse[] = [];  // Array to hold the orders
  sortedOrders: ConfirmOrderResponse[] = []; // To store sorted orders
  isDescending: boolean = false; // Flag to track sorting order

  constructor(private invoiceService: InvoiceService) {}

  ngOnInit(): void {
    // Fetch the sorted orders when the component initializes
    this.invoiceService.getSortedOrders().subscribe(
      (response: ConfirmOrderResponse[]) => {
        this.orders = response;  // Assign the response to the orders array
        this.sortedOrders = [...this.orders]; // Initialize sorted orders
      },
      (error) => {
        console.error('Error fetching orders:', error);  // Handle error if any
      }
    );
  }

  // Method to toggle sorting by orderDate
  sortOrdersByDate(): void {
    this.isDescending = !this.isDescending; // Toggle the sorting order
    this.sortedOrders = this.orders.sort((a, b) => {
      const dateA = new Date(a.orderDate).getTime();
      const dateB = new Date(b.orderDate).getTime();
      return this.isDescending ? dateB - dateA : dateA - dateB;
    });
  }
}
