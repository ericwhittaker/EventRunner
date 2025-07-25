import { Component, computed } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../shared/header/header';
import { ConvexAuthService } from '../../services/convex-auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    Header
  ],
  template: `
    <div class="app-layout">
      <!-- Header - you can enhance this later with inputs -->
      <er-header></er-header>
      
      <!-- Optional: Sidebar -->
      <!-- <app-sidebar></app-sidebar> -->
      
      <!-- Main content area -->
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
      
      <!-- Optional: Footer -->
      <!-- <app-footer 
        [userCount]="userCount()"
        [appVersion]="'1.0.0'">
      </app-footer> -->
    </div>
  `,
  styles: [`
    .app-layout {
      display: flex;
      flex-direction: column;
      height: 100vh;
    }
    
    .main-content {
      flex: 1;
      overflow: auto;
    }
  `]
})
export class MainLayoutComponent {
  constructor(public authService: ConvexAuthService) {}
  
  // Computed properties for global state
  userCount = computed(() => this.authService.users().length);
}
