import { Component } from '@angular/core';
import { MenuComponent } from '../menu.component';
import { SubMenuComponent } from '../submenu.component';

@Component({
  selector: 'app-events',
  imports: [MenuComponent, SubMenuComponent],
  template: `
    <app-menu></app-menu>
    <div class="subheader-row">
      <app-submenu></app-submenu>
    </div>
    <div class="page-content">
      <h2>Events Management</h2>
      <p>This is the Events page. You can navigate here using <code>#/events</code></p>
      <div class="card">
        <h3>Add New Event</h3>
        <p>Event creation form would go here...</p>
      </div>
      <div class="card">
        <h3>Event List</h3>
        <p>Event listing would go here...</p>
      </div>
    </div>
  `,
  styles: [`
    .page-content {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
    .card {
      background: white;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    h2 {
      color: #333;
      margin-bottom: 20px;
    }
    h3 {
      color: #555;
      margin-bottom: 10px;
    }
    code {
      background: #f5f5f5;
      padding: 2px 6px;
      border-radius: 4px;
      font-family: monospace;
    }
  `]
})
export class EventsComponent {
}
