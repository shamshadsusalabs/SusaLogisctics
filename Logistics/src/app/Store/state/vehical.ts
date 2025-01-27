import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Vehicle, VehicleResponse } from '../../Modals/vehical';
import { getAllVehical, getVehicalByVendorId } from '../action/vehical';
import { catchError, of, tap } from 'rxjs';
import { VehicalService } from '../../Service/vehical.service';
import { Injectable } from '@angular/core';

export interface VehicleStateModel {
  vehicles: Vehicle[]; // Array to hold all vehicles
  vehiclesByVendorId: { [key: string]: Vehicle[] }; // Store vehicles by vendor ID
}

@State<VehicleStateModel>({
  name: 'vehicleState',
  defaults: {
    vehicles: [],
    vehiclesByVendorId: {}, // Initial empty object to store vehicles by vendor ID
  }
})
@Injectable()
export class VehicleState {
  constructor(private vehicalService: VehicalService) {}

  @Selector()
  static getVehicles(state: VehicleStateModel): Vehicle[] {
    return state.vehicles;
  }

  @Selector()
  static getVehiclesByVendorId(state: VehicleStateModel): (vendorId: string) => Vehicle[] {
    return (vendorId: string) => state.vehiclesByVendorId[vendorId] || [];
  }

  @Action(getAllVehical)
  fetchVehicles({ getState, setState }: StateContext<VehicleStateModel>) {
    console.log("Fetching all vehicles...");
    return this.vehicalService.getVehicles().pipe(
      tap((res: VehicleResponse) => {
        const state = getState();
        setState({
          ...state,
          vehicles: res.data, // Update vehicles array in state
        });
      }),
      catchError(error => {
        console.error('Error fetching vehicles', error);
        return of([]); // Return empty array in case of error
      })
    );
  }

  @Action(getVehicalByVendorId)
  fetchVehiclesByVendorId(
    { getState, setState }: StateContext<VehicleStateModel>,
    { id }: getVehicalByVendorId
  ) {
    console.log(`Fetching vehicles for Vendor ID: ${id}`);
    return this.vehicalService.getVehiclesByVendorId(id).pipe(
      tap((res: VehicleResponse) => {
        const state = getState();
        setState({
          ...state,
          vehiclesByVendorId: {
            ...state.vehiclesByVendorId,
            [id]: res.data, // Store vehicles for the specific vendor ID
          },
        });
        console.log(`Vehicles for Vendor ID ${id} set in state:`, res.data);
      }),
      catchError(error => {
        console.error(`Error fetching vehicles for Vendor ID ${id}`, error);
        return of([]); // Return empty array in case of error
      })
    );
  }
}
