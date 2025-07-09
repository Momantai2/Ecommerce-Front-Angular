import { Component } from '@angular/core';
import { ChartConfiguration, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';

@Component({
  selector: 'app-dashboardresumen',
  imports: [NgChartsModule],
  templateUrl: './dashboardresumen.component.html',
  styleUrl: './dashboardresumen.component.css'
})
export class DashboardresumenComponent {
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
  };

  public barChartType: ChartType = 'bar';

  public barChartData = {
    labels: ['Hombres', 'Mujeres'],
    datasets: [
      { data: [12, 8], label: 'Usuarios por género' }
    ]
  };
}