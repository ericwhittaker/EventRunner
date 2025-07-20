import { Component, input, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BaseDashboardRow, calculateEmptyRows } from '../../dashboard-list-types';
import { getStatusClass } from '../../dashboard-utils';

export interface MainDashboardRow extends BaseDashboardRow {
  eventId: { html: string };
  venue: string;
  cityState: string;
  providing: string;
  toDo: number; // Count of todos
  daysOut?: number; // Days until/since event (shows in Status column)
}

/** Need to move this interface to the v3 dashboard and change the name of dashboard to events i think and clean up the other events component...
 * Maybe call it eventsListView and eventsDetailedView? 
 */

@Component({
  selector: 'app-dashboard-list',
  standalone: true,
  imports: [CommonModule],
  template: ``,
  styles: [`
    .status-cell {
      text-align: center;
      font-weight: 600;
      padding: 4px 8px;
      border-radius: 4px;
    }
    
    /* Live event - Vibrant Green */
    .status-live {
      background-color: #00e676 !important;
      color: white !important;
    }
    
    /* Urgent (1-14 days) - Red */
    .status-urgent {
      background-color: #F44336;
      color: white;
    }
    
    /* Soon (15-30 days) - Orange */
    .status-soon {
      background-color: #FF9800;
      color: white;
    }
    
    /* Future (31-60 days) - Yellow */
    .status-future {
      background-color: #FFC107;
      color: black;
    }
    
    /* Far future (60+ days) - Blue */
    .status-far-future {
      background-color: #2196F3;
      color: white;
    }
    
    /* Past events - Gray */
    .status-past {
      background-color: #9E9E9E;
      color: white;
    }
  `],
  styleUrls: ['./dashboard-list.component.scss']
})
export class DashboardListComponent {
  private router = inject(Router);

  // Modern functional input signal
  data = input.required<MainDashboardRow[]>();
  
  // Internal signal for the data (if needed for additional processing)
  private _dataSignal = computed(() => {
    const inputData = this.data();
    console.log('📊 Main Dashboard List received data:', inputData);
    return inputData;
  });
  
  // Getter for template usage
  get dataSignal() {
    return this._dataSignal;
  }

  openEvent(row: MainDashboardRow) {
    // Extract event ID from HTML (e.g., "8591" from '<span class="event-id">8591</span>')
    const eventId = row.eventId.html.match(/>\s*(\d+)\s*</)?.[1] || 'unknown';
    this.router.navigate(['/event', eventId]);
  }

  // Calculate empty rows to maintain consistent table height
  private maxRows = 10;
  
  emptyRows = computed(() => {
    return calculateEmptyRows(this._dataSignal().length, this.maxRows);
  });

  getDaysOutClass(daysOut: number | undefined): string {
    return getStatusClass(daysOut);
  }
}
