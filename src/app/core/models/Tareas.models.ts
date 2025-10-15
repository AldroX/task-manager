export interface Tareas {
  id: number;
  title: string;
  description: string;
  estado: string | 'pendiente' | 'completado';
}