import { Component, Input, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface BaseDashboardRow {
  start: string;
  end: string;
  eventName: string;
  [key: string]: any; // Allow additional properties
}

export interface DashboardColumnConfig {
  key: string;
  label: string;
  width: string;
  isHtml?: boolean;
  cssClass?: string;
}

@Component({
  selector: 'app-base-dashboard-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-card-header">{{ title }}</div>
    <div class="dashboard-card-content">
      <table [class]="tableClass">
        <thead>
          <tr>
            @for (column of columns; track column.key) {
              <th [style.width]="column.width">{{ column.label }}</th>
            }
          </tr>
        </thead>
        <tbody>
          @for (row of dataSignal(); track trackByFn(row)) {
            <tr [class]="getRowClass(row)" (click)="onRowClick(row)">
              @for (column of columns; track column.key) {
                <td 
                  [class]="column.cssClass || ''"
                  [innerHTML]="column.isHtml ? getCellValue(row, column.key)?.html || getCellValue(row, column.key) : ''"
                >
                  @if (!column.isHtml) {
                    {{ getCellValue(row, column.key) }}
                  }
                </td>
              }
            </tr>
          }
          <!-- Empty rows to maintain consistent height -->
          @for (i of emptyRows(); track i) {
            <tr class="empty-row">
              @for (column of columns; track column.key) {
                <td>&nbsp;</td>
              }
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styleUrls: []
})
export class BaseDashboardListComponent<T extends BaseDashboardRow> {
  @Input() data: T[] = [];
  @Input() title: string = '';
  @Input() columns: DashboardColumnConfig[] = [];
  @Input() tableClass: string = 'dashboard-table';
  @Input() maxRows: number = 10;
  @Input() trackByField: string = 'eventName';
  @Input() clickable: boolean = false;

  dataSignal = signal<T[]>([]);
  
  emptyRowsCount = computed(() => {
    const currentRows = this.dataSignal().length;
    return Math.max(0, this.maxRows - currentRows);
  });

  emptyRows = computed(() => {
    return Array(this.emptyRowsCount()).fill(0).map((_, i) => i);
  });

  ngOnInit() {
    this.dataSignal.set(this.data);
  }

  ngOnChanges() {
    this.dataSignal.set(this.data);
  }

  getCellValue(row: T, key: string): any {
    return row[key];
  }

  trackByFn(row: T): any {
    return row[this.trackByField];
  }

  getRowClass(row: T): string {
    return this.clickable ? 'clickable-row' : '';
  }

  onRowClick(row: T): void {
    if (this.clickable) {
      // Override in child components
    }
  }
}
