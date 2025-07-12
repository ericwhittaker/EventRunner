import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface PostShowRow {
  start: string;
  end: string;
  eventName: string;
  cityState: string;
  info: { html: string };
  toDo: string;
  setS: { html: string };
}

@Component({
  selector: 'app-postshow-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-card">
      <div class="dashboard-card-header">Post Show / Follow Up</div>
      <div class="dashboard-card-content">
        <table class="postshow-table">
          <thead>
            <tr>
              <th style="width: 15%">Start</th>
              <th style="width: 15%">End</th>
              <th style="width: 30%">Event Name</th>
              <th style="width: 15%">City / State</th>
              <th style="width: 8%">Info</th>
              <th style="width: 8%">To Do</th>
              <th style="width: 9%">Set S</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let row of data">
              <td>{{ row.start }}</td>
              <td>{{ row.end }}</td>
              <td class="event-name">{{ row.eventName }}</td>
              <td>{{ row.cityState }}</td>
              <td [innerHTML]="row.info.html"></td>
              <td class="todo-cell">{{ row.toDo }}</td>
              <td [innerHTML]="row.setS.html"></td>
            </tr>
            <!-- Empty rows to maintain height -->
            <tr *ngFor="let i of emptyRows" class="empty-row">
              <td>&nbsp;</td>
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
export class PostShowListComponent {
  @Input() data: PostShowRow[] = [];
  
  get emptyRows(): number[] {
    const minRows = 6;
    const emptyCount = Math.max(0, minRows - this.data.length);
    return new Array(emptyCount).fill(0).map((_, i) => i);
  }
}
