import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  @Output() sectionSelected = new EventEmitter<string>();
  selected: string = 'clientes';

  navigate(section: string) {
    this.selected = section;
    this.sectionSelected.emit(section);
  }
}
