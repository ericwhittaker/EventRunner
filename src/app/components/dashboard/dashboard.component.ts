import { Component, signal, inject, OnInit } from '@angular/core';
import { MenuComponent } from '../menu.component';
import { SubMenuComponent } from '../submenu.component';
import { DashboardListComponent, MainDashboardRow } from '../dashboard-list.component';
import { TentativeListComponent, TentativeRow } from '../tentative-list.component';
import { PostShowListComponent, PostShowRow } from '../postshow-list.component';
import { ActionButtonService } from '../shared/action-buttons/action-button.service';
import { calculateDaysOut, getStatusIcon } from '../shared/dashboard-utils';
import { EventService, Event } from '../../services/event.service';

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
  
  constructor(private eventService: EventService) {}
  
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
    const venue = this.eventService.getVenueById(event.venue_id);
    const client = this.eventService.getContactById(event.client_contact_id);
    
    const startDate = this.eventService.formatEventDate(event.event_date);
    const endDate = this.eventService.formatEventDate(new Date(event.event_date.getTime() + (event.duration_hours * 60 * 60 * 1000)));
    
    return this.addCalculatedFields({
      start: startDate,
      end: endDate,
      eventName: event.title,
      eventId: { html: `<span class="event-id">${event.id}</span>` },
      venue: venue ? `${venue.name}` : 'Unknown Venue',
      cityState: venue ? `${venue.city}, ${venue.state}` : 'Unknown Location',
      providing: event.event_type,
      toDo: Math.floor(Math.random() * 10) + 1 // This should come from actual task data
    });
  }

  // Convert Event to TentativeRow
  private convertEventToTentativeRow(event: Event): TentativeRow {
    const venue = this.eventService.getVenueById(event.venue_id);
    const client = this.eventService.getContactById(event.client_contact_id);
    
    return {
      start: this.eventService.formatEventDate(event.event_date),
      end: this.eventService.formatEventDate(new Date(event.event_date.getTime() + (event.duration_hours * 60 * 60 * 1000))),
      eventName: event.title,
      status: { html: `<span class="status tentative">Tentative</span>` },
      toDo: Math.floor(Math.random() * 5) + 1
    };
  }

  // Convert Event to PostShowRow
  private convertEventToPostShowRow(event: Event): PostShowRow {
    const venue = this.eventService.getVenueById(event.venue_id);
    
    return {
      start: this.eventService.formatEventDate(event.event_date),
      end: this.eventService.formatEventDate(new Date(event.event_date.getTime() + (event.duration_hours * 60 * 60 * 1000))),
      eventName: event.title,
      cityState: venue ? `${venue.city}, ${venue.state}` : 'Unknown Location',
      toDo: Math.floor(Math.random() * 3) + 1,
      setS: { html: `<span class="status post-show">Post Show</span>` }
    };
  }
  
  // Main Dashboard Data - from Firebase
  mainDashboardData = signal<MainDashboardRow[]>([]);
  
  // Tentative Data - from Firebase
  tentativeData = signal<TentativeRow[]>([]);
  
  // Post Show Data - from Firebase
  postShowData = signal<PostShowRow[]>([]);

  async ngOnInit() {
    // Load data from Firebase
    await this.eventService.loadAllData();
    
    // Update signals with Firebase data
    const currentAndFutureEvents = this.eventService.getCurrentAndFutureEvents();
    const tentativeEvents = this.eventService.getTentativeEvents();
    const postShowEvents = this.eventService.getPostShowEvents();
    
    this.mainDashboardData.set(
      currentAndFutureEvents.map(event => this.convertEventToMainDashboardRow(event))
    );
    
    this.tentativeData.set(
      tentativeEvents.map(event => this.convertEventToTentativeRow(event))
    );
    
    this.postShowData.set(
      postShowEvents.map(event => this.convertEventToPostShowRow(event))
    );
  }
}
