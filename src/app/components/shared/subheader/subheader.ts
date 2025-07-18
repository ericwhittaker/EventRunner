/** ANGULAR (CORE) */
import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

/** ANGULAR (ROUTER) */
// import { Router } from '@angular/router'; // Uncomment if needed for navigation

/** APP (SERVICES) */
// import { SomeService } from '...'; // Add if needed

/**
 * ENUMS AND INTERFACES (These are temporary and should go in the model files)
 * ##############################################################################################
 * ##############################################################################################
 */
// Example:
// export interface SubheaderConfig { ... }

/** END of SECTION */

/**
 * COMPONENT DEFINITION
 * ##############################################################################################
 * ##############################################################################################
 */
@Component({
  selector: 'er-subheader',
  imports: [
    CommonModule
  ],
  templateUrl: './subheader.html',
  styleUrl: './subheader.scss'
})
export class Subheader {
  /** DEV WORKAREA, NOTES, AND TODOs
   * ##############################################################################################
   * ##############################################################################################
   * @note This component is designed for flexible subheader layouts using ng-content slots.
   * @todo Add input()s for title, actions, etc. as needed for future customization.
   */

  /** WORKING AREA ================================ */
  // Add signals, input()s, or computed()s here as needed
  /** END OF WORKING AREA ========================= */

  /** ALL INJECTABLES 
   * ##############################################################################################
   * ##############################################################################################
   */
  // public router = inject(Router); // Uncomment if navigation needed
  /** END of SECTION */

  /** ALL input()'s, output()'s, PROPERTIES, signal()'s, linkedSignals(), computed()'s, etc.
   * ##############################################################################################
   * ##############################################################################################
   */

  /** input() to pass in what the accent color is for the specific component using this */
  public readonly accentColor = input<string>('');

  /** END of SECTION */
}
