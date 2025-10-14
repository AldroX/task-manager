import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { SideBarComponent } from './side-bar/side-bar.component';
import { MainComponent } from './main/main.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [HeaderComponent, SideBarComponent, MainComponent],
  template: `
<app-header></app-header>
<div class="layout-container">
  <app-side-bar></app-side-bar>
  <app-main></app-main>
</div>
  `,
  styleUrl: './layout.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent { }
