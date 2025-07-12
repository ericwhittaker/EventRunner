import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface DashboardColumn {
  key: string;
  header: string;
  width?: string;
}

export interface DashboardRow {
  [key: string]: any;
}

@Component({
  selector: 'app-dashboard-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-card-container">
      <div class="dashboard-card-header">{{ title }}</div>
      <div class="dashboard-card-content">
        <table class="dashboard-table">
          <thead>
            <tr>
              <th *ngFor="let column of columns" [style.width]="column.width">
                {{ column.header }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let row of data; let i = index">
              <td *ngFor="let column of columns" [innerHTML]="getCellValue(row, column.key)"></td>
            </tr>
            <!-- Empty rows to maintain consistent height -->
            <tr *ngFor="let emptyRow of emptyRows" class="empty-row">
              <td *ngFor="let column of columns">&nbsp;</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-card-container {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    
    .dashboard-card-content {
      flex: 1;
      overflow: hidden;
      padding: 0;
    }
    
    .empty-row td {
      height: 28px;
      border-bottom: 1px solid #f0f3f7;
      padding: 4px 8px;
    }
  `]
})
export class DashboardCardComponent {
  @Input() title: string = '';
  @Input() columns: DashboardColumn[] = [];
  @Input() data: DashboardRow[] = [];
  @Input() minRows: number = 8; // Minimum rows to display for consistent height
  
  get emptyRows(): any[] {
    const emptyRowCount = Math.max(0, this.minRows - this.data.length);
    return new Array(emptyRowCount);
  }
  
  getCellValue(row: DashboardRow, key: string): string {
    const value = row[key];
    if (typeof value === 'string') {
      return value;
    } else if (typeof value === 'object' && value.html) {
      return value.html;
    }
    return String(value || '');
  }
}
