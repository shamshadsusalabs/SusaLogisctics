import { Component } from '@angular/core';
import Chart from 'chart.js/auto';
import { DriverCount, DriverService } from '../../Service/driver.service';
import { OperatorService } from '../../Service/operator.service';
@Component({
  selector: 'app-main-component',
  imports: [],
  templateUrl: './main-component.component.html',
  styleUrl: './main-component.component.css'
})
export class MainComponentComponent {
  ngOnInit(): void {
    this.createChart();
    this.fetchDriverCount();
    this.  fetchOperatorCount();
    this. fetchOrderCount();
  }

  createChart() {
    const ctx = document.getElementById('requestsChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [
          {
            label: 'Vehicle Requests',
            data: [50, 100, 150, 120, 180, 200],
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }



  driverCount: number = 0;
  operatorCount: number = 0;
  orderCount: number = 0;
  loading: boolean = false;
  errorMessage: string = '';

  constructor(private driverService: DriverService,private  operatorService: OperatorService) {}



  fetchDriverCount(): void {
    this.loading = true;
    this.driverService.getTotalDriverCount().subscribe(
      (response: DriverCount) => {
        this.loading = false;
        this.driverCount = response.data.count;
      },
      (error) => {
        this.loading = false;
        this.errorMessage = 'Failed to fetch driver count.';
        console.error('Error fetching driver count:', error);
      }
    );
  }

  fetchOperatorCount(): void {
    this.loading = true;
    this.operatorService.getTotalOperatorCount().subscribe(
      (response: DriverCount) => {
        this.loading = false;
        this.operatorCount = response.data.count;
      },
      (error) => {
        this.loading = false;
        this.errorMessage = 'Failed to fetch driver count.';
        console.error('Error fetching driver count:', error);
      }
    );
  }

  fetchOrderCount(): void {
    this.loading = true;
    this.operatorService.getTotalOperatorCount().subscribe(
      (response: DriverCount) => {
        this.loading = false;
        this.orderCount = response.data.count;
      },
      (error) => {
        this.loading = false;
        this.errorMessage = 'Failed to fetch driver count.';
        console.error('Error fetching driver count:', error);
      }
    );
  }
}
