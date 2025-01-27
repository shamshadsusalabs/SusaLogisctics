import { ChangeDetectorRef, Component } from '@angular/core';
import { OperatorService } from '../../Service/operator.service';
import { Operator } from '../../Modals/operator';
import { Subject, takeUntil } from 'rxjs';
import { Store } from '@ngxs/store';
import { Router } from '@angular/router';
import { OperatorState } from '../../Store/state/Operator';
import { getAllOperator } from '../../Store/action/operator';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-operator',
  imports: [CommonModule,FormsModule],
  templateUrl: './operator.component.html',
  styleUrl: './operator.component.css'
})
export class OperatorComponent {
  operators: Operator[] = [];
  searchText: string = '';
  page: number = 1;
  pageSize: number = 5;
  totalPages: number = 1;
  loading: boolean = false;
  errorMessage: string = '';

  private destroy$ = new Subject<void>();  // Subject for unsubscription

  constructor(
    private store: Store,
    private operatorService:OperatorService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}
  ngOnInit(): void {
    let alreadyDispatched = false; // Flag to ensure action is dispatched only once

    this.store.select(OperatorState.getOperatorsList)
      .pipe(takeUntil(this.destroy$)) // Automatically unsubscribe when the component is destroyed
      .subscribe((operators: Operator[]) => {
        if (!alreadyDispatched && (!operators || operators.length === 0)) {
          alreadyDispatched = true; // Mark as dispatched
          this.loading = true;
          this.store.dispatch(new getAllOperator()).subscribe(
            () => (this.loading = false), // Stop loading spinner when successful
            (error) => {
              this.loading = false; // Stop loading spinner on error
              this.errorMessage = 'Failed to load operators';
              console.error(error);
            }
          );
        } else {
          this.operators = operators || [];
          this.updatePagination();
        }
      });
  }


  filteredOperator(): Operator[] {
    const filtered = this.operators.filter((operator) =>
      operator.name?.toLowerCase().includes(this.searchText.toLowerCase())
    );
    this.updatePagination(filtered.length);
    return filtered.slice((this.page - 1) * this.pageSize, this.page * this.pageSize);
  }

  sortTable(key: keyof Operator): void {
    this.operators.sort((a, b) => {
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

  viewOperator(operatorId: string): void {
    this.router.navigate(['/Super-Admin-dashboard/operator-selectedoperator', operatorId]);
  }

  toggleApprovalStatus(_id: string, currentStatus: boolean): void {
    const newStatus = !currentStatus;
    this.operatorService.updateApprovalStatus(_id, newStatus).subscribe(
      (response) => {
        console.log('Approval status updated:', response);
        const index = this.operators.findIndex((operator) => operator._id === _id);
        if (index > -1) {
          this.operators[index].approved = newStatus;
          this.cdr.detectChanges();
        }
      },
      (error) => console.error('Failed to update approval status:', error)
    );
  }

  private updatePagination(filteredCount: number = this.operators.length): void {
    this.totalPages = Math.ceil(filteredCount / this.pageSize);
  }

  ngOnDestroy(): void {
    // Unsubscribe to prevent memory leaks
    this.destroy$.next();
    this.destroy$.complete();
  }

}
