/** ANGULAR (CORE) */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contacts',
  imports: [
    CommonModule
  ],
  template: `
    <div class="subnav-container">
      <div class="subnav-left">
        <button class="action-btn">Add Contact</button>
        <button class="action-btn">Import</button>
      </div>
      <div class="subnav-center">
        <div class="nav-item active">All Contacts</div>
        <div class="nav-item">Clients</div>
        <div class="nav-item">Vendors</div>
        <div class="nav-item">Crew</div>
        <div class="nav-item">Recently Added</div>
      </div>
      <div class="subnav-right">
        <input type="text" placeholder="Search contacts..." class="search-input">
      </div>
    </div>
    <div class="page-content">
      <div class="content-grid">
        <div class="card">
          <h3>Recent Contacts</h3>
          <div class="contact-list">
            <div class="contact-item">
              <div class="contact-avatar">JD</div>
              <div class="contact-info">
                <h4>John Doe</h4>
                <p>Production Manager</p>
                <span class="contact-type client">Client</span>
              </div>
              <div class="contact-actions">
                <button class="action-icon">✉️</button>
                <button class="action-icon">📞</button>
              </div>
            </div>
            <div class="contact-item">
              <div class="contact-avatar">SM</div>
              <div class="contact-info">
                <h4>Sarah Miller</h4>
                <p>Sound Engineer</p>
                <span class="contact-type crew">Crew</span>
              </div>
              <div class="contact-actions">
                <button class="action-icon">✉️</button>
                <button class="action-icon">📞</button>
              </div>
            </div>
          </div>
        </div>
        <div class="card">
          <h3>Contact Statistics</h3>
          <div class="stats-grid">
            <div class="stat-item">
              <span class="stat-number">432</span>
              <span class="stat-label">Total Contacts</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">89</span>
              <span class="stat-label">Active Clients</span>
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
    .contact-item { display: flex; align-items: center; gap: 15px; padding: 15px 0; border-bottom: 1px solid #eee; }
    .contact-avatar { width: 40px; height: 40px; border-radius: 50%; background: #007bff; color: white; display: flex; align-items: center; justify-content: center; font-weight: 600; }
    .contact-info { flex: 1; }
    .contact-info h4 { margin: 0 0 5px 0; color: #333; }
    .contact-info p { margin: 0 0 5px 0; color: #666; font-size: 14px; }
    .contact-type { padding: 2px 8px; border-radius: 12px; font-size: 12px; }
    .contact-type.client { background: #e8f5e8; color: #2e7d32; }
    .contact-type.crew { background: #fff3e0; color: #f57c00; }
    .contact-actions { display: flex; gap: 8px; }
    .action-icon { background: none; border: none; font-size: 16px; cursor: pointer; padding: 4px; }
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
export class ContactsComponent {
}
