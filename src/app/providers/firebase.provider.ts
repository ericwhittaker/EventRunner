import { InjectionToken, inject } from '@angular/core';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, Auth, connectAuthEmulator } from 'firebase/auth';
import { getFunctions, Functions, connectFunctionsEmulator } from 'firebase/functions';
import { getStorage, FirebaseStorage, connectStorageEmulator } from 'firebase/storage';
import { environment } from '../../environments/environment';

// Injection tokens
export const FIREBASE_APP = new InjectionToken<FirebaseApp>('firebase.app');
export const FIRESTORE = new InjectionToken<Firestore>('firestore');
export const FIREBASE_AUTH = new InjectionToken<Auth>('firebase.auth');
export const FIREBASE_FUNCTIONS = new InjectionToken<Functions>('firebase.functions');
export const FIREBASE_STORAGE = new InjectionToken<FirebaseStorage>('firebase.storage');

// Firebase App Provider
export function provideFirebaseApp() {
  return {
    provide: FIREBASE_APP,
    useFactory: () => {
      console.log('🔥 Initializing Firebase App...');
      return initializeApp(environment.firebase);
    }
  };
}

// Firestore Provider
export function provideFirestore() {
  return {
    provide: FIRESTORE,
    useFactory: () => {
      const app = inject(FIREBASE_APP);
      const firestore = getFirestore(app);
      
      // Connect to emulator in development
      if (!environment.production && environment.useEmulators) {
        try {
          connectFirestoreEmulator(firestore, 'localhost', 8080);
          console.log('🔥 Connected to Firestore Emulator');
        } catch (error) {
          console.log('🔥 Firestore Emulator not available, using production');
        }
      }
      
      console.log('🔥 Firestore initialized');
      return firestore;
    },
    deps: [FIREBASE_APP]
  };
}

// Auth Provider
export function provideFirebaseAuth() {
  return {
    provide: FIREBASE_AUTH,
    useFactory: () => {
      const app = inject(FIREBASE_APP);
      const auth = getAuth(app);
      
      // Connect to emulator in development
      if (!environment.production && environment.useEmulators) {
        try {
          connectAuthEmulator(auth, 'http://localhost:9099');
          console.log('🔥 Connected to Auth Emulator');
        } catch (error) {
          console.log('🔥 Auth Emulator not available, using production');
        }
      }
      
      console.log('🔥 Firebase Auth initialized');
      return auth;
    },
    deps: [FIREBASE_APP]
  };
}

// Functions Provider
export function provideFirebaseFunctions() {
  return {
    provide: FIREBASE_FUNCTIONS,
    useFactory: () => {
      const app = inject(FIREBASE_APP);
      const functions = getFunctions(app);
      
      // Connect to emulator in development
      if (!environment.production && environment.useEmulators) {
        try {
          connectFunctionsEmulator(functions, 'localhost', 5001);
          console.log('🔥 Connected to Functions Emulator');
        } catch (error) {
          console.log('🔥 Functions Emulator not available, using production');
        }
      }
      
      console.log('🔥 Firebase Functions initialized');
      return functions;
    },
    deps: [FIREBASE_APP]
  };
}

// Storage Provider
export function provideFirebaseStorage() {
  return {
    provide: FIREBASE_STORAGE,
    useFactory: () => {
      const app = inject(FIREBASE_APP);
      const storage = getStorage(app);
      
      // Connect to emulator in development
      if (!environment.production && environment.useEmulators) {
        try {
          connectStorageEmulator(storage, 'localhost', 9199);
          console.log('🔥 Connected to Storage Emulator');
        } catch (error) {
          console.log('🔥 Storage Emulator not available, using production');
        }
      }
      
      console.log('🔥 Firebase Storage initialized');
      return storage;
    },
    deps: [FIREBASE_APP]
  };
}
