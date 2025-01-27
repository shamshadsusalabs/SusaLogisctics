import { Component, OnInit, OnDestroy } from '@angular/core';
import { Vehicle } from '../../Modals/vehical';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngxs/store';
import { VehicleState } from '../../Store/state/vehical';
import { getAllVehical } from '../../Store/action/vehical';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-all-vehicals',
  imports: [CommonModule,FormsModule],
  templateUrl: './all-vehicals.component.html',
  styleUrls: ['./all-vehicals.component.css']
})
export class AllVehicalsComponent implements OnInit, OnDestroy {
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
    let alreadyDispatched = false; // Flag to ensure action is dispatched only once

    this.vehiclesSubscription = this.vehicles$.subscribe((vehicles) => {
      if (!alreadyDispatched && vehicles.length === 0) {
        alreadyDispatched = true; // Mark as dispatched
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
