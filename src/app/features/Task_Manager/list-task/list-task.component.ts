import { Component, inject, OnInit } from '@angular/core';
import { Tareas } from '@core/models/Tareas.models';
import { TaskService } from 'app/core/services/task.service';

import { CommonModule } from '@angular/common';
import { TaskCardComponent } from '../task-card/task-card.component';
import {MatGridListModule} from '@angular/material/grid-list';

@Component({
  selector: 'app-list-task',
  standalone: true,
  imports: [TaskCardComponent, CommonModule, MatGridListModule],
  templateUrl: './list-task.component.html',
  styleUrl: './list-task.component.scss',
})
export class ListTaskComponent implements OnInit {
  private taskService = inject(TaskService);
  tasks: Tareas[] = [];

  ngOnInit() {
    this.taskService.getTasks().subscribe({
      next: (tasks: Tareas[]) => {
        this.tasks = tasks;
        console.log(tasks);
      },
      error: (error: unknown) => {
        console.error(error);
      }
    });
  }
}
