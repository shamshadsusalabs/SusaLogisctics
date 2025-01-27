import { Component, OnInit, OnDestroy } from '@angular/core';
import { getVehicalByVendorId } from '../../Store/action/vehical';
import { VehicleState } from '../../Store/state/vehical';
import { Vehicle } from '../../Modals/vehical';
import { map, Observable, Subscription } from 'rxjs';
import { Store } from '@ngxs/store';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-all-vehicals',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './all-vehicals.component.html',
  styleUrls: ['./all-vehicals.component.css']
})
export class AllVehicalsComponent implements OnInit, OnDestroy {
  vehicles$: Observable<Vehicle[]> | undefined; // Observable for vehicles
  filteredVehicles: Vehicle[] = []; // Array for filtered vehicles
  private allVehicles: Vehicle[] = []; // Store all vehicles for filtering
  searchText: string = ''; // Search input text
  statusFilters = ['Available', 'In Transit', 'Under Maintenance', 'Unavailable']; // Status filter buttons
  activeStatusFilter: string | null = null; // Currently selected status filter
  private alreadyDispatched = false; // Flag to avoid redundant API call
  private vehiclesSubscription: Subscription | undefined; // Subscription to handle unsubscription

  constructor(private store: Store) {}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const vendorId = user._id; // Retrieve vendor ID from local storage

    if (vendorId) {
      // Fetch vehicles from state or API
      this.vehicles$ = this.store.select(VehicleState.getVehiclesByVendorId).pipe(
        map(selector => selector(vendorId))
      );

      // Fetch data if not already available in the state
      this.vehiclesSubscription = this.vehicles$.subscribe(vehicles => {
        if (!vehicles || vehicles.length === 0) {
          if (!this.alreadyDispatched) {
            this.alreadyDispatched = true; // Prevent redundant API call
            console.log('Fetching vehicles from API...');
            this.store.dispatch(new getVehicalByVendorId(vendorId)).subscribe(
              () => {
                console.log('Vehicles fetched successfully.');
                this.updateVehiclesFromState();
              },
              (error) => {
                console.error('Failed to fetch vehicles:', error);
              }
            );
          }
        } else {
          console.log('Using cached vehicles from state.');
          this.allVehicles = vehicles;
          this.filteredVehicles = vehicles; // Initialize filtered list
        }
      });
    } else {
      console.error('Vendor ID not found in local storage!');
    }
  }

  // Update filtered vehicles whenever search input changes
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

  // Update vehicles from state after the API call
  private updateVehiclesFromState(): void {
    this.store.select(VehicleState.getVehiclesByVendorId).pipe(
      map(selector => selector(JSON.parse(localStorage.getItem('user') || '{}')._id))
    ).subscribe(vehicles => {
      this.allVehicles = vehicles;
      this.filteredVehicles = vehicles;
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe to avoid memory leaks
    if (this.vehiclesSubscription) {
      this.vehiclesSubscription.unsubscribe();
    }
  }
}
