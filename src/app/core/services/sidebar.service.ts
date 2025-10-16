import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  private isCollapsed = new BehaviorSubject(false);
  isCollapsed$ = this.isCollapsed.asObservable();

  toggle() {
    this.isCollapsed.next(!this.isCollapsed.value);
  }
}
