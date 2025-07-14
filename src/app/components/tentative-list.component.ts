import { Component, Input, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseDashboardRow, calculateEmptyRows } from './shared/dashboard-list-types';

export interface TentativeRow extends BaseDashboardRow {
  status: { html: string };
  toDo: number; // Count of todos
}

@Component({
  selector: 'app-tentative-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-card-header">Tentative</div>
    <div class="dashboard-card-content">
      <table class="tentative-table">
        <thead>
          <tr>
            <th style="width: 18%">Start</th>
            <th style="width: 18%">End</th>
            <th style="width: 32%">Event Name</th>
            <th style="width: 10%">Status</th>
            <th style="width: 7%">To Do</th>
            <th style="width: 5%">Info</th>
          </tr>
        </thead>
        <tbody>
          @for (row of dataSignal(); track row.eventName) {
            <tr class="clickable-row">
              <td>{{ row.start }}</td>
              <td>{{ row.end }}</td>
              <td class="event-name">{{ row.eventName }}</td>
              <td [innerHTML]="row.status.html"></td>
              <td class="todo-count">{{ row.toDo }}</td>
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
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .tentative-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 11px;
    }
    
    .tentative-table th {
      background: #e8f0fe;
      color: #1a1a1a;
      font-weight: 600;
      padding: 6px 8px;
      border-bottom: 1px solid #c1d5f0;
      text-align: left;
      font-size: 11px;
    }
    
    .tentative-table td {
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
    
    :host ::ng-deep .status {
      border-radius: 12px;
      padding: 3px 8px;
      font-size: 10px;
      font-weight: 600;
      color: white;
      display: inline-block;
      min-width: 20px;
      text-align: center;
    }
    
    :host ::ng-deep .status.urgent {
      background: #f44336;
    }
    
    :host ::ng-deep .status.warning {
      background: #ff9800;
    }
    
    :host ::ng-deep .info-icon {
      color: #2196f3;
      font-weight: bold;
      cursor: pointer;
    }
  `]
})
export class TentativeListComponent {
  @Input() set data(value: TentativeRow[]) {
    this._data.set(value);
  }
  
  private _data = signal<TentativeRow[]>([]);
  private maxRows = 6;
  
  emptyRows = computed(() => {
    return calculateEmptyRows(this._data().length, this.maxRows);
  });
  
  // Getter for template usage
  get dataSignal() {
    return this._data;
  }
}
