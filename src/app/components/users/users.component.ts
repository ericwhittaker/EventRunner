/**ANGULAR (CORE) */
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConvexAuthService, SignUpData } from '../../services/convex-auth.service';

@Component({
  selector: 'app-users',
  imports: [
    CommonModule,
    FormsModule
  ],
  template: `
    <div class="subnav-container">
      <div class="subnav-left">
        <button class="action-btn" (click)="showAddUserDialog()">Add User</button>
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
        
        <!-- New: Convex Auth Users Section -->
        <div class="card">
          <h3>Convex Auth Users</h3>
          <div class="user-list">
            @if (convexAuthService.users().length === 0) {
              <div class="no-users">
                <p>No users found in Convex Auth database.</p>
                @if (!convexAuthService.isAuthenticated()) {
                  <p><small>Login as admin to view users.</small></p>
                }
              </div>
            } @else {
              @for (user of convexAuthService.users(); track user.id) {
                <div class="user-item">
                  <div class="user-avatar">
                    {{ getInitials(user.firstName, user.lastName, user.email) }}
                  </div>
                  <div class="user-info">
                    <h4>{{ getDisplayName(user.firstName, user.lastName, user.email) }}</h4>
                    <p>{{ user.email }}</p>
                    <span class="user-status convex">Convex User</span>
                  </div>
                  <div class="user-actions">
                    <button class="edit-btn" disabled>Manage</button>
                  </div>
                </div>
              }
            }
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

    <!-- Add User Dialog -->
    @if (showAddDialog()) {
      <div class="dialog-overlay" (click)="hideAddUserDialog()">
        <div class="dialog-container" (click)="$event.stopPropagation()">
          <div class="dialog-header">
            <h2>Add New User</h2>
            <button class="close-btn" (click)="hideAddUserDialog()">
              <i class="fas fa-times"></i>
            </button>
          </div>
          
          <div class="dialog-content">
            <form (ngSubmit)="createUser()" #userForm="ngForm">
              @if (errorMessage()) {
                <div class="error-message">
                  <i class="fas fa-exclamation-triangle"></i>
                  {{ errorMessage() }}
                </div>
              }

              <div class="form-group">
                <label for="email">Email *</label>
                <input 
                  id="email"
                  type="email" 
                  [(ngModel)]="newUserData.email" 
                  name="email"
                  required
                  placeholder="Enter user email"
                  class="form-control"
                />
              </div>

              <div class="form-group">
                <label for="password">Password *</label>
                <input 
                  id="password"
                  type="password" 
                  [(ngModel)]="newUserData.password" 
                  name="password"
                  required
                  placeholder="Enter password"
                  class="form-control"
                />
              </div>

              <div class="form-group">
                <label for="firstName">First Name</label>
                <input 
                  id="firstName"
                  type="text" 
                  [(ngModel)]="newUserData.firstName" 
                  name="firstName"
                  placeholder="Enter first name"
                  class="form-control"
                />
              </div>

              <div class="form-group">
                <label for="lastName">Last Name</label>
                <input 
                  id="lastName"
                  type="text" 
                  [(ngModel)]="newUserData.lastName" 
                  name="lastName"
                  placeholder="Enter last name"
                  class="form-control"
                />
              </div>

              <div class="dialog-actions">
                <button type="button" class="btn btn-secondary" (click)="hideAddUserDialog()">
                  Cancel
                </button>
                <button 
                  type="submit" 
                  class="btn btn-primary" 
                  [disabled]="!userForm.valid || isCreating()"
                >
                  @if (isCreating()) {
                    <i class="fas fa-spinner fa-spin"></i>
                    Creating...
                  } @else {
                    Create User
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    }
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
    .user-status.convex { background: #d1ecf1; color: #0c5460; }
    .no-users { text-align: center; padding: 20px; color: #666; }
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

    /* Dialog styles */
    .dialog-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .dialog-container { background: white; border-radius: 8px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15); width: 90%; max-width: 500px; max-height: 90vh; overflow: hidden; }
    .dialog-header { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem; border-bottom: 1px solid #e0e0e0; background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); }
    .dialog-header h2 { margin: 0; color: #333; font-size: 1.25rem; font-weight: 600; }
    .close-btn { background: none; border: none; font-size: 1.2rem; color: #666; cursor: pointer; padding: 0.25rem; border-radius: 4px; transition: all 0.2s ease; }
    .close-btn:hover { background: #e9ecef; color: #333; }
    .dialog-content { padding: 1.5rem; }
    .form-group { margin-bottom: 1rem; }
    .form-group label { display: block; margin-bottom: 0.5rem; font-weight: 500; color: #333; }
    .form-control { width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 4px; font-size: 1rem; transition: border-color 0.2s ease; }
    .form-control:focus { outline: none; border-color: #00BAFB; box-shadow: 0 0 0 2px rgba(0, 186, 251, 0.25); }
    .dialog-actions { display: flex; gap: 0.75rem; justify-content: flex-end; margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid #e0e0e0; }
    .btn { padding: 0.75rem 1.5rem; border: none; border-radius: 4px; font-size: 1rem; font-weight: 500; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; gap: 0.5rem; }
    .btn:disabled { opacity: 0.6; cursor: not-allowed; }
    .btn-secondary { background: #6c757d; color: white; }
    .btn-secondary:hover:not(:disabled) { background: #5a6268; }
    .btn-primary { background: #00BAFB; color: white; }
    .btn-primary:hover:not(:disabled) { background: #0099cc; }
    .error-message { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; border-radius: 8px; padding: 12px; margin-bottom: 20px; display: flex; align-items: center; gap: 8px; }
    .fa-spin { animation: spin 1s linear infinite; }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  `]
})
export class UsersComponent {
  // Dialog state
  showAddDialog = signal(false);
  isCreating = signal(false);
  errorMessage = signal<string | null>(null);

  // Form data for new user
  newUserData: SignUpData = {
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  };

  constructor(public convexAuthService: ConvexAuthService) {}

  showAddUserDialog(): void {
    this.showAddDialog.set(true);
    this.errorMessage.set(null);
    // Reset form
    this.newUserData = {
      email: '',
      password: '',
      firstName: '',
      lastName: ''
    };
  }

  hideAddUserDialog(): void {
    this.showAddDialog.set(false);
    this.errorMessage.set(null);
  }

  async createUser(): Promise<void> {
    this.isCreating.set(true);
    this.errorMessage.set(null);

    try {
      console.log('(EventRunner) Creating user:', this.newUserData.email);
      
      const success = await this.convexAuthService.signUp(this.newUserData);
      
      if (success) {
        console.log('(EventRunner) User created successfully');
        this.hideAddUserDialog();
        // Refresh the user list to show the new user
        await this.convexAuthService.refreshData();
      } else {
        this.errorMessage.set('Failed to create user. Please check the details and try again.');
      }
    } catch (error) {
      console.error('(EventRunner) Error creating user:', error);
      this.errorMessage.set('An error occurred while creating the user.');
    } finally {
      this.isCreating.set(false);
    }
  }

  // Helper methods for user display
  getInitials(firstName?: string, lastName?: string, email?: string): string {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    if (firstName) {
      return firstName.substring(0, 2).toUpperCase();
    }
    if (email) {
      return email.substring(0, 2).toUpperCase();
    }
    return 'U';
  }

  getDisplayName(firstName?: string, lastName?: string, email?: string): string {
    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    }
    if (firstName) {
      return firstName;
    }
    return email || 'Unknown User';
  }
}
