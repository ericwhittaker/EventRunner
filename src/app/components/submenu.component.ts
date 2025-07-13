import { Component } from '@angular/core';
import { ActionButtons } from './shared/action-buttons/action-buttons';

@Component({
  selector: 'app-submenu',
  imports: [
    ActionButtons
  ],
  templateUrl: './submenu.component.html',
  styleUrl: './submenu.component.scss'
})
export class SubMenuComponent {}
