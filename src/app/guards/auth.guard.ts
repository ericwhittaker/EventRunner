import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ConvexAuthService } from '../services/convex-auth.service';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(
    private convexAuthService: ConvexAuthService,
    private authService: AuthService,
    private router: Router
  ) {}

  async canActivate(): Promise<boolean> {
    console.log('(EventRunner) File: auth.guard.ts #(canActivate)# Checking authentication');
    
    // Wait for ConvexService to finish initial authentication check
    // This is crucial on app refresh when services are just starting up
    let retries = 0;
    const maxRetries = 20; // Wait up to 2 seconds
    
    while (retries < maxRetries) {
      const isLoading = this.convexAuthService.isLoading();
      const isAuthenticated = this.convexAuthService.isAuthenticated();
      const user = this.convexAuthService.user();
      
      console.log(`(EventRunner) Auth check attempt ${retries + 1}:`, {
        isLoading,
        isAuthenticated,
        hasUser: !!user,
        userEmail: user?.email
      });
      
      // If we have a definitive auth state (not loading), make decision
      if (!isLoading) {
        if (isAuthenticated && user) {
          console.log('(EventRunner) File: auth.guard.ts #(canActivate)# User authenticated:', user.email);
          return true;
        } else {
          // Check if we have a stored token that might not be validated yet
          const hasStoredToken = localStorage.getItem('__convexAuth-https://scintillating-mandrill-776.convex.cloud');
          if (hasStoredToken && retries < 10) {
            // Token exists but auth state not updated yet, wait a bit more
            console.log('(EventRunner) Auth token found, waiting for validation...');
            await new Promise(resolve => setTimeout(resolve, 200));
            retries++;
            continue;
          } else {
            console.log('(EventRunner) File: auth.guard.ts #(canActivate)# User not authenticated, redirecting to login');
            this.router.navigate(['/login']);
            return false;
          }
        }
      }
      
      // Still loading, wait and retry
      await new Promise(resolve => setTimeout(resolve, 100));
      retries++;
    }
    
    // Fallback after max retries
    console.log('(EventRunner) File: auth.guard.ts #(canActivate)# Max retries reached, redirecting to login');
    this.router.navigate(['/login']);
    return false;
  }
}
