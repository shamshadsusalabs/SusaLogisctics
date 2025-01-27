import { Action, Selector, State, StateContext } from "@ngxs/store";
import { Injectable } from "@angular/core";
import { catchError, tap } from "rxjs";
import { of } from "rxjs";
import { Vendor, VendorResponse } from "../../Modals/vendor";
import { VendorService } from "../../Service/vendor.service";
import { getAllVendor, selectedVendor } from "../action/vendor";
import { Patner, PatnerResponse } from "../../Modals/Partner";
import { getAllPatner, selectedPatner } from "../action/patner";
import { PatnerService } from "../../Service/patner.service";

export interface PatnerStateModel {
  Patners: Patner[];
  selectedPatner: Patner | null; // Add selected driver field to the state
}

@State<PatnerStateModel>({
  name: 'Patners',
  defaults: {
    Patners: [],
    selectedPatner: null, // Default to null when no driver is selected
  }
})

@Injectable()
export class PatnerState {

  constructor(private patnerService: PatnerService) {}

  @Selector()
  static getPatnerList(state: PatnerStateModel): Patner[] {
    return state.Patners;
  }

  @Selector()
  static getSelectedPatner(state: PatnerStateModel): Patner | null {
    return state.selectedPatner;
  }

  @Action(getAllPatner)
  fetchPatners({ getState, setState }: StateContext<PatnerStateModel>) {
    console.log("Fetching Patners...");
    return this.patnerService.getAllPatners().pipe(
      tap((res: PatnerResponse) => {
        console.log("tap response",res);
        const state = getState();
        setState({
          ...state,
          Patners: res.data, // Update the Patners array
        });
      }),
      catchError(error => {
        console.error('Error fetching Patners', error); // Handle the error
        return of([]); // Return empty array to maintain app stability
      })
    );
  }

  @Action(selectedPatner)
  setSelectedPatner({ getState, setState }: StateContext<PatnerStateModel>, { _id }: selectedPatner) {
    console.log('Setting selected Patner with ID:', _id);
    const state = getState();
    const selectedPatner = state.Patners.find(Patner => Patner._id === _id) || null;
    console.log('Selected Patner:', selectedPatner);

    setState({
      ...state,
      selectedPatner, // Set the selected Patner in the state
    });
  }

}
