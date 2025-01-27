import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { VehicalService } from '../../Service/vehical.service';
import { Vehicle } from '../../Modals/vehical';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vehical',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './vehical.component.html',
  styleUrls: ['./vehical.component.css']
})
export class VehicalComponent {
  vehicleForm!: FormGroup;

  constructor(private fb: FormBuilder, private vehicleService: VehicalService) {}

  ngOnInit(): void {
    // Retrieve user object from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // Set default values for vendor fields from the user object
    const vendorId = user._id || '';
    const vendorName = user.name || '';
    const vendorContactNumber = user.contactNumber || '';

    // Initialize the form
    this.vehicleForm = this.fb.group({
      vehicleName: ['', Validators.required],
      vehicleNumber: ['', Validators.required],
      insuranceImage: [null],
      insuranceNumber: ['', Validators.required],
      dimensions: this.fb.group({
        length: [0, Validators.required],
        breadth: [0, Validators.required],
      }),
      speed: this.fb.group({
        kilometerPerHour: [0, Validators.required],
      }),
      ratePerKilometer: [0, Validators.required],
      vendorId: [vendorId, Validators.required],
      vendorName: [vendorName, Validators.required],
      vendorContactNumber: [vendorContactNumber, Validators.required],
      driverName: [''],
      driverContact: [''],
      status: ['Available', Validators.required],
      location: ['', Validators.required],
      capacity: [0, Validators.required],
      lastServicedDate: [new Date().toISOString().split('T')[0]],
    });
  }

  onFileChange(event: any, field: string): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      // Instead of just updating with the file name, store the actual file
      this.vehicleForm.patchValue({ [field]: file });
    }
  }
  onSubmit(): void {
    if (this.vehicleForm.valid) {
      const formData = new FormData();

      // Append each form control value to FormData
      Object.keys(this.vehicleForm.value).forEach((key) => {
        const value = this.vehicleForm.get(key)?.value;

        if (key === 'insuranceImage' && value instanceof File) {
          // Append the file for 'insuranceImage'
          formData.append(key, value);
        } else if (typeof value === 'object' && value !== null) {
          // Handle nested objects like 'dimensions' and 'speed'
          Object.keys(value).forEach((nestedKey) => {
            formData.append(`${key}.${nestedKey}`, value[nestedKey]);
          });
        } else {
          formData.append(key, value);
        }
      });

      // Log FormData keys for debugging
      for (const pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }

      // Send FormData via the service
      this.vehicleService.createVehicle(formData).subscribe(
        (response) => {
          alert('Vehicle added successfully!');
          this.vehicleForm.reset();
        },
        (error) => {
          alert('Error adding vehicle: ' + error.message);
        }
      );
    }
  }

}
