import { Component } from '@angular/core';
import { MenuComponent } from '../menu.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-venues',
  imports: [MenuComponent, CommonModule],
  template: `
    <app-menu></app-menu>
    <div class="subnav-container">
      <div class="subnav-left">
        <button class="action-btn">Add Venue</button>
        <button class="action-btn">Import</button>
      </div>
      <div class="subnav-center">
        <div class="nav-item active">All Venues</div>
        <div class="nav-item">Theaters</div>
        <div class="nav-item">Outdoor</div>
        <div class="nav-item">Corporate</div>
        <div class="nav-item">Recently Used</div>
      </div>
      <div class="subnav-right">
        <input type="text" placeholder="Search venues..." class="search-input">
      </div>
    </div>
    <div class="page-content">
      <div class="content-grid">
        <div class="card">
          <h3>Featured Venues</h3>
          <div class="venue-list">
            <div class="venue-item">
              <div class="venue-info">
                <h4>Park Theatre</h4>
                <p>Jaffrey, NH</p>
                <span class="venue-type">Theater</span>
              </div>
              <div class="venue-stats">
                <span class="stat">12 events</span>
              </div>
            </div>
            <div class="venue-item">
              <div class="venue-info">
                <h4>Beak & Skiff Brewery</h4>
                <p>Lafayette, NY</p>
                <span class="venue-type">Outdoor</span>
              </div>
              <div class="venue-stats">
                <span class="stat">8 events</span>
              </div>
            </div>
          </div>
        </div>
        <div class="card">
          <h3>Venue Statistics</h3>
          <div class="stats-grid">
            <div class="stat-item">
              <span class="stat-number">156</span>
              <span class="stat-label">Total Venues</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">23</span>
              <span class="stat-label">Active This Month</span>
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
    .venue-item { display: flex; justify-content: space-between; align-items: center; padding: 15px 0; border-bottom: 1px solid #eee; }
    .venue-info h4 { margin: 0 0 5px 0; color: #333; }
    .venue-info p { margin: 0 0 5px 0; color: #666; font-size: 14px; }
    .venue-type { background: #e3f2fd; color: #1565c0; padding: 2px 8px; border-radius: 12px; font-size: 12px; }
    .stat { background: #f8f9fa; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
    .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
    .stat-item { text-align: center; padding: 20px; background: #f8f9fa; border-radius: 8px; }
    .stat-number { display: block; font-size: 24px; font-weight: 700; color: #007bff; }
    .stat-label { color: #6c757d; font-size: 12px; }
    .search-input { padding: 6px 12px; border: 1px solid #ddd; border-radius: 4px; }
    .subnav-container { background: #f8f9fa; padding: 10px 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #dee2e6; }
    .subnav-left { display: flex; gap: 10px; }
    .subnav-center { display: flex; gap: 20px; }
    .action-btn { background: #007bff; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; }
    .nav-item { padding: 8px 16px; cursor: pointer; border-radius: 4px; }
    .nav-item.active { background: #007bff; color: white; }
    .nav-item:hover:not(.active) { background: #e9ecef; }
  `]
})
export class VenuesComponent {
}
