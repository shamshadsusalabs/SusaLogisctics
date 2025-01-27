import { Component } from '@angular/core';
import { ConfirnorderService, Order, OrdersResponse } from '../../Service/confirnorder.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-invoices',
  imports: [CommonModule,FormsModule],
  templateUrl: './invoices.component.html',
  styleUrl: './invoices.component.css'
})
export class InvoicesComponent {
  orders: Order[] = []; // To store fetched orders
  filteredOrders: Order[] = []; // To store filtered orders
  partnerId: string = ''; // Partner ID retrieved from localStorage
  loading: boolean = false; // For displaying loading state
  errorMessage: string = ''; // For displaying error messages
  searchQuery: string = ''; // For search functionality
  currentPage: number = 1; // Current page for pagination
  itemsPerPage: number = 5; // Number of items per page

  constructor(private orderService: ConfirnorderService) {}

  ngOnInit(): void {
    this.getPartnerIdFromLocalStorage();
    this.fetchOrders();
  }

  // Retrieve the partnerId from localStorage
  getPartnerIdFromLocalStorage(): void {
    try {
      const currUser = JSON.parse(localStorage.getItem('user') || '{}');
      this.partnerId = currUser?._id || ''; // Assuming '_id' is the key for partnerId
      console.log('Partner ID from localStorage:', this.partnerId);
    } catch (error) {
      console.error('Error parsing user data from localStorage:', error);
    }
  }

  // Fetch orders based on the partnerId
  fetchOrders(): void {
    if (this.partnerId) {
      this.loading = true;
      this.orderService.getOrdersByPartnerId(this.partnerId).subscribe({
        next: (data) => {
          console.log('Fetched data:', data); // Log the fetched data
          this.orders = Array.isArray(data.orders) ? data.orders : []; // Ensure it's an array
          this.filteredOrders = [...this.orders]; // Initialize filtered orders
          this.loading = false;
          console.log(this.orders);
        },
        error: (error) => {
          this.errorMessage = 'Failed to fetch orders. Please try again later.';
          console.error('Error fetching orders:', error);
          this.loading = false;
        },
      });
    } else {
      this.errorMessage = 'Partner ID not found in localStorage.';
      console.error(this.errorMessage);
    }
  }

  // Filter orders based on the search query
  onSearch(): void {
    this.filteredOrders = this.orders.filter(order =>
      order._id.includes(this.searchQuery) || // Match order ID
      order.invoiceUrl.includes(this.searchQuery) || // Match invoice URL
      order.orderDate.includes(this.searchQuery) // Match order date
    );
    this.currentPage = 1; // Reset to the first page after filtering
  }

  // Get paginated orders
  get paginatedOrders(): Order[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredOrders.slice(startIndex, startIndex + this.itemsPerPage);
  }

  // Handle page change
  onPageChange(page: number): void {
    this.currentPage = page;
  }

  // Calculate the total number of pages
  get totalPages(): number {
    return Math.ceil(this.filteredOrders.length / this.itemsPerPage);
  }
}
