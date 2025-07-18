/** ANGULAR (CORE) */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-trips',
  imports: [
    CommonModule
  ],
  template: `
    <div class="subnav-container">
      <div class="subnav-left">
        <button class="action-btn">Add Trip</button>
        <button class="action-btn">Add Vehicle</button>
      </div>
      <div class="subnav-center">
        <div class="nav-item active">Active Trips</div>
        <div class="nav-item">Completed</div>
        <div class="nav-item">Vehicles</div>
        <div class="nav-item">Maintenance</div>
      </div>
      <div class="subnav-right">
        <span class="module-title">Trips & Vehicles</span>
      </div>
    </div>
    <div class="page-content">
      <div class="content-grid">
        <div class="card">
          <h3>Active Trips</h3>
          <div class="trip-list">
            <div class="trip-item">
              <span class="trip-date">07/15/25</span>
              <span class="trip-route">Boston → Portland</span>
              <span class="trip-driver">Mike Johnson</span>
              <span class="trip-status active">En Route</span>
            </div>
            <div class="trip-item">
              <span class="trip-date">07/16/25</span>
              <span class="trip-route">Portland → Jaffrey</span>
              <span class="trip-driver">Sarah Chen</span>
              <span class="trip-status scheduled">Scheduled</span>
            </div>
          </div>
        </div>
        <div class="card">
          <h3>Vehicle Fleet</h3>
          <div class="vehicle-list">
            <div class="vehicle-item">
              <span class="vehicle-id">T-001</span>
              <span class="vehicle-type">Box Truck</span>
              <span class="vehicle-status available">Available</span>
            </div>
            <div class="vehicle-item">
              <span class="vehicle-id">T-002</span>
              <span class="vehicle-type">Flatbed</span>
              <span class="vehicle-status in-use">In Use</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-content { padding: 20px; max-width: 1400px; margin: 0 auto; }
    .content-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .card { background: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .trip-item, .vehicle-item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
    .trip-status, .vehicle-status { padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 600; }
    .trip-status.active, .vehicle-status.in-use { background: #4caf50; color: white; }
    .trip-status.scheduled, .vehicle-status.available { background: #2196f3; color: white; }
    .subnav-container { background: #f8f9fa; padding: 10px 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #dee2e6; }
    .subnav-left { display: flex; gap: 10px; }
    .subnav-center { display: flex; gap: 20px; }
    .subnav-right { font-weight: 600; color: #495057; }
    .action-btn { background: #007bff; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; }
    .nav-item { padding: 8px 16px; cursor: pointer; border-radius: 4px; }
    .nav-item.active { background: #007bff; color: white; }
    .nav-item:hover:not(.active) { background: #e9ecef; }
  `]
})
export class TripsComponent {
}
