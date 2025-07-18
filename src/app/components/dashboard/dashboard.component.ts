/** ANGULAR (CORE) */
import { Component, OnInit, inject, signal, effect } from '@angular/core';
import { ActionButtons } from '../shared/action-buttons/action-buttons';

/** COMPONENTS */

import { Subheader } from '../shared/subheader/subheader';
import { MainDashboardRow } from '../dashboard-list.component';
import { DashboardListV3Component } from '../dashboard-list-v3.component';
import { TentativeListComponent, TentativeRow } from '../tentative-list.component';
import { PostShowListComponent, PostShowRow } from '../postshow-list.component';
import { ActionButtonService } from '../shared/action-buttons/action-button.service';
import { calculateDaysOut, getStatusIcon } from '../shared/dashboard-utils';
import { EventService, Event } from '../../services/event-v2.service';
import { EventDataV3Service } from '../../services/eventData-v3.service';









  /** ENUMS AND INTERFACES (These are temporary and should go in the model files)
   * ##############################################################################################
   * ##############################################################################################
   */

  

  /** END of SECTION */










@Component({
  selector: 'app-dashboard',
  imports: [
    ActionButtons,
    // DashboardListComponent,
    DashboardListV3Component,
    TentativeListComponent,
    PostShowListComponent,
    Subheader
],
  templateUrl: './dashboard.component.html',
  styleUrls: ['../../app.scss', './events.scss']
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
  private eventService = inject(EventService); // Keep existing v2 service
  
  // Add v3 services for gradual migration (parallel approach)
  private eventDataV3Service = inject(EventDataV3Service);

  /** END of SECTION */










  /** ALL input()'s, output()'s, PROPERTIES, VARIABLES, AND signal()'s, computed()'s, etc.
   * ##############################################################################################
   * ##############################################################################################
   */

  /** Dashboard Data Signals */
  // mainDashboardData = signal<MainDashboardRow[]>([]);
  tentativeData = signal<TentativeRow[]>([]);
  postShowData = signal<PostShowRow[]>([]);

  // NEW: V3 data signals for gradual migration (these won't affect existing UI yet)
  mainDashboardDataV3 = signal<MainDashboardRow[]>([]);

  /** END of SECTION */










  /** CONSTRUCTOR
   * ##############################################################################################
   * ##############################################################################################
   */

  constructor() {


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

    // NEW: V3 Effect for main dashboard (runs in parallel, doesn't affect existing UI)
    effect(() => {
      const eventsV3 = this.eventDataV3Service.normalizedEvents();
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      console.log(`🆕 V3 Dashboard processing ${eventsV3.length} total events`);
      
      // Same logic as v2, but using v3 data
      const liveAndFutureEventsV3 = eventsV3.filter(event => {
        const status = event.eventStatus || event.status;
        if (status === 'Tentative' || status === 'Cancelled') {
          return false;
        }
        
        const startDate = event.startDate || event.event_date || event.date || event.dateStart;
        const endDate = event.endDate || event.startDate || event.event_date || event.date || event.dateStart;
        
        if (!startDate) return false;
        
        const eventStart = new Date(startDate);
        const eventEnd = new Date(endDate || startDate);
        eventStart.setHours(0, 0, 0, 0);
        eventEnd.setHours(23, 59, 59, 999);
        
        const isLive = today >= eventStart && today <= eventEnd;
        const isFuture = eventStart > today;
        
        return isLive || isFuture;
      });
      
      // Sort same as v2
      const sortedEventsV3 = liveAndFutureEventsV3.sort((a, b) => {
        const startDateA = a.startDate || a.event_date || a.date || a.dateStart;
        const startDateB = b.startDate || b.event_date || b.date || b.dateStart;
        
        if (!startDateA || !startDateB) return 0;
        
        const dateA = new Date(startDateA);
        const dateB = new Date(startDateB);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const endDateA = a.endDate || startDateA;
        const endDateB = b.endDate || startDateB;
        const isLiveA = today >= new Date(startDateA) && today <= new Date(endDateA);
        const isLiveB = today >= new Date(startDateB) && today <= new Date(endDateB);
        
        if (isLiveA && !isLiveB) return -1;
        if (!isLiveA && isLiveB) return 1;
        
        return dateA.getTime() - dateB.getTime();
      });
      
      this.mainDashboardDataV3.set(
        sortedEventsV3.map(event => this.convertEventToMainDashboardRowV3(event))
      );
      
      console.log(`🆕 V3 Updated main dashboard: ${liveAndFutureEventsV3.length} live/future events`);
    });
  }

  /** END of SECTION */










    /** METHODS - LIFECYCLE HOOKS
   * ##############################################################################################
   * ##############################################################################################
   */

  /** This is the lifecycle hook for when the component is initialized */

  ngOnInit() {
    console.log('🚀 Dashboard initializing with real-time signals');
    console.log('🔍 Initial events count:', this.eventService.events().length);
    
    // Start real-time listeners - this will automatically trigger our effects
    this.eventService.startRealtimeListeners();
    
    // Also initialize v3 services (parallel to v2 for comparison)
    console.log('🆕 Initializing EventDataV3Service listeners...');
    this.eventDataV3Service.initializeAllRealtimeListeners();
    
    // Add a slight delay to see if events load after Firebase connection
    setTimeout(() => {
      console.log('⏰ After 2 seconds - events count:', this.eventService.events().length);
      console.log('⏰ Current events:', this.eventService.events());
      
      // Log v3 data for comparison
      console.log('🆕 V3 Events count:', this.eventDataV3Service.normalizedEvents().length);
      console.log('🆕 V3 Events:', this.eventDataV3Service.normalizedEvents());
    }, 2000);
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



  // NEW: V3 version of converter (uses v3 service for venue lookups)
  private convertEventToMainDashboardRowV3(event: any): MainDashboardRow {
    const startDate = event.startDate || event.event_date || event.date || event.dateStart;
    const endDate = event.endDate || event.startDate || event.event_date || event.date || event.dateStart;
    
    if (!startDate) {
      console.warn('V3 Event missing start date:', event);
    }

    const formattedStartDate = this.formatDate(startDate || null);
    const formattedEndDate = this.formatDate(endDate || null);
    
    // Calculate status based on actual dates, not formatted strings
    const { daysOut, isLive } = this.calculateEventStatus(startDate || null, endDate || null);
    
    return {
      start: formattedStartDate,
      end: formattedEndDate,
      eventName: event.title || event.name || 'Untitled Event',
      eventId: { html: `<span class="event-id v3">${event.id}</span>` }, // Add v3 class for identification
      venue: this.eventDataV3Service.getVenueName(event.venue_id || ''),
      cityState: this.eventDataV3Service.getVenueLocation(event.venue_id || ''),
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





}
