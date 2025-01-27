export interface VehicleOrder {
  _id: string;
  vehicleName: string;
  vehicleNumber: string;
  vehicleId: string; // Reference to Vehicle schema
  ratePerKilometer: number;
  pickupLocation: string;
  dropLocation: string;
  totalKilometer: number;
  vendorId: string; // Reference to Vendor schema
  vendorName: string;
  vendorContactNumber: string;
  driverName: string;
  driverContact: string;
  driverId: string; // Reference to Driver schema
  lastServicedDate?: string; // Optional as it might not always be provided
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;

}

export interface VehicleOrderResponse {
  message:string,
  data:VehicleOrder[]
}
