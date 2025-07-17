import { Component, input, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BaseDashboardRow, calculateEmptyRows } from './shared/dashboard-list-types';
import { getStatusClass } from './shared/dashboard-utils';

export interface MainDashboardRow extends BaseDashboardRow {
  eventId: { html: string };
  venue: string;
  cityState: string;
  providing: string;
  toDo: number; // Count of todos
  daysOut?: number; // Days until/since event (shows in Status column)
}

@Component({
  selector: 'app-dashboard-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-card-header">Main Dashboard</div>
    <div class="dashboard-card-content">
      <table class="main-dashboard-table">
        <thead>
          <tr>
            <th style="width: 7%">Start</th>
            <th style="width: 7%">End</th>
            <th style="width: 26%">Event Name</th>
            <th style="width: 7%">Event ID</th>
            <th style="width: 18%">Venue / Sub Venue</th>
            <th style="width: 11%">City / State</th>
            <th style="width: 8%">Providing</th>
            <th style="width: 4%">Status</th>
            <th style="width: 4%">To Do</th>
            <th style="width: 3%">Set $</th>
            <th style="width: 3%">Notes</th>
            <th style="width: 2%">Info</th>
          </tr>
        </thead>
        <tbody>
          @for (row of dataSignal(); track row.eventId) {
            <tr class="event-row clickable-row" (click)="openEvent(row)">
              <td>{{ row.start }}</td>
              <td>{{ row.end }}</td>
              <td class="event-name">{{ row.eventName }}</td>
              <td [innerHTML]="row.eventId.html"></td>
              <td class="venue">{{ row.venue }}</td>
              <td>{{ row.cityState }}</td>
              <td>{{ row.providing }}</td>
              <td class="status-cell" [ngClass]="getDaysOutClass(row.daysOut)">
                {{ row.daysOut !== undefined ? row.daysOut : 'Live' }}
              </td>
              <td class="todo-count">{{ row.toDo }}</td>
              <td class="set-money">$</td>
              <td class="notes-cell">📝</td>
              <td class="info-cell"><i class="info-icon">ℹ</i></td>
            </tr>
          }
          <!-- Empty rows to maintain height -->
          @for (i of emptyRows(); track i) {
            <tr class="empty-row">
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
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
