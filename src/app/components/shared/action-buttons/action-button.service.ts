import { Injectable, signal, computed } from '@angular/core';
import { ActionButtonConfig } from './action-buttons';
import { ActionInfo } from './action-components/action-info/action-info/action-info';
import { ActionRelatedApps } from './action-components/action-related-apps/action-related-apps';

@Injectable({
  providedIn: 'root'
})
export class ActionButtonService {
  
  private buttonConfigs = signal<ActionButtonConfig[]>([
    {
      id: 'add-event',
      icon: '➕',
      text: 'Add Event',
      tooltip: 'Add new event',
      type: 'action',
      enabled: true,
      visible: true,
      action: () => this.onAddEvent()
    },
    {
      id: 'refresh',
      icon: '🔄',
      text: 'Refresh',
      tooltip: 'Refresh application',
      type: 'action',
      enabled: true,
      visible: true,
      action: () => this.onRefreshApp()
    },
    {
      id: 'info',
      icon: 'ℹ️',
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
      icon: '⚙️',
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
    console.log('Add Event clicked');
    // TODO: Implement add event modal/functionality
    // Could emit an event or call a service method
  }

  private onRefreshApp(): void {
    console.log('Refresh App clicked');
    // For Electron apps, use a more reliable refresh method
    if (typeof window !== 'undefined' && (window as any).electronAPI) {
      // If you have electron API exposed, use it
      (window as any).electronAPI.reload();
    } else {
      // Fallback to standard reload, but with better error handling
      try {
        window.location.reload();
      } catch (error) {
        console.error('Failed to reload application:', error);
        // Alternative refresh method for Electron
        window.location.href = window.location.href;
      }
    }
  }
}
