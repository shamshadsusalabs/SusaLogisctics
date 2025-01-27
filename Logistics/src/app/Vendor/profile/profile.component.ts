import { Component } from '@angular/core';
import { VendorService } from '../../Service/vendor.service';
import { Vendor, VendorResponse, VendorResponseUpdate } from '../../Modals/vendor';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})

  export class ProfileComponent {
    vendorForm: FormGroup;
  vendorData: Vendor | null = null;

  constructor(
    private fb: FormBuilder,
    private vendorService: VendorService
  ) {
    this.vendorForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      contactNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      gstNumber: ['', [Validators.pattern(/^[A-Za-z0-9]+$/)]],
      gstImage: [null],
      address: [''],
      aadhaarImage: [null],
      password: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      profilePic: [null],
      aadhaarNumber: ['', [Validators.required, Validators.pattern(/^\d{12}$/)]],
      // Default to false
    });
  }

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user && user._id) {
      this.vendorService.getVendorById(user._id).subscribe(
        (response: VendorResponseUpdate) => {
          this.vendorData = response.data;
          this.fillForm(response.data);
        },
        (error) => {
          console.error('Error fetching vendor data:', error);
        }
      );
    }
  }

  fillForm(vendor: Vendor): void {
    this.vendorForm.patchValue({
      name: vendor.name,
      email: vendor.email,
      password: vendor.password,
      contactNumber: vendor.contactNumber,
      gstNumber: vendor.gstNumber || '',
      gstImage: vendor.gstImage || '',
      address: vendor.address || '',
      aadhaarImage: vendor.aadhaarImage || '',
      profilePic: vendor.profilePic || '',
      aadhaarNumber:vendor. aadhaarNumber || '',

    });
  }

  onFileChange(event: any, field: string): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      // Instead of just updating with the file name, store the actual file
      this.vendorForm.patchValue({ [field]: file });
    }
  }


  // Update vendor details on form submit
  onSubmit() {
    if (this.vendorForm.valid) {
      const formData = new FormData();

      // Get the user object from localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}');

      // Ensure `_id` exists
      if (user && user._id) {
        // Show loading Swal
        Swal.fire({
          title: 'Updating...',
          text: 'Please wait while we update your profile.',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        // Append text fields
        Object.keys(this.vendorForm.value).forEach((key) => {
          const value = this.vendorForm.value[key];
          if (value instanceof File) {
            // Append file fields
            formData.append(key, value);
          } else {
            // Append other fields
            formData.append(key, value);
          }
        });

        // Call the service to update the vendor
        this.vendorService.updateVendor(formData, user._id).subscribe(
          (response) => {
            Swal.fire({
              icon: 'success',
              title: 'Success!',
              text: 'Profile updated successfully!',
              confirmButtonText: 'OK',
            });
            console.log('Vendor updated successfully:', response);
          },
          (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: 'An error occurred while updating the profile.',
              confirmButtonText: 'OK',
            });
            console.error('Error updating vendor:', error);
          }
        );
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'User _id is missing. Cannot update the profile.',
          confirmButtonText: 'OK',
        });
        console.error('User _id not found in localStorage');
      }
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Form',
        text: 'Please fill all the required fields correctly.',
        confirmButtonText: 'OK',
      });
      console.error('Form is invalid');
    }
  }

  }
