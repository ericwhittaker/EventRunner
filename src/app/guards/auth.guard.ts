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
    
    // Give reactive queries a moment to settle if they're loading
    if (this.convexAuthService.isLoading()) {
      console.log('(EventRunner) File: auth.guard.ts #(canActivate)# Convex queries loading, waiting...');
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Check both auth services for debugging
    const mockAuthAuthenticated = this.authService.isAuthenticated();
    const convexAuthAuthenticated = this.convexAuthService.isAuthenticated();
    
    console.log('(EventRunner) File: auth.guard.ts #(canActivate)# Mock Auth:', mockAuthAuthenticated);
    console.log('(EventRunner) File: auth.guard.ts #(canActivate)# Convex Auth:', convexAuthAuthenticated);
    console.log('(EventRunner) File: auth.guard.ts #(canActivate)# Convex User:', this.convexAuthService.user());
    console.log('(EventRunner) File: auth.guard.ts #(canActivate)# Convex Loading:', this.convexAuthService.isLoading());
    
    const isAuthenticated = convexAuthAuthenticated || mockAuthAuthenticated;
    
    if (isAuthenticated) {
      console.log('(EventRunner) File: auth.guard.ts #(canActivate)# User is authenticated');
      return true;
    } else {
      console.log('(EventRunner) File: auth.guard.ts #(canActivate)# User not authenticated, redirecting to login');
      this.router.navigate(['/login']);
      return false;
    }
  }
}
