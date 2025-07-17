import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuComponent } from '../menu.component';
import { CommonModule } from '@angular/common';
import { EventService } from '../../services/event-v2.service';

@Component({
  selector: 'app-events-viewer',
  imports: [MenuComponent, CommonModule],
  template: `
    <app-menu></app-menu>
    <div class="page-header">
      <h1>Events Dashboard</h1>
      <button class="btn-primary" (click)="runMigration()">� Run Migration</button>
    </div>
    
    <div class="page-content">
      <div *ngIf="eventService.loading()" class="loading">
        <p>Loading events...</p>
      </div>
      
      <div *ngIf="eventService.error()" class="error">
        <p>Error: {{ eventService.error() }}</p>
      </div>
      
      <div *ngIf="!eventService.loading() && !eventService.error()">
        <div class="stats">
          <div class="stat-card">
            <h3>{{ eventService.events().length }}</h3>
            <p>Total Events</p>
          </div>
          <div class="stat-card">
            <h3>{{ eventService.venues().length }}</h3>
            <p>Venues</p>
          </div>
          <div class="stat-card">
            <h3>{{ eventService.contacts().length }}</h3>
            <p>Contacts</p>
          </div>
        </div>
        
        <div class="events-list">
          <h2>All Events</h2>
          <div *ngFor="let event of eventService.events()" class="event-card">
            <h3>{{ event.title }}</h3>
            <p><strong>Date:</strong> {{ formatDate(event.event_date) }}</p>
            <p><strong>Type:</strong> {{ event.event_type }}</p>
            <p><strong>Status:</strong> {{ event.status }}</p>
            <p><strong>Budget:</strong> {{ formatCurrency(event.budget) }}</p>
            <p><strong>Venue:</strong> {{ getVenueName(event.venue_id) }}</p>
            <p><strong>Location:</strong> {{ getVenueLocation(event.venue_id) }}</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-header { display: flex; justify-content: space-between; align-items: center; padding: 20px; }
    .page-content { padding: 20px; }
    .btn-primary { background: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; }
    .loading, .error { text-align: center; padding: 40px; }
    .stats { display: flex; gap: 20px; margin-bottom: 30px; }
    .stat-card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); text-align: center; }
    .stat-card h3 { margin: 0 0 10px 0; font-size: 24px; color: #007bff; }
    .events-list h2 { margin-bottom: 20px; }
    .event-card { background: white; padding: 20px; margin-bottom: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .event-card h3 { margin: 0 0 10px 0; color: #333; }
    .event-card p { margin: 5px 0; }
  `]
})
export class EventsViewerComponent implements OnInit {
  constructor(public eventService: EventService, public router: Router) {}

  async ngOnInit() {
    await this.eventService.loadAllData();
  }
  
  async runMigration() {
    const { FileMakerMigrationService } = await import('../../services/filemaker-migration-new.service');
    const { FirebaseService } = await import('../../services/firebase-v2.service');
    const { DDRParserService } = await import('../../services/ddr-parser.service');
    const firebaseService = new FirebaseService();
    const ddrParserService = new DDRParserService();
    const migrationService = new FileMakerMigrationService(firebaseService, ddrParserService);
    await migrationService.migrateWithXMLOrDDR();
    await this.eventService.loadAllData();
  }
  
  formatDate(date: Date | undefined): string {
    return date ? date.toLocaleDateString() : 'No date';
  }
  
  formatCurrency(amount: number | undefined): string {
    return '$' + (amount || 0).toLocaleString();
  }
  
  getVenueName(venueId: string | undefined): string {
    if (!venueId) return 'Unknown Venue';
    const venue = this.eventService.getVenueById(venueId);
    return venue?.name || venue?.venueName || 'Unknown Venue';
  }
  
  getVenueLocation(venueId: string | undefined): string {
    if (!venueId) return 'Unknown Location';
    return this.eventService.getVenueLocation(venueId);
  }
}
