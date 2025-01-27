import { Component } from '@angular/core';
import { Vendor } from '../../Modals/vendor';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { ActivatedRoute } from '@angular/router';
import { selectedVendor } from '../../Store/action/vendor';
import { VendorState } from '../../Store/state/vendor';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vendor-details',
  imports: [CommonModule],
  templateUrl: './vendor-details.component.html',
  styleUrl: './vendor-details.component.css'
})
export class VendorDetailsComponent {
  selectedVendor$!: Observable< Vendor | null>;

  constructor(
    private store: Store,
    private route: ActivatedRoute // Inject ActivatedRoute to get the route parameters
  ) {}

  ngOnInit(): void {
    console.log('vendorDetailsComponent ngOnInit called');

    // Get the driver ID from the route snapshot
    const vendorId = this.route.snapshot.paramMap.get('_id');
    console.log('vendor ID from route:', vendorId);

    if (vendorId) {
      // Dispatch the action to set the selected driver
      console.log('Dispatching selectedvendor action with ID:', vendorId);
      this.store.dispatch(new selectedVendor(vendorId));
    } else {
      console.log('No driver ID found in the route');
    }

    // Subscribe to the selected driver from the state
    this. selectedVendor$ = this.store.select( VendorState.getSelectedVendor);
    console.log('Subscribed to selectedvendor$ observable:', this. selectedVendor$);
  }


}
