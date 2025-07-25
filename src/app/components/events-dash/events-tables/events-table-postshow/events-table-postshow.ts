import { Component, input, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BaseDashboardRow, calculateEmptyRows } from '../../dashboard-list-types';

export interface PostShowRow extends BaseDashboardRow {
  eventId: string;
  cityState: string;
  toDo: number; // Count of todos
  setS: { html: string };
}

@Component({
  selector: 'er-events-table-postshow',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-card-header">Post Show / Follow Up</div>
    <div class="dashboard-card-content">
      <table class="postshow-table">
        <thead>
          <tr>
            <th style="width: 13%">Start</th>
            <th style="width: 13%">End</th>
            <th style="width: 28%">Event Name</th>
            <th style="width: 13%">City / State</th>
            <th style="width: 7%">To Do</th>
            <th style="width: 5%">Info</th>
            <th style="width: 9%">Set S</th>
          </tr>
        </thead>
        <tbody>
          @for (row of dataSignal(); track row.eventId) {
            <tr class="clickable-row">
              <td>{{ row.start }}</td>
              <td>{{ row.end }}</td>
              <td class="event-name">{{ row.eventName }}</td>
              <td>{{ row.cityState }}</td>
              <td class="todo-count">{{ row.toDo }}</td>
              <td class="info-cell"><i class="info-icon">ℹ</i></td>
              <td [innerHTML]="row.setS.html"></td>
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
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .postshow-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 11px;
    }
    
    .postshow-table th {
      background: #e8f0fe;
      color: #1a1a1a;
      font-weight: 600;
      padding: 6px 8px;
      border-bottom: 1px solid #c1d5f0;
      text-align: left;
      font-size: 11px;
    }
    
    .postshow-table td {
      padding: 4px 8px;
      border-bottom: 1px solid #f0f3f7;
      font-size: 11px;
      color: #333;
    }
    
    .empty-row td {
      height: 24px;
    }
    
    .event-name {
      font-weight: 500;
    }
    
    .todo-cell {
      text-align: center;
      font-weight: 600;
    }
    
    :host ::ng-deep .info-icon {
      color: #2196f3;
      font-weight: bold;
      cursor: pointer;
    }
    
    :host ::ng-deep .check-icon {
      color: #4caf50;
      font-weight: bold;
    }
  `]
})
export class EventsTablePostShowComponent {
  private router = inject(Router);

  // Modern functional input signal
  data = input.required<PostShowRow[]>();
  
  // Internal signal for the data with logging
  private _dataSignal = computed(() => {
    const inputData = this.data();
    console.log('📊 Post Show List received data:', inputData);
    return inputData;
  });
  
  private maxRows = 6;
  
  emptyRows = computed(() => {
    return calculateEmptyRows(this._dataSignal().length, this.maxRows);
  });
  
  // Getter for template usage
  get dataSignal() {
    return this._dataSignal;
  }
}
