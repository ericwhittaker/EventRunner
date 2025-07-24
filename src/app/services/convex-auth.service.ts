import { Injectable, signal, computed } from '@angular/core';
import { ConvexService, User, LoginCredentials, SignUpData } from './convex.service';

// Re-export interfaces so they can be imported from this service
export type { User, LoginCredentials, SignUpData } from './convex.service';

@Injectable({
  providedIn: 'root'
})
export class ConvexAuthService {
  private convexService = new ConvexService();

  // Expose the auth signals from ConvexService
  public user = computed(() => this.convexService.user());
  public isAuthenticated = computed(() => this.convexService.isAuthenticated());
  public isLoading = computed(() => this.convexService.isLoading());
  public error = computed(() => this.convexService.authError());
  
  // Expose data signals
  public users = computed(() => this.convexService.users());

  constructor() {
    console.log('(EventRunner) ConvexAuthService using enhanced ConvexService');
    
    // Add debug function to window for easy access
    (window as any).debugConvexAuth = () => this.debugStorage();
  }

  /**
   * Debug function to check localStorage for auth tokens
   */
  debugStorage(): void {
    console.log('=== Convex Auth Storage Debug ===');
    
    // Check for all localStorage keys
    const allKeys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        allKeys.push(key);
      }
    }
    
    console.log('All localStorage keys:', allKeys);
    
    // Check specifically for Convex Auth keys
    const convexAuthKeys = allKeys.filter(key => 
      key.includes('__convexAuth') || 
      key.includes('convex') || 
      key.includes('auth') || 
      key.includes('token') || 
      key.includes('scintillating-mandrill-776')
    );
    
    console.log('Convex Auth keys found:', convexAuthKeys);
    
    if (convexAuthKeys.length === 0) {
      console.warn('❌ No Convex Auth tokens found in localStorage!');
    } else {
      convexAuthKeys.forEach(key => {
        const value = localStorage.getItem(key);
        console.log(`${key}:`, value);
      });
    }
  }

  async login(credentials: LoginCredentials): Promise<boolean> {
    return await this.convexService.login(credentials);
  }

  async signUp(signUpData: SignUpData): Promise<boolean> {
    return await this.convexService.signUp(signUpData);
  }

  async logout(): Promise<void> {
    return await this.convexService.logout();
  }

  clearError(): void {
    // ConvexService handles errors automatically
  }

  getCurrentUserId(): string {
    const user = this.user();
    return user?.id || 'anonymous';
  }

  getCurrentUserEmail(): string {
    const user = this.user();
    return user?.email || 'anonymous@eventrunner.local';
  }
}
