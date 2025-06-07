import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
// import { Chart } from 'chart.js';
import Chart, { ChartConfiguration } from 'chart.js/auto';
import { Observable } from 'rxjs';
import { PriorityCounts, StatusCounts, Task } from '../../core/models/task';
import { TaskActions } from '../../core/state/task.actions';
import { selectAllTasks, selectTasksLoading, selectTasksError } from '../../core/state/task.selectors';
import { CommonModule } from '@angular/common';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  providers: [provideCharts(withDefaultRegisterables())],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  tasks$!: Observable<Task[]>;
  loading$!: Observable<boolean>;
  error$!: Observable<string | null>;

  statusChartData!: ChartConfiguration['data'];
  priorityChartData!: ChartConfiguration['data'];
  statusChartType: ChartConfiguration['type'] = 'pie';
  priorityChartType: ChartConfiguration['type'] = 'pie';
  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  constructor(private store: Store) {}

  ngOnInit() {
    this.tasks$ = this.store.select(selectAllTasks);
    this.loading$ = this.store.select(selectTasksLoading);
    this.error$ = this.store.select(selectTasksError);

    this.tasks$.subscribe((tasks) => {
      const statusCounts: StatusCounts = {
        'To Do': 0,
        'In Progress': 0,
        'In Review': 0,
        Completed: 0,
      };

      tasks.forEach((task) => {
        statusCounts[task.status]++;
      });

      this.statusChartData = {
        labels: ['To Do', 'In Progress', 'In Review', 'Completed'],
        datasets: [
          {
            data: [
              statusCounts['To Do'],
              statusCounts['In Progress'],
              statusCounts['In Review'],
              statusCounts['Completed'],
            ],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
          },
        ],
      };

      const priorityCounts: PriorityCounts = {
        Low: 0,
        Medium: 0,
        High: 0,
        Critical: 0,
      };

      tasks.forEach((task) => {
        priorityCounts[task.priority]++;
      });

      this.priorityChartData = {
        labels: ['Low', 'Medium', 'High', 'Critical'],
        datasets: [
          {
            data: [
              priorityCounts['Low'],
              priorityCounts['Medium'],
              priorityCounts['High'],
              priorityCounts['Critical'],
            ],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FF9F40'],
          },
        ],
      };
    });
  }
}
