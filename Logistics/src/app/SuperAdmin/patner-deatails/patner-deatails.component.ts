import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Vendor } from '../../Modals/vendor';
import { Store } from '@ngxs/store';
import { ActivatedRoute } from '@angular/router';
import { Patner } from '../../Modals/Partner';
import { selectedPatner } from '../../Store/action/patner';
import { PatnerState } from '../../Store/state/Patner';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-patner-deatails',
  imports: [CommonModule],
  templateUrl: './patner-deatails.component.html',
  styleUrl: './patner-deatails.component.css'
})
export class PatnerDeatailsComponent {
  selectedPatner$!: Observable< Patner | null>;

  constructor(
    private store: Store,
    private route: ActivatedRoute // Inject ActivatedRoute to get the route parameters
  ) {}

  ngOnInit(): void {
    console.log('PatnerDetailsComponent ngOnInit called');

    // Get the driver ID from the route snapshot
    const PatnerId = this.route.snapshot.paramMap.get('_id');
    console.log('Patner ID from route:', PatnerId);

    if (PatnerId) {
      // Dispatch the action to set the selected driver
      console.log('Dispatching selectedPatner action with ID:', PatnerId);
      this.store.dispatch(new selectedPatner(PatnerId));
    } else {
      console.log('No driver ID found in the route');
    }

    // Subscribe to the selected driver from the state
    this. selectedPatner$ = this.store.select( PatnerState.getSelectedPatner);
    console.log('Subscribed to selectedPatner$ observable:', this. selectedPatner$);
  }




}
