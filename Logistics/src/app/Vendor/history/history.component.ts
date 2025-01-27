import { Component } from '@angular/core';
import { InvoiceService } from '../../Service/invoice.service';
import { VendorInvoice } from '../../Modals/confirmorder';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-history',
  imports: [CommonModule,FormsModule,  NgxPaginationModule,],
  templateUrl: './history.component.html',
  styleUrl: './history.component.css'
})
export class HistoryComponent {
  invoices: VendorInvoice[] = [];
  filteredInvoices: VendorInvoice[] = [];
  pagedInvoices: VendorInvoice[] = [];  // Invoices for the current page
  vendorId: string = '';  // Default to an empty string
  searchQuery: string = '';  // For search input
  page: number = 1;  // Current page for pagination
  itemsPerPage: number = 5;  // Number of items per page
  totalPages: number = 1;  // Total number of pages

  constructor(private invoiceService: InvoiceService) {}

  ngOnInit(): void {
    // Retrieve the user object from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');  // Assuming the user is stored as a JSON object

    // Extract the _id (vendorId) from the user object
    if (user && user._id) {
      this.vendorId = user._id;  // Set vendorId based on _id from user object in localStorage
      this.fetchInvoices();  // Fetch invoices after setting the vendorId
    } else {
      console.error('User not found in localStorage or no _id in user object');
    }
  }

  // Fetch invoices using the InvoiceService
  fetchInvoices(): void {
    if (this.vendorId) {
      this.invoiceService.getInvoicesByVendorId(this.vendorId).subscribe(
        (data) => {
          console.log(data);
          this.invoices = data;  // Store the fetched invoices
          this.filteredInvoices = data;  // Initially, show all invoices
          this.totalPages = Math.ceil(this.filteredInvoices.length / this.itemsPerPage); // Calculate total pages
          this.updatePagedInvoices(); // Set the current page's invoices
        },
        (error) => {
          console.error('Error fetching invoices:', error);
        }
      );
    }
  }

  // Filter invoices based on search input
  searchInvoices(): void {
    if (this.searchQuery) {
      this.filteredInvoices = this.invoices.filter(invoice =>
        invoice.pickupLocation.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        invoice.dropLocation.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        invoice.invoiceUrl.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      this.filteredInvoices = this.invoices;  // Reset the filter if searchQuery is empty
    }
    this.totalPages = Math.ceil(this.filteredInvoices.length / this.itemsPerPage); // Recalculate total pages
    this.updatePagedInvoices(); // Update current page's data
  }

  // Update the displayed invoices for the current page
  updatePagedInvoices(): void {
    const startIndex = (this.page - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.pagedInvoices = this.filteredInvoices.slice(startIndex, endIndex); // Slice the filtered invoices
  }

  // Change the current page and update the displayed invoices
  changePage(newPage: number): void {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.page = newPage;
      this.updatePagedInvoices(); // Update the current page's invoices
    }
  }
}
