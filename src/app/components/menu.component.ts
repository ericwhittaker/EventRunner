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
  version: string = '';

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadVersion();
  }

  async loadVersion() {
    try {
      // Use the version from the generated version file
      this.version = APP_VERSION;
      console.log('Version loaded:', this.version);
      
      // Optional: Try to get version from Electron if available (for future updates)
      if ((window as any).electronAPI && (window as any).electronAPI.getVersion) {
        try {
          const electronVersion = await (window as any).electronAPI.getVersion();
          if (electronVersion && electronVersion.trim() !== '') {
            this.version = electronVersion;
            console.log('Updated version from Electron:', this.version);
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
