import { Component, signal } from '@angular/core';
import { MenuComponent } from '../menu.component';
import { CommonModule } from '@angular/common';
import { APP_VERSION } from '../../version';
import { FileMakerMigrationService } from '../../services/filemaker-migration-new.service';
import { EventService } from '../../services/event.service';
import { FirebaseService } from '../../services/firebase.service';

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
        <div class="nav-item" [class.active]="selectedTab() === 'dashboard'" (click)="selectTab('dashboard')">Dashboard</div>
        <div class="nav-item" [class.active]="selectedTab() === 'health'" (click)="selectTab('health')">System Health</div>
        <div class="nav-item" [class.active]="selectedTab() === 'logs'" (click)="selectTab('logs')">Logs</div>
        <div class="nav-item" [class.active]="selectedTab() === 'database'" (click)="selectTab('database')">Database</div>
        <div class="nav-item" [class.active]="selectedTab() === 'integrations'" (click)="selectTab('integrations')">Integrations</div>
        <div class="nav-item" [class.active]="selectedTab() === 'migration'" (click)="selectTab('migration')">FileMaker Migration</div>
      </div>
      <div class="subnav-right">
        <span class="module-title">System Administration</span>
      </div>
    </div>
    <div class="page-content">
      <!-- Dashboard Tab -->
      @if (selectedTab() === 'dashboard') {
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
                <span>{{ version() }}</span>
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
      }

      <!-- FileMaker Migration Tab -->
      @if (selectedTab() === 'migration') {
        <div class="migration-container">
          <div class="card">
            <h3>FileMaker to Firestore Migration</h3>
            <p class="migration-info">
              Migrate your FileMaker data to Firestore using the DDR analysis from your FileMaker solution.
              <br><strong>Full Migration:</strong> All records will be migrated to Firestore with comprehensive data and relationships.
            </p>
            
            <div class="ddr-info">
              <h4>📋 Database Schema (from DDR)</h4>
              <div class="table-info-grid">
                <div class="table-info-item">
                  <span class="table-icon">📅</span>
                  <span class="table-name">EVENTS</span>
                  <span class="table-count">~7,263 records</span>
                </div>
                <div class="table-info-item">
                  <span class="table-icon">🏢</span>
                  <span class="table-name">VENUES</span>
                  <span class="table-count">~767 records</span>
                </div>
                <div class="table-info-item">
                  <span class="table-icon">👥</span>
                  <span class="table-name">CONTACTS</span>
                  <span class="table-count">~1,638 records</span>
                </div>
                <div class="table-info-item">
                  <span class="table-icon">🚗</span>
                  <span class="table-name">VEHICLES</span>
                  <span class="table-count">~107 records</span>
                </div>
              </div>
            </div>
            
            <div class="migration-controls">
              <button 
                class="migration-btn start-btn" 
                (click)="startDDRMigration()" 
                [disabled]="migrationService.migrationStatus() === 'running'">
                @if (migrationService.migrationStatus() === 'running') {
                  <span>🔄 Migrating...</span>
                } @else {
                  <span>🚀 Start DDR Migration</span>
                }
              </button>
              
              <button 
                class="migration-btn clear-btn" 
                (click)="clearData()" 
                [disabled]="migrationService.migrationStatus() === 'running'">
                🗑️ Clear Data
              </button>
            </div>
          </div>
          
          @if (migrationService.migrationStatus() !== 'idle') {
            <div class="card">
              <h3>Migration Progress</h3>
              <div class="progress-section">
                <div class="progress-bar">
                  <div class="progress-fill" [style.width.%]="migrationService.migrationProgress()"></div>
                </div>
                <div class="progress-info">
                  <span>{{ migrationService.migrationProgress() }}% Complete</span>
                  <span class="status-badge" [class]="migrationService.migrationStatus()">
                    {{ migrationService.migrationStatus() | titlecase }}
                  </span>
                </div>
              </div>
            </div>
          }
          
          @if (migrationService.migrationLogs().length > 0) {
            <div class="card logs-card">
              <h3>Migration Logs</h3>
              <div class="logs-container">
                @for (log of migrationService.migrationLogs(); track log) {
                  <div class="log-entry" 
                       [class.success]="log.includes('✓')"
                       [class.error]="log.includes('✗')">
                    {{ log }}
                  </div>
                }
              </div>
            </div>
          }
        </div>
      }

      <!-- Placeholder for other tabs -->
      @if (selectedTab() !== 'dashboard' && selectedTab() !== 'migration') {
        <div class="content-grid">
          <div class="card">
            <h3>{{ selectedTab() | titlecase }}</h3>
            <p>This section is under development.</p>
          </div>
        </div>
      }
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
    
    /* Migration specific styles */
    .migration-container { display: flex; flex-direction: column; gap: 20px; }
    .migration-info { color: #6c757d; font-size: 14px; margin-bottom: 20px; }
    .ddr-info { margin: 20px 0; }
    .ddr-info h4 { margin-bottom: 15px; color: #495057; }
    .table-info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; }
    .table-info-item { display: flex; align-items: center; gap: 10px; padding: 12px; background: #f8f9fa; border-radius: 8px; border: 1px solid #dee2e6; }
    .table-icon { font-size: 20px; }
    .table-name { font-weight: 600; color: #495057; }
    .table-count { color: #6c757d; font-size: 12px; margin-left: auto; }
    .migration-controls { display: flex; gap: 10px; margin-top: 20px; }
    .migration-btn { padding: 12px 24px; border: none; border-radius: 4px; cursor: pointer; font-weight: 600; }
    .start-btn { background: #28a745; color: white; }
    .start-btn:disabled { background: #6c757d; cursor: not-allowed; }
    .clear-btn { background: #dc3545; color: white; }
    .clear-btn:disabled { background: #6c757d; cursor: not-allowed; }
    .progress-section { margin-top: 15px; }
    .progress-bar { width: 100%; height: 20px; background: #e9ecef; border-radius: 10px; overflow: hidden; margin-bottom: 10px; }
    .progress-fill { height: 100%; background: #28a745; transition: width 0.3s ease; }
    .progress-info { display: flex; justify-content: space-between; align-items: center; }
    .status-badge { padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 600; }
    .status-badge.running { background: #ffc107; color: #212529; }
    .status-badge.completed { background: #28a745; color: white; }
    .status-badge.error { background: #dc3545; color: white; }
    .logs-card { grid-column: 1 / -1; }
    .logs-container { max-height: 300px; overflow-y: auto; background: #f8f9fa; padding: 15px; border-radius: 4px; font-family: monospace; }
    .log-entry { margin-bottom: 8px; padding: 4px 0; font-size: 12px; }
    .log-entry.success { color: #28a745; }
    .log-entry.error { color: #dc3545; }
  `]
})
export class AdminComponent {
  version = signal(APP_VERSION);
  selectedTab = signal('dashboard');

  constructor(
    public migrationService: FileMakerMigrationService, 
    private eventService: EventService,
    private firebaseService: FirebaseService
  ) {}

  selectTab(tab: string) {
    this.selectedTab.set(tab);
  }

  async startDDRMigration() {
    try {
      await this.migrationService.migrateWithXMLOrDDR();
      // Refresh the EventService to reflect the new data
      await this.eventService.loadAllData();
      alert('Migration completed successfully!');
    } catch (error) {
      alert(`Migration failed: ${error}`);
    }
  }

  async clearData() {
    if (confirm('Are you sure you want to clear all migration data? This cannot be undone.')) {
      await this.migrationService.clearMigrationData();
      // Refresh the EventService to reflect the cleared data
      await this.eventService.loadAllData();
      alert('Migration data cleared successfully!');
    }
  }
}
