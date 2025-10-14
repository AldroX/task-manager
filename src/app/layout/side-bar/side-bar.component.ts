import { Component, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [CommonModule, MatSidenavModule, MatListModule, MatIconModule, MatButtonModule, RouterLink],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss',
})
export class SideBarComponent {
  isExpanded = true;
  @HostBinding('class.collapsed')
  get collapsed(): boolean {
    return !this.isExpanded;
  }

  toggleSidebar() {
    this.isExpanded = !this.isExpanded;
  }
}
