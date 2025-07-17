import { Injectable, signal, computed, inject } from '@angular/core';
import { ActionButtonConfig } from './action-buttons';
import { ActionInfo } from './action-components/action-info/action-info/action-info';
import { ActionRelatedApps } from './action-components/action-related-apps/action-related-apps';
import { DialogService } from '../../../services/dialog.service';
import { AddEventDialogComponent } from '../../dialogs/add-event-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ActionButtonService {
  private dialogService = inject(DialogService);
  
  private buttonConfigs = signal<ActionButtonConfig[]>([
    {
      id: 'add-event',
      icon: 'fas fa-plus',
      text: 'Add Event',
      tooltip: 'Add new event',
      type: 'action',
      enabled: true,
      visible: true,
      action: () => this.onAddEvent()
    },
    {
      id: 'info',
      icon: 'fas fa-info-circle',
      text: 'Info',
      tooltip: 'EventRunner information',
      type: 'popover',
      enabled: true,
      visible: true,
      component: ActionInfo,
      popoverConfig: {
        title: 'EventRunner Info',
        width: '400px',
        position: 'bottom'
      }
    },
    {
      id: 'tools',
      icon: 'fas fa-cog',
      text: 'Tools',
      tooltip: 'Related tools and apps',
      type: 'popover',
      enabled: true,
      visible: true,
      component: ActionRelatedApps,
      popoverConfig: {
        title: 'Related Apps & Tools',
        width: '500px',
        position: 'bottom'
      }
    }
  ]);
  
  // Get all visible buttons
  visibleButtons = computed(() => 
    this.buttonConfigs().filter(btn => btn.visible !== false)
  );
  
  // Get buttons by context/page
  getButtonsForContext(context: string): ActionButtonConfig[] {
    // This could be extended to filter buttons based on current page/context
    return this.visibleButtons();
  }
  
  // Update button configuration
  updateButton(buttonId: string, updates: Partial<ActionButtonConfig>): void {
    const currentButtons = this.buttonConfigs();
    const updatedButtons = currentButtons.map(btn => 
      btn.id === buttonId ? { ...btn, ...updates } : btn
    );
    this.buttonConfigs.set(updatedButtons);
  }
  
  // Add new button
  addButton(button: ActionButtonConfig): void {
    const currentButtons = this.buttonConfigs();
    this.buttonConfigs.set([...currentButtons, button]);
  }
  
  // Remove button
  removeButton(buttonId: string): void {
    const currentButtons = this.buttonConfigs();
    this.buttonConfigs.set(currentButtons.filter(btn => btn.id !== buttonId));
  }
  
  // Toggle button visibility
  toggleButtonVisibility(buttonId: string): void {
    this.updateButton(buttonId, { 
      visible: !this.getButton(buttonId)?.visible 
    });
  }
  
  // Enable/disable button
  setButtonEnabled(buttonId: string, enabled: boolean): void {
    this.updateButton(buttonId, { enabled });
  }
  
  // Get specific button
  getButton(buttonId: string): ActionButtonConfig | undefined {
    return this.buttonConfigs().find(btn => btn.id === buttonId);
  }
  
  // Default actions
  private onAddEvent(): void {
    console.log('🎉 Opening Add Event dialog');
    this.dialogService.openDialog(AddEventDialogComponent);
  }
}
