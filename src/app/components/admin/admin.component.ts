import { Component } from '@angular/core';
import { MenuComponent } from '../menu.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
  imports: [MenuComponent, CommonModule],
  template: `
    <app-menu></app-menu>
    <div class="subnav-container">
      <div class="subnav-left">
        <button class="action-btn">System Settings</button>
        <button class="action-btn">Backup</button>
      </div>
      <div class="subnav-center">
        <div class="nav-item active">Dashboard</div>
        <div class="nav-item">System Health</div>
        <div class="nav-item">Logs</div>
        <div class="nav-item">Database</div>
        <div class="nav-item">Integrations</div>
      </div>
      <div class="subnav-right">
        <span class="module-title">System Administration</span>
      </div>
    </div>
    <div class="page-content">
      <div class="content-grid">
        <div class="card">
          <h3>System Status</h3>
          <div class="status-grid">
            <div class="status-item healthy">
              <span class="status-icon">✓</span>
              <span class="status-label">Database</span>
            </div>
            <div class="status-item healthy">
              <span class="status-icon">✓</span>
              <span class="status-label">API Server</span>
            </div>
            <div class="status-item warning">
              <span class="status-icon">⚠</span>
              <span class="status-label">Storage</span>
            </div>
          </div>
        </div>
        <div class="card">
          <h3>Recent Activity</h3>
          <div class="activity-log">
            <div class="activity-item">
              <span class="activity-time">10:30 AM</span>
              <span class="activity-desc">User login: Eric</span>
            </div>
            <div class="activity-item">
              <span class="activity-time">09:15 AM</span>
              <span class="activity-desc">Database backup completed</span>
            </div>
          </div>
        </div>
        <div class="card">
          <h3>Quick Actions</h3>
          <div class="admin-actions">
            <button class="admin-btn">Clear Cache</button>
            <button class="admin-btn">Export Data</button>
            <button class="admin-btn">System Restart</button>
          </div>
        </div>
        <div class="card">
          <h3>System Information</h3>
          <div class="info-list">
            <div class="info-item">
              <span>Version:</span>
              <span>2.1.3</span>
            </div>
            <div class="info-item">
              <span>Uptime:</span>
              <span>7 days, 3 hours</span>
            </div>
            <div class="info-item">
              <span>Users Online:</span>
              <span>2</span>
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
    .status-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; }
    .status-item { display: flex; flex-direction: column; align-items: center; padding: 15px; border-radius: 8px; }
    .status-item.healthy { background: #d4edda; color: #155724; }
    .status-item.warning { background: #fff3cd; color: #856404; }
    .status-icon { font-size: 24px; margin-bottom: 8px; }
    .status-label { font-size: 12px; font-weight: 600; }
    .activity-item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
    .activity-time { color: #6c757d; font-size: 12px; }
    .activity-desc { font-size: 14px; }
    .admin-actions { display: flex; flex-direction: column; gap: 10px; }
    .admin-btn { background: #dc3545; color: white; border: none; padding: 10px; border-radius: 4px; cursor: pointer; }
    .info-item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
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
export class AdminComponent {
}
