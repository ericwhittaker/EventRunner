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
    // Add more sample data as needed...
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
    }
  ]);

  ngOnInit() {
    // Initialize any dashboard-specific setup
  }
}
