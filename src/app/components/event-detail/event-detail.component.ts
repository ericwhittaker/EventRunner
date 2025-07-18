/** ANGULAR (CORE) */
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FileSystemService } from '../../services/file-system.service';

@Component({
  selector: 'app-event-detail',
  imports: [
    CommonModule
  ],
  template: `
    <div class="subnav-container">
      <div class="subnav-left">
        <button class="btn btn-secondary" (click)="goBack()">
          <i class="fas fa-arrow-left"></i>
          <span>Back to Dashboard</span>
        </button>
        <button class="btn btn-primary">
          <i class="fas fa-edit"></i>
          <span>Edit Event</span>
        </button>
        <button class="btn btn-success" (click)="openFileManager()" [disabled]="isOpeningFolder()">
          <i class="fas" [class.fa-spinner]="isOpeningFolder()" [class.fa-spin]="isOpeningFolder()" [class.fa-folder-open]="!isOpeningFolder()"></i>
          <span>{{ isOpeningFolder() ? 'Opening...' : 'Open Files' }}</span>
        </button>
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
              <span class="stat-number">{{ getEquipmentCount() }}</span>
              <span class="stat-label">Equipment Items</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">{{ getCrewCount() }}</span>
              <span class="stat-label">Crew Members</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">{{ getTodoCount() }}</span>
              <span class="stat-label">To-Do Items</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">{{ getDaysUntilEvent() }}</span>
              <span class="stat-label">{{ getDaysUntilEvent() === 0 ? 'Event Live!' : 'Days Until Event' }}</span>
            </div>
          </div>
        </div>

        <div class="card">
          <h3>Recent Activity</h3>
          <div class="activity-list">
            <div class="activity-item">
              <span class="activity-time">2 hours ago</span>
              <span class="activity-desc">Equipment list updated for {{ eventName }}</span>
            </div>
            <div class="activity-item">
              <span class="activity-time">1 day ago</span>
              <span class="activity-desc">Crew assignments confirmed</span>
            </div>
            <div class="activity-item">
              <span class="activity-time">3 days ago</span>
              <span class="activity-desc">Site survey completed at {{ venue }}</span>
            </div>
            <div class="activity-item">
              <span class="activity-time">1 week ago</span>
              <span class="activity-desc">Initial client meeting scheduled</span>
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
            <div class="contact-item">
              <span class="contact-name">Mike Davis</span>
              <span class="contact-role">Lead Audio Tech</span>
            </div>
            <div class="contact-item">
              <span class="contact-name">Emily Chen</span>
              <span class="contact-role">Client Representative</span>
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
    .subnav-container { background: #f8f9fa; padding: 15px 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #dee2e6; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
    .subnav-left { display: flex; gap: 12px; }
    .subnav-center { display: flex; gap: 20px; }
    
    /* Modern Button Styles */
    .btn { 
      display: inline-flex; 
      align-items: center; 
      gap: 8px; 
      padding: 10px 16px; 
      border: none; 
      border-radius: 6px; 
      font-size: 14px; 
      font-weight: 500; 
      cursor: pointer; 
      transition: all 0.2s ease;
      text-decoration: none;
      min-width: 120px;
      justify-content: center;
    }
    
    .btn i { font-size: 14px; }
    
    .btn-primary { 
      background: linear-gradient(135deg, #007bff 0%, #0056b3 100%); 
      color: white; 
      box-shadow: 0 2px 4px rgba(0, 123, 255, 0.3);
    }
    .btn-primary:hover:not(:disabled) { 
      background: linear-gradient(135deg, #0056b3 0%, #004085 100%); 
      box-shadow: 0 4px 8px rgba(0, 123, 255, 0.4);
      transform: translateY(-1px);
    }
    
    .btn-secondary { 
      background: linear-gradient(135deg, #6c757d 0%, #545b62 100%); 
      color: white; 
      box-shadow: 0 2px 4px rgba(108, 117, 125, 0.3);
    }
    .btn-secondary:hover:not(:disabled) { 
      background: linear-gradient(135deg, #545b62 0%, #383d41 100%); 
      box-shadow: 0 4px 8px rgba(108, 117, 125, 0.4);
      transform: translateY(-1px);
    }
    
    .btn-success { 
      background: linear-gradient(135deg, #28a745 0%, #1e7e34 100%); 
      color: white; 
      box-shadow: 0 2px 4px rgba(40, 167, 69, 0.3);
    }
    .btn-success:hover:not(:disabled) { 
      background: linear-gradient(135deg, #1e7e34 0%, #155724 100%); 
      box-shadow: 0 4px 8px rgba(40, 167, 69, 0.4);
      transform: translateY(-1px);
    }
    
    .btn:disabled { 
      background: linear-gradient(135deg, #6c757d 0%, #545b62 100%) !important; 
      cursor: not-allowed !important; 
      opacity: 0.7;
      transform: none !important;
      box-shadow: 0 1px 2px rgba(0,0,0,0.1) !important;
    }
    
    .btn:active:not(:disabled) { 
      transform: translateY(0px) !important; 
      box-shadow: 0 1px 2px rgba(0,0,0,0.2) !important;
    }
    
    /* Loading spinner animation */
    .fa-spin { animation: spin 1s linear infinite; }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    .nav-item { padding: 8px 16px; cursor: pointer; border-radius: 4px; }
    .nav-item.active { background: #007bff; color: white; }
    .nav-item:hover:not(.active) { background: #e9ecef; }
  `]
})
export class EventDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fileSystemService = inject(FileSystemService);

  eventId: string = '';
  eventName: string = '';
  venue: string = '';
  startDate: string = '';
  endDate: string = '';
  location: string = '';
  providing: string = '';
  status: string = '';
  statusClass: string = '';
  isOpeningFolder = signal(false);

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
        startDate: '07/15/25',
        endDate: '07/25/25',
        location: 'Jaffrey, NH',
        providing: 'Rig',
        status: 'Live',
        statusClass: 'live'
      },
      '8776': {
        name: 'Beak & Skiff Seasonal Generator Rental',
        venue: 'Beak & Skiff Brewery, Concert Field',
        startDate: '07/10/25',
        endDate: '07/14/25',
        location: 'Lafayette, NY',
        providing: 'Gen',
        status: 'Live',
        statusClass: 'live'
      },
      '8409': {
        name: 'Do Good Fest 2025',
        venue: 'National Life Group, Concert Site',
        startDate: '07/12/25',
        endDate: '07/13/25',
        location: 'Montpelier, VT',
        providing: 'Rig',
        status: 'Live',
        statusClass: 'live'
      },
      '8743': {
        name: 'Shoreline Summer Fest',
        venue: 'Atomic Pro Audio, Shop Return',
        startDate: '07/13/25',
        endDate: '07/13/25',
        location: 'N. Clarendon, VT',
        providing: 'Sound',
        status: 'Live',
        statusClass: 'live'
      },
      '8798': {
        name: 'Mountain View Country Club Wedding',
        venue: 'Mountain View Country Club, Grand Ballroom',
        startDate: '07/22/25',
        endDate: '07/25/25',
        location: 'Stowe, VT',
        providing: 'Audio/Video',
        status: '8 Days',
        statusClass: 'soon'
      },
      '8845': {
        name: 'Boston Harbor Festival - Main Stage Setup',
        venue: 'Harbor Pavilion, Main Stage',
        startDate: '08/02/25',
        endDate: '08/04/25',
        location: 'Boston, MA',
        providing: 'Full Rig',
        status: '19 Days',
        statusClass: 'future'
      },
      '8856': {
        name: 'University Graduation Ceremony',
        venue: 'University Stadium, Field House',
        startDate: '08/22/25',
        endDate: '08/24/25',
        location: 'Burlington, VT',
        providing: 'Audio Only',
        status: '39 Days',
        statusClass: 'future'
      },
      '8901': {
        name: 'Tech Conference 2025 - Corporate AV',
        venue: 'Boston Convention Center, Hall A',
        startDate: '08/15/25',
        endDate: '08/17/25',
        location: 'Boston, MA',
        providing: 'AV/Lighting',
        status: '32 Days',
        statusClass: 'future'
      },
      '8923': {
        name: 'Fall Harvest Festival - Multiple Stages',
        venue: 'Shelburne Farms, Multiple Locations',
        startDate: '09/05/25',
        endDate: '09/07/25',
        location: 'Shelburne, VT',
        providing: 'Full Production',
        status: '53 Days',
        statusClass: 'far-future'
      },
      '8967': {
        name: 'Craft Beer Festival - Outdoor Stage',
        venue: 'Downtown Park, Main Stage',
        startDate: '09/12/25',
        endDate: '09/14/25',
        location: 'Portland, ME',
        providing: 'Stage/Audio',
        status: '60 Days',
        statusClass: 'far-future'
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

  async openFileManager() {
    if (this.isOpeningFolder()) return;
    
    this.isOpeningFolder.set(true);
    
    try {
      const result = await this.fileSystemService.openFileManager();
      
      if (result.success) {
        console.log('✅ File manager opened successfully on', result.platform);
        // Optionally show a brief success message
      } else {
        console.error('❌ Failed to open file manager:', result.error);
        // Show error to user
        alert(`Failed to open file manager: ${result.error}`);
      }
    } catch (error) {
      console.error('❌ Error opening file manager:', error);
      alert('An unexpected error occurred while opening the file manager.');
    }
    
    // Reset button after 2 seconds
    setTimeout(() => {
      this.isOpeningFolder.set(false);
    }, 2000);
  }

  // Dynamic stat methods based on event ID
  getEquipmentCount(): number {
    const equipmentCounts: {[key: string]: number} = {
      '8591': 15, '8776': 8, '8409': 22, '8743': 12,
      '8798': 18, '8845': 35, '8856': 14, '8901': 28,
      '8923': 45, '8967': 25
    };
    return equipmentCounts[this.eventId] || 12;
  }

  getCrewCount(): number {
    const crewCounts: {[key: string]: number} = {
      '8591': 6, '8776': 3, '8409': 8, '8743': 4,
      '8798': 5, '8845': 12, '8856': 4, '8901': 9,
      '8923': 15, '8967': 8
    };
    return crewCounts[this.eventId] || 5;
  }

  getTodoCount(): number {
    const todoCounts: {[key: string]: number} = {
      '8591': 3, '8776': 1, '8409': 0, '8743': 0,
      '8798': 2, '8845': 5, '8856': 1, '8901': 4,
      '8923': 7, '8967': 2
    };
    return todoCounts[this.eventId] || 0;
  }

  getDaysUntilEvent(): number {
    if (!this.startDate) return 0;
    const eventDate = new Date(this.startDate);
    const today = new Date();
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  }
}
