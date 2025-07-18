
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { MenuComponent } from './components/menu.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    MenuComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
}
