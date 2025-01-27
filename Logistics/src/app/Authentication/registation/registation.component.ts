import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { VendorService } from '../../Service/vendor.service';
import { OperatorService } from '../../Service/operator.service';
import Swal from 'sweetalert2';
import { PatnerService } from '../../Service/patner.service';

@Component({
  selector: 'app-registation',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './registation.component.html',
  styleUrls: ['./registation.component.css']
})
export class RegistationComponent implements OnInit {
  registrationForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private vendorService: VendorService,
    private operatorService: OperatorService,
    private patnerService:PatnerService
  ) {}

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      userType: ['', Validators.required], // New field for user type
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      contactNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]]
    });
  }

  onSubmit(): void {
    if (this.registrationForm.valid) {
      const userType = this.registrationForm.get('userType')?.value;
      const formData = this.registrationForm.value;

      // Map userType to the corresponding service
      const serviceMap: { [key: string]: VendorService | OperatorService | PatnerService } = {
        vendor: this.vendorService,
        operator: this.operatorService,
        patner: this.patnerService,
      };

      const service = serviceMap[userType];

      // Check if service is defined before proceeding
      if (!service) {
        Swal.fire({
          icon: 'error',
          title: 'Invalid User Type',
          text: 'Please select a valid user type.',
          confirmButtonText: 'OK',
        });
        return;
      }

      service.signup(formData).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Registration Successful!',
            text: `Your ${userType} account has been created successfully.`,
            confirmButtonText: 'OK',
          });
          this.registrationForm.reset();
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Registration Failed',
            text: err?.error?.message || 'Something went wrong. Please try again.',
            confirmButtonText: 'Retry',
          });
          console.error('Error:', err);
        },
      });
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Input',
        text: 'Please fill out the form correctly before submitting.',
        confirmButtonText: 'OK',
      });
      this.registrationForm.markAllAsTouched();
    }
  }
}
