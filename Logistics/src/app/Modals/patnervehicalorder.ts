export interface PartnerVehicleOrder {
  vehicleCount: number;
  orderDate: string; // Date of the order
  hubAddress: string; // Hub address associated with the order
  vehicleType: string; // Type of the vehicle
  capacity: number; // Capacity of the vehicle
  pickupLocation: string; // Location where the vehicle will pick up goods
  dropLocation: string; // Location where the vehicle will drop off goods
  partnerId: string; // ID of the partner (can be a reference to another model)
  partnerName: string; // Name of the partner
  partnerContactNumber: string; // Contact number of the partner
  isAccepted?: boolean;
  totalKilometer:number // Indicates whether the order is accepted (optional, default false)
}
// vehicle-order.model.ts
export interface VehicleOrder {
  _id: string;
  vehicleCount: number;
  orderDate: string;
  hubAddress: string;
  vehicleType: string;
  capacity: number;
  pickupLocation: string;
  dropLocation: string;
  partnerId: string;
  partnerName: string;
  partnerContactNumber: string;
  totalKilometer: number;
  isAccepted: boolean;
  __v: number;
}
