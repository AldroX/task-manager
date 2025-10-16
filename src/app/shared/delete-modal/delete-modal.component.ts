import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-delete-modal',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatIcon],
  templateUrl: './delete-modal.component.html',
  styleUrl: './delete-modal.component.scss'
})
export class DeleteModalComponent {
  constructor(
    private dialogRef:MatDialogRef<DeleteModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; message: string }
  ) { }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
  onCancel(): void {
    this.dialogRef.close(false);
  }
}
