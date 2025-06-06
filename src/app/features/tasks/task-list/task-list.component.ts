import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TaskMockService } from '../../../core/services/task-mock.service';
import { Task } from '../../../core/models/task';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];

  constructor(private taskMockService: TaskMockService) {}

  ngOnInit() {
    this.tasks = this.taskMockService.getTasks();
  }
}
