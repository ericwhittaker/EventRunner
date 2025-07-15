import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { APP_VERSION } from '../version';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  version: string = APP_VERSION; // Use static version directly
  private static cachedElectronVersion: string | null = null; // Cache the Electron version

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadVersion();
  }

  async loadVersion() {
    try {
      // Start with the static version
      this.version = APP_VERSION;
      console.log('Version loaded:', this.version);
      
      // Only call Electron API once per app session, then cache the result
      if (MenuComponent.cachedElectronVersion) {
        // Use cached version
        this.version = MenuComponent.cachedElectronVersion;
        console.log('Using cached Electron version:', this.version);
      } else if ((window as any).electronAPI && (window as any).electronAPI.getVersion) {
        try {
          const electronVersion = await (window as any).electronAPI.getVersion();
          if (electronVersion && electronVersion.trim() !== '') {
            // Cache the result for future component instances
            MenuComponent.cachedElectronVersion = electronVersion;
            this.version = electronVersion;
            console.log('Fetched and cached Electron version:', this.version);
          }
        } catch (error) {
          console.log('Electron version not available, using static version');
        }
      }
    } catch (error) {
      console.error('Could not load version:', error);
      this.version = '0.4.1'; // Final fallback
    }
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  isActive(route: string): boolean {
    return this.router.url.includes(route) || (route === 'dashboard' && this.router.url === '/');
  }
}
