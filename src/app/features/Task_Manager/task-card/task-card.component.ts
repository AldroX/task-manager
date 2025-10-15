import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tareas } from '@core/models/Tareas.models';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatCardContent } from '@angular/material/card';
import { MatCardActions } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { DialogService } from 'app/core/services/dialog.service';
import { TaskService } from 'app/core/services/task.service';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatCardContent,
    MatCardActions,
    MatIconModule,
    RouterLink
],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss',
})
export class TaskCardComponent {
  @Input() task!: Tareas;
  @Output() editTask = new EventEmitter<Tareas>();
  @Output() deleteTask = new EventEmitter<Tareas>();

  constructor(
    private dialogService: DialogService,
    private taskService: TaskService
  ) {}

  onViewTask(): void {
    // Implementar vista de detalles si es necesario
    console.log('Ver tarea:', this.task);
  }

  onEditTask(): void {
    this.editTask.emit(this.task);
  }

  onDeleteTask(): void {
    this.dialogService
      .openConfirmDialog(
        'Eliminar Tarea',
        '¿Estás seguro de que quieres eliminar esta tarea?'
      )
      .subscribe((confirmed) => {
        if (confirmed) {
          this.deleteTask.emit(this.task);
        }
      });
  }
}
