/**ANGULAR (CORE) */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users',
  imports: [
    CommonModule
  ],
  template: `
    <div class="subnav-container">
      <div class="subnav-left">
        <button class="action-btn">Add User</button>
        <button class="action-btn">Manage Roles</button>
      </div>
      <div class="subnav-center">
        <div class="nav-item active">Active Users</div>
        <div class="nav-item">Permissions</div>
        <div class="nav-item">User Groups</div>
        <div class="nav-item">Activity Log</div>
      </div>
      <div class="subnav-right">
        <input type="text" placeholder="Search users..." class="search-input">
      </div>
    </div>
    <div class="page-content">
      <div class="content-grid">
        <div class="card">
          <h3>System Users</h3>
          <div class="user-list">
            <div class="user-item">
              <div class="user-avatar">EW</div>
              <div class="user-info">
                <h4>Eric Whittaker</h4>
                <p>Administrator</p>
                <span class="user-status online">Online</span>
              </div>
              <div class="user-actions">
                <button class="edit-btn">Edit</button>
              </div>
            </div>
            <div class="user-item">
              <div class="user-avatar">MJ</div>
              <div class="user-info">
                <h4>Mike Johnson</h4>
                <p>Project Manager</p>
                <span class="user-status offline">Offline</span>
              </div>
              <div class="user-actions">
                <button class="edit-btn">Edit</button>
              </div>
            </div>
          </div>
        </div>
        <div class="card">
          <h3>User Roles</h3>
          <div class="role-list">
            <div class="role-item">
              <span class="role-name">Administrator</span>
              <span class="role-count">2 users</span>
            </div>
            <div class="role-item">
              <span class="role-name">Project Manager</span>
              <span class="role-count">5 users</span>
            </div>
            <div class="role-item">
              <span class="role-name">Crew Member</span>
              <span class="role-count">12 users</span>
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
    .user-item { display: flex; align-items: center; gap: 15px; padding: 15px 0; border-bottom: 1px solid #eee; }
    .user-avatar { width: 40px; height: 40px; border-radius: 50%; background: #28a745; color: white; display: flex; align-items: center; justify-content: center; font-weight: 600; }
    .user-info { flex: 1; }
    .user-info h4 { margin: 0 0 5px 0; color: #333; }
    .user-info p { margin: 0 0 5px 0; color: #666; font-size: 14px; }
    .user-status { padding: 2px 8px; border-radius: 12px; font-size: 12px; }
    .user-status.online { background: #d4edda; color: #155724; }
    .user-status.offline { background: #f8d7da; color: #721c24; }
    .edit-btn { background: #6c757d; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px; }
    .role-item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
    .role-name { font-weight: 500; }
    .role-count { color: #6c757d; font-size: 14px; }
    .subnav-container { background: #f8f9fa; padding: 10px 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #dee2e6; }
    .subnav-left { display: flex; gap: 10px; }
    .subnav-center { display: flex; gap: 20px; }
    .subnav-right { display: flex; align-items: center; }
    .search-input { padding: 6px 12px; border: 1px solid #ddd; border-radius: 4px; }
    .action-btn { background: #007bff; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; }
    .nav-item { padding: 8px 16px; cursor: pointer; border-radius: 4px; }
    .nav-item.active { background: #007bff; color: white; }
    .nav-item:hover:not(.active) { background: #e9ecef; }
  `]
})
export class UsersComponent {
}
