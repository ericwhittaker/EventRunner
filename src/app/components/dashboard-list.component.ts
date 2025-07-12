import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface MainDashboardRow {
  start: string;
  end: string;
  eventName: string;
  eventId: { html: string };
  venue: string;
  cityState: string;
  providing: string;
  status: { html: string };
  toDo?: string;
  setS?: string;
  notes?: string;
}

@Component({
  selector: 'app-dashboard-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-card">
      <div class="dashboard-card-header">Main Dashboard</div>
      <div class="dashboard-card-content">
        <table class="main-dashboard-table">
          <thead>
            <tr>
              <th style="width: 8%">Start</th>
              <th style="width: 8%">End</th>
              <th style="width: 28%">Event Name</th>
              <th style="width: 8%">Event ID</th>
              <th style="width: 20%">Venue / Sub Venue</th>
              <th style="width: 12%">City / State</th>
              <th style="width: 8%">Providing</th>
              <th style="width: 8%">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let row of data">
              <td>{{ row.start }}</td>
              <td>{{ row.end }}</td>
              <td class="event-name">{{ row.eventName }}</td>
              <td [innerHTML]="row.eventId.html"></td>
              <td class="venue">{{ row.venue }}</td>
              <td>{{ row.cityState }}</td>
              <td>{{ row.providing }}</td>
              <td [innerHTML]="row.status.html"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .main-dashboard-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 11px;
    }
    
    .main-dashboard-table th {
      background: #e8f0fe;
      color: #1a1a1a;
      font-weight: 600;
      padding: 6px 8px;
      border-bottom: 1px solid #c1d5f0;
      text-align: left;
      font-size: 11px;
    }
    
    .main-dashboard-table td {
      padding: 4px 8px;
      border-bottom: 1px solid #f0f3f7;
      font-size: 11px;
      color: #333;
    }
    
    .event-name {
      font-weight: 500;
    }
    
    .venue {
      color: #555;
    }
    
    :host ::ng-deep .event-id {
      background: #e3f2fd;
      color: #1565c0;
      padding: 2px 6px;
      border-radius: 3px;
      font-weight: 600;
      font-size: 10px;
    }
    
    :host ::ng-deep .status {
      border-radius: 12px;
      padding: 3px 8px;
      font-size: 10px;
      font-weight: 600;
      color: white;
      display: inline-block;
      min-width: 16px;
      text-align: center;
    }
    
    :host ::ng-deep .status.live {
      background: #4caf50;
    }
  `]
})
export class DashboardListComponent {
  @Input() data: MainDashboardRow[] = [];
}
