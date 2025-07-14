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
        this.version = await (window as any).electronAPI.getVersion();
      } else {
        // Fallback for web development
        this.version = 'dev';
      }
    } catch (error) {
      console.log('Could not load version:', error);
      this.version = '0.0.0';
    }
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  isActive(route: string): boolean {
    return this.router.url.includes(route) || (route === 'dashboard' && this.router.url === '/');
  }
}
