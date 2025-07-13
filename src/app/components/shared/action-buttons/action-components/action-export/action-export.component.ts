import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-action-export',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="action-export">
      <div class="export-section">
        <h4>Export Options</h4>
        <div class="export-options">
          @for (option of exportOptions(); track option.id) {
            <button 
              class="export-option-btn" 
              (click)="selectExportOption(option)">
              <span class="option-icon">{{ option.icon }}</span>
              <div class="option-info">
                <div class="option-name">{{ option.name }}</div>
                <div class="option-description">{{ option.description }}</div>
              </div>
            </button>
          }
        </div>
      </div>
      
      <div class="export-section">
        <h4>Export Filters</h4>
        <div class="filter-options">
          <label class="filter-option">
            <input type="checkbox" checked> Include Main Dashboard
          </label>
          <label class="filter-option">
            <input type="checkbox" checked> Include Tentative Events
          </label>
          <label class="filter-option">
            <input type="checkbox" checked> Include Post Show Events
          </label>
          <label class="filter-option">
            <input type="radio" name="dateRange" checked> All Events
          </label>
          <label class="filter-option">
            <input type="radio" name="dateRange"> Last 30 Days
          </label>
          <label class="filter-option">
            <input type="radio" name="dateRange"> Custom Date Range
          </label>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .action-export {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }
    
    .export-section {
      margin-bottom: 20px;
      
      &:last-child {
        margin-bottom: 0;
      }
    }
    
    .export-section h4 {
      margin: 0 0 12px 0;
      font-size: 14px;
      font-weight: 600;
      color: #003043;
      border-bottom: 1px solid #e5e7eb;
      padding-bottom: 6px;
    }
    
    .export-options {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .export-option-btn {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
      text-align: left;
      
      &:hover {
        border-color: #00BAFB;
        background: #f8fbff;
      }
      
      &:active {
        background: #e6f7ff;
        transform: translateY(1px);
      }
    }
    
    .option-icon {
      font-size: 16px;
      width: 24px;
      text-align: center;
    }
    
    .option-info {
      flex: 1;
    }
    
    .option-name {
      font-weight: 500;
      font-size: 12px;
      color: #374151;
      margin-bottom: 2px;
    }
    
    .option-description {
      font-size: 11px;
      color: #6b7280;
      line-height: 1.3;
    }
    
    .filter-options {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .filter-option {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      color: #374151;
      cursor: pointer;
      
      input {
        margin: 0;
      }
    }
  `]
})
export class ActionExportComponent {
  exportOptions = signal([
    {
      id: 'csv',
      name: 'CSV Export',
      description: 'Export data as comma-separated values for Excel',
      icon: '📊'
    },
    {
      id: 'pdf',
      name: 'PDF Report',
      description: 'Generate a formatted PDF report',
      icon: '📄'
    },
    {
      id: 'json',
      name: 'JSON Data',
      description: 'Export raw data in JSON format for developers',
      icon: '💾'
    },
    {
      id: 'print',
      name: 'Print Preview',
      description: 'Open print-friendly view of current data',
      icon: '🖨️'
    }
  ]);
  
  selectExportOption(option: any) {
    console.log('Selected export option:', option.name);
    // TODO: Implement actual export functionality
    alert(`Exporting as ${option.name}...`);
  }
}
