import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileMakerMigrationService } from '../services/filemaker-migration-new.service';

@Component({
  selector: 'app-migration',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="migration-container">
      <h2>FileMaker to Firestore Migration</h2>
      
      <div class="upload-section">
        <h3>Upload CSV Files</h3>
        <p>Export your FileMaker tables as CSV files and upload them here. <br>
        <strong>Test Mode:</strong> Only the first 10 records from each table will be migrated.</p>
        
        <div class="file-uploads">
          <div class="file-upload">
            <label for="events-file">Events CSV:</label>
            <input type="file" id="events-file" accept=".csv" (change)="onFileSelected($event, 'EVENTS')">
            <span class="file-status" [class.uploaded]="uploadedFiles()['EVENTS']">
              {{ uploadedFiles()['EVENTS'] ? '✓ Uploaded' : 'No file' }}
            </span>
          </div>
          
          <div class="file-upload">
            <label for="venues-file">Venues CSV:</label>
            <input type="file" id="venues-file" accept=".csv" (change)="onFileSelected($event, 'VENUES')">
            <span class="file-status" [class.uploaded]="uploadedFiles()['VENUES']">
              {{ uploadedFiles()['VENUES'] ? '✓ Uploaded' : 'No file' }}
            </span>
          </div>
          
          <div class="file-upload">
            <label for="contacts-file">Contacts CSV:</label>
            <input type="file" id="contacts-file" accept=".csv" (change)="onFileSelected($event, 'CONTACTS')">
            <span class="file-status" [class.uploaded]="uploadedFiles()['CONTACTS']">
              {{ uploadedFiles()['CONTACTS'] ? '✓ Uploaded' : 'No file' }}
            </span>
          </div>
          
          <div class="file-upload">
            <label for="vehicles-file">Vehicles CSV:</label>
            <input type="file" id="vehicles-file" accept=".csv" (change)="onFileSelected($event, 'VEHICLES')">
            <span class="file-status" [class.uploaded]="uploadedFiles()['VEHICLES']">
              {{ uploadedFiles()['VEHICLES'] ? '✓ Uploaded' : 'No file' }}
            </span>
          </div>
        </div>
      </div>
      
      <div class="migration-controls">
        <button 
          (click)="startMigration()" 
          [disabled]="migrationService.migrationStatus() === 'running' || getUploadedFilesCount() === 0"
          class="migrate-btn">
          {{ migrationService.migrationStatus() === 'running' ? 'Migrating...' : 'Start Migration' }}
        </button>
        
        <button 
          (click)="clearData()" 
          [disabled]="migrationService.migrationStatus() === 'running'"
          class="clear-btn">
          Clear Migration Data
        </button>
      </div>
      
      <div class="migration-status" *ngIf="migrationService.migrationStatus() !== 'idle'">
        <h3>Migration Status</h3>
        <div class="progress-bar">
          <div class="progress-fill" [style.width.%]="migrationService.migrationProgress()"></div>
        </div>
        <p>{{ migrationService.migrationProgress() }}% Complete</p>
        <p class="status">Status: {{ migrationService.migrationStatus() }}</p>
      </div>
      
      <div class="migration-logs" *ngIf="migrationService.migrationLogs().length > 0">
        <h3>Migration Logs</h3>
        <div class="logs-container">
          <div *ngFor="let log of migrationService.migrationLogs(); trackBy: trackByLog" class="log-entry">
            {{ log }}
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .migration-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      font-family: Arial, sans-serif;
    }
    
    .upload-section {
      margin-bottom: 30px;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 8px;
    }
    
    .file-uploads {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 15px;
    }
    
    .file-upload {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
    
    .file-upload label {
      font-weight: bold;
      color: #333;
    }
    
    .file-upload input[type="file"] {
      padding: 5px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    
    .file-status {
      font-size: 12px;
      color: #666;
    }
    
    .file-status.uploaded {
      color: #4CAF50;
      font-weight: bold;
    }
    
    .migration-controls {
      display: flex;
      gap: 10px;
      margin-bottom: 30px;
    }
    
    .migrate-btn, .clear-btn {
      padding: 12px 24px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
      font-weight: bold;
    }
    
    .migrate-btn {
      background-color: #4CAF50;
      color: white;
    }
    
    .migrate-btn:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
    
    .clear-btn {
      background-color: #f44336;
      color: white;
    }
    
    .clear-btn:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
    
    .migration-status {
      margin-bottom: 30px;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 8px;
    }
    
    .progress-bar {
      width: 100%;
      height: 20px;
      background-color: #f0f0f0;
      border-radius: 10px;
      overflow: hidden;
      margin: 10px 0;
    }
    
    .progress-fill {
      height: 100%;
      background-color: #4CAF50;
      transition: width 0.3s ease;
    }
    
    .status {
      font-weight: bold;
      text-transform: capitalize;
    }
    
    .migration-logs {
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 8px;
    }
    
    .logs-container {
      max-height: 300px;
      overflow-y: auto;
      background-color: #f9f9f9;
      padding: 10px;
      border-radius: 4px;
    }
    
    .log-entry {
      font-family: monospace;
      font-size: 12px;
      margin-bottom: 5px;
      padding: 2px 0;
    }
    
    .log-entry:contains("✓") {
      color: #4CAF50;
    }
    
    .log-entry:contains("✗") {
      color: #f44336;
    }
  `]
})
export class MigrationComponent {
  uploadedFiles = signal<{ [key: string]: boolean }>({});
  csvData: { [tableName: string]: any[] } = {};

  constructor(public migrationService: FileMakerMigrationService) {}

  getUploadedFilesCount(): number {
    return Object.keys(this.uploadedFiles()).length;
  }

  onFileSelected(event: any, tableName: string) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const csvContent = e.target?.result as string;
        this.csvData[tableName] = this.migrationService.parseCsvData(csvContent);
        this.uploadedFiles.update(files => ({ ...files, [tableName]: true }));
      };
      reader.readAsText(file);
    }
  }

  async startMigration() {
    if (Object.keys(this.csvData).length === 0) {
      alert('Please upload at least one CSV file before starting migration.');
      return;
    }

    try {
      await this.migrationService.migrateFromFileMaker(this.csvData);
      alert('Migration completed successfully!');
    } catch (error) {
      alert(`Migration failed: ${error}`);
    }
  }

  async clearData() {
    if (confirm('Are you sure you want to clear all migration data? This cannot be undone.')) {
      await this.migrationService.clearMigrationData();
      alert('Migration data cleared successfully!');
    }
  }

  trackByLog(index: number, log: string): string {
    return log;
  }
}
