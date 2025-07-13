
import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuComponent } from './components/menu.component';
import { SubMenuComponent } from './components/submenu.component';
import { DashboardListComponent, MainDashboardRow } from './components/dashboard-list.component';
import { TentativeListComponent, TentativeRow } from './components/tentative-list.component';
import { PostShowListComponent, PostShowRow } from './components/postshow-list.component';
import { ActionButtonService } from './components/shared/action-buttons/action-button.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    MenuComponent,
    SubMenuComponent,
    DashboardListComponent,
    TentativeListComponent,
    PostShowListComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  private actionButtonService = inject(ActionButtonService);
  
  protected readonly title = signal('EventRunner');
  
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
      start: '05/26/25',
      end: '06/30/25',
      eventName: 'Beak & Skiff Seasonal Rental',
      eventId: { html: '<span class="event-id">8772</span>' },
      venue: 'Beak & Skiff Brewery, Concert Field',
      cityState: 'Lafayette, NY',
      providing: 'P&D Site',
      status: { html: '<span class="status live">Live</span>' }
    },
    {
      start: '06/13/25',
      end: '07/13/25', 
      eventName: 'Bard College Summer Radio Institute at Bard College',
      eventId: { html: '<span class="event-id">8785</span>' },
      venue: 'Bard College, Richard B Fisher Center for the',
      cityState: 'Annandale, NY',
      providing: 'Srd',
      status: { html: '<span class="status live">Live</span>' }
    },
    {
      start: '06/15/25',
      end: '07/30/25',
      eventName: 'Opera North Summer Rental',
      eventId: { html: '<span class="event-id">8644</span>' },
      venue: 'Blow Me Down Farm, Concert Field',
      cityState: 'Cornish, NH',
      providing: 'Lis Rig Pers',
      status: { html: '<span class="status live">Live</span>' }
    }
  ]);
  
  // Tentative Data
  tentativeData = signal<TentativeRow[]>([
    {
      start: '07/20/25',
      end: '07/20/25',
      eventName: 'Fight Oligarchy Stanchion rental',
      status: { html: '<span class="status urgent">8</span>' },
      toDo: '0',
      info: { html: '<span class="info-icon">ⓘ</span>' }
    },
    {
      start: '07/24/25',
      end: '07/26/25',
      eventName: 'Jam in the Dam',
      status: { html: '<span class="status warning">12</span>' },
      toDo: '0',
      info: { html: '<span class="info-icon">ⓘ</span>' }
    },
    {
      start: '07/25/25',
      end: '07/25/25',
      eventName: 'Dartmouth DGALA Event',
      status: { html: '<span class="status warning"><30</span>' },
      toDo: '0',
      info: { html: '<span class="info-icon">ⓘ</span>' }
    }
  ]);
  
  // Post Show / Follow Up Data  
  postShowData = signal<PostShowRow[]>([
    {
      start: '07/11/25',
      end: '07/11/25',
      eventName: 'Thompson\'s Point - Dark Star Orchestra',
      cityState: 'Portland, ME',
      info: { html: '<span class="info-icon">ⓘ</span>' },
      toDo: '0',
      setS: { html: '<span class="check-icon">✓</span>' }
    },
    {
      start: '07/10/25',
      end: '07/12/25',
      eventName: 'CQTG - SL320 - Father John Misty',
      cityState: 'Shelburne, VT',
      info: { html: '<span class="info-icon">ⓘ</span>' },
      toDo: '0', 
      setS: { html: '<span class="check-icon">✓</span>' }
    },
    {
      start: '07/10/25',
      end: '07/12/25',
      eventName: 'Amos Lee at Lake Morey Resort',
      cityState: 'Fairlee, VT',
      info: { html: '<span class="info-icon">ⓘ</span>' },
      toDo: '3',
      setS: { html: '<span class="check-icon">✓</span>' }
    }
  ]);
  
  ngOnInit() {
    // Example: Configure action buttons dynamically
    // You can customize buttons based on user permissions, current page, etc.
    
    // Example: Add a custom button for dashboard page
    // this.actionButtonService.addButton({
    //   id: 'export-data',
    //   icon: '📁',
    //   text: 'Export',
    //   tooltip: 'Export dashboard data',
    //   type: 'action',
    //   enabled: true,
    //   visible: true,
    //   action: () => this.exportDashboardData()
    // });
    
    // Example: Disable a button based on some condition
    // this.actionButtonService.setButtonEnabled('add-event', false);
  }
  
  private exportDashboardData() {
    console.log('Exporting dashboard data...');
    // Implementation for exporting data
  }
}
