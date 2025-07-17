import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

import { routes } from './app.routes';
import { 
  provideFirebaseApp, 
  provideFirestore, 
  provideFirebaseAuth, 
  provideFirebaseFunctions, 
  provideFirebaseStorage 
} from './providers/firebase.provider';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    
    // Firebase providers
    provideFirebaseApp(),
    provideFirestore(),
    provideFirebaseAuth(),
    provideFirebaseFunctions(),
    provideFirebaseStorage()
  ]
};
