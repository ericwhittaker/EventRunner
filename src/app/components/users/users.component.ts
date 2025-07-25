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
        <!-- Convex Auth Users Section (Main) -->
        <div class="card main-users-card">
          <h3>Users</h3>
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
                    <div class="user-status-row">
                      <span class="user-status convex">Convex User</span>
                      <span class="user-status {{ getUserOnlineStatus(user.id) }}">
                        {{ getUserOnlineStatus(user.id) === 'online' ? 'Online' : 'Offline' }}
                      </span>
                    </div>
                  </div>
                  <div class="user-actions">
                    <button class="edit-btn" disabled>Manage</button>
                    <button class="reset-password-btn" (click)="showResetPasswordDialog(user.id, user.email)">
                      <i class="fas fa-key"></i>
                      Reset Password
                    </button>
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

    <!-- Reset Password Dialog -->
    @if (showResetDialog()) {
      <div class="dialog-overlay" (click)="hideResetPasswordDialog()">
        <div class="dialog-container reset-password-dialog" (click)="$event.stopPropagation()">
          <div class="dialog-header critical-header">
            <h2>
              <i class="fas fa-exclamation-triangle"></i>
              Reset Password - Critical Operation
            </h2>
            <button class="close-btn" (click)="hideResetPasswordDialog()">
              <i class="fas fa-times"></i>
            </button>
          </div>
          
          <div class="dialog-content">
            <div class="user-info-banner">
              <i class="fas fa-user"></i>
              <span>Resetting password for: <strong>{{ resetUserEmail() }}</strong></span>
            </div>

            <form (ngSubmit)="resetPassword()" #resetForm="ngForm">
              @if (resetErrorMessage()) {
                <div class="error-message">
                  <i class="fas fa-exclamation-triangle"></i>
                  {{ resetErrorMessage() }}
                </div>
              }

              <div class="form-group">
                <label for="newPassword">New Password *</label>
                <div class="password-input-container">
                  <input 
                    id="newPassword"
                    [type]="showPassword() ? 'text' : 'password'" 
                    [(ngModel)]="resetPasswordData.newPassword" 
                    name="newPassword"
                    required
                    placeholder="Enter new password"
                    class="form-control"
                    (input)="validatePassword()"
                  />
                  <button 
                    type="button" 
                    class="password-toggle-btn"
                    (click)="togglePasswordVisibility()"
                  >
                    <i class="fas" [class]="showPassword() ? 'fa-eye-slash' : 'fa-eye'"></i>
                  </button>
                </div>
                
                <!-- Password Strength Indicator -->
                <div class="password-strength-container">
                  <div class="password-strength-bar">
                    <div 
                      class="password-strength-fill" 
                      [class]="'strength-' + passwordStrength().level"
                      [style.width.%]="passwordStrength().score * 25"
                    ></div>
                  </div>
                  <span class="password-strength-text" [class]="'strength-' + passwordStrength().level">
                    {{ passwordStrength().text }}
                  </span>
                </div>

                <!-- Password Requirements -->
                <div class="password-requirements">
                  <div class="requirement" [class.met]="passwordChecks().length">
                    <i class="fas" [class]="passwordChecks().length ? 'fa-check-circle' : 'fa-times-circle'"></i>
                    At least 8 characters
                  </div>
                  <div class="requirement" [class.met]="passwordChecks().uppercase">
                    <i class="fas" [class]="passwordChecks().uppercase ? 'fa-check-circle' : 'fa-times-circle'"></i>
                    One uppercase letter
                  </div>
                  <div class="requirement" [class.met]="passwordChecks().lowercase">
                    <i class="fas" [class]="passwordChecks().lowercase ? 'fa-check-circle' : 'fa-times-circle'"></i>
                    One lowercase letter
                  </div>
                  <div class="requirement" [class.met]="passwordChecks().number">
                    <i class="fas" [class]="passwordChecks().number ? 'fa-check-circle' : 'fa-times-circle'"></i>
                    One number
                  </div>
                  <div class="requirement" [class.met]="passwordChecks().special">
                    <i class="fas" [class]="passwordChecks().special ? 'fa-check-circle' : 'fa-times-circle'"></i>
                    One special character (!&#64;#$%^&*)
                  </div>
                </div>
              </div>

              <div class="form-group">
                <label for="confirmPassword">Confirm Password *</label>
                <input 
                  id="confirmPassword"
                  type="password" 
                  [(ngModel)]="resetPasswordData.confirmPassword" 
                  name="confirmPassword"
                  required
                  placeholder="Confirm new password"
                  class="form-control"
                  [class.error]="resetPasswordData.confirmPassword && !passwordsMatch()"
                />
                @if (resetPasswordData.confirmPassword && !passwordsMatch()) {
                  <div class="field-error">
                    <i class="fas fa-exclamation-circle"></i>
                    Passwords do not match
                  </div>
                }
              </div>

              <div class="critical-warning">
                <i class="fas fa-exclamation-triangle"></i>
                <strong>Warning:</strong> This will immediately change the user's password. 
                They will need to use the new password for their next login.
              </div>

              <div class="dialog-actions">
                <button type="button" class="btn btn-secondary" (click)="hideResetPasswordDialog()">
                  Cancel
                </button>
                <button 
                  type="submit" 
                  class="btn btn-danger" 
                  [disabled]="!isPasswordValid() || isResetting()"
                >
                  @if (isResetting()) {
                    <i class="fas fa-spinner fa-spin"></i>
                    Resetting...
                  } @else {
                    <i class="fas fa-key"></i>
                    Reset Password
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
    .main-users-card { grid-column: 1 / -1; } /* Make users card span full width */
    .user-item { display: flex; align-items: center; gap: 15px; padding: 15px 0; border-bottom: 1px solid #eee; }
    .user-avatar { width: 40px; height: 40px; border-radius: 50%; background: #28a745; color: white; display: flex; align-items: center; justify-content: center; font-weight: 600; }
    .user-info { flex: 1; }
    .user-info h4 { margin: 0 0 5px 0; color: #333; }
    .user-info p { margin: 0 0 8px 0; color: #666; font-size: 14px; }
    .user-status-row { display: flex; gap: 8px; align-items: center; }
    .user-status { padding: 3px 8px; border-radius: 12px; font-size: 12px; font-weight: 500; }
    .user-status.online { background: #d4edda; color: #155724; }
    .user-status.offline { background: #f8d7da; color: #721c24; }
    .user-status.convex { background: #d1ecf1; color: #0c5460; }
    .no-users { text-align: center; padding: 20px; color: #666; }
    .edit-btn { background: #6c757d; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px; }
    .reset-password-btn { 
      background: #dc3545; 
      color: white; 
      border: none; 
      padding: 6px 12px; 
      border-radius: 4px; 
      cursor: pointer; 
      font-size: 12px; 
      margin-left: 8px;
      display: flex;
      align-items: center;
      gap: 4px;
      transition: background 0.2s ease;
    }
    .reset-password-btn:hover {
      background: #c82333;
    }
    .user-actions {
      display: flex;
      gap: 8px;
    }
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
    .btn-danger { background: #dc3545; color: white; }
    .btn-danger:hover:not(:disabled) { background: #c82333; }
    .error-message { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; border-radius: 8px; padding: 12px; margin-bottom: 20px; display: flex; align-items: center; gap: 8px; }
    .fa-spin { animation: spin 1s linear infinite; }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

    /* Reset Password Dialog Styles */
    .reset-password-dialog { max-width: 600px; }
    .critical-header { 
      background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%); 
      border-bottom: 2px solid #ffc107;
      color: #856404;
    }
    .critical-header h2 {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #856404;
    }
    .user-info-banner {
      background: #e3f2fd;
      border: 1px solid #2196f3;
      border-radius: 8px;
      padding: 12px;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      gap: 8px;
      color: #1565c0;
      font-weight: 500;
    }
    .password-input-container {
      position: relative;
      display: flex;
      align-items: center;
    }
    .password-toggle-btn {
      position: absolute;
      right: 10px;
      background: none;
      border: none;
      color: #6c757d;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      transition: color 0.2s ease;
    }
    .password-toggle-btn:hover {
      color: #495057;
    }
    .password-strength-container {
      margin-top: 8px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .password-strength-bar {
      flex: 1;
      height: 6px;
      background: #e9ecef;
      border-radius: 3px;
      overflow: hidden;
    }
    .password-strength-fill {
      height: 100%;
      transition: width 0.3s ease, background-color 0.3s ease;
      border-radius: 3px;
    }
    .strength-weak .password-strength-fill { background: #dc3545; }
    .strength-fair .password-strength-fill { background: #fd7e14; }
    .strength-good .password-strength-fill { background: #ffc107; }
    .strength-strong .password-strength-fill { background: #28a745; }
    .password-strength-text {
      font-size: 14px;
      font-weight: 600;
      min-width: 60px;
    }
    .strength-weak { color: #dc3545; }
    .strength-fair { color: #fd7e14; }
    .strength-good { color: #ffc107; }
    .strength-strong { color: #28a745; }
    .password-requirements {
      margin-top: 12px;
      padding: 12px;
      background: #f8f9fa;
      border-radius: 6px;
      border: 1px solid #e9ecef;
    }
    .requirement {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 6px;
      font-size: 14px;
      color: #6c757d;
      transition: color 0.2s ease;
    }
    .requirement:last-child {
      margin-bottom: 0;
    }
    .requirement.met {
      color: #28a745;
    }
    .requirement .fa-check-circle {
      color: #28a745;
    }
    .requirement .fa-times-circle {
      color: #dc3545;
    }
    .form-control.error {
      border-color: #dc3545;
      box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.25);
    }
    .field-error {
      margin-top: 6px;
      color: #dc3545;
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .critical-warning {
      background: #fff3cd;
      border: 1px solid #ffc107;
      border-radius: 8px;
      padding: 12px;
      margin-top: 20px;
      margin-bottom: 20px;
      color: #856404;
      display: flex;
      align-items: flex-start;
      gap: 8px;
      font-size: 14px;
    }
    .critical-warning .fas {
      margin-top: 2px;
      flex-shrink: 0;
    }
  `]
})
export class UsersComponent {
  // Dialog state
  showAddDialog = signal(false);
  isCreating = signal(false);
  errorMessage = signal<string | null>(null);

  // Reset password dialog state
  showResetDialog = signal(false);
  isResetting = signal(false);
  resetErrorMessage = signal<string | null>(null);
  resetUserId = signal<string>('');
  resetUserEmail = signal<string>('');
  showPassword = signal(false);

  // Form data for new user
  newUserData: SignUpData = {
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  };

  // Reset password form data
  resetPasswordData = {
    newPassword: '',
    confirmPassword: ''
  };

  // Password validation state
  passwordChecks = signal({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });

  passwordStrength = signal({
    score: 0,
    level: 'weak' as 'weak' | 'fair' | 'good' | 'strong',
    text: 'Very Weak'
  });

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

  // Mock online status - this could be enhanced with real presence tracking later
  getUserOnlineStatus(userId: string): 'online' | 'offline' {
    // For now, randomly assign status based on userId hash for demonstration
    // In a real app, this would come from a presence service
    const hash = userId.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return Math.abs(hash) % 3 === 0 ? 'offline' : 'online';
  }

  // =================================
  // RESET PASSWORD METHODS
  // =================================

  showResetPasswordDialog(userId: string, email: string): void {
    this.resetUserId.set(userId);
    this.resetUserEmail.set(email);
    this.showResetDialog.set(true);
    this.resetErrorMessage.set(null);
    this.showPassword.set(false);
    
    // Reset form data
    this.resetPasswordData = {
      newPassword: '',
      confirmPassword: ''
    };
    
    // Reset validation state
    this.validatePassword();
  }

  hideResetPasswordDialog(): void {
    this.showResetDialog.set(false);
    this.resetErrorMessage.set(null);
    this.resetUserId.set('');
    this.resetUserEmail.set('');
    this.showPassword.set(false);
  }

  togglePasswordVisibility(): void {
    this.showPassword.set(!this.showPassword());
  }

  validatePassword(): void {
    const password = this.resetPasswordData.newPassword;
    
    // Check individual requirements
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    };
    
    this.passwordChecks.set(checks);
    
    // Calculate strength score (0-4)
    const score = Object.values(checks).filter(Boolean).length;
    
    // Determine strength level and text
    let level: 'weak' | 'fair' | 'good' | 'strong' = 'weak';
    let text = 'Very Weak';
    
    if (score === 0) {
      level = 'weak';
      text = 'Very Weak';
    } else if (score === 1 || score === 2) {
      level = 'weak';
      text = 'Weak';
    } else if (score === 3) {
      level = 'fair';
      text = 'Fair';
    } else if (score === 4) {
      level = 'good';
      text = 'Good';
    } else if (score === 5) {
      level = 'strong';
      text = 'Strong';
    }
    
    this.passwordStrength.set({ score, level, text });
  }

  passwordsMatch(): boolean {
    return this.resetPasswordData.newPassword === this.resetPasswordData.confirmPassword;
  }

  isPasswordValid(): boolean {
    const checks = this.passwordChecks();
    const allRequirementsMet = checks.length && checks.uppercase && checks.lowercase && checks.number && checks.special;
    const passwordsMatch = this.passwordsMatch();
    const hasConfirmPassword = this.resetPasswordData.confirmPassword.length > 0;
    
    return allRequirementsMet && passwordsMatch && hasConfirmPassword;
  }

  async resetPassword(): Promise<void> {
    if (!this.isPasswordValid()) {
      this.resetErrorMessage.set('Please ensure all password requirements are met and passwords match.');
      return;
    }

    this.isResetting.set(true);
    this.resetErrorMessage.set(null);

    try {
      console.log('(EventRunner) Resetting password for user:', this.resetUserEmail());
      
      const success = await this.convexAuthService.resetUserPassword(
        this.resetUserId(), 
        this.resetPasswordData.newPassword
      );
      
      if (success) {
        console.log('(EventRunner) Password reset successful');
        this.hideResetPasswordDialog();
        
        // Show success message (you might want to add a success signal)
        alert(`Password successfully reset for ${this.resetUserEmail()}`);
      } else {
        this.resetErrorMessage.set('Failed to reset password. Please try again.');
      }
      
    } catch (error) {
      console.error('(EventRunner) Error resetting password:', error);
      this.resetErrorMessage.set('An error occurred while resetting the password. Please try again.');
    } finally {
      this.isResetting.set(false);
    }
  }
}
