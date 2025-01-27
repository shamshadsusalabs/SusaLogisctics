import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Driver } from '../../Modals/driver';
import { Store } from '@ngxs/store';
import { ActivatedRoute } from '@angular/router';
import { selectedDriver } from '../../Store/action/driver';
import { DriverState } from '../../Store/state/driver';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-driver-details',
  imports: [CommonModule],
  templateUrl: './driver-details.component.html',
  styleUrl: './driver-details.component.css'
})
export class DriverDetailsComponent {
  selectedDriver$!: Observable<Driver | null>;

  constructor(
    private store: Store,
    private route: ActivatedRoute // Inject ActivatedRoute to get the route parameters
  ) {}

  ngOnInit(): void {
    console.log('DriverDetailsComponent ngOnInit called');

    // Get the driver ID from the route snapshot
    const driverId = this.route.snapshot.paramMap.get('_id');
    console.log('Driver ID from route:', driverId);

    if (driverId) {
      // Dispatch the action to set the selected driver
      console.log('Dispatching selectedDriver action with ID:', driverId);
      this.store.dispatch(new selectedDriver(driverId));
    } else {
      console.log('No driver ID found in the route');
    }

    // Subscribe to the selected driver from the state
    this.selectedDriver$ = this.store.select(DriverState.getSelectedDriver);
    console.log('Subscribed to selectedDriver$ observable:', this.selectedDriver$);
  }
}
