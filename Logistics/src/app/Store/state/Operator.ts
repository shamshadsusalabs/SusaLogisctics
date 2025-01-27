import { Action, Selector, State, StateContext } from "@ngxs/store";
import { Injectable } from "@angular/core";
import { catchError, tap } from "rxjs/operators";
import { of } from "rxjs";
import { Operator, OperatorResponse } from "../../Modals/operator";
import { OperatorService } from "../../Service/operator.service";
import { getAllOperator, selectedOperator } from "../action/operator";

export interface OperatorStateModel {
  operators: Operator[];
  selectedOperator: Operator | null;
}

@State<OperatorStateModel>({
  name: 'operators',
  defaults: {
    operators: [],
    selectedOperator: null,
  }
})

@Injectable()
export class OperatorState {
  constructor(private operatorService: OperatorService) {}

  // Selector to get the operators list
  @Selector()
  static getOperatorsList(state: OperatorStateModel): Operator[] {
    return state.operators;
  }

  // Selector to get the selected operator
  @Selector()
  static getSelectedOperator(state: OperatorStateModel): Operator | null {
    return state.selectedOperator;
  }

  // Fetch all operators from the API
  @Action(getAllOperator)
  fetchOperators({ getState, setState }: StateContext<OperatorStateModel>) {
    console.log("Fetching operators...");
    return this.operatorService.getAllOperators().pipe(
      tap((res: OperatorResponse) => {
        if (res?.data?.length) {
          console.log("Operators fetched successfully:", res.data);
          const state = getState();
          setState({
            ...state,
            operators: res.data, // Update operators in the state
          });
        } else {
          console.warn("No operators found in the response.");
        }
      }),
      catchError((error) => {
        console.error("Error fetching operators", error);
        return of([]); // Return an empty array to maintain stability
      })
    );
  }

  // Set the selected operator by ID
  @Action(selectedOperator)
  setSelectedOperator({ getState, setState }: StateContext<OperatorStateModel>, { _id }: selectedOperator) {
    console.log('Setting selected operator with ID:', _id);
    const state = getState();

    // Ensure the operator list is loaded before selecting
    const selectedOperator = state.operators.find(operator => operator._id === _id) || null;

    if (!selectedOperator) {
      console.warn(`Operator with ID ${_id} not found.`);
    } else {
      console.log("Selected Operator:", selectedOperator);
    }

    setState({
      ...state,
      selectedOperator, // Update the state with the selected operator
    });
  }
}
