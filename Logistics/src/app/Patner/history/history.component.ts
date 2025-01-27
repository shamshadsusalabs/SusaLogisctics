import { Component } from '@angular/core';
import { VehicleOrder } from '../../Modals/patnervehicalorder';
import { PatnerVehicalOrderService } from '../../Service/patner-vehical-order.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-history',
  imports: [CommonModule,FormsModule],
  templateUrl: './history.component.html',
  styleUrl: './history.component.css'
})
export class HistoryComponent {
  vehicleOrders: VehicleOrder[] = [];
  filteredOrders: VehicleOrder[] = [];
  partnerId: string = '';
  searchQuery: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5;
  sortField: keyof VehicleOrder | '' = '';
  sortOrder: 'asc' | 'desc' = 'asc';

  Math = Math; // Expose Math object to the template

  constructor(private vehicleOrderService: PatnerVehicalOrderService) {}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.partnerId = user._id;
    this.fetchVehicleOrders();
  }

  fetchVehicleOrders(): void {
    this.vehicleOrderService.getVehicleOrdersByPartnerId(this.partnerId).subscribe({
      next: (orders) => {
        this.vehicleOrders = orders;
        this.filteredOrders = orders;
      },
      error: (err) => {
        console.error('Error fetching vehicle orders:', err);
      },
    });
  }

  searchOrders(): void {
    this.filteredOrders = this.vehicleOrders.filter((order) =>
      Object.values(order).some((value) =>
        value.toString().toLowerCase().includes(this.searchQuery.toLowerCase())
      )
    );
    this.currentPage = 1;
  }

  sortOrders(field: keyof VehicleOrder): void {
    if (this.sortField === field) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortOrder = 'asc';
    }

    this.filteredOrders.sort((a, b) => {
      const valueA = a[field];
      const valueB = b[field];
      if (valueA < valueB) return this.sortOrder === 'asc' ? -1 : 1;
      if (valueA > valueB) return this.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }

  get paginatedOrders(): VehicleOrder[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredOrders.slice(start, end);
  }

  changePage(page: number): void {
    this.currentPage = page;
  }
}
