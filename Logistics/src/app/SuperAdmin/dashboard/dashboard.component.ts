import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-dashboard',
  imports: [ RouterOutlet, CommonModule,RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
}
