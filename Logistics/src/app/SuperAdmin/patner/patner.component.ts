import { ChangeDetectorRef, Component } from '@angular/core';
import { Patner } from '../../Modals/Partner';
import { Subject, takeUntil } from 'rxjs';
import { Store } from '@ngxs/store';
import { Router } from '@angular/router';
import { PatnerState } from '../../Store/state/Patner';
import { getAllPatner } from '../../Store/action/patner';
import { PatnerService } from '../../Service/patner.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-patner',
  imports: [FormsModule,ReactiveFormsModule,CommonModule],
  templateUrl: './patner.component.html',
  styleUrl: './patner.component.css'
})
export class PatnerComponent {
  Patners: Patner[] = [];
  searchText: string = '';
  page: number = 1;
  pageSize: number = 5;
  totalPages: number = 1;
  loading: boolean = false;
  errorMessage: string = '';

  private destroy$ = new Subject<void>();  // Subject for unsubscription

  constructor(
    private store: Store,
    private patnerService: PatnerService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    let alreadyDispatched = false; // Flag to ensure action is dispatched only once

    this.store.select(PatnerState.getPatnerList)
      .pipe(takeUntil(this.destroy$)) // Automatically unsubscribe when the component is destroyed
      .subscribe((Patners: Patner[]) => {
        if (!alreadyDispatched && (!Patners || Patners.length === 0)) {
          alreadyDispatched = true; // Mark as dispatched
          this.loading = true;
          this.store.dispatch(new getAllPatner()).subscribe(
            () => (this.loading = false), // Stop loading spinner when successful
            (error) => {
              this.loading = false; // Stop loading spinner on error
              this.errorMessage = 'Failed to load Patners';
              console.error(error);
            }
          );
        } else {
          this.Patners = Patners || [];
          this.updatePagination();
        }
      });
  }

  filteredPatner(): Patner[] {
    const filtered = this.Patners.filter((Patner) =>
      Patner.name?.toLowerCase().includes(this.searchText.toLowerCase())
    );
    this.updatePagination(filtered.length);
    return filtered.slice((this.page - 1) * this.pageSize, this.page * this.pageSize);
  }

  sortTable(key: keyof Patner): void {
    this.Patners.sort((a, b) => {
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

  viewPatner(PatnerId: string): void {
    this.router.navigate(['/Super-Admin-dashboard/patner-selectedpatner', PatnerId]);
  }

  toggleApprovalStatus(_id: string, currentStatus: boolean): void {
    const newStatus = !currentStatus;
    this.patnerService.updateApprovalStatus(_id, newStatus).subscribe(
      (response) => {
        console.log('Approval status updated:', response);
        const index = this.Patners.findIndex((Patner) => Patner._id === _id);
        if (index > -1) {
          this.Patners[index].approved = newStatus;
          this.cdr.detectChanges();
        }
      },
      (error) => console.error('Failed to update approval status:', error)
    );
  }

  private updatePagination(filteredCount: number = this.Patners.length): void {
    this.totalPages = Math.ceil(filteredCount / this.pageSize);
  }

  ngOnDestroy(): void {
    // Unsubscribe to prevent memory leaks
    this.destroy$.next();
    this.destroy$.complete();
  }


}
