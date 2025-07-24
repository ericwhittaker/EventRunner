/** ANGULAR (CORE) */
import { Component, OnInit, inject, signal, effect } from '@angular/core';

/** COMPONENTS */

import { EventsTableMainComponent } from './events-tables/events-table-main/events-table-main';
import { EventsTableTentativeComponent, TentativeRow } from './events-tables/events-table-tentative/events-table-tentative';
import { EventsTablePostShowComponent, PostShowRow } from './events-tables/events-table-postshow/events-table-postshow';
import { MainDashboardRow } from './dashboard-list-types';
import { ConvexService } from '../../services/convex.service';









  /** ENUMS AND INTERFACES (These are temporary and should go in the model files)
   * ##############################################################################################
   * ##############################################################################################
   */

  

  /** END of SECTION */










@Component({
  selector: 'app-dashboard',
  imports: [
    EventsTableMainComponent,
    EventsTableTentativeComponent,
    EventsTablePostShowComponent
],
  templateUrl: './events-dash.html',
  styleUrls: ['../../app.scss', './events-dash.scss']
})
export class EventsDashComponent implements OnInit {

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
  
  // NEW: Convex service for gradual migration to Convex database
  private convexService = inject(ConvexService);

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
  
  // NEW: Convex data signals for comparison and gradual migration
  convexEvents = signal<any[]>([]);
  convexDataLoaded = signal(false);

  /** END of SECTION */










  /** CONSTRUCTOR
   * ##############################################################################################
   * ##############################################################################################
   */

  constructor() {
    // Subscribe to ConvexService events signal for real-time updates
    effect(() => {
      const events = this.convexService.events() || [];
      this.convexEvents.set(events);
      this.convexDataLoaded.set(events.length > 0);
      
      console.log('🔥 Real-time Convex events update:', events.length, 'events');
      
      // Log first event for structure comparison
      if (events.length > 0) {
        console.log('🔥 Sample Convex event structure:', events[0]);
      }
    });

    // NEW: Convex Effect for tentative events
    effect(() => {
      const convexEvents = this.convexEvents();
      
      if (convexEvents.length === 0) return;
      
      console.log(`🔥 Convex processing ${convexEvents.length} events for tentative dashboard`);
      
      // Tentative Dashboard: All events marked as "tentative"
      const tentativeEvents = convexEvents.filter(event => {
        const status = event.status;
        return status === 'tentative';
      });
      
      this.tentativeData.set(
        tentativeEvents.map(event => this.convertConvexEventToTentativeRow(event))
      );
      
      console.log(`🔥 Convex Updated tentative data: ${tentativeEvents.length} events`);
    });

    // NEW: Convex Effect for main dashboard events
    effect(() => {
      const convexEvents = this.convexEvents();
      
      if (convexEvents.length === 0) return;
      
      console.log(`🔥 Convex processing ${convexEvents.length} events for main dashboard`);
      
      // Main Dashboard: All confirmed events (not tentative, not postshow)
      const mainEvents = convexEvents.filter(event => {
        const status = event.status;
        return status === 'confirmed';
      });
      
      this.mainDashboardDataV3.set(
        mainEvents.map(event => this.convertConvexEventToMainRow(event))
      );
      
      console.log(`🔥 Convex Updated main dashboard data: ${mainEvents.length} events`);
    });

    // NEW: Convex Effect for postshow events
    effect(() => {
      const convexEvents = this.convexEvents();
      
      if (convexEvents.length === 0) return;
      
      console.log(`🔥 Convex processing ${convexEvents.length} events for postshow dashboard`);
      
      // PostShow Dashboard: All events marked as "postshow"
      const postShowEvents = convexEvents.filter(event => {
        const status = event.status;
        return status === 'postshow';
      });
      
      this.postShowData.set(
        postShowEvents.map(event => this.convertConvexEventToPostShowRow(event))
      );
      
      console.log(`🔥 Convex Updated postshow data: ${postShowEvents.length} events`);
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
    
    // The effects in constructor will automatically handle data updates
    // No need to call loadConvexData() - effects will trigger when ConvexService loads data
    
    // Add a slight delay to see if events load after Convex connection
    setTimeout(() => {
      console.log('🔥 Convex Events count:', this.convexEvents().length);
      console.log('🔥 Convex Events:', this.convexEvents());
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

  // NEW: Convert Convex Event to TentativeRow
  private convertConvexEventToTentativeRow(event: any): TentativeRow {
    // Convex stores eventDate as timestamp, convert to Date
    const startDate = event.eventDate ? new Date(event.eventDate) : null;
    const endDate = startDate; // For now, assume same day events
    
    return {
      eventId: event._id || `temp-${Math.random()}`,
      start: this.formatDate(startDate),
      end: this.formatDate(endDate),
      eventName: event.name || 'Untitled Event',
      status: { html: `<span class="status tentative convex">Tentative (Convex)</span>` },
      toDo: Math.floor(Math.random() * 5) + 1
    };
  }

  // NEW: Convert Convex Event to MainDashboardRow
  private convertConvexEventToMainRow(event: any): MainDashboardRow {
    // Convex stores eventDate as timestamp, convert to Date
    const startDate = event.eventDate ? new Date(event.eventDate) : null;
    const endDate = startDate; // For now, assume same day events
    
    // Calculate days until event
    const today = new Date();
    const daysOut = startDate ? Math.ceil((startDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) : undefined;
    
    return {
      eventId: { html: `<span class="event-id">${event._id}</span>` },
      start: this.formatDate(startDate),
      end: this.formatDate(endDate),
      eventName: event.name || 'Untitled Event',
      venue: 'TBD', // TODO: Lookup venue name
      cityState: 'TBD', // TODO: Get from venue
      providing: event.eventType || 'TBD',
      daysOut: daysOut,
      toDo: Math.floor(Math.random() * 5) + 1
    };
  }

  // NEW: Convert Convex Event to PostShowRow
  private convertConvexEventToPostShowRow(event: any): PostShowRow {
    // Convex stores eventDate as timestamp, convert to Date
    const startDate = event.eventDate ? new Date(event.eventDate) : null;
    const endDate = startDate; // For now, assume same day events
    
    return {
      eventId: event._id || `temp-${Math.random()}`,
      start: this.formatDate(startDate),
      end: this.formatDate(endDate),
      eventName: event.name || 'Untitled Event',
      cityState: 'TBD', // TODO: Get from venue
      toDo: Math.floor(Math.random() * 3) + 1,
      setS: { html: `<span class="check-icon">✓</span>` }
    };
  }

}
