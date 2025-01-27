import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { Vendor } from '../../Modals/vendor';
import { Store } from '@ngxs/store';
import { Router } from '@angular/router';
import { VendorState } from '../../Store/state/vendor';
import { getAllVendor } from '../../Store/action/vendor';
import { VendorService } from '../../Service/vendor.service';
import { DriverService } from '../../Service/driver.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-vendor',
  imports: [CommonModule, FormsModule],
  templateUrl: './vendor.component.html',
  styleUrls: ['./vendor.component.css']
})
export class VendorComponent implements OnInit, OnDestroy {
  vendors: Vendor[] = [];
  searchText: string = '';
  page: number = 1;
  pageSize: number = 5;
  totalPages: number = 1;
  loading: boolean = false;
  errorMessage: string = '';

  private destroy$ = new Subject<void>();  // Subject for unsubscription

  constructor(
    private store: Store,
    private vendorService: VendorService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    let alreadyDispatched = false; // Flag to ensure action is dispatched only once

    this.store.select(VendorState.getVendorList)
      .pipe(takeUntil(this.destroy$)) // Automatically unsubscribe when the component is destroyed
      .subscribe((vendors: Vendor[]) => {
        if (!alreadyDispatched && (!vendors || vendors.length === 0)) {
          alreadyDispatched = true; // Mark as dispatched
          this.loading = true;
          this.store.dispatch(new getAllVendor()).subscribe(
            () => (this.loading = false), // Stop loading spinner when successful
            (error) => {
              this.loading = false; // Stop loading spinner on error
              this.errorMessage = 'Failed to load vendors';
              console.error(error);
            }
          );
        } else {
          this.vendors = vendors || [];
          this.updatePagination();
        }
      });
  }

  filteredVendor(): Vendor[] {
    const filtered = this.vendors.filter((vendor) =>
      vendor.name?.toLowerCase().includes(this.searchText.toLowerCase())
    );
    this.updatePagination(filtered.length);
    return filtered.slice((this.page - 1) * this.pageSize, this.page * this.pageSize);
  }

  sortTable(key: keyof Vendor): void {
    this.vendors.sort((a, b) => {
      const valA = a[key] ?? '';
      const valB = b[key] ?? '';
      return valA < valB ? -1 : valA > valB ? 1 : 0;
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

  viewVendor(vendorId: string): void {
    this.router.navigate(['/Super-Admin-dashboard/vendor-selectedventor', vendorId]);
  }

  toggleApprovalStatus(_id: string, currentStatus: boolean): void {
    const newStatus = !currentStatus;
    this.vendorService.updateApprovalStatus(_id, newStatus).subscribe(
      (response) => {
        console.log('Approval status updated:', response);
        const index = this.vendors.findIndex((vendor) => vendor._id === _id);
        if (index > -1) {
          this.vendors[index].approved = newStatus;
          this.cdr.detectChanges();
        }
      },
      (error) => console.error('Failed to update approval status:', error)
    );
  }

  private updatePagination(filteredCount: number = this.vendors.length): void {
    this.totalPages = Math.ceil(filteredCount / this.pageSize);
  }

  ngOnDestroy(): void {
    // Unsubscribe to prevent memory leaks
    this.destroy$.next();
    this.destroy$.complete();
  }
}
