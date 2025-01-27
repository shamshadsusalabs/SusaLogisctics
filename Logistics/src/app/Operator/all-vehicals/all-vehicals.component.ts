import { Component } from '@angular/core';
import { Vehicle } from '../../Modals/vehical';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngxs/store';
import { VehicleState } from '../../Store/state/vehical';
import { getAllVehical } from '../../Store/action/vehical';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-all-vehicals',
  imports: [FormsModule,CommonModule],
  templateUrl: './all-vehicals.component.html',
  styleUrl: './all-vehicals.component.css'
})
export class AllVehicalsComponent {
  vehicles$: Observable<Vehicle[]>;
  filteredVehicles: Vehicle[] = [];
  private allVehicles: Vehicle[] = [];
  searchText: string = '';
  private vehiclesSubscription!: Subscription;
  statusFilters = ['Available', 'In Transit', 'Under Maintenance', 'Unavailable'];
  activeStatusFilter: string | null = null; // Stores the currently selected status

  constructor(private store: Store) {
    this.vehicles$ = this.store.select(VehicleState.getVehicles);
  }

  ngOnInit(): void {
    this.vehiclesSubscription = this.vehicles$.subscribe((vehicles) => {
      if (vehicles.length === 0) {
        this.store.dispatch(new getAllVehical());
      } else {
        this.allVehicles = vehicles;
        this.filteredVehicles = vehicles;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.vehiclesSubscription) {
      this.vehiclesSubscription.unsubscribe();
    }
  }

  // Filter by search text
  onSearchChange(): void {
    this.applyFilters();
  }

  // Filter by status
  filterByStatus(status: string | null): void {
    this.activeStatusFilter = status;
    this.applyFilters();
  }

  // Apply all filters
  private applyFilters(): void {
    this.filteredVehicles = this.allVehicles.filter((vehicle) => {
      const matchesSearchText = this.searchText
        ? vehicle.vehicleName.toLowerCase().includes(this.searchText.toLowerCase()) ||
          vehicle.vehicleNumber.toLowerCase().includes(this.searchText.toLowerCase()) ||
          vehicle.vendorName.toLowerCase().includes(this.searchText.toLowerCase())
        : true;

      const matchesStatus = this.activeStatusFilter
        ? vehicle.status === this.activeStatusFilter
        : true;

      return matchesSearchText && matchesStatus;
    });
  }


}
