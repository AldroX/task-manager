import { Component, HostBinding, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { SidebarService } from 'app/core/services/sidebar.service';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [CommonModule, MatSidenavModule, MatListModule, MatIconModule, MatButtonModule, RouterLink, MatTooltipModule,],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss',
})
export class SideBarComponent implements OnInit {
  sideBarService = inject(SidebarService);
  isExpanded = true;
  @HostBinding('class.collapsed')
  get collapsed(): boolean {
    return !this.isExpanded;
  }

  ngOnInit(): void {
    this.sideBarService.isCollapsed$.subscribe((isCollapsed) => {
      this.isExpanded = !isCollapsed;
    });
  }

  toggleSidebar() {
    this.sideBarService.toggle();
  }
}
