/** ANGULAR (CORE) */
import { Component, input, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MainDashboardRow } from './dashboard-list.component';

@Component({
  selector: 'app-dashboard-list-v3',
  template: `
    <div>
      <div class="dashboard-card-header">Main Dashboard (V3 - Modern Control Flow)</div>
      <table class="dashboard-table">
        <thead>
          <tr>
            <th>Start</th>
            <th>End</th>
            <th>Event Name</th>
            <th>Event ID</th>
            <th>Venue / Sub Venue</th>
            <th>City / State</th>
            <th>Providing</th>
            <th>Status</th>
            <th>To Do</th>
            <th>Set $</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          @for (row of data(); track row.eventId.html) {
            <tr (click)="openEventDetail(row.eventId.html)" style="cursor:pointer;">
              <td>{{ row.start }}</td>
              <td>{{ row.end }}</td>
              <td>{{ row.eventName }}</td>
              <td [innerHTML]="row.eventId.html"></td>
              <td>{{ row.venue }}</td>
              <td>{{ row.cityState }}</td>
              <td>{{ row.providing }}</td>
              <td>
                @if (row.daysOut !== undefined) {
                  @if (row.daysOut === 0) {
                    <span class="status live">Live</span>
                  } @else if (row.daysOut > 0) {
                    <span class="status future">{{ row.daysOut }} days</span>
                  } @else {
                    <span class="status past">Past</span>
                  }
                } @else {
                  <span class="status live">Live</span>
                }
              </td>
              <td>{{ row.toDo }}</td>
              <td>0</td>
              <td>
                <button class="icon-btn">
                  <span class="icon-placeholder">✏️</span>
                </button>
              </td>
            </tr>
          } @empty {
            <tr>
              <td colspan="11" style="text-align: center; color: #666; font-style: italic;">
                No events found
              </td>
            </tr>
          }
        </tbody>
      </table>
      <div style="margin-top: 8px; font-size: 12px; color: #666;">
        🆕 V3 Service | Real-time: {{ data().length }} events
      </div>
    </div>
  `,
  styleUrl: '../../../../app.scss',
})
export class DashboardListV3Component {
  /** INPUT SIGNALS - Modern Angular approach */
  data = input.required<MainDashboardRow[]>();

  public router = inject(Router);
  constructor() {
    console.log('🆕 DashboardListV3Component created with modern control flow');
  }

  openEventDetail(eventIdHtml: string) {
    // Extract event ID from HTML string (e.g., <span class="event-id">8591</span>)
    const match = eventIdHtml.match(/>([^<]+)</);
    const eventId = match ? match[1].trim() : 'unknown';
    console.log('[DashboardListV3] Clicked event row:', { eventIdHtml, eventId });
    this.router.navigate(['event', eventId]);
  }
}
