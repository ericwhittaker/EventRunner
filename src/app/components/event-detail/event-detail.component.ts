import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuComponent } from '../menu.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-event-detail',
  imports: [MenuComponent, CommonModule],
  template: `
    <app-menu></app-menu>
    <div class="subnav-container">
      <div class="subnav-left">
        <button class="action-btn" (click)="goBack()">← Back to Dashboard</button>
        <button class="action-btn">Edit Event</button>
      </div>
      <div class="subnav-center">
        <div class="nav-item active">Overview</div>
        <div class="nav-item">Equipment</div>
        <div class="nav-item">Crew</div>
        <div class="nav-item">Timeline</div>
        <div class="nav-item">Notes</div>
      </div>
      <div class="subnav-right">
        <span class="event-id">Event #{{ eventId }}</span>
      </div>
    </div>
    <div class="page-content">
      <div class="content-grid">
        <div class="card main-info">
          <h2>{{ eventName }}</h2>
          <div class="event-details">
            <div class="detail-row">
              <span class="label">Venue:</span>
              <span class="value">{{ venue }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Dates:</span>
              <span class="value">{{ startDate }} - {{ endDate }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Location:</span>
              <span class="value">{{ location }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Providing:</span>
              <span class="value">{{ providing }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Status:</span>
              <span class="status-badge" [class]="statusClass">{{ status }}</span>
            </div>
          </div>
        </div>
        
        <div class="card">
          <h3>Quick Stats</h3>
          <div class="stats-grid">
            <div class="stat-item">
              <span class="stat-number">12</span>
              <span class="stat-label">Equipment Items</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">5</span>
              <span class="stat-label">Crew Members</span>
            </div>
          </div>
        </div>

        <div class="card">
          <h3>Recent Activity</h3>
          <div class="activity-list">
            <div class="activity-item">
              <span class="activity-time">2 hours ago</span>
              <span class="activity-desc">Equipment list updated</span>
            </div>
            <div class="activity-item">
              <span class="activity-time">1 day ago</span>
              <span class="activity-desc">Crew assignments confirmed</span>
            </div>
          </div>
        </div>

        <div class="card">
          <h3>Key Contacts</h3>
          <div class="contact-list">
            <div class="contact-item">
              <span class="contact-name">John Smith</span>
              <span class="contact-role">Production Manager</span>
            </div>
            <div class="contact-item">
              <span class="contact-name">Sarah Johnson</span>
              <span class="contact-role">Venue Coordinator</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-content { padding: 20px; max-width: 1400px; margin: 0 auto; }
    .content-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 20px; }
    .card { background: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .card.main-info { grid-column: 1 / -1; }
    h2 { margin: 0 0 20px 0; color: #333; font-size: 28px; }
    .event-details { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
    .detail-row { display: flex; flex-direction: column; gap: 5px; }
    .label { font-weight: 600; color: #666; font-size: 14px; }
    .value { color: #333; font-size: 16px; }
    .status-badge { padding: 6px 12px; border-radius: 12px; font-size: 14px; font-weight: 600; }
    .status-badge.live { background: #d4edda; color: #155724; }
    .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
    .stat-item { text-align: center; padding: 20px; background: #f8f9fa; border-radius: 8px; }
    .stat-number { display: block; font-size: 24px; font-weight: 700; color: #007bff; }
    .stat-label { color: #6c757d; font-size: 12px; }
    .activity-item, .contact-item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
    .activity-time { color: #6c757d; font-size: 12px; }
    .contact-role { color: #6c757d; font-size: 14px; }
    .event-id { background: #e3f2fd; color: #1565c0; padding: 4px 8px; border-radius: 4px; font-weight: 600; }
    .subnav-container { background: #f8f9fa; padding: 10px 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #dee2e6; }
    .subnav-left { display: flex; gap: 10px; }
    .subnav-center { display: flex; gap: 20px; }
    .action-btn { background: #007bff; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; }
    .nav-item { padding: 8px 16px; cursor: pointer; border-radius: 4px; }
    .nav-item.active { background: #007bff; color: white; }
    .nav-item:hover:not(.active) { background: #e9ecef; }
  `]
})
export class EventDetailComponent implements OnInit {
  eventId: string = '';
  eventName: string = '';
  venue: string = '';
  startDate: string = '';
  endDate: string = '';
  location: string = '';
  providing: string = '';
  status: string = '';
  statusClass: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.eventId = this.route.snapshot.params['id'];
    this.loadEventData();
  }

  private loadEventData() {
    // Mock data based on event ID - in real app this would come from a service
    const mockEvents: {[key: string]: any} = {
      '8591': {
        name: 'The Park Theatre (Motor Truss Rental) #3',
        venue: 'Park Theatre, Main Stage',
        startDate: '07/12/25',
        endDate: '07/25/25',
        location: 'Jaffrey, NH',
        providing: 'Rig',
        status: 'Live',
        statusClass: 'live'
      },
      '8776': {
        name: 'Beak & Skiff Seasonal Generator Rental',
        venue: 'Beak & Skiff Brewery, Concert Field',
        startDate: '05/26/25',
        endDate: '06/11/25',
        location: 'Lafayette, NY',
        providing: 'Gen',
        status: 'Live',
        statusClass: 'live'
      }
    };

    const eventData = mockEvents[this.eventId] || {
      name: 'Event Not Found',
      venue: 'Unknown',
      startDate: 'TBD',
      endDate: 'TBD',
      location: 'Unknown',
      providing: 'Unknown',
      status: 'Unknown',
      statusClass: ''
    };

    this.eventName = eventData.name;
    this.venue = eventData.venue;
    this.startDate = eventData.startDate;
    this.endDate = eventData.endDate;
    this.location = eventData.location;
    this.providing = eventData.providing;
    this.status = eventData.status;
    this.statusClass = eventData.statusClass;
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}
