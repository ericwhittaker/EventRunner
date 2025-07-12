import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TentativeRow {
  start: string;
  end: string;
  eventName: string;
  status: { html: string };
  toDo: string;
  info: { html: string };
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
            <th style="width: 20%">Start</th>
            <th style="width: 20%">End</th>
            <th style="width: 35%">Event Name</th>
            <th style="width: 10%">Status</th>
            <th style="width: 8%">To Do</th>
            <th style="width: 7%">Info</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let row of data">
            <td>{{ row.start }}</td>
            <td>{{ row.end }}</td>
            <td class="event-name">{{ row.eventName }}</td>
            <td [innerHTML]="row.status.html"></td>
            <td class="todo-cell">{{ row.toDo }}</td>
            <td [innerHTML]="row.info.html"></td>
          </tr>
          <!-- Empty rows to maintain height -->
          <tr *ngFor="let i of emptyRows" class="empty-row">
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
          </tr>
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
  @Input() data: TentativeRow[] = [];
  
  get emptyRows(): number[] {
    const minRows = 6;
    const emptyCount = Math.max(0, minRows - this.data.length);
    return new Array(emptyCount).fill(0).map((_, i) => i);
  }
}
