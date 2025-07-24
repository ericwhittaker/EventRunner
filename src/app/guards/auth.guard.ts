import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    console.log('(EventRunner) File: auth.guard.ts #(canActivate)# Checking authentication');
    
    if (this.authService.isAuthenticated()) {
      console.log('(EventRunner) File: auth.guard.ts #(canActivate)# User is authenticated');
      return true;
    } else {
      console.log('(EventRunner) File: auth.guard.ts #(canActivate)# User not authenticated, redirecting to login');
      this.router.navigate(['/login']);
      return false;
    }
  }
}
