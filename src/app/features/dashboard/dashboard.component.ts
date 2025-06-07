import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
// import { Chart } from 'chart.js';
import Chart, { ChartConfiguration } from 'chart.js/auto';
import { Observable } from 'rxjs';
import { Task } from '../../core/models/task';
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

  statusChartType: 'pie' = 'pie';
  priorityChartType: 'pie' = 'pie';
  statusChartData!: ChartConfiguration<'pie'>['data'];
  priorityChartData!: ChartConfiguration<'pie'>['data'];
  statusChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Tasks by Status',
      },
    },
  };
  priorityChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Tasks by Priority',
      },
    },
  };

  constructor(private store: Store) {}

  ngOnInit() {
    this.tasks$ = this.store.select(selectAllTasks);
    this.loading$ = this.store.select(selectTasksLoading);
    this.error$ = this.store.select(selectTasksError);
    this.store.dispatch(TaskActions.loadTasks());

    this.tasks$.subscribe((tasks) => {
      this.updateCharts(tasks);
    });
  }

  updateCharts(tasks: Task[]) {
    // Tasks by Status
    const statusCounts = {
      'To Do': 0,
      'In Progress': 0,
      Completed: 0,
    };
    tasks.forEach((task) => {
      statusCounts[task.status]++;
    });

    this.statusChartData = {
      labels: ['To Do', 'In Progress', 'Completed'],
      datasets: [
        {
          data: [
            statusCounts['To Do'],
            statusCounts['In Progress'],
            statusCounts['Completed'],
          ],
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        },
      ],
    };

    // Tasks by Priority
    const priorityCounts = {
      Low: 0,
      Medium: 0,
      High: 0,
    };
    tasks.forEach((task) => {
      priorityCounts[task.priority]++;
    });

    this.priorityChartData = {
      labels: ['Low', 'Medium', 'High'],
      datasets: [
        {
          data: [
            priorityCounts['Low'],
            priorityCounts['Medium'],
            priorityCounts['High'],
          ],
          backgroundColor: ['#4CAF50', '#FFC107', '#F44336'],
        },
      ],
    };
  }
}
