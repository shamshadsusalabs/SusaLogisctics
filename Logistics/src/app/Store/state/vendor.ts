import { Action, Selector, State, StateContext } from "@ngxs/store";
import { Injectable } from "@angular/core";
import { catchError, tap } from "rxjs/operators";
import { of } from "rxjs";
import { Vendor, VendorResponse } from "../../Modals/vendor";
import { VendorService } from "../../Service/vendor.service";
import { getAllVendor, selectedVendor } from "../action/vendor";

export interface VendorStateModel {
  Vendors: Vendor[];
  selectedVendor: Vendor | null; // Selected vendor field in the state
}

@State<VendorStateModel>({
  name: "Vendors",
  defaults: {
    Vendors: [],
    selectedVendor: null, // Default to null when no vendor is selected
  },
})
@Injectable()
export class VendorState {
  constructor(private vendorService: VendorService) {}

  // Selector to get the vendor list
  @Selector()
  static getVendorList(state: VendorStateModel): Vendor[] {
    return state.Vendors;
  }

  // Selector to get the selected vendor
  @Selector()
  static getSelectedVendor(state: VendorStateModel): Vendor | null {
    return state.selectedVendor;
  }

  // Fetch vendors action
  @Action(getAllVendor)
  fetchVendors({ getState, setState }: StateContext<VendorStateModel>) {
    console.log("Fetching vendors...");
    return this.vendorService.getAllVendors().pipe(
      tap((res: VendorResponse) => {
        if (res?.data?.length) {
          console.log("Vendors fetched successfully:", res.data);
          const state = getState();
          setState({
            ...state,
            Vendors: res.data, // Populate vendors array in the state
          });
        } else {
          console.warn("No vendors found in the response");
        }
      }),
      catchError((error) => {
        console.error("Error fetching vendors", error);
        const state = getState();
        setState({
          ...state,
          Vendors: [], // Clear the vendors array on error
        });
        return of([]); // Return empty array to maintain stability
      })
    );
  }

  // Set selected vendor action
  @Action(selectedVendor)
  setSelectedVendor(
    { getState, setState }: StateContext<VendorStateModel>,
    { _id }: selectedVendor
  ) {
    console.log("Setting selected vendor with ID:", _id);
    const state = getState();

    // Find the selected vendor by ID
    const selectedVendor = state.Vendors.find((vendor) => vendor._id === _id) || null;

    if (!selectedVendor) {
      console.warn(`Vendor with ID ${_id} not found in the state.`);
    } else {
      console.log("Selected Vendor:", selectedVendor);
    }

    // Update the selected vendor in the state
    setState({
      ...state,
      selectedVendor,
    });
  }
}
