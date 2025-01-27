export interface Vehicle {
  vehicleName: string;
  vehicleNumber: string;
  insuranceImage: string;
  insuranceNumber: string;
  dimensions: {
    length: number;
    breadth: number;
  };
  speed: {
    kilometerPerHour: number;
  };
  ratePerKilometer: number;
  image?: string; // Optional
  additionalDetails?: {
    color?: string; // Optional
    fuelType?: string; // Optional
  };
  vendorId: string;
  vendorName: string;
  vendorContactNumber: string;
  driverName?: string; // Optional
  driverContact?: string; // Optional
  status: 'Available' | 'In Transit' | 'Under Maintenance' | 'Unavailable';
  location: string;
  capacity: number;
  lastServicedDate?: string; // Optional (ISO date string)
}


export interface VehicleResponse{

    meessag: string;
    data: Vehicle[];

}
