/** ANGULAR (CORE) */
import { Component, OnInit, inject, signal, effect } from '@angular/core';

import { MenuComponent } from '../menu.component';
import { SubMenuComponent } from '../submenu.component';
import { DashboardListComponent, MainDashboardRow } from '../dashboard-list.component';
import { TentativeListComponent, TentativeRow } from '../tentative-list.component';
import { PostShowListComponent, PostShowRow } from '../postshow-list.component';
import { ActionButtonService } from '../shared/action-buttons/action-button.service';
import { calculateDaysOut, getStatusIcon } from '../shared/dashboard-utils';
import { EventService, Event } from '../../services/event-v2.service';









  /** ENUMS AND INTERFACES (These are temporary and should go in the model files)
   * ##############################################################################################
   * ##############################################################################################
   */

  

  /** END of SECTION */










@Component({
  selector: 'app-dashboard',
  imports: [
    MenuComponent,
    SubMenuComponent,
    DashboardListComponent,
    TentativeListComponent,
    PostShowListComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: '../../app.scss'
})
export class DashboardComponent implements OnInit {

  /** DEV WORKAREA, NOTES, AND TODOs
   * ##############################################################################################
   * ##############################################################################################
   * @note 
   * @todo 
   */

  /** WORKING AREA ================================ */

  /** END OF WORKING AREA ========================= */










  /** ALL INJECTABLES 
   * ##############################################################################################
   * ##############################################################################################
   */

  private actionButtonService = inject(ActionButtonService);
  private eventService = inject(EventService);

  /** END of SECTION */










  /** ALL input()'s, output()'s, PROPERTIES, VARIABLES, AND signal()'s, computed()'s, etc.
   * ##############################################################################################
   * ##############################################################################################
   */

  /** Dashboard Data Signals */
  mainDashboardData = signal<MainDashboardRow[]>([]);
  tentativeData = signal<TentativeRow[]>([]);
  postShowData = signal<PostShowRow[]>([]);

  /** END of SECTION */










  /** CONSTRUCTOR
   * ##############################################################################################
   * ##############################################################################################
   */

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
      
      // Sort events: Live events first, then future events by start date
      const sortedEvents = liveAndFutureEvents.sort((a, b) => {
        const startDateA = a.startDate || a.event_date || a.date || a.dateStart;
        const startDateB = b.startDate || b.event_date || b.date || b.dateStart;
        
        if (!startDateA || !startDateB) return 0;
        
        const dateA = new Date(startDateA);
        const dateB = new Date(startDateB);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Check if events are live
        const endDateA = a.endDate || startDateA;
        const endDateB = b.endDate || startDateB;
        const isLiveA = today >= new Date(startDateA) && today <= new Date(endDateA);
        const isLiveB = today >= new Date(startDateB) && today <= new Date(endDateB);
        
        // Live events come first
        if (isLiveA && !isLiveB) return -1;
        if (!isLiveA && isLiveB) return 1;
        
        // Within same category (both live or both future), sort by start date
        return dateA.getTime() - dateB.getTime();
      });
      
      this.mainDashboardData.set(
        sortedEvents.map(event => this.convertEventToMainDashboardRow(event))
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

  /** END of SECTION */








  // Helper method to format date for display in MM/DD/YYYY format
  private formatDate(date: Date | null): string {
    if (!date) return 'No Date';
    
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  }

  // Helper method to calculate event status and days
  private calculateEventStatus(startDate: Date | null, endDate: Date | null): { daysOut: number | undefined, isLive: boolean } {
    if (!startDate) {
      return { daysOut: undefined, isLive: false };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today
    
    const eventStart = new Date(startDate);
    eventStart.setHours(0, 0, 0, 0);
    
    const eventEnd = endDate ? new Date(endDate) : eventStart;
    eventEnd.setHours(23, 59, 59, 999); // End of the day
    
    // Check if event is live (today is between start and end dates)
    const isLive = today >= eventStart && today <= eventEnd;
    
    if (isLive) {
      return { daysOut: undefined, isLive: true }; // "Live" - no days count
    }
    
    // Calculate days until event starts
    const diffTime = eventStart.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return { daysOut: diffDays, isLive: false };
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
    
    // Calculate status based on actual dates, not formatted strings
    const { daysOut, isLive } = this.calculateEventStatus(startDate || null, endDate || null);
    
    return {
      start: formattedStartDate,
      end: formattedEndDate,
      eventName: event.title || event.name || 'Untitled Event',
      eventId: { html: `<span class="event-id">${event.id}</span>` },
      venue: this.eventService.getVenueName(event.venue_id || ''),
      cityState: this.eventService.getVenueLocation(event.venue_id || ''),
      providing: event.event_type || event.type || 'General',
      toDo: Math.floor(Math.random() * 10) + 1, // This should come from actual task data
      daysOut: daysOut
    };
  }

  // Convert Event to TentativeRow
  private convertEventToTentativeRow(event: Event): TentativeRow {
    const startDate = event.startDate || event.event_date || event.date || event.dateStart;
    const endDate = event.endDate || event.startDate || event.event_date || event.date || event.dateStart;
    
    return {
      eventId: event.id || `temp-${Math.random()}`,
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
      eventId: event.id || `temp-${Math.random()}`,
      start: this.formatDate(startDate || null),
      end: this.formatDate(endDate || null),
      eventName: event.title || event.name || 'Untitled Event',
      cityState: this.eventService.getVenueLocation(event.venue_id || ''),
      toDo: Math.floor(Math.random() * 3) + 1,
      setS: { html: `<span class="status post-show">Post Show</span>` }
    };
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
