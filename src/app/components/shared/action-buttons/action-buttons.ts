import { Component, ViewChild, ElementRef, OnInit, OnDestroy, signal, computed, Type, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionInfo } from './action-components/action-info/action-info/action-info';
import { ActionRelatedApps } from './action-components/action-related-apps/action-related-apps';
import { ActionButtonService } from './action-button.service';

export type ActionButtonType = 'action' | 'popover';

export interface ActionButtonConfig {
  id: string;
  icon: string;
  text: string;
  tooltip: string;
  type: ActionButtonType;
  enabled?: boolean;
  visible?: boolean;
  action?: () => void;
  component?: Type<any>;
  popoverConfig?: {
    title?: string;
    width?: string;
    maxWidth?: string;
    position?: 'bottom' | 'top' | 'left' | 'right';
  };
}

@Component({
  selector: 'action-buttons',
  imports: [CommonModule, ActionInfo, ActionRelatedApps],
  templateUrl: './action-buttons.html',
  styleUrl: './action-buttons.scss'
})
export class ActionButtons implements OnInit, OnDestroy {
  @ViewChild('popoverContainer') popoverContainer!: ElementRef;
  
  private actionButtonService = inject(ActionButtonService);
  
  activePopover = signal<string | null>(null);
  
  // Get buttons from service
  buttons = this.actionButtonService.visibleButtons;

  ngOnInit() {
    // Add global click listener to close popovers
    document.addEventListener('click', this.onDocumentClick.bind(this));
    document.addEventListener('keydown', this.onKeyDown.bind(this));
  }

  ngOnDestroy() {
    // Clean up event listeners
    document.removeEventListener('click', this.onDocumentClick.bind(this));
    document.removeEventListener('keydown', this.onKeyDown.bind(this));
  }

  private onDocumentClick(event: Event) {
    if (this.activePopover()) {
      const target = event.target as HTMLElement;
      const popoverElement = this.popoverContainer?.nativeElement;
      
      // Close if click is outside the popover
      if (popoverElement && !popoverElement.contains(target)) {
        this.closePopover();
      }
    }
  }

  private onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape' && this.activePopover()) {
      this.closePopover();
    }
  }

  getActiveButtonText(): string {
    const activeButton = this.buttons().find(btn => btn.id === this.activePopover());
    return activeButton?.text || '';
  }
  
  getActiveButtonTitle(): string {
    const activeButton = this.buttons().find(btn => btn.id === this.activePopover());
    return activeButton?.popoverConfig?.title || activeButton?.text || '';
  }
  
  getPopoverWidth(): string {
    const activeButton = this.buttons().find(btn => btn.id === this.activePopover());
    return activeButton?.popoverConfig?.width || '400px';
  }

  onButtonClick(button: ActionButtonConfig, event: Event) {
    if (button.enabled === false) return;
    
    if (button.type === 'action' && button.action) {
      button.action();
    } else if (button.type === 'popover') {
      this.togglePopover(button.id, event);
    }
  }

  togglePopover(buttonId: string, event: Event) {
    event.stopPropagation();
    
    if (this.activePopover() === buttonId) {
      this.closePopover();
    } else {
      this.activePopover.set(buttonId);
      // Position popover below the clicked button
      this.positionPopover(event.target as HTMLElement);
    }
  }

  closePopover() {
    this.activePopover.set(null);
  }

  private positionPopover(buttonElement: HTMLElement) {
    // Will position the popover relative to the clicked button
    setTimeout(() => {
      const popover = this.popoverContainer?.nativeElement;
      if (popover && buttonElement) {
        const buttonRect = buttonElement.getBoundingClientRect();
        popover.style.position = 'absolute';
        popover.style.top = `${buttonRect.bottom + 5}px`;
        popover.style.left = `${buttonRect.left}px`;
        popover.style.zIndex = '1000';
      }
    });
  }
  
  // Service delegation methods for external use
  updateButton(buttonId: string, updates: Partial<ActionButtonConfig>): void {
    this.actionButtonService.updateButton(buttonId, updates);
  }
  
  addButton(button: ActionButtonConfig): void {
    this.actionButtonService.addButton(button);
  }
  
  removeButton(buttonId: string): void {
    this.actionButtonService.removeButton(buttonId);
  }
}
