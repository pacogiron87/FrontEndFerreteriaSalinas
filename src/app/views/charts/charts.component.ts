import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

// PrimeNG Modules
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-charts',
  standalone: true,
  imports: [
    CommonModule,
    ChartModule,
    CardModule
  ],
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss']
})
export class ChartsComponent implements OnInit {

  readonly months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  // Chart Data Signals
  readonly chartBarData = signal({
    labels: [...this.months].slice(0, 7),
    datasets: [
      {
        label: 'GitHub Commits',
        backgroundColor: '#f87979',
        data: [40, 20, 12, 39, 17, 42, 79]
      }
    ]
  });

  readonly chartLineData = signal({
    labels: [...this.months].slice(0, 7),
    datasets: [
      {
        label: 'First Dataset',
        backgroundColor: 'rgba(220, 220, 220, 0.2)',
        borderColor: 'rgba(220, 220, 220, 1)',
        data: [65, 59, 80, 81, 56, 55, 40]
      }
    ]
  });

  readonly chartPieData = signal({
    labels: ['Red', 'Green', 'Yellow'],
    datasets: [
      {
        data: [300, 50, 100],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
      }
    ]
  });

  ngOnInit(): void {
    // Initialization logic if needed
  }
}
