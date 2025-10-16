import { Component, inject, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
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
import { MatDialog } from '@angular/material/dialog';
import { DeleteModalComponent } from '@shared/delete-modal/delete-modal.component';

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

  constructor(private dialog: MatDialog, private cdr: ChangeDetectorRef) {}

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
          this.tasks = [...tasks]; // Crear una nueva referencia del array
        },
        error: (error: unknown) => {
          console.error('Error al cargar tareas:', error);
        },
      })
    );
  }
  //todo: Cambiar el mensaje de confirmacion por un modal de angular material
  onDeleteTask(task: Tareas): void {
    this.taskService.deleteTask(task.id).subscribe({
      next: () => {
        console.log('Tarea eliminada exitosamente');
        this.loadAllTask();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al eliminar tarea:', error);
      },
    });
  }
  openConfirmDialog($event: Tareas): void {
    const dialogRef = this.dialog.open(DeleteModalComponent, {
      width: '400px',
      data: {
        title: 'Eliminar Tarea',
        message: '¿Estás seguro de que quieres eliminar esta tarea?',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.onDeleteTask($event);
      }
    });
  }
}
