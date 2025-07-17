import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileMakerMigrationService } from '../services/filemaker-migration.service';
import { EventService } from '../services/event-v2.service';

@Component({
  selector: 'app-migration',
  standalone: true,
  imports: [CommonModule],
  template: `
        <div class="migration-container">
      <h2>Data Migration & Admin Tools</h2>
      
      <!-- Sample Event Generation Section -->
      <div class="upload-section">
        <h3>Generate Sample Events</h3>
        <p>Generate sample events for testing dashboard functionality (10 events: some live, some future, 2 tentative, 3 post-show)</p>
        
        <div class="migration-controls">
          <button 
            (click)="generateSampleEvents()" 
            [disabled]="isGeneratingEvents()"
            class="migrate-btn">
            {{ isGeneratingEvents() ? 'Generating...' : 'Generate Sample Events' }}
          </button>
          
          <button 
            (click)="clearSampleEvents()" 
            [disabled]="isGeneratingEvents()"
            class="clear-btn">
            Clear Sample Events
          </button>
        </div>
        
        <div class="event-generation-status" *ngIf="generationMessage()">
          <p>{{ generationMessage() }}</p>
        </div>
      </div>
      
      <!-- FileMaker Migration Section -->
      <div class="upload-section">
        <h3>FileMaker Data Migration</h3>
      
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
          [disabled]="false"
          class="migrate-btn">
          Start Migration (Disabled)
        </button>
        
        <button 
          (click)="clearData()" 
          [disabled]="false"
          class="clear-btn">
          Clear Migration Data (Disabled)
        </button>
      </div>
      
      <!--
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
      -->
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
  
  // Sample event generation signals
  isGeneratingEvents = signal<boolean>(false);
  generationMessage = signal<string>('');
  
  private eventService = inject(EventService);

  constructor(public migrationService: FileMakerMigrationService) {}

  getUploadedFilesCount(): number {
    return Object.keys(this.uploadedFiles()).length;
  }

  onFileSelected(event: any, tableName: string) {
    /*
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
    */
    console.log('FileMaker migration temporarily disabled');
  }

  async startMigration() {
    /*
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
    */
    alert('FileMaker migration temporarily disabled. Use "Generate Sample Events" instead.');
  }

  async clearData() {
    /*
    if (confirm('Are you sure you want to clear all migration data? This cannot be undone.')) {
      await this.migrationService.clearMigrationData();
      alert('Migration data cleared successfully!');
    }
    */
    alert('FileMaker migration temporarily disabled.');
  }

  trackByLog(index: number, log: string): string {
    return log;
  }

  // Sample Event Generation Methods
  async generateSampleEvents() {
    this.isGeneratingEvents.set(true);
    this.generationMessage.set('Generating sample events...');

    try {
      const sampleEvents = this.createSampleEventsData();
      
      // Add events one by one
      for (let i = 0; i < sampleEvents.length; i++) {
        const event = sampleEvents[i];
        await this.eventService.addEvent(event);
        this.generationMessage.set(`Generated ${i + 1}/${sampleEvents.length} events...`);
      }
      
      this.generationMessage.set(`Successfully generated ${sampleEvents.length} sample events!`);
      
      // Clear message after 3 seconds
      setTimeout(() => {
        this.generationMessage.set('');
      }, 3000);
      
    } catch (error) {
      this.generationMessage.set(`Error generating events: ${error}`);
      console.error('Error generating sample events:', error);
    } finally {
      this.isGeneratingEvents.set(false);
    }
  }

  async clearSampleEvents() {
    if (confirm('Are you sure you want to clear all sample events? This will remove events created by the generator.')) {
      this.isGeneratingEvents.set(true);
      this.generationMessage.set('Clearing sample events...');

      try {
        // Get all events and filter by ones that look like sample events
        const allEvents = this.eventService.events();
        const sampleEventNames = [
          'Rock Concert Live Tonight', 'Tech Conference 2024', 'Art Gallery Opening',
          'Music Festival Summer', 'Food & Wine Expo', 'Sports Championship',
          'Comedy Show Special', 'Fashion Week Finale', 'Gaming Tournament',
          'Book Launch Event'
        ];
        
        const sampleEvents = allEvents.filter(event => 
          sampleEventNames.some(name => event.name?.includes(name.split(' ')[0]))
        );

        for (const event of sampleEvents) {
          if (event.id) {
            await this.eventService.deleteEvent(event.id);
          }
        }
        
        this.generationMessage.set(`Cleared ${sampleEvents.length} sample events.`);
        
        // Clear message after 3 seconds
        setTimeout(() => {
          this.generationMessage.set('');
        }, 3000);
        
      } catch (error) {
        this.generationMessage.set(`Error clearing events: ${error}`);
        console.error('Error clearing sample events:', error);
      } finally {
        this.isGeneratingEvents.set(false);
      }
    }
  }

  private createSampleEventsData() {
    const now = new Date();
    const events = [];

    // Helper function to create dates
    const addDays = (date: Date, days: number) => {
      const result = new Date(date);
      result.setDate(result.getDate() + days);
      return result;
    };

    const addHours = (date: Date, hours: number) => {
      const result = new Date(date);
      result.setHours(result.getHours() + hours);
      return result;
    };

    // 1. Live Event (happening now)
    events.push({
      name: 'Rock Concert Live Tonight',
      startDate: addHours(now, -1), // Started 1 hour ago
      endDate: addHours(now, 2), // Ends in 2 hours
      eventStatus: 'Confirmed' as const,
      location: 'Madison Square Garden',
      description: 'Amazing rock concert with top artists'
    });

    // 2. Another Live Event
    events.push({
      name: 'Tech Conference 2024',
      startDate: addHours(now, -2), // Started 2 hours ago
      endDate: addHours(now, 6), // Ends in 6 hours
      eventStatus: 'Confirmed' as const,
      location: 'Convention Center',
      description: 'Latest trends in technology and innovation'
    });

    // 3. Future Event (next week)
    events.push({
      name: 'Art Gallery Opening',
      startDate: addDays(now, 7),
      endDate: addDays(addHours(now, 3), 7),
      eventStatus: 'Confirmed' as const,
      location: 'Downtown Art Gallery',
      description: 'Exclusive art exhibition opening'
    });

    // 4. Future Event (next month)
    events.push({
      name: 'Music Festival Summer',
      startDate: addDays(now, 30),
      endDate: addDays(addHours(now, 8), 30),
      eventStatus: 'Confirmed' as const,
      location: 'Central Park',
      description: 'Three-day music festival with multiple stages'
    });

    // 5. Future Event (next month)
    events.push({
      name: 'Food & Wine Expo',
      startDate: addDays(now, 45),
      endDate: addDays(addHours(now, 6), 45),
      eventStatus: 'Confirmed' as const,
      location: 'Exhibition Hall',
      description: 'Culinary experience with world-class chefs'
    });

    // 6. Tentative Event #1
    events.push({
      name: 'Sports Championship',
      startDate: addDays(now, 14),
      endDate: addDays(addHours(now, 4), 14),
      eventStatus: 'Tentative' as const,
      location: 'Sports Arena',
      description: 'Championship finals - date to be confirmed'
    });

    // 7. Tentative Event #2  
    events.push({
      name: 'Comedy Show Special',
      startDate: addDays(now, 21),
      endDate: addDays(addHours(now, 2), 21),
      eventStatus: 'Tentative' as const,
      location: 'Comedy Club',
      description: 'Special comedy night - waiting for artist confirmation'
    });

    // 8. Post-show Event #1 (ended yesterday)
    events.push({
      name: 'Fashion Week Finale',
      startDate: addDays(now, -2),
      endDate: addDays(addHours(now, -1), -1),
      eventStatus: 'Confirmed' as const,
      location: 'Fashion District',
      description: 'Grand finale of fashion week'
    });

    // 9. Post-show Event #2 (ended last week)
    events.push({
      name: 'Gaming Tournament',
      startDate: addDays(now, -7),
      endDate: addDays(addHours(now, 5), -7),
      eventStatus: 'Confirmed' as const,
      location: 'Gaming Arena',
      description: 'Professional esports tournament'
    });

    // 10. Post-show Event #3 (ended last month)
    events.push({
      name: 'Book Launch Event',
      startDate: addDays(now, -30),
      endDate: addDays(addHours(now, 2), -30),
      eventStatus: 'Confirmed' as const,
      location: 'Bookstore Main',
      description: 'Bestselling author book launch and signing'
    });

    return events;
  }
}
