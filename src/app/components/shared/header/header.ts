/** ANGULAR (CORE) */
import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
/** ANGULAR (ROUTER) */
import { Router } from '@angular/router';
/** APP (SERVICES) */
import { APP_VERSION } from '../../../version';
import { ConvexAuthService } from '../../../services/convex-auth.service';

import { ActionButtons } from '../action-buttons/action-buttons';










  /** ENUMS AND INTERFACES (These are temporary and should go in the model files)
   * ##############################################################################################
   * ##############################################################################################
   */

  

  /** END of SECTION */










@Component({
  selector: 'er-header',
  imports: [
    CommonModule,
    ActionButtons
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header implements OnInit {

    /** DEV WORKAREA, NOTES, AND TODOs
   * ##############################################################################################
   * ##############################################################################################
   * @note 
   * @todo 
   */

  /** WORKING AREA ================================ */

  /** END OF WORKING AREA ========================= */










  /** ALL INJECTABLES 
   * ##############################################################################################
   * ##############################################################################################
   */

  public router = inject(Router);
  public convexAuthService = inject(ConvexAuthService);

  /** END of SECTION */










  /** ALL input()'s, output()'s, PROPERTIES, signal()'s, linkedSignals(), computed()'s, etc.
   * ##############################################################################################
   * ##############################################################################################
   */

  public version: string = APP_VERSION; // Use static version directly
  private static cachedElectronVersion: string | null = null; // Cache the Electron version
  public readonly currentSection = signal('events'); // Signal for current section (used for dynamic sub menu)

  /** END of SECTION */










  /** CONSTRUCTOR
   * ##############################################################################################
   * ##############################################################################################
   */

  constructor() { 
    /** DEV NOTE: Console logging that this is being called */
    console.log('(E-TRAK) File: header.ts #(constructor())# CALLED');
  }

  /** END of SECTION */










  /** METHODS - (LIFECYCLE HOOKS)
   * ##############################################################################################
   * ##############################################################################################
   */

  /** This is the lifecycle hook for when the component is initialized */
  ngOnInit() {
    console.log('(E-TRAK) File: header.ts #(ngOnInit())# CALLED');
    this.loadVersion();
    this.setCurrentSectionFromRoute();
    console.log('(E-TRAK) File: header.ts #(ngOnInit())# END');
  }

  /** This is the lifecycle hook for when the component is destroyed */
  ngOnDestroy() {
    console.log('(E-TRAK) File: header.ts #(ngOnDestroy())# CALLED');
    console.log('(E-TRAK) File: header.ts #(ngOnDestroy())# END');
  }

  /** END of SECTION */










  /** METHODS - (GENERAL)
   * ##############################################################################################
   * ##############################################################################################
   */

  /** 
   * @method - This method loads the version of the application
   * @description - This method fetches the version from the Electron API or uses a static
   * @note - If you have notes they go here
   * ______________________________________________________________________________________________
   * @param - none
   * @param - exampleParameter - This is the parameter description example
   * ______________________________________________________________________________________________
   * @returns - nothing
   * @returns - This is the return description example
   * ______________________________________________________________________________________________
   */
  async loadVersion() {
    try {
      // Start with the static version
      this.version = APP_VERSION;
      console.log('Version loaded:', this.version);
      
      // Only call Electron API once per app session, then cache the result
      if (Header.cachedElectronVersion) {
        // Use cached version
        this.version = Header.cachedElectronVersion;
        console.log('Using cached Electron version:', this.version);
      } else if ((window as any).electronAPI && (window as any).electronAPI.getVersion) {
        try {
          const electronVersion = await (window as any).electronAPI.getVersion();
          if (electronVersion && electronVersion.trim() !== '') {
            // Cache the result for future component instances
            Header.cachedElectronVersion = electronVersion;
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

  /** 
   * @method - This method navigates to a specific route
   * @description - This method uses the Angular Router to navigate to a specified route
   * @note - If you have notes they go here
   * ______________________________________________________________________________________________
   * @param - none
   * @param - exampleParameter - This is the parameter description example
   * ______________________________________________________________________________________________
   * @returns - nothing
   * @returns - This is the return description example
   * ______________________________________________________________________________________________
   */
  navigateTo(route: string) {
    console.log(`🧭 Header navigating to route: ${route}`);
    this.router.navigate([route]);
  }

  /** 
   * @method - This method checks if a route is active
   * @description - This method checks if the current route matches the specified route
   * @note - If you have notes they go here
   * ______________________________________________________________________________________________
   * @param - none
   * @param - exampleParameter - This is the parameter description example
   * ______________________________________________________________________________________________
   * @returns - nothing
   * @returns - This is the return description example
   * ______________________________________________________________________________________________
   */
  isActive(route: string): boolean {
    if (route === 'dashboard') {
      // Active for dashboard and event detail routes
      return (
        this.router.url === '/' ||
        this.router.url.includes('dashboard') ||
        /\/event\//.test(this.router.url)
      );
    }
    return this.router.url.includes(route);
  }

  /** 
   * @method - This method sets the current section signal based on the route
   * @description - Listens for route changes and updates currentSection accordingly
   * @note - Keeps ngOnInit clean and readable
   * ______________________________________________________________________________________________
   * @param - none
   * @returns - nothing
   */
  setCurrentSectionFromRoute() {
    this.router.events.subscribe(() => {
      const url = this.router.url;
      if (url.includes('dashboard') || url === '/') {
        this.currentSection.set('dashboard');
      } else if (url.includes('build-log')) {
        this.currentSection.set('build');
      } else if (url.includes('trips')) {
        this.currentSection.set('trips');
      } else if (url.includes('venues')) {
        this.currentSection.set('venues');
      } else if (url.includes('contacts')) {
        this.currentSection.set('contacts');
      } else if (url.includes('admin')) {
        this.currentSection.set('admin');
      } else if (url.includes('users')) {
        this.currentSection.set('users');
      } else if (/\/event\//.test(url)) {
        this.currentSection.set('event');
      } else {
        this.currentSection.set('events');
      }
    });
  }

  /** 
   * @method - This method logs out the current user
   * @description - Calls the Convex auth service to logout and redirects to login page
   * ______________________________________________________________________________________________
   * @param - none
   * @returns - nothing
   */
  async logout(): Promise<void> {
    console.log('(EventRunner) File: header.ts #(logout)# Logging out user');
    await this.convexAuthService.logout();
    this.router.navigate(['/login']);
  }

  /** END of SECTION */
}
