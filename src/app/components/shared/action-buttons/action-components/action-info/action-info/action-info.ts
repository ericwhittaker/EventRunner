import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

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
  appVersion = signal('1.0.0');
  buildNumber = signal('20241201');
  platform = signal(navigator.platform || 'Unknown');
  userAgent = signal(navigator.userAgent);
  screenResolution = signal(`${screen.width}x${screen.height}`);
  
  patchNotes = signal<PatchNote[]>([
    {
      version: '1.0.0',
      description: 'Initial release with FileMaker integration'
    },
    {
      version: '0.9.8',
      description: 'Added action button system with popovers'
    },
    {
      version: '0.9.7',
      description: 'Enhanced UI to match FileMaker design'
    },
    {
      version: '0.9.6',
      description: 'Implemented three-card dashboard layout'
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
