import { inject, Injectable } from '@angular/core';
import { taskData } from '../../data/task-data.db';
import { HttpClient } from '@angular/common/http';
import { Tareas } from '@core/models/Tareas.models';
import { of, BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasksSubject = new BehaviorSubject<Tareas[]>(taskData);
  public tasks$ = this.tasksSubject.asObservable();
  
  http = inject(HttpClient);

  getTasks(): Observable<Tareas[]> {
    return this.tasks$;
  }

  getTaskById(id: number): Observable<Tareas | undefined> {
    const task = this.tasksSubject.value.find(task => task.id === id);
    return of(task);
  }

  createTask(task: Omit<Tareas, 'id'>): Observable<Tareas> {
    const currentTasks = this.tasksSubject.value;
    console.log('Tareas actuales antes de crear:', currentTasks.length);
    
    const newTask: Tareas = {
      ...task,
      id: Math.max(...currentTasks.map(t => t.id), 0) + 1
    };
    
    const updatedTasks = [...currentTasks, newTask];
    console.log('Tareas después de crear:', updatedTasks.length);
    console.log('Nueva tarea creada:', newTask);
    
    this.tasksSubject.next(updatedTasks);
    console.log('BehaviorSubject actualizado');
    
    return of(newTask);
  }

  updateTask(id: number, updatedTask: Partial<Tareas>): Observable<Tareas | null> {
    const currentTasks = this.tasksSubject.value;
    const taskIndex = currentTasks.findIndex(task => task.id === id);
    
    if (taskIndex === -1) {
      return of(null);
    }
    
    const updatedTasks = [...currentTasks];
    updatedTasks[taskIndex] = { ...updatedTasks[taskIndex], ...updatedTask };
    this.tasksSubject.next(updatedTasks);
    
    return of(updatedTasks[taskIndex]);
  }

  deleteTask(id: number): Observable<boolean> {
    const currentTasks = this.tasksSubject.value;
    const updatedTasks = currentTasks.filter(task => task.id !== id);
    this.tasksSubject.next(updatedTasks);
    return of(true);
  }
}
