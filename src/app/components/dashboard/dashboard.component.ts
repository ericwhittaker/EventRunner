import { Component, signal, inject, OnInit } from '@angular/core';
import { MenuComponent } from '../menu.component';
import { SubMenuComponent } from '../submenu.component';
import { DashboardListComponent, MainDashboardRow } from '../dashboard-list.component';
import { TentativeListComponent, TentativeRow } from '../tentative-list.component';
import { PostShowListComponent, PostShowRow } from '../postshow-list.component';
import { ActionButtonService } from '../shared/action-buttons/action-button.service';

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
  
  // Main Dashboard Data - matching FileMaker design
  mainDashboardData = signal<MainDashboardRow[]>([
    {
      start: '07/12/25',
      end: '07/25/25',
      eventName: 'The Park Theatre (Motor Truss Rental) #3',
      eventId: { html: '<span class="event-id">8591</span>' },
      venue: 'Park Theatre, Main Stage',
      cityState: 'Jaffrey, NH',
      providing: 'Rig',
      status: { html: '<span class="status live">Live</span>' }
    },
    {
      start: '05/26/25',
      end: '06/11/25', 
      eventName: 'Beak & Skiff Seasonal Generator Rental',
      eventId: { html: '<span class="event-id">8776</span>' },
      venue: 'Beak & Skiff Brewery, Concert Field',
      cityState: 'Lafayette, NY',
      providing: 'Gen',
      status: { html: '<span class="status live">Live</span>' }
    },
    {
      start: '08/02/25',
      end: '08/04/25',
      eventName: 'Boston Harbor Festival - Main Stage Setup',
      eventId: { html: '<span class="event-id">8845</span>' },
      venue: 'Harbor Pavilion, Main Stage',
      cityState: 'Boston, MA',
      providing: 'Full Rig',
      status: { html: '<span class="status live">Live</span>' }
    },
    {
      start: '07/28/25',
      end: '08/01/25',
      eventName: 'Mountain View Country Club Wedding',
      eventId: { html: '<span class="event-id">8798</span>' },
      venue: 'Mountain View Country Club, Grand Ballroom',
      cityState: 'Stowe, VT',
      providing: 'Audio/Video',
      status: { html: '<span class="status live">Live</span>' }
    },
    {
      start: '08/15/25',
      end: '08/17/25',
      eventName: 'Tech Conference 2025 - Corporate AV',
      eventId: { html: '<span class="event-id">8901</span>' },
      venue: 'Boston Convention Center, Hall A',
      cityState: 'Boston, MA',
      providing: 'AV/Lighting',
      status: { html: '<span class="status live">Live</span>' }
    },
    {
      start: '09/05/25',
      end: '09/07/25',
      eventName: 'Fall Harvest Festival - Multiple Stages',
      eventId: { html: '<span class="event-id">8923</span>' },
      venue: 'Shelburne Farms, Multiple Locations',
      cityState: 'Shelburne, VT',
      providing: 'Full Production',
      status: { html: '<span class="status live">Live</span>' }
    },
    {
      start: '08/22/25',
      end: '08/24/25',
      eventName: 'University Graduation Ceremony',
      eventId: { html: '<span class="event-id">8856</span>' },
      venue: 'University Stadium, Field House',
      cityState: 'Burlington, VT',
      providing: 'Audio Only',
      status: { html: '<span class="status live">Live</span>' }
    },
    {
      start: '09/12/25',
      end: '09/14/25',
      eventName: 'Craft Beer Festival - Outdoor Stage',
      eventId: { html: '<span class="event-id">8967</span>' },
      venue: 'Downtown Park, Main Stage',
      cityState: 'Portland, ME',
      providing: 'Stage/Audio',
      status: { html: '<span class="status live">Live</span>' }
    }
  ]);

  // Tentative Data
  tentativeData = signal<TentativeRow[]>([
    {
      start: '08/15/25',
      end: '08/20/25',
      eventName: 'Summer Music Festival',
      status: { html: '<span class="status tentative">Tentative</span>' },
      toDo: 'Follow up on contract',
      info: { html: '<span class="venue">Central Park Amphitheater</span>' }
    },
    {
      start: '09/20/25',
      end: '09/22/25',
      eventName: 'Corporate Annual Meeting',
      status: { html: '<span class="status tentative">Tentative</span>' },
      toDo: 'Waiting on venue confirmation',
      info: { html: '<span class="venue">Hilton Downtown, Grand Ballroom</span>' }
    },
    {
      start: '10/05/25',
      end: '10/07/25',
      eventName: 'Fall Wedding - Outdoor Ceremony',
      status: { html: '<span class="status tentative">Tentative</span>' },
      toDo: 'Weather contingency plan needed',
      info: { html: '<span class="venue">Private Estate, Woodstock VT</span>' }
    }
  ]);

  // Post Show Data
  postShowData = signal<PostShowRow[]>([
    {
      start: '06/01/25',
      end: '06/03/25',
      eventName: 'Corporate Conference 2025',
      cityState: 'Boston, MA',
      info: { html: '<span class="venue">Convention Center</span>' },
      toDo: 'Equipment return',
      setS: { html: '<span class="status completed">Completed</span>' }
    },
    {
      start: '06/15/25',
      end: '06/17/25',
      eventName: 'Summer Concert Series - Week 1',
      cityState: 'Burlington, VT',
      info: { html: '<span class="venue">Waterfront Park</span>' },
      toDo: 'Final invoice sent',
      setS: { html: '<span class="status completed">Completed</span>' }
    },
    {
      start: '07/02/25',
      end: '07/04/25',
      eventName: 'Independence Day Celebration',
      cityState: 'Concord, NH',
      info: { html: '<span class="venue">State Capitol Grounds</span>' },
      toDo: 'Equipment inventory check',
      setS: { html: '<span class="status completed">Completed</span>' }
    }
  ]);

  ngOnInit() {
    // Initialize any dashboard-specific setup
  }
}
