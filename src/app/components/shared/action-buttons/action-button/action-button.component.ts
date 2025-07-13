import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionButtonConfig } from '../action-buttons';

@Component({
  selector: 'app-action-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button 
      class="action-btn"
      [class.active]="isActive()"
      [class.disabled]="config().enabled === false"
      [title]="config().tooltip" 
      [disabled]="config().enabled === false"
      (click)="onButtonClick($event)">
      <span class="btn-icon">{{ config().icon }}</span>
      <span class="btn-text">{{ config().text }}</span>
    </button>
  `,
  styleUrl: '../action-buttons.scss'
})
export class ActionButtonComponent {
  config = signal<ActionButtonConfig>({
    id: '',
    icon: '',
    text: '',
    tooltip: '',
    type: 'action'
  });
  
  isActive = signal<boolean>(false);
  
  @Output() buttonClick = new EventEmitter<{ config: ActionButtonConfig, event: Event }>();
  
  onButtonClick(event: Event): void {
    if (this.config().enabled !== false) {
      this.buttonClick.emit({ config: this.config(), event });
    }
  }
  
  updateConfig(newConfig: ActionButtonConfig): void {
    this.config.set(newConfig);
  }
  
  setActive(active: boolean): void {
    this.isActive.set(active);
  }
}
