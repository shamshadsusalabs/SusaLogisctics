import { Action, Selector, State, StateContext } from "@ngxs/store";
import { Driver, DriverResponse } from "../../Modals/driver";
import { Injectable } from "@angular/core";
import { getAllDriver, selectedDriver } from "../action/driver";
import { DriverService } from "../../Service/driver.service";
import { catchError, tap } from "rxjs";
import { of } from "rxjs";

export interface DriverStateModel {
  drivers: Driver[];
  selectedDriver: Driver | null; // Add selected driver field to the state
}

@State<DriverStateModel>({
  name: 'drivers',
  defaults: {
    drivers: [],
    selectedDriver: null, // Default to null when no driver is selected
  }
})

@Injectable()
export class DriverState {

  constructor(private driverService: DriverService) {}

  @Selector()
  static getDriverList(state: DriverStateModel): Driver[] {
    return state.drivers;
  }

  @Selector()
  static getSelectedDriver(state: DriverStateModel): Driver | null {
    return state.selectedDriver;
  }

  @Action(getAllDriver)
  getDrivers({ getState, setState }: StateContext<DriverStateModel>) {
    console.log("Fetching drivers...");
    return this.driverService.getAllDrivers().pipe(
      tap((res: DriverResponse) => {
        const state = getState();
        setState({
          ...state,
          drivers: res.data // Update the drivers array
        });
      }),
      catchError(error => {
        console.error('Error fetching drivers', error); // Handle the error
        return of([]); // Return empty array to maintain app stability
      })
    );
  }

  @Action(selectedDriver)
  setSelectedDriver({ getState, setState }: StateContext<DriverStateModel>, { _id }: selectedDriver) {
    console.log('Setting selected driver with ID:', _id);
    const state = getState();
    const selectedDriver = state.drivers.find(driver => driver._id === _id) || null;
    console.log('Selected driver:', selectedDriver);

    setState({
      ...state,
      selectedDriver // Set the selected driver in the state
    });
  }
}
