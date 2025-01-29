import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PartnerVehicleOrder } from '../../Modals/patnervehicalorder';
import { PatnerVehicalOrderService } from '../../Service/patner-vehical-order.service';
import { Vehicle, VehicleResponse } from '../../Modals/vehical';
import { VehicalService } from '../../Service/vehical.service';
import { ConfirnorderService } from '../../Service/confirnorder.service';
import { ConfirmOrder } from '../../Modals/confirmorder';
import { VendorInvoiceService } from '../../Service/vendor-invoice.service';
import { TripService } from '../../Service/trip.service';

@Component({
  selector: 'app-vehicalrequest',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vehicalrequest.component.html',
  styleUrls: ['./vehicalrequest.component.css']
})
export class VehicalrequestComponent implements OnInit {
  vehicles: Vehicle[] = [];
  partnerVehicleOrders: PartnerVehicleOrder[] = [];
  filteredOrders: PartnerVehicleOrder[] = [];
  searchQuery: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5;
  sortColumn: string = 'partnerName';
  sortAscending: boolean = true;
  filteredVehicles: Vehicle[] = [];
  availableCapacities: number[] = [];
  selectedCapacity: number = 0;
  selectedVehicleNumber: string = '';
  modalData: any = {};

  constructor(private partnerVehicleOrderService: PatnerVehicalOrderService, private vehicalService: VehicalService,  private confirmOrderService:  ConfirnorderService,
    private vendorInvoiceService:VendorInvoiceService,private  tripService: TripService
   ) {}

  ngOnInit(): void {
    this.getVehicles();
    this.getPartnerVehicleOrders();
  }

  getVehicles(): void {
    this.vehicalService.getVehiclesAvaialable().subscribe(
      (response: VehicleResponse) => {
        this.vehicles = response.data;
        console.log('Vehicles fetched successfully:', this.vehicles);
        this.availableCapacities = [...new Set(this.vehicles.map(vehicle => vehicle.capacity))];
        this.filteredVehicles = this.vehicles;
      },
      (error) => {
        console.error('Error fetching vehicles:', error);
      }
    );
  }

  filterVehiclesByCapacity(): void {
    console.log('Selected Capacity:', this.selectedCapacity); // Log selected capacity
    if (this.selectedCapacity) {
      this.filteredVehicles = this.vehicles.filter(vehicle => {
        console.log('Vehicle Capacity:', vehicle.capacity); // Log each vehicle's capacity
        return Number(vehicle.capacity) === Number(this.selectedCapacity); // Ensure both values are numbers
      });
      console.log('Filtered Vehicles by Capacity:', this.filteredVehicles); // Log filtered vehicles
    } else {
      this.filteredVehicles = this.vehicles;
      console.log('No selected capacity, showing all vehicles:', this.filteredVehicles); // Log all vehicles
    }
  }


  updateVehicleName(vehicleNumber: string): void {
    console.log('Selected Vehicle Number:', vehicleNumber); // Log selected vehicle number

    // Find the selected vehicle from the vehicles array based on the vehicle number
    const selectedVehicle = this.vehicles.find(vehicle => vehicle.vehicleNumber === vehicleNumber);

    if (selectedVehicle) {
      console.log('Selected Vehicle:', selectedVehicle);

      // Find the index of the vehicle in the modal data
      const vehicleIndex = this.modalData.vehicles.findIndex(
        (vehicle: { vehicleNumber: string }) => vehicle.vehicleNumber === vehicleNumber
      );

      if (vehicleIndex !== -1) {
        // Update the vehicle details in the modal
        this.modalData.vehicles[vehicleIndex].vehicleName = selectedVehicle.vehicleName;
        this.modalData.vehicles[vehicleIndex].vendorId = selectedVehicle.vendorId;
        this.modalData.vehicles[vehicleIndex].ratePerKilometer = selectedVehicle.ratePerKilometer; // Populate rate from vehicle data

        // Keep RatePerkilometerAdmin for manual input by the user
        if (!this.modalData.vehicles[vehicleIndex].RatePerkilometerAdmin) {
          this.modalData.vehicles[vehicleIndex].RatePerkilometerAdmin = ''; // Default empty for manual entry
        }

        console.log('Updated modal data:', this.modalData.vehicles[vehicleIndex]);
      }
    } else {
      console.log('Vehicle not found');
    }
  }




  getPartnerVehicleOrders(): void {
    this.partnerVehicleOrderService.getAllPartnerVehicleOrders().subscribe(
      (orders: PartnerVehicleOrder[]) => {
        this.partnerVehicleOrders = orders;
        this.filteredOrders = orders;
        console.log(orders);
      },
      (error) => {
        console.error('Error fetching vehicle orders:', error);
      }
    );
  }

  searchOrders(): void {
    this.filteredOrders = this.partnerVehicleOrders.filter(order =>
      Object.values(order).some(value =>
        value.toString().toLowerCase().includes(this.searchQuery.toLowerCase())
      )
    );
    this.currentPage = 1;
  }

  sortOrders(column: string): void {
    if (this.sortColumn === column) {
      this.sortAscending = !this.sortAscending;
    } else {
      this.sortColumn = column;
      this.sortAscending = true;
    }

    this.filteredOrders.sort((a: any, b: any) => {
      const valueA = a[column];
      const valueB = b[column];
      if (valueA < valueB) return this.sortAscending ? -1 : 1;
      if (valueA > valueB) return this.sortAscending ? 1 : -1;
      return 0;
    });
  }

  getPaginatedOrders(): PartnerVehicleOrder[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredOrders.slice(startIndex, startIndex + this.itemsPerPage);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  get totalPages(): number {
    return Math.ceil(this.filteredOrders.length / this.itemsPerPage);
  }

  isModalOpen: boolean = false;

  openModal(order: any): void {
    // Initialize modal data and set partnerId from order._id
    this.modalData = {
      partnerId: order._id, // Set partnerId from the _id field of the order
      pickupLocation: order.pickupLocation,
      dropLocation: order.dropLocation,
      totalKilometer:order.totalKilometer,
      vehicles: Array(order.vehicleCount).fill(null).map(() => ({
        vehicleNumber: '',
        vehicleName: '',
        driverName: '',
        driverContactNumber: '',
        driverNumber: '',
        capacity: '',
        RatePerkilometerAdmin: '' // For manual input
      }))
    };

    console.log('Modal data initialized:', this.modalData); // Debugging
    this.isModalOpen = true;
  }




  closeModal(): void {
    this.isModalOpen = false;
  }

  submitForm(): void {
    const confirmOrderData: ConfirmOrder = {
      pickupLocation: this.modalData.pickupLocation,
      dropLocation: this.modalData.dropLocation,
      partnerId: this.modalData.partnerId,
      totalKilometer: this.modalData.totalKilometer,
      vehicles: this.modalData.vehicles, // Ensure this contains multiple drivers
    };

    this.confirmOrderService.createConfirmOrder(confirmOrderData).subscribe(
      (response) => {
        console.log("Confirm Order created successfully:", response);

        // Create the vendor invoice
        this.vendorInvoiceService.createConfirmOrder(confirmOrderData).subscribe(
          (invoiceResponse) => {
            console.log("Vendor invoice created successfully:", invoiceResponse);

            // Prepare data for each driver
            const tripDataArray = this.modalData.vehicles.map((vehicle: { driverNumber: any; pickupLocation: any; dropLocation: any; distanceInKm: any; }) => ({
              driverNumber: vehicle.driverNumber,
              pickupLocation: vehicle.pickupLocation || this.modalData.pickupLocation,
              dropLocation: vehicle.dropLocation || this.modalData.dropLocation,
              distanceInKm: vehicle.distanceInKm || this.modalData.totalKilometer,
            }));

            // Call the trip creation service for each driver
            tripDataArray.forEach((tripData: any) => {
              this.tripService.createTrip(tripData).subscribe(
                (tripResponse) => {
                  console.log("Trip created successfully:", tripResponse);
                },
                (tripError) => {
                  console.error("Error creating trip:", tripError);
                }
              );
            });

            this.closeModal();
            alert("Order, invoice, and trips created successfully!");
          },
          (invoiceError) => {
            console.error("Error creating vendor invoice:", invoiceError);
          }
        );
      },
      (error) => {
        console.error("Error creating confirm order:", error);
      }
    );
  }

}
