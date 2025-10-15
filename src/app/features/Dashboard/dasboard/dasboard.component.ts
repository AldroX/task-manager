import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { TaskService, TaskStats } from 'app/core/services/task.service';

import {
  Chart,
  ChartConfiguration,
  CategoryScale,
  LinearScale,
  BarController,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PieController,
} from 'chart.js';
import { Subject, takeUntil } from 'rxjs';

Chart.register(
  CategoryScale,
  LinearScale,
  BarController,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PieController
);
@Component({
  selector: 'app-dasboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dasboard.component.html',
  styleUrl: './dasboard.component.scss',
})
export class DasboardComponent implements OnInit, AfterViewInit, OnDestroy {
 @ViewChild('pieChart') pieChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('barChart') barChartRef!: ElementRef<HTMLCanvasElement>;

  private destroy$ = new Subject<void>();
  private pieChart?: Chart;
  private barChart?: Chart;

  stats:TaskStats = {
    total: 0,
    porEstado: {
      pendiente: 0,
      completado: 0
    }
  };

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadStats();
  }

  ngAfterViewInit(): void {
    // Los gráficos se crearán cuando loadStats termine
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    
    if (this.pieChart) {
      this.pieChart.destroy();
    }
    if (this.barChart) {
      this.barChart.destroy();
    }
  }

  loadStats(): void {
    this.taskService.getTaskStats()
      .pipe(takeUntil(this.destroy$))
      .subscribe((stats:TaskStats) => {
        this.stats = stats;
        setTimeout(() => this.createCharts(), 0);
      });
  }

  createCharts(): void {
    this.createPieChart();
    this.createBarChart();
  }

  createPieChart(): void {
    if (!this.pieChartRef) return;

    if (this.pieChart) {
      this.pieChart.destroy();
    }

    const ctx = this.pieChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    this.pieChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Pendientes', 'Completadas'],
        datasets: [{
          data: [
            this.stats.porEstado.pendiente,
            this.stats.porEstado.completado
          ],
          backgroundColor: [
            'rgba(255, 159, 64, 0.8)',
            'rgba(75, 192, 192, 0.8)'
          ],
          borderColor: [
            'rgba(255, 159, 64, 1)',
            'rgba(75, 192, 192, 1)'
          ],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
          },
          title: {
            display: true,
            text: 'Distribución de Tareas por Estado',
            font: { size: 16 }
          }
        }
      }
    });
  }

  createBarChart(): void {
    if (!this.barChartRef) return;

    if (this.barChart) {
      this.barChart.destroy();
    }

    const ctx = this.barChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    this.barChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Pendientes', 'Completadas', 'Total'],
        datasets: [{
          label: 'Número de Tareas',
          data: [
            this.stats.porEstado.pendiente,
            this.stats.porEstado.completado,
            this.stats.total
          ],
          backgroundColor: [
            'rgba(255, 159, 64, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(54, 162, 235, 0.8)'
          ],
          borderColor: [
            'rgba(255, 159, 64, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(54, 162, 235, 1)'
          ],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: { stepSize: 1 }
          }
        },
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: 'Resumen de Tareas',
            font: { size: 16 }
          }
        }
      }
    });
  }
}

