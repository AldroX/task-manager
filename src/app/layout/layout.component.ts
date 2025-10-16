import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { SideBarComponent } from './side-bar/side-bar.component';
import { MainComponent } from './main/main.component';
import { SidebarService } from 'app/core/services/sidebar.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [HeaderComponent, SideBarComponent, MainComponent, AsyncPipe],
  template: `
<app-header></app-header>
<div class="layout-container" [class.collapsed]="isCollapsed$ | async">
  <app-side-bar></app-side-bar>
  <app-main></app-main>
</div>
  `,
  styleUrl: './layout.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {
  sideBarService = inject(SidebarService);
  isCollapsed$ = this.sideBarService.isCollapsed$;
 }
