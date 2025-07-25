import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ConvexAuthService, LoginCredentials } from '../../services/convex-auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h1>EventRunner</h1>
          <p>Welcome back! Please sign in to continue.</p>
        </div>

        <form class="login-form" (ngSubmit)="onSubmit()" #loginForm="ngForm">
          @if (convexAuthService.error()) {
            <div class="error-message">
              <i class="fas fa-exclamation-triangle"></i>
              {{ convexAuthService.error() }}
              <button type="button" class="error-close" (click)="convexAuthService.clearError()">
                <i class="fas fa-times"></i>
              </button>
            </div>
          }

          <div class="form-group">
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              [(ngModel)]="credentials.email"
              required
              [disabled]="convexAuthService.isLoading()"
              placeholder="Enter your email"
              autocomplete="email"
            />
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              [(ngModel)]="credentials.password"
              required
              [disabled]="convexAuthService.isLoading()"
              placeholder="Enter your password"
              autocomplete="current-password"
            />
          </div>

          <button
            type="submit"
            class="login-button"
            [disabled]="convexAuthService.isLoading() || !loginForm.valid"
          >
            @if (convexAuthService.isLoading()) {
              <i class="fas fa-spinner fa-spin"></i>
              Signing in...
            } @else {
              <i class="fas fa-sign-in-alt"></i>
              Sign In
            }
          </button>
        </form>

        <div class="login-footer">
          <div class="demo-info">
            <h4>Need Access?</h4>
            <p>Contact your administrator to create an account.</p>
            <p>Existing users can login with their email and password.</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #003043 0%, #00506b 100%);
      padding: 20px;
    }

    .login-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0, 48, 67, 0.2);
      max-width: 400px;
      width: 100%;
      overflow: hidden;
    }

    .login-header {
      background: #003043;
      color: white;
      padding: 30px;
      text-align: center;
    }

    .login-header h1 {
      margin: 0 0 10px 0;
      font-size: 32px;
      font-weight: 700;
    }

    .login-header p {
      margin: 0;
      opacity: 0.9;
      font-size: 16px;
    }

    .login-form {
      padding: 30px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      margin-bottom: 8px;
      font-weight: 600;
      color: #333;
    }

    .form-group input {
      width: 100%;
      padding: 12px 16px;
      border: 2px solid #e1e5e9;
      border-radius: 8px;
      font-size: 16px;
      transition: border-color 0.3s;
      box-sizing: border-box;
    }

    .form-group input:focus {
      outline: none;
      border-color: #00BAFB;
    }

    .form-group input:disabled {
      background-color: #f8f9fa;
      color: #6c757d;
    }

    .login-button {
      width: 100%;
      padding: 14px;
      background: #003043;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .login-button:hover:not(:disabled) {
      background: #004a5a;
      transform: translateY(-1px);
    }

    .login-button:disabled {
      background: #6c757d;
      cursor: not-allowed;
      transform: none;
    }

    .error-message {
      background: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
      border-radius: 8px;
      padding: 12px;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      gap: 8px;
      position: relative;
    }

    .error-close {
      position: absolute;
      right: 8px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: #721c24;
      cursor: pointer;
      padding: 4px;
    }

    .login-footer {
      background: #f8f9fa;
      padding: 20px 30px;
      border-top: 1px solid #e1e5e9;
    }

    .demo-info h4 {
      margin: 0 0 10px 0;
      color: #333;
      font-size: 14px;
    }

    .demo-info p {
      margin: 4px 0;
      font-size: 13px;
      color: #6c757d;
    }

    .demo-info code {
      background: #e9ecef;
      padding: 2px 6px;
      border-radius: 4px;
      font-family: monospace;
      font-size: 12px;
    }

    .admin-creation {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #e1e5e9;
    }

    .admin-creation h4 {
      margin: 0 0 10px 0;
      color: #28a745;
      font-size: 14px;
    }

    .admin-creation p {
      margin: 4px 0 10px 0;
      font-size: 13px;
      color: #6c757d;
    }

    .create-admin-btn {
      background: #28a745;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s;
    }

    .create-admin-btn:hover:not(:disabled) {
      background: #218838;
    }

    .create-admin-btn:disabled {
      background: #6c757d;
      cursor: not-allowed;
    }

    @media (max-width: 480px) {
      .login-container {
        padding: 10px;
      }
      
      .login-header {
        padding: 20px;
      }
      
      .login-form {
        padding: 20px;
      }
      
      .login-footer {
        padding: 15px 20px;
      }
    }
  `]
})
export class LoginComponent {
  // Use plain object instead of signal for form binding
  credentials: LoginCredentials = {
    email: '',
    password: ''
  };

  constructor(
    public convexAuthService: ConvexAuthService,
    private router: Router
  ) {
    console.log('(EventRunner) File: login.component.ts #(Constructor)# Login Component initialized');
    
    // If already authenticated, redirect to dashboard
    if (this.convexAuthService.isAuthenticated()) {
      console.log('(EventRunner) File: login.component.ts #(Constructor)# User already authenticated, redirecting...');
      this.router.navigate(['/dashboard']);
    }
  }

  async onSubmit(): Promise<void> {
    console.log('(EventRunner) File: login.component.ts #(onSubmit)# Login attempt for:', this.credentials.email);
    
    const success = await this.convexAuthService.login(this.credentials);
    
    if (success) {
      console.log('(EventRunner) File: login.component.ts #(onSubmit)# Login successful, waiting for auth state to update...');
      
      // Wait for the reactive queries to update after successful authentication
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Check if auth state is updated, if not wait a bit more
      let retries = 0;
      while (!this.convexAuthService.isAuthenticated() && retries < 10) {
        console.log('(EventRunner) File: login.component.ts #(onSubmit)# Waiting for auth state update, retry:', retries + 1);
        await new Promise(resolve => setTimeout(resolve, 100));
        retries++;
      }
      
      console.log('(EventRunner) File: login.component.ts #(onSubmit)# Auth state updated, redirecting to dashboard');
      this.router.navigate(['/dashboard']);
    }
  }
}
