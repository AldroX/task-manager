import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Tareas } from '@core/models/Tareas.models';
import { ModalComponent } from '@shared/modal/modal.component';
import { routes } from 'app/app.routes';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from 'app/core/services/task.service';


export interface TaskFormData {
  task?: Tareas;
  isEditMode: boolean;
}

@Component({
  selector: 'app-create-update-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './create-update-form.component.html',
  styleUrl: './create-update-form.component.scss',
})
export class CreateUpdateFormComponent implements OnInit {
  taskForm: FormGroup;
  isEditMode: boolean = false;
  activateRoute = inject(ActivatedRoute);
  router = inject(Router);
  taskService = inject(TaskService);
  id: string = '';
  taskData?: Tareas;

  constructor(private fb: FormBuilder) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      estado: ['pendiente', Validators.required],
    });
  }

  ngOnInit(): void {
    this.id = this.activateRoute.snapshot.params['id'];
    this.isEditMode = this.id ? true : false;

    if (this.id && this.isEditMode) {
      this.loadTaskById(this.id);
    }else{
      this.initializeNewTask();
    }
  }
  private loadTaskById(id: string): void {
    this.taskService.getTaskById(+id).subscribe({
      next: (task: Tareas | undefined) => {
        if (task) {
          this.taskData = task;
          this.taskForm.patchValue({
            title: task.title,
            description: task.description,
            estado: task.estado,
          });
        }
      },
      error: (error) => {
        console.error('Error al cargar la tarea:', error);
        this.router.navigate(['tasks']);
      },
    });
  }

  private initializeNewTask(): void {
    this.taskForm.reset({
      title: '',
      description: '',
      estado: 'pendiente',
    });
  }

  get submitButtonText(): string {
    return this.isEditMode ? 'Actualizar' : 'Crear';
  }

  onSave(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    const formValues = this.taskForm.value;
    if(this.isEditMode && this.taskData){
      this.editTask(formValues as Tareas);
    }else{
      this.createTask(formValues as Tareas);
    }
  }
  
  createTask(task: Tareas): void {
    const newTask: Omit<Tareas, 'id'> = {
      title: task.title,
      description: task.description,
      estado: task.estado,
    }

    this.taskService.createTask(newTask).subscribe({
      next: (createdTask) => {
        console.log('Tarea creada exitosamente:', createdTask);
        this.taskForm.reset();
        // Navegar a la lista o mostrar mensaje de éxito
        this.router.navigate(['/tasks']);
      },
      error: (error) => {
        console.error('Error al crear la tarea:', error);
      },
    });
  }

  editTask(task: Tareas): void {
    if(!this.taskData?.id){
      return
    }
    const updatedTask: Partial<Tareas> = {
      title: task.title,
      description: task.description,
      estado: task.estado,
    };

    this.taskService.updateTask(+this.id,updatedTask).subscribe({
      next: (updatedTask) => {
        console.log('Tarea actualizada exitosamente:', updatedTask);
        this.taskForm.reset();
        // Navegar a la lista o mostrar mensaje de éxito
        this.router.navigate(['/tasks']);
      },
      error: (error) => {
        console.error('Error al actualizar la tarea:', error);
      },
    })

  }

  // Helper methods para validación en el template
  isFieldInvalid(fieldName: string): boolean {
    const field = this.taskForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getErrorMessage(fieldName: string): string {
    const field = this.taskForm.get(fieldName);
    if (field?.hasError('required')) {
      return 'Este campo es requerido';
    }
    if (field?.hasError('minlength')) {
      const minLength = field.errors?.['minlength'].requiredLength;
      return `Mínimo ${minLength} caracteres`;
    }
    return '';
  }

  onCancel(): void {
    this.taskForm.reset();
    this.router.navigate(['/tasks']);
  }

}
