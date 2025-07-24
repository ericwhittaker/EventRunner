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
  }

  /** END of SECTION */










    /** METHODS - LIFECYCLE HOOKS
   * ##############################################################################################
   * ##############################################################################################
   */

  /** This is the lifecycle hook for when the component is initialized */

  ngOnInit() {
    console.log('🚀 Dashboard initializing with real-time signals');
    
    // NEW: Load Convex data for comparison
    console.log('🔥 Loading Convex data...');
    this.loadConvexData();
    
    // Add a slight delay to see if events load after Firebase connection
    setTimeout(() => {
      
      // Log Convex data for comparison
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

  /**
   * Load data from Convex database for comparison with existing Firebase data
   */
  private async loadConvexData(): Promise<void> {
    try {
      console.log('🔥 Loading Convex events...');
      
      // Load initial data using the public method
      await this.convexService.refreshData();
      
      // Get events from Convex
      const events = this.convexService.events();
      this.convexEvents.set(events);
      this.convexDataLoaded.set(true);
      
      console.log('🔥 Convex data loaded successfully:', events.length, 'events');
      
      // Log first event for structure comparison
      if (events.length > 0) {
        console.log('🔥 Sample Convex event structure:', events[0]);
      }
      
    } catch (error) {
      console.error('🔥 Error loading Convex data:', error);
    }
  }





}
