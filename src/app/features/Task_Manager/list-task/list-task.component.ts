import {
  Component,
  inject,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
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
    MatSelectModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './list-task.component.html',
  styleUrl: './list-task.component.scss',
})
export class ListTaskComponent implements OnInit, OnDestroy {
  private taskService = inject(TaskService);
  notificationService = inject(NotificationService);
  private cdr = inject(ChangeDetectorRef);
  test = inject(MatSnackBar);
  private subscription: Subscription = new Subscription();

  constructor(private dialog: MatDialog) {}

  tasks: Tareas[] = [];
  filteredTasks: Tareas[] = [];
  searchControl = new FormControl('');
  estadoControl = new FormControl('');

  ngOnInit() {
    this.loadAllTask();
    this.setupFilters();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * Configura los listeners para los filtros de búsqueda y estado
   * CRÍTICO: Con OnPush, debemos forzar detección de cambios después de cada actualización
   */
  private setupFilters(): void {
    // Filtro de búsqueda con debounce
    this.subscription.add(
      this.searchControl.valueChanges
        .pipe(debounceTime(300), distinctUntilChanged())
        .subscribe((searchTerm) => {
          this.filterTasks(searchTerm, this.estadoControl.value);
          // CRÍTICO: Marcar para verificar cambios después de filtrar
          this.cdr.markForCheck();
        })
    );

    // Filtro de estado
    this.subscription.add(
      this.estadoControl.valueChanges.subscribe((estado) => {
        this.filterTasks(this.searchControl.value, estado);
        // CRÍTICO: Marcar para verificar cambios después de filtrar
        this.cdr.markForCheck();
      })
    );
  }

  loadAllTask(): void {
    this.subscription.add(
      this.taskService.getTasks().subscribe({
        next: (tasks: Tareas[]) => {
          this.tasks = tasks; // Crear una nueva referencia del array
          this.filterTasks(this.searchControl.value, this.estadoControl.value); // Aplicar el filtro después de cargar las tareas
          this.cdr.markForCheck();
        },
        error: (error: unknown) => {
          console.error(error);
          this.notificationService.error('Error al cargar las tareas');
          this.cdr.markForCheck();
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
            this.cdr.markForCheck();
          },
          error: (error) => {
            console.error( error);
            this.cdr.markForCheck();
            this.notificationService.error('Error al eliminar la tarea');
          },
        })
      );
    }
  }

  /**
   * Filtra las tareas según el término de búsqueda y el estado
   * @param searchTerm - Término de búsqueda
   * @param estado - Estado de la tarea (pendiente/completado)
   */
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

  /**
   * Limpia todos los filtros aplicados
   */
  clearFilters(): void {
    this.searchControl.setValue('');
    this.estadoControl.setValue('');
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
