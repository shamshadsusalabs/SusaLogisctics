import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { Router, RouterLink } from '@angular/router'; // Optional: If you want to navigate on successful login
import { SuperAdminService } from '../../Service/super-admin.service';
import { VendorService } from '../../Service/vendor.service'; // Import VendorService
import { PatnerLogin, SuperAdminLogin } from '../../Modals/login';
import { VendorLogin } from '../../Modals/login'; // Assuming you have a VendorLogin model
import { OperatorLogin } from '../../Modals/operator';
import { OperatorService } from '../../Service/operator.service';
import { PatnerService } from '../../Service/patner.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private superAdminService: SuperAdminService,
    private vendorService: VendorService, // Inject VendorService
    private router: Router,
    private operatorService: OperatorService,
    private partnerService:  PatnerService, // Inject PartnerService// Inject OperatorService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['superadmin', Validators.required], // Add role to the form group
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password, role } = this.loginForm.value;
      const credentials = { email, password };

      switch (role) {
        case 'superadmin':
          this.superAdminService.login(credentials as SuperAdminLogin).subscribe(
            (response) => this.handleLoginSuccess(response, '/Super-Admin-dashboard'),
            (error) => console.error('Superadmin login failed', error)
          );
          break;

        case 'vendor':
          this.vendorService.login(credentials as VendorLogin).subscribe(
            (response) => this.handleLoginSuccess(response, '/Vendor-Admin-dashboard'),
            (error) => console.error('Vendor login failed', error)
          );
          break;

        case 'operator':
          this.operatorService.login(credentials as OperatorLogin).subscribe(
            (response) => this.handleLoginSuccess(response, '/Operator-Admin-dashboard'),
            (error) => console.error('Operator login failed', error)
          );
          break;

        case 'partner': // Handle Partner login
          this.partnerService.login(credentials as PatnerLogin).subscribe(
            (response) => this.handleLoginSuccess(response, '/Patner-Admin-dashboard'),
            (error) => console.error('Partner login failed', error)
          );
          break;

        default:
          console.error('Invalid role');
          break;
      }
    } else {
      console.log('Form is not valid');
    }
  }

  private handleLoginSuccess(response: any, redirectUrl: string): void {
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    localStorage.setItem('user', JSON.stringify(response.user));
    this.router.navigate([redirectUrl]);
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  get role() {
    return this.loginForm.get('role');
  }
}
