import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface AppItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  url?: string;
  action?: () => void;
}

@Component({
  selector: 'app-action-related-apps',
  imports: [CommonModule],
  templateUrl: './action-related-apps.html',
  styleUrl: './action-related-apps.scss'
})
export class ActionRelatedApps {
  
  relatedApps = signal<AppItem[]>([
    {
      id: 'apa-event-schedules',
      name: 'APA Event Schedules',
      description: 'View and manage APA tournament schedules',
      icon: '📅',
      url: '/apa-schedules'
    },
    {
      id: 'fill-shop-schedules',
      name: 'Fill Shop Schedules',
      description: 'Brewery and venue fill shop scheduling',
      icon: '🍺',
      url: '/fill-shop'
    },
    {
      id: 'liquidchart',
      name: 'LiquidChart',
      description: 'Advanced analytics and reporting',
      icon: '📊',
      url: '/liquidchart'
    },
    {
      id: 'fleet-management',
      name: 'Fleet',
      description: 'Vehicle and logistics management',
      icon: '🚚',
      url: '/fleet'
    },
    {
      id: 'latico-admin',
      name: 'Latico',
      description: 'Administrative tools and utilities',
      icon: '⚙️',
      url: '/latico'
    }
  ]);

  externalTools = signal<AppItem[]>([
    {
      id: 'filemaker-pro',
      name: 'FileMaker Pro',
      description: 'Open main FileMaker database',
      icon: '🗃️',
      url: 'fmp://eventrunner.fmp12'
    },
    {
      id: 'google-calendar',
      name: 'Google Calendar',
      description: 'View event calendar integration',
      icon: '📅',
      url: 'https://calendar.google.com'
    },
    {
      id: 'slack',
      name: 'Team Slack',
      description: 'Internal team communication',
      icon: '💬',
      url: 'https://eventrunner.slack.com'
    }
  ]);

  openApp(app: AppItem) {
    console.log('Opening app:', app.name);
    if (app.action) {
      app.action();
    } else if (app.url) {
      if (app.url.startsWith('http') || app.url.startsWith('fmp://')) {
        window.open(app.url, '_blank');
      } else {
        // Internal route
        // this.router.navigate([app.url]);
        console.log('Would navigate to:', app.url);
      }
    }
  }

  openExternalTool(tool: AppItem) {
    console.log('Opening external tool:', tool.name);
    if (tool.url) {
      window.open(tool.url, '_blank');
    }
  }

  refreshAllApps() {
    console.log('Refreshing all apps...');
    // TODO: Implement refresh functionality for all related apps
    alert('Refreshing all connected applications...');
  }

  openSettings() {
    console.log('Opening app settings...');
    // TODO: Implement settings modal or navigation
    alert('Opening application settings...');
  }
}
