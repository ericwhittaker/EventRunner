import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  version: string = '';

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadVersion();
  }

  async loadVersion() {
    try {
      // Check if we're in Electron environment
      if ((window as any).electronAPI) {
        console.log('Getting version from Electron...');
        
        try {
          // Try IPC method first
          if ((window as any).electronAPI.getVersion) {
            const versionPromise = (window as any).electronAPI.getVersion();
            const timeoutPromise = new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Timeout')), 2000)
            );
            
            this.version = await Promise.race([versionPromise, timeoutPromise]);
            console.log('Version received via IPC:', this.version);
          }
        } catch (ipcError) {
          console.warn('IPC version failed, trying fallback:', ipcError);
          
          // Try direct fallback method
          if ((window as any).electronAPI.getAppInfo) {
            const appInfo = (window as any).electronAPI.getAppInfo();
            this.version = appInfo.version;
            console.log('Version received via fallback:', this.version);
          }
        }
        
        // Final fallback if version is still empty
        if (!this.version || this.version.trim() === '') {
          console.warn('Version is empty, using hardcoded fallback');
          this.version = '0.4.0'; // Current package version as fallback
        }
      } else {
        // Fallback for web development
        console.log('Not in Electron environment, using dev fallback');
        this.version = 'dev';
      }
    } catch (error) {
      console.error('Could not load version:', error);
      this.version = '0.4.0'; // Use current package version as fallback
    }
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  isActive(route: string): boolean {
    return this.router.url.includes(route) || (route === 'dashboard' && this.router.url === '/');
  }
}
