import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { APP_VERSION } from '../../../../../../version';

interface PatchNote {
  version: string;
  description: string;
}

@Component({
  selector: 'app-action-info',
  imports: [CommonModule],
  templateUrl: './action-info.html',
  styleUrl: './action-info.scss'
})
export class ActionInfo implements OnInit {
  appVersion = signal(APP_VERSION);
  buildNumber = signal('20241201');
  platform = signal(navigator.platform || 'Unknown');
  userAgent = signal(navigator.userAgent);
  screenResolution = signal(`${screen.width}x${screen.height}`);
  
  patchNotes = signal<PatchNote[]>([
    {
      version: APP_VERSION,
      description: 'Auto-updating version display and improved release workflow'
    },
    {
      version: '0.4.2',
      description: 'Fixed white screen issue and implemented auto-updater'
    },
    {
      version: '0.4.1',
      description: 'Enhanced hash-based routing for Electron compatibility'
    },
    {
      version: '0.4.0',
      description: 'Added GitHub release automation and version management'
    }
  ]);

  ngOnInit() {
    // Load app version from package.json or environment if available
    // this.loadAppVersion();
  }

  private loadAppVersion() {
    // This could load from package.json or an API endpoint
    // For now using static version
  }
}
