import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Tareas } from '@core/models/Tareas.models';
import { TaskService } from 'app/core/services/task.service';
import { Subscription } from 'rxjs';

import { CommonModule } from '@angular/common';
import { TaskCardComponent } from '../task-card/task-card.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-list-task',
  standalone: true,
  imports: [
    CommonModule,
    MatGridListModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    TaskCardComponent,
    RouterLink,
  ],
  templateUrl: './list-task.component.html',
  styleUrl: './list-task.component.scss',
})
export class ListTaskComponent implements OnInit, OnDestroy {
  private taskService = inject(TaskService);
  private subscription: Subscription = new Subscription();

  tasks: Tareas[] = [];

  ngOnInit() {
    this.loadAllTask();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadAllTask(): void {
    this.subscription.add(
      this.taskService.getTasks().subscribe({
        next: (tasks: Tareas[]) => {
          this.tasks = tasks; // Crear una nueva referencia del array
        },
        error: (error: unknown) => {
          console.error('Error al cargar tareas:', error);
        },
      })
    );
  }
 //todo: Cambiar el mensaje de confirmacion por un modal de angular material
  onDeleteTask(task: Tareas): void {
    this.subscription.add(
      this.taskService.deleteTask(task.id).subscribe({
        next: () => {
          console.log('Tarea eliminada exitosamente');
          this.loadAllTask();
        },
        error: (error) => {
          console.error('Error al eliminar tarea:', error);
        },
      })
    );
  }
}
