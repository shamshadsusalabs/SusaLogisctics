import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngxs/store';
import { DriverState } from '../../Store/state/driver';
import { getAllDriver } from '../../Store/action/driver';
import { Driver } from '../../Modals/driver';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DriverService } from '../../Service/driver.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-driver',
  imports: [CommonModule, FormsModule],
  templateUrl: './driver.component.html',
  styleUrls: ['./driver.component.css']
})
export class DriverComponent implements OnInit, OnDestroy {
  drivers$!: Observable<Driver[]>;
  drivers: Driver[] = [];
  searchText: string = '';
  page: number = 1;
  pageSize: number = 5;
  totalPages: number = 1;
  loading: boolean = false;
  errorMessage: string = '';

  private destroy$ = new Subject<void>();

  constructor(private store: Store, private driverService: DriverService, private router: Router) {}

  ngOnInit(): void {
    let alreadyDispatched = false; // Flag to ensure action is dispatched only once

    this.drivers$ = this.store.select(DriverState.getDriverList);

    this.drivers$
      .pipe(takeUntil(this.destroy$))
      .subscribe((drivers: Driver[]) => {
        if (!alreadyDispatched && drivers.length === 0) {
          alreadyDispatched = true; // Mark as dispatched
          this.loading = true;
          this.store.dispatch(new getAllDriver()).subscribe(
            () => {
              this.loading = false; // Stop the loading spinner
            },
            (error) => {
              this.loading = false; // Stop the loading spinner on error
              this.errorMessage = 'Failed to load drivers';
              console.error(error);
            }
          );
        } else {
          this.drivers = drivers;
          this.totalPages = Math.ceil(this.drivers.length / this.pageSize);
        }
      });
  }


  ngOnDestroy(): void {
    // Complete the destroy$ subject to unsubscribe from all subscriptions
    this.destroy$.next();
    this.destroy$.complete();
  }

  filteredDrivers(): Driver[] {
    const filtered = this.drivers.filter((driver) =>
      driver.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
    this.totalPages = Math.ceil(filtered.length / this.pageSize);
    return filtered.slice((this.page - 1) * this.pageSize, this.page * this.pageSize);
  }

  sortTable(key: keyof Driver): void {
    this.drivers.sort((a, b) => {
      if (a[key] < b[key]) return -1;
      if (a[key] > b[key]) return 1;
      return 0;
    });
  }

  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
    }
  }

  prevPage(): void {
    if (this.page > 1) {
      this.page--;
    }
  }

  toggleApprovalStatus(_id: string, currentStatus: boolean): void {
    const newStatus = !currentStatus;
    this.driverService.updateApprovalStatus(_id, newStatus).subscribe(
      (response) => {
        console.log('Approval status updated:', response);
        const driverIndex = this.drivers.findIndex(driver => driver._id === _id);
        if (driverIndex > -1) {
          this.drivers[driverIndex].approved = newStatus;
        }
      },
      (error) => {
        console.error('Failed to update approval status:', error);
      }
    );
  }

  viewDriver(driverId: string): void {
    this.router.navigate(['/Super-Admin-dashboard/driver-selectedDriver', driverId]);
  }

  deleteDriver(driverId: string): void {
    console.log(`View driver with ID: ${driverId}`);
  }
}
