import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Tareas } from '@core/models/Tareas.models';
import { TaskService } from 'app/core/services/task.service';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';

import { CommonModule } from '@angular/common';
import { TaskCardComponent } from '../task-card/task-card.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotificationService } from 'app/core/services/notification.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    MatSelectModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './list-task.component.html',
  styleUrl: './list-task.component.scss',
})
export class ListTaskComponent implements OnInit, OnDestroy {
  private taskService = inject(TaskService);
  notificationService = inject(NotificationService);
  test = inject(MatSnackBar)
  private subscription: Subscription = new Subscription();

  tasks: Tareas[] = [];
  filteredTasks: Tareas[] = [];
  searchControl = new FormControl('');
  estadoControl = new FormControl('');

  ngOnInit() {

    this.loadAllTask();
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300), // Espera 300ms después de que el usuario deje de escribir
        distinctUntilChanged() // Solo emite si el valor cambió
      )
      .subscribe((searchTerm) => {
        this.filterTasks(searchTerm, this.estadoControl.value);
      });
    // Escuchar cambios en el select de estado
    this.estadoControl.valueChanges.subscribe((estado) => {
      this.filterTasks(this.searchControl.value, estado);
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadAllTask(): void {
    this.subscription.add(
      this.taskService.getTasks().subscribe({
        next: (tasks: Tareas[]) => {
          this.tasks = tasks; // Crear una nueva referencia del array
          this.filterTasks(this.searchControl.value, this.estadoControl.value); // Aplicar el filtro después de cargar las tareas
        },
        error: (error: unknown) => {
          console.error('Error al cargar tareas:', error);
        },
      })
    );
  }
  //todo: Cambiar el mensaje de confirmacion por un modal de angular material
  onDeleteTask(task: Tareas): void {
     {
      this.subscription.add(
        this.taskService.deleteTask(task.id).subscribe({
          next: () => {
            this.tasks = this.tasks.filter((t) => t.id !== task.id);
            this.filteredTasks = this.filteredTasks.filter(
              (t) => t.id !== task.id
            );
            this.notificationService.success('Tarea eliminada exitosamente');
          },
          error: (error) => {
            console.error('Error al eliminar tarea:', error);
          },
        })
      );
    }
  }

  filterTasks(searchTerm: string | null, estado: string | null): void {
    let filtered = [...this.tasks];

    // Filtrar por término de búsqueda (título y descripción)
    if (searchTerm && searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(term) ||
          task.description.toLowerCase().includes(term)
      );
    }

    // Filtrar por estado
    if (estado && estado !== '') {
      filtered = filtered.filter((task) => task.estado === estado);
    }

    this.filteredTasks = filtered;
  }

  clearSearch(): void {
    this.searchControl.setValue('');
  }

  clearFilters(): void {
    this.searchControl.setValue('');
    this.estadoControl.setValue('');
  }
}
