import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PatnerVehicalOrderService } from '../../Service/patner-vehical-order.service';
import { PartnerVehicleOrder } from '../../Modals/patnervehicalorder';

@Component({
  selector: 'app-order-vehical',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './order-vehical.component.html',
  styleUrl: './order-vehical.component.css'
})
export class OrderVehicalComponent {
  orderForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private patnerVehicalOrderService: PatnerVehicalOrderService // Inject the service
  ) {}

  ngOnInit(): void {
    this.orderForm = this.fb.group({
      vehicleCount: [null, [Validators.required, Validators.min(1)]],
      orderDate: [new Date().toISOString().slice(0, 10), Validators.required],
      hubAddress: ['', Validators.required],
      vehicleType: ['', Validators.required],
      capacity: [null, [Validators.required, Validators.min(1)]],
      pickupLocation: ['', Validators.required],
      dropLocation: ['', Validators.required],
      partnerName: ['', Validators.required],
      partnerContactNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      totalKilometer: [null, [Validators.required, Validators.min(1)]], // Added totalKilometer
    });
  }

  onSubmit(): void {
    if (this.orderForm.valid) {
      // Retrieve partnerId from local storage
      const currUser = JSON.parse(localStorage.getItem('user') || '{}');
      const partnerId = currUser._id;

      if (!partnerId) {
        console.error('Partner ID not found in local storage');
        return;
      }

      // Prepare the order data
      const order: PartnerVehicleOrder = {
        ...this.orderForm.value,
        partnerId, // Add partnerId from local storage
        isAccepted: false // Optional if the backend sets this as default
      };

      // Call the service to create the vehicle order
      this.patnerVehicalOrderService.createVehicleOrder(order).subscribe(
        (response) => {
          console.log('Order created successfully:', response);
          alert('Order submitted successfully!');
        },
        (error) => {
          console.error('Error creating order:', error);
          alert('Failed to submit the order. Please try again.');
        }
      );
    } else {
      console.log('Form is invalid');
    }
  }
}
