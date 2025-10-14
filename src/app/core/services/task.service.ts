import { inject, Injectable } from '@angular/core';
import { taskData } from '../../data/task-data.db';
import { HttpClient } from '@angular/common/http';
import { Tareas } from '@core/models/Tareas.models';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  tasks = taskData;
  http = inject(HttpClient)

  getTasks() {
    return of(this.tasks);
  }

  getTaskById(id: number) {
    return of(this.tasks.find(task => task.id === id));
  }

  createTask(task: Tareas) {
    return of(this.tasks.push(task));
  }

  updateTask(id: number, task: Tareas) {
    return of(this.tasks.find(task => task.id === id), task);
  }

  deleteTask(id: number) {
    return of(this.tasks.filter(task => task.id !== id));
  }
}
