import { Component, signal, inject, OnInit, effect } from '@angular/core';
import { MenuComponent } from '../menu.component';
import { SubMenuComponent } from '../submenu.component';
import { DashboardListComponent, MainDashboardRow } from '../dashboard-list.component';
import { TentativeListComponent, TentativeRow } from '../tentative-list.component';
import { PostShowListComponent, PostShowRow } from '../postshow-list.component';
import { ActionButtonService } from '../shared/action-buttons/action-button.service';
import { calculateDaysOut, getStatusIcon } from '../shared/dashboard-utils';
import { EventService, Event } from '../../services/event-v2.service';

@Component({
  selector: 'app-dashboard',
  imports: [
    MenuComponent,
    SubMenuComponent,
    DashboardListComponent,
    TentativeListComponent,
    PostShowListComponent
  ],
  template: `
    <app-menu></app-menu>
    <div class="subheader-row">
      <app-submenu></app-submenu>
    </div>
    <div class="dashboard-center-area">
      <div class="dashboard-main-area">
        <div class="dashboard-card dashboard-card-main">
          <!-- Debug info -->
          <div style="position: absolute; top: 0; right: 0; background: yellow; font-size: 10px; padding: 2px;">
            Main: {{mainDashboardData().length}} | Tent: {{tentativeData().length}} | Post: {{postShowData().length}}
          </div>
          <app-dashboard-list [data]="mainDashboardData()"></app-dashboard-list>
        </div>
        <div class="dashboard-bottom-row">
          <div class="dashboard-card dashboard-card-tentative">
            <app-tentative-list [data]="tentativeData()"></app-tentative-list>
          </div>
          <div class="dashboard-card dashboard-card-postshow">
            <app-postshow-list [data]="postShowData()"></app-postshow-list>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['../../app.scss']
})
export class DashboardComponent implements OnInit {
  private actionButtonService = inject(ActionButtonService);
  private eventService = inject(EventService);
  
  // Helper method to format date for display
  private formatDate(date: Date | null): string {
    if (!date) return 'No Date';
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }

  // Helper method to add calculated fields
  private addCalculatedFields(row: any): MainDashboardRow {
    const daysOut = calculateDaysOut(row.start);
    return {
      ...row,
      daysOut,
      statusIcon: getStatusIcon(daysOut)
    };
  }

  // Convert Event to MainDashboardRow
  private convertEventToMainDashboardRow(event: Event): MainDashboardRow {
    const startDate = event.startDate || event.event_date || event.date || event.dateStart;
    const endDate = event.endDate || event.startDate || event.event_date || event.date || event.dateStart;
    
    if (!startDate) {
      console.warn('Event missing start date:', event);
    }

    const venue = event.venue_id ? this.eventService.getVenueById(event.venue_id) : null;
    
    const formattedStartDate = this.formatDate(startDate || null);
    const formattedEndDate = this.formatDate(endDate || null);
    
    return this.addCalculatedFields({
      start: formattedStartDate,
      end: formattedEndDate,
      eventName: event.title || event.name || 'Untitled Event',
      eventId: { html: `<span class="event-id">${event.id}</span>` },
      venue: this.eventService.getVenueName(event.venue_id || ''),
      cityState: this.eventService.getVenueLocation(event.venue_id || ''),
      providing: event.event_type || event.type || 'General',
      toDo: Math.floor(Math.random() * 10) + 1 // This should come from actual task data
    });
  }

  // Convert Event to TentativeRow
  private convertEventToTentativeRow(event: Event): TentativeRow {
    const startDate = event.startDate || event.event_date || event.date || event.dateStart;
    const endDate = event.endDate || event.startDate || event.event_date || event.date || event.dateStart;
    
    return {
      start: this.formatDate(startDate || null),
      end: this.formatDate(endDate || null),
      eventName: event.title || event.name || 'Untitled Event',
      status: { html: `<span class="status tentative">Tentative</span>` },
      toDo: Math.floor(Math.random() * 5) + 1
    };
  }

  // Convert Event to PostShowRow
  private convertEventToPostShowRow(event: Event): PostShowRow {
    const startDate = event.startDate || event.event_date || event.date || event.dateStart;
    const endDate = event.endDate || event.startDate || event.event_date || event.date || event.dateStart;
    
    return {
      start: this.formatDate(startDate || null),
      end: this.formatDate(endDate || null),
      eventName: event.title || event.name || 'Untitled Event',
      cityState: this.eventService.getVenueLocation(event.venue_id || ''),
      toDo: Math.floor(Math.random() * 3) + 1,
      setS: { html: `<span class="status post-show">Post Show</span>` }
    };
  }
  
  // Dashboard Data Signals
  mainDashboardData = signal<MainDashboardRow[]>([]);
  tentativeData = signal<TentativeRow[]>([]);
  postShowData = signal<PostShowRow[]>([]);

  constructor() {
    // Set up effects to automatically update dashboard when data changes
    effect(() => {
      const events = this.eventService.events();
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Start of today
      
      console.log(`🔍 Dashboard processing ${events.length} total events`);
      
      // Main Dashboard: Live events (today between start/end) + Future confirmed events
      const liveAndFutureEvents = events.filter(event => {
        // Must be confirmed status (not tentative or cancelled)
        const status = event.eventStatus || event.status;
        if (status === 'Tentative' || status === 'Cancelled') {
          console.log(`❌ Filtering out ${status} event: ${event.title}`);
          return false;
        }
        
        const startDate = event.startDate || event.event_date || event.date || event.dateStart;
        const endDate = event.endDate || event.startDate || event.event_date || event.date || event.dateStart;
        
        if (!startDate) {
          console.log(`❌ Event missing start date: ${event.title}`);
          return false;
        }
        
        const eventStart = new Date(startDate);
        const eventEnd = new Date(endDate || startDate);
        eventStart.setHours(0, 0, 0, 0);
        eventEnd.setHours(23, 59, 59, 999); // End of the day
        
        // Live: today is between start and end dates (inclusive)
        const isLive = today >= eventStart && today <= eventEnd;
        // Future: starts after today
        const isFuture = eventStart > today;
        
        const result = isLive || isFuture;
        console.log(`📅 Event "${event.title}": start=${eventStart.toDateString()}, end=${eventEnd.toDateString()}, today=${today.toDateString()}, isLive=${isLive}, isFuture=${isFuture}, showing=${result}`);
        
        return result;
      });
      
      this.mainDashboardData.set(
        liveAndFutureEvents.map(event => this.convertEventToMainDashboardRow(event))
      );
      
      console.log(`📊 Updated main dashboard: ${liveAndFutureEvents.length} live/future events`);
    });

    effect(() => {
      const events = this.eventService.events();
      
      // Tentative Dashboard: All events marked as "Tentative"
      const tentativeEvents = events.filter(event => {
        const status = event.eventStatus || event.status;
        return status === 'Tentative';
      });
      
      this.tentativeData.set(
        tentativeEvents.map(event => this.convertEventToTentativeRow(event))
      );
      
      console.log(`📊 Updated tentative data: ${tentativeEvents.length} events`);
    });

    effect(() => {
      const events = this.eventService.events();
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Post Show Dashboard: Events that have passed OR are cancelled
      const postShowEvents = events.filter(event => {
        const status = event.eventStatus || event.status;
        
        // Include cancelled events regardless of date
        if (status === 'Cancelled') return true;
        
        // Include events that have passed their end date
        const endDate = event.endDate || event.startDate || event.event_date || event.date || event.dateStart;
        if (!endDate) return false;
        
        const eventEnd = new Date(endDate);
        eventEnd.setHours(23, 59, 59, 999); // End of the day
        
        // Event has passed
        return today > eventEnd;
      });
      
      this.postShowData.set(
        postShowEvents.map(event => this.convertEventToPostShowRow(event))
      );
      
      console.log(`📊 Updated post-show data: ${postShowEvents.length} events`);
    });
  }

  async ngOnInit() {
    console.log('🚀 Dashboard initializing with real-time signals');
    console.log('🔍 Initial events count:', this.eventService.events().length);
    
    // Start real-time listeners - this will automatically trigger our effects
    this.eventService.startRealtimeListeners();
    
    // Add a slight delay to see if events load after Firebase connection
    setTimeout(() => {
      console.log('⏰ After 2 seconds - events count:', this.eventService.events().length);
      console.log('⏰ Current events:', this.eventService.events());
    }, 2000);
  }
}
