import { Component, Input, signal, computed } from '@angular/core';
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
      <div class="dashboard-card-header">{{ title() }}</div>
      <div class="dashboard-card-content">
        <table class="dashboard-table">
          <thead>
            <tr>
              @for (column of columns(); track column.key) {
                <th [style.width]="column.width">
                  {{ column.header }}
                </th>
              }
            </tr>
          </thead>
          <tbody>
            @for (row of data(); track $index) {
              <tr>
                @for (column of columns(); track column.key) {
                  <td [innerHTML]="getCellValue(row, column.key)"></td>
                }
              </tr>
            }
            <!-- Empty rows to maintain consistent height -->
            @for (emptyRow of emptyRows(); track emptyRow) {
              <tr class="empty-row">
                @for (column of columns(); track column.key) {
                  <td>&nbsp;</td>
                }
              </tr>
            }
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
  title = signal<string>('');
  columns = signal<DashboardColumn[]>([]);
  data = signal<DashboardRow[]>([]);
  minRows = signal<number>(8); // Minimum rows to display for consistent height
  
  emptyRows = computed(() => {
    const emptyRowCount = Math.max(0, this.minRows() - this.data().length);
    return new Array(emptyRowCount).fill(0).map((_, i) => i);
  });
  
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
