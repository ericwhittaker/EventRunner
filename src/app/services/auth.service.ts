import { Injectable, signal, computed } from '@angular/core';

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Signals for reactive authentication state
  private _user = signal<User | null>(null);
  private _isLoading = signal(false);
  private _error = signal<string | null>(null);

  // Public computed signals
  public user = this._user.asReadonly();
  public isLoading = this._isLoading.asReadonly();
  public error = this._error.asReadonly();
  public isAuthenticated = computed(() => this._user() !== null);

  constructor() {
    console.log('(EventRunner) File: auth.service.ts #(Constructor)# Auth Service initialized');
    
    // Check if user is already logged in (from localStorage or similar)
    this.checkExistingAuth();
  }

  /**
   * Check if user is already authenticated (e.g., from localStorage)
   */
  private checkExistingAuth(): void {
    try {
      const savedUser = localStorage.getItem('eventrunner_user');
      if (savedUser) {
        const user: User = JSON.parse(savedUser);
        this._user.set(user);
        console.log('(EventRunner) File: auth.service.ts #(checkExistingAuth)# Found existing user:', user.email);
      }
    } catch (error) {
      console.error('(EventRunner) File: auth.service.ts #(checkExistingAuth)# Error parsing saved user:', error);
      // Clear invalid data
      localStorage.removeItem('eventrunner_user');
    }
  }

  /**
   * Login with email and password
   * For now, this is a simple demo implementation
   * Later, you can integrate with Convex Auth or another auth provider
   */
  async login(credentials: LoginCredentials): Promise<boolean> {
    this._isLoading.set(true);
    this._error.set(null);

    try {
      console.log('(EventRunner) File: auth.service.ts #(login)# Attempting login for:', credentials.email);

      // TODO: Replace this with real authentication
      // For now, we'll simulate a login process
      await this.simulateLogin(credentials);

      // Create user object (in real app, this would come from your auth service)
      const user: User = {
        id: 'user_' + Date.now(),
        email: credentials.email,
        firstName: this.extractFirstName(credentials.email),
        role: 'user'
      };

      // Save user to state and localStorage
      this._user.set(user);
      localStorage.setItem('eventrunner_user', JSON.stringify(user));

      console.log('(EventRunner) File: auth.service.ts #(login)# Login successful for:', user.email);
      return true;

    } catch (error) {
      console.error('(EventRunner) File: auth.service.ts #(login)# Login failed:', error);
      this._error.set(error instanceof Error ? error.message : 'Login failed');
      return false;
    } finally {
      this._isLoading.set(false);
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      console.log('(EventRunner) File: auth.service.ts #(logout)# Logging out user');
      
      // Clear user state
      this._user.set(null);
      this._error.set(null);
      
      // Clear localStorage
      localStorage.removeItem('eventrunner_user');
      
      console.log('(EventRunner) File: auth.service.ts #(logout)# Logout successful');
    } catch (error) {
      console.error('(EventRunner) File: auth.service.ts #(logout)# Logout error:', error);
    }
  }

  /**
   * Clear any auth errors
   */
  clearError(): void {
    this._error.set(null);
  }

  /**
   * Simulate a login process (replace with real auth later)
   */
  private async simulateLogin(credentials: LoginCredentials): Promise<void> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simple demo validation
    if (!credentials.email || !credentials.password) {
      throw new Error('Email and password are required');
    }

    if (credentials.password.length < 3) {
      throw new Error('Password must be at least 3 characters');
    }

    // In a real app, you'd validate against your auth service
    // For demo, we'll accept any email with password 'demo' or 'test'
    const validPasswords = ['demo', 'test', 'password', '123'];
    if (!validPasswords.includes(credentials.password.toLowerCase())) {
      throw new Error('Invalid credentials. Try password: demo, test, password, or 123');
    }
  }

  /**
   * Extract first name from email for demo purposes
   */
  private extractFirstName(email: string): string {
    const localPart = email.split('@')[0];
    const name = localPart.replace(/[._-]/g, ' ');
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  }

  /**
   * Get current user ID for Convex operations
   */
  getCurrentUserId(): string {
    const user = this._user();
    return user?.id || 'anonymous';
  }

  /**
   * Get current user email for Convex operations
   */
  getCurrentUserEmail(): string {
    const user = this._user();
    return user?.email || 'anonymous@eventrunner.local';
  }
}
