import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
// import { Chart } from 'chart.js';
import Chart, { ChartConfiguration } from 'chart.js/auto';
import { Observable } from 'rxjs';
import { PriorityCounts, StatusCounts, Task } from '../../core/models/task';
// import { TaskActions } from '../../core/state/task.actions';
import {
  selectAllTasks,
  selectTasksLoading,
  selectTasksError,
  selectTotalTasks,
  selectCompletedTasks,
  selectOverdueTasks,
} from '../../core/state/task.selectors';
import { CommonModule } from '@angular/common';
import {
  BaseChartDirective,
  provideCharts,
  withDefaultRegisterables,
} from 'ng2-charts';
import { Activity } from '../../core/models/activity';
import { selectActivities } from '../../core/state/activity.selectors';
import { loadTasks } from '../../core/state/task.actions';
import { MatIconModule } from '@angular/material/icon';
import { loadActivities } from '../../core/state/activity.actions';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective, MatIconModule],
  providers: [provideCharts(withDefaultRegisterables())],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  tasks$!: Observable<Task[]>;
  loading$!: Observable<boolean>;
  error$!: Observable<string | null>;
  totalTasks$!: Observable<number>;
  completedTasks$!: Observable<number>;
  overdueTasks$!: Observable<number>;
  activities$!: Observable<Activity[]>;

  statusChartData: ChartConfiguration['data'] = {
    labels: ['To Do', 'In Progress', 'In Review', 'Completed'],
    datasets: [
      {
        data: [0, 0, 0, 0],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
      },
    ],
  };

  priorityChartData: ChartConfiguration['data'] = {
    labels: ['Low', 'Medium', 'High', 'Critical'],
    datasets: [
      {
        data: [0, 0, 0, 0],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FF9F40'],
      },
    ],
  };

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

  retryLoading(): void {
    this.store.dispatch(loadActivities());
  }

  // Determine the icon based on the activity action
  getIcon(action: string): string {
    switch (action) {
      case 'Task Created':
        return 'add_circle';
      case 'Task Updated':
        return 'edit';
      case 'Task Deleted':
        return 'delete';
      default:
        return 'info';
    }
  }

  // Determine the icon class for styling based on the activity action
  getIconClass(action: string): string {
    switch (action) {
      case 'Task Created':
        return 'icon-created';
      case 'Task Updated':
        return 'icon-updated';
      case 'Task Deleted':
        return 'icon-deleted';
      default:
        return 'icon-default';
    }
  }

  constructor(private store: Store) {}

  ngOnInit() {
    this.tasks$ = this.store.select(selectAllTasks);
    this.loading$ = this.store.select(selectTasksLoading);
    this.error$ = this.store.select(selectTasksError);
    this.totalTasks$ = this.store.select(selectTotalTasks);
    this.completedTasks$ = this.store.select(selectCompletedTasks);
    this.overdueTasks$ = this.store.select(selectOverdueTasks);
    this.activities$ = this.store.select(selectActivities);

    // Ensure tasks are loaded
    this.store.dispatch(loadTasks());
    this.store.dispatch(loadActivities());

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
