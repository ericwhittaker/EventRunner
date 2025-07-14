import { Component, Input, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BaseDashboardRow, calculateEmptyRows } from './shared/dashboard-list-types';

export interface MainDashboardRow extends BaseDashboardRow {
  eventId: { html: string };
  venue: string;
  cityState: string;
  providing: string;
  toDo: number; // Count of todos
  status: { html: string };
  setS?: string;
  notes?: string;
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
            <th style="width: 24%">Event Name</th>
            <th style="width: 7%">Event ID</th>
            <th style="width: 17%">Venue / Sub Venue</th>
            <th style="width: 11%">City / State</th>
            <th style="width: 8%">Providing</th>
            <th style="width: 6%">To Do</th>
            <th style="width: 5%">Info</th>
            <th style="width: 8%">Status</th>
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
              <td class="todo-count">{{ row.toDo }}</td>
              <td class="info-cell"><i class="info-icon">ℹ</i></td>
              <td [innerHTML]="row.status.html"></td>
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
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styleUrls: ['./dashboard-list.component.scss']
})
export class DashboardListComponent {
  constructor(private router: Router) {}

  @Input() set data(value: MainDashboardRow[]) {
    this._data.set(value);
  }
  
  private _data = signal<MainDashboardRow[]>([]);
  
  // Getter for template usage
  get dataSignal() {
    return this._data;
  }

  openEvent(row: MainDashboardRow) {
    // Extract event ID from HTML (e.g., "8591" from '<span class="event-id">8591</span>')
    const eventId = row.eventId.html.match(/>\s*(\d+)\s*</)?.[1] || 'unknown';
    this.router.navigate(['/event', eventId]);
  }

  // Calculate empty rows to maintain consistent table height
  private maxRows = 10;
  
  emptyRows = computed(() => {
    return calculateEmptyRows(this._data().length, this.maxRows);
  });
}
