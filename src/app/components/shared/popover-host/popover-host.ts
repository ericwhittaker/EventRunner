import { Component, ViewChild, ElementRef, signal, effect, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, NgComponentOutlet } from '@angular/common';
import { ActionButtonService } from '../action-buttons/action-button.service';
import { ActionButtonConfig } from '../action-buttons/action-buttons';

@Component({
  selector: 'popover-host',
  standalone: true,
  imports: [CommonModule, NgComponentOutlet],
  templateUrl: './popover-host.html',
  styleUrls: ['./popover-host.scss']
})
export class PopoverHost implements AfterViewInit {
  @ViewChild('popoverContainer') popoverContainerRef!: ElementRef<HTMLElement>;

  private actionButtonService = inject(ActionButtonService);
  private cdr = inject(ChangeDetectorRef);

  activePopover = this.actionButtonService.activePopover;
  
  constructor() {
    effect(() => {
      const popoverState = this.activePopover();
      if (popoverState?.triggerElement && this.popoverContainerRef) {
        this.positionPopover(popoverState.triggerElement);
      }
    });
  }

  ngAfterViewInit() {
    // Effect might run before view is ready, so re-check
    const popoverState = this.activePopover();
    if (popoverState?.triggerElement && this.popoverContainerRef) {
      this.positionPopover(popoverState.triggerElement);
    }
  }

  closePopover() {
    this.actionButtonService.closePopover();
  }

  private positionPopover(buttonElement: HTMLElement) {
    // We need to wait for the DOM to update
    this.cdr.detectChanges();
    setTimeout(() => {
      const popoverContainer = this.popoverContainerRef?.nativeElement;
      if (popoverContainer && buttonElement) {
        const buttonRect = buttonElement.getBoundingClientRect();
        popoverContainer.style.top = `${buttonRect.bottom + 10}px`; // 10px for arrow
        popoverContainer.style.left = `${buttonRect.left}px`;
        popoverContainer.style.opacity = '1'; // Fade in
      }
    });
  }

  getPopoverWidth(): string {
    return this.activePopover()?.config.popoverConfig?.width || '400px';
  }

  getActiveButtonTitle(): string {
    const config = this.activePopover()?.config;
    return config?.popoverConfig?.title || config?.text || '';
  }
}
