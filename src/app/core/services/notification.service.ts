import { inject, Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private snackBar = inject(MatSnackBar);

  private defaultConfig: MatSnackBarConfig = {
    duration: 3000,
    horizontalPosition: 'center',
    verticalPosition: 'bottom',
  };

  success(message: string, action: string = 'Cerrar'): void {
    this.snackBar.open(message, action, {
      ...this.defaultConfig,
      panelClass: ['snackbar-success'],
    });
  }

  error(message: string, action: string = 'Cerrar'): void {
    this.snackBar.open(message, action, {
      ...this.defaultConfig,
      duration: 5000, // Errores duran más tiempo
      panelClass: ['snackbar-error'],
    });
  }

  warning(message: string, action: string = 'Cerrar'): void {
    this.snackBar.open(message, action, {
      ...this.defaultConfig,
      panelClass: ['snackbar-warning'],
    });
  }

  info(message: string, action: string = 'Cerrar'): void {
    this.snackBar.open(message, action, {
      ...this.defaultConfig,
      panelClass: ['snackbar-info'],
    });
  }

  // Snackbar personalizado
  show(
    message: string,
    action: string = 'Cerrar',
    config?: MatSnackBarConfig
  ): void {
    this.snackBar.open(message, action, {
      ...this.defaultConfig,
      ...config,
    });
  }
}
