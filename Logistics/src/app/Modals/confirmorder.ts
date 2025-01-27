

// Define the interface for the Confirm Order data
export interface Vehicle {
  vehicleNumber: string;
  vehicleName: string;
  driverName: string;
  driverContactNumber: string;
  driverNumber: string;
  capacity: string;
}

export interface ConfirmOrder {
  pickupLocation: string;
  dropLocation: string;
  partnerId:string;
  totalKilometer:number
  vehicles: Vehicle[];
  // Optional status field, default to 'pending' if not provided
}

export interface ConfirmOrderResponse {
  orderDate: string; // Date as string (ISO format)
  invoiceUrl: string; // URL to the invoice
}

// invoice.model.ts

export interface vendorVehicle {
  _id: string;
  vehicleNumber: string;
  vehicleName: string;
  driverName: string;
  driverContactNumber: string;
  driverNumber: string;
  capacity: string;
  ratePerKilometer: number;
  RatePerkilometerAdmin: string;
  vendorId: string;
}

export interface VendorInvoice {
  _id: string;
  pickupLocation: string;
  dropLocation: string;
  totalKilometer: number;
  partnerId: string;
  vehicles: vendorVehicle[];
  invoiceUrl: string;
  orderDate: string; // You can use Date type if you prefer Date handling
  __v: number;
}

