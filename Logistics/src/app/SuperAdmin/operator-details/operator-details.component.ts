import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Operator } from '../../Modals/operator';
import { Store } from '@ngxs/store';
import { ActivatedRoute } from '@angular/router';

import { CommonModule } from '@angular/common';
import { selectedOperator } from '../../Store/action/operator';
import { OperatorState } from '../../Store/state/Operator';

@Component({
  selector: 'app-operator-details',
  imports: [CommonModule],
  templateUrl: './operator-details.component.html',
  styleUrl: './operator-details.component.css'
})
export class OperatorDetailsComponent {
  selectedOperator$!: Observable< Operator | null>;

  constructor(
    private store: Store,
    private route: ActivatedRoute // Inject ActivatedRoute to get the route parameters
  ) {}

  ngOnInit(): void {
    console.log('OperatorDetailsComponent ngOnInit called');

    // Get the driver ID from the route snapshot
    const OperatorId = this.route.snapshot.paramMap.get('_id');
    console.log('Operator ID from route:', OperatorId);

    if (OperatorId) {
      // Dispatch the action to set the selected driver
      console.log('Dispatching selectedOperator action with ID:', OperatorId);
      this.store.dispatch(new selectedOperator(OperatorId));
    } else {
      console.log('No driver ID found in the route');
    }

    // Subscribe to the selected driver from the state
    this. selectedOperator$ = this.store.select( OperatorState.getSelectedOperator);
    console.log('Subscribed to selectedOperator$ observable:', this. selectedOperator$);
  }




}
