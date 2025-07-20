/** ANGULAR (CORE) */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'er-build-tasks',
  imports: [
    CommonModule
  ],
  template: `
    <div class="subnav-container">
      <div class="subnav-left">
        <button class="action-btn">New Build</button>
        <button class="action-btn">Update Status</button>
      </div>
      <div class="subnav-center">
        <div class="nav-item active">In Progress</div>
        <div class="nav-item">Completed</div>
        <div class="nav-item">Materials</div>
        <div class="nav-item">Labor Hours</div>
      </div>
      <div class="subnav-right">
        <span class="module-title">Build Log</span>
      </div>
    </div>
    <div class="page-content">
      <div class="content-grid">
        <div class="card full-width">
          <h3>Current Builds</h3>
          <div class="build-table">
            <div class="build-header">
              <span>Project</span>
              <span>Stage</span>
              <span>Assigned To</span>
              <span>Due Date</span>
              <span>Progress</span>
            </div>
            <div class="build-row">
              <span>Truss System A</span>
              <span>Fabrication</span>
              <span>Team Alpha</span>
              <span>07/20/25</span>
              <div class="progress-bar"><div class="progress-fill" style="width: 75%"></div></div>
            </div>
            <div class="build-row">
              <span>Lighting Rig B</span>
              <span>Testing</span>
              <span>Team Beta</span>
              <span>07/18/25</span>
              <div class="progress-bar"><div class="progress-fill" style="width: 90%"></div></div>
            </div>
          </div>
        </div>
        <div class="card">
          <h3>Material Inventory</h3>
          <div class="material-list">
            <div class="material-item">
              <span>Steel Tubes (20ft)</span>
              <span class="qty">150 units</span>
            </div>
            <div class="material-item">
              <span>LED Fixtures</span>
              <span class="qty">45 units</span>
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
    .card.full-width { grid-column: 1 / -1; }
    .build-table { display: flex; flex-direction: column; gap: 10px; }
    .build-header, .build-row { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr 1fr; gap: 15px; align-items: center; padding: 10px; }
    .build-header { background: #f8f9fa; font-weight: 600; border-radius: 4px; }
    .build-row { border-bottom: 1px solid #eee; }
    .progress-bar { background: #e9ecef; height: 8px; border-radius: 4px; overflow: hidden; }
    .progress-fill { background: #28a745; height: 100%; transition: width 0.3s; }
    .material-item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
    .qty { font-weight: 600; color: #007bff; }
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
export class BuildTasksComponent {
}
