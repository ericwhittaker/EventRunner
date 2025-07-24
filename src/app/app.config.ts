import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
// Remove convex-angular dependency
// import { provideConvex } from 'convex-angular';

import { routes } from './app.routes';
// import { 
//   provideFirebaseApp, 
//   provideFirestore, 
//   provideFirebaseAuth, 
//   provideFirebaseFunctions, 
//   provideFirebaseStorage 
// } from './providers/firebase.provider';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    
    // Use our own ConvexService instead of convex-angular
    // ConvexService will handle both database operations AND authentication
    
    // // Firebase providers
    // provideFirebaseApp(),
    // provideFirestore(),
    // provideFirebaseAuth(),
    // provideFirebaseFunctions(),
    // provideFirebaseStorage()
  ]
};
