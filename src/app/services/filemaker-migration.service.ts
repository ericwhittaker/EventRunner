import { Injectable } from '@angular/core';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, orderBy, limit } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';

// Import our models
import { Event, EventArtist, EventTodo } from '../models/event.model';
import { Venue, SubVenue, Contact } from '../models/venue.model';
import { User, Vehicle, VehicleIssue, VehicleIssueLog } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class FileMakerMigrationService {
  private app: FirebaseApp;
  private db: Firestore;
  private auth: Auth;

  constructor() {
    // Initialize Firebase (you'll need to add your config)
    const firebaseConfig = {
      // Add your Firebase configuration here
      apiKey: "your-api-key",
      authDomain: "your-project.firebaseapp.com",
      projectId: "your-project-id",
      storageBucket: "your-project.appspot.com",
      messagingSenderId: "your-sender-id",
      appId: "your-app-id"
    };

    this.app = initializeApp(firebaseConfig);
    this.db = getFirestore(this.app);
    this.auth = getAuth(this.app);
  }

  /**
   * Migration Methods for Each Table
   */

  async migrateEvents(events: any[]): Promise<void> {
    console.log(`Starting migration of ${events.length} events...`);
    
    for (const fmEvent of events) {
      try {
        const firestoreEvent: Event = {
          id: fmEvent.__pkEventID || this.generateId(),
          name: fmEvent.eventName || 'Unnamed Event',
          description: fmEvent.eventDescription || '',
          eventType: fmEvent.eventType || '',
          status: fmEvent.eventStatus || 'Active',
          
          // Convert FileMaker dates/times to Firestore format
          artistsDoorsDate: this.convertFileMakerDate(fmEvent.eventArtistsDoorsDate),
          artistsDoorsTime: fmEvent.eventArtistsDoorsTime || '',
          artistsInDate: this.convertFileMakerDate(fmEvent.eventArtistsInDate),
          artistsInTime: fmEvent.eventArtistsInTime || '',
          
          // Billing info
          billingEntity: fmEvent.eventBillingEntity || '',
          billingCity: fmEvent.eventBillingCity || '',
          billingDeposit: fmEvent.eventBillingDeposit || '',
          billingInfoFrom: fmEvent.eventBillingInfoFrom || '',
          
          // Notes from FileMaker
          notesLts: fmEvent.eventNotesLts || '',
          notesStg: fmEvent.eventNotesStg || '',
          notesBkl: fmEvent.eventNotesBkl || '',
          notesVid: fmEvent.eventNotesVid || '',
          notesPandD: fmEvent.eventNotesPandD || '',
          notesSite: fmEvent.eventNotesSite || '',
          notesPwr: fmEvent.eventNotesPwr || '',
          notesRig: fmEvent.eventNotesRig || '',
          notesPers: fmEvent.eventNotesPers || '',
          notesMisc: fmEvent.eventNotesMisc || '',
          
          // System fields
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: 'migration',
          userId: fmEvent._zG_fkUserID || '',
          dashboardId: fmEvent._fkDashboardID || '',
          venueId: fmEvent._fkVenueID || '',
          subVenueId: fmEvent._fkSubVenueID || ''
        };

        // Add to Firestore
        await addDoc(collection(this.db, 'events'), firestoreEvent);
        console.log(`Migrated event: ${firestoreEvent.name}`);
        
      } catch (error) {
        console.error(`Error migrating event ${fmEvent.eventName}:`, error);
      }
    }
  }

  async migrateVenues(venues: any[]): Promise<void> {
    console.log(`Starting migration of ${venues.length} venues...`);
    
    for (const fmVenue of venues) {
      try {
        const firestoreVenue: Venue = {
          id: fmVenue.__pkVenueID || this.generateId(),
          name: fmVenue.venueName || 'Unnamed Venue',
          address: fmVenue.venueAddress || '',
          city: fmVenue.venueCity || '',
          state: fmVenue.venueState || '',
          zipCode: fmVenue.venueZipCode || '',
          country: fmVenue.venueCountry || '',
          
          contactName: fmVenue.venueContactName || '',
          contactEmail: fmVenue.venueContactEmail || '',
          contactPhone: fmVenue.venueContactPhone || '',
          
          capacity: fmVenue.venueCapacity || 0,
          venueType: fmVenue.venueType || '',
          description: fmVenue.venueDescription || '',
          
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: 'migration'
        };

        await addDoc(collection(this.db, 'venues'), firestoreVenue);
        console.log(`Migrated venue: ${firestoreVenue.name}`);
        
      } catch (error) {
        console.error(`Error migrating venue ${fmVenue.venueName}:`, error);
      }
    }
  }

  async migrateSubVenues(subVenues: any[]): Promise<void> {
    console.log(`Starting migration of ${subVenues.length} sub-venues...`);
    
    for (const fmSubVenue of subVenues) {
      try {
        const firestoreSubVenue: SubVenue = {
          id: fmSubVenue.__pkSubVenueID || this.generateId(),
          venueId: fmSubVenue._fkVenueID || '',
          name: fmSubVenue.subVenueName || 'Unnamed Sub-Venue',
          description: fmSubVenue.subVenueDescription || '',
          capacity: fmSubVenue.subVenueCapacity || 0,
          
          dimensions: fmSubVenue.subVenueDimensions || '',
          powerSpecs: fmSubVenue.subVenuePowerSpecs || '',
          audioSpecs: fmSubVenue.subVenueAudioSpecs || '',
          videoSpecs: fmSubVenue.subVenueVideoSpecs || '',
          
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: 'migration'
        };

        await addDoc(collection(this.db, 'subVenues'), firestoreSubVenue);
        console.log(`Migrated sub-venue: ${firestoreSubVenue.name}`);
        
      } catch (error) {
        console.error(`Error migrating sub-venue ${fmSubVenue.subVenueName}:`, error);
      }
    }
  }

  async migrateUsers(users: any[]): Promise<void> {
    console.log(`Starting migration of ${users.length} users...`);
    
    for (const fmUser of users) {
      try {
        const firestoreUser: User = {
          id: fmUser.__pkUserID || this.generateId(),
          username: fmUser.username || fmUser.userEmail || 'unknown',
          email: fmUser.userEmail || '',
          firstName: fmUser.userFirstName || '',
          lastName: fmUser.userLastName || '',
          
          role: this.mapUserRole(fmUser.userRole) || 'User',
          permissions: this.mapUserPermissions(fmUser.userPermissions) || [],
          
          preferences: {
            defaultView: fmUser.userDefaultView || 'dashboard',
            notifications: fmUser.userNotifications !== false,
            theme: fmUser.userTheme || 'light'
          },
          
          createdAt: new Date(),
          updatedAt: new Date(),
          lastLogin: this.convertFileMakerDate(fmUser.userLastLogin),
          isActive: fmUser.userIsActive !== false
        };

        await addDoc(collection(this.db, 'users'), firestoreUser);
        console.log(`Migrated user: ${firestoreUser.username}`);
        
      } catch (error) {
        console.error(`Error migrating user ${fmUser.username}:`, error);
      }
    }
  }

  async migrateVehicles(vehicles: any[]): Promise<void> {
    console.log(`Starting migration of ${vehicles.length} vehicles...`);
    
    for (const fmVehicle of vehicles) {
      try {
        const firestoreVehicle: Vehicle = {
          id: fmVehicle.__pkVehicleID || this.generateId(),
          name: fmVehicle.vehicleName || 'Unnamed Vehicle',
          vehicleType: fmVehicle.vehicleType || '',
          make: fmVehicle.vehicleMake || '',
          model: fmVehicle.vehicleModel || '',
          year: fmVehicle.vehicleYear || 0,
          
          capacity: fmVehicle.vehicleCapacity || '',
          rampType: fmVehicle.vehicleRampType || '',
          liftGateType: fmVehicle.vehicleLiftGateType || '',
          
          licensePlate: fmVehicle.vehicleLicensePlate || '',
          vinNumber: fmVehicle.vehicleVIN || '',
          registrationExpiry: this.convertFileMakerDate(fmVehicle.vehicleRegistrationExpiry),
          inspectionExpiry: this.convertFileMakerDate(fmVehicle.vehicleInspectionExpiry),
          
          status: fmVehicle.vehicleStatus || 'Active',
          
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: 'migration'
        };

        await addDoc(collection(this.db, 'vehicles'), firestoreVehicle);
        console.log(`Migrated vehicle: ${firestoreVehicle.name}`);
        
      } catch (error) {
        console.error(`Error migrating vehicle ${fmVehicle.vehicleName}:`, error);
      }
    }
  }

  /**
   * Helper Methods
   */

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  private convertFileMakerDate(fmDate: any): Date | undefined {
    if (!fmDate) return undefined;
    
    // FileMaker dates need to be converted to JavaScript Date objects
    // This will depend on the exact format in your export
    if (typeof fmDate === 'string') {
      const date = new Date(fmDate);
      return isNaN(date.getTime()) ? undefined : date;
    }
    
    return fmDate instanceof Date ? fmDate : undefined;
  }

  private mapUserRole(fmRole: string): 'Admin' | 'Manager' | 'User' | 'Viewer' {
    switch (fmRole?.toLowerCase()) {
      case 'admin':
      case 'administrator':
        return 'Admin';
      case 'manager':
        return 'Manager';
      case 'viewer':
      case 'readonly':
        return 'Viewer';
      default:
        return 'User';
    }
  }

  private mapUserPermissions(fmPermissions: any): string[] {
    // Convert FileMaker permissions to array format
    if (Array.isArray(fmPermissions)) {
      return fmPermissions;
    }
    
    if (typeof fmPermissions === 'string') {
      return fmPermissions.split(',').map(p => p.trim());
    }
    
    return [];
  }

  /**
   * Batch Migration Method
   */
  async runFullMigration(fileMakerData: any): Promise<void> {
    try {
      console.log('Starting full FileMaker to Firestore migration...');
      
      // Migrate in order due to dependencies
      if (fileMakerData.users) {
        await this.migrateUsers(fileMakerData.users);
      }
      
      if (fileMakerData.venues) {
        await this.migrateVenues(fileMakerData.venues);
      }
      
      if (fileMakerData.subVenues) {
        await this.migrateSubVenues(fileMakerData.subVenues);
      }
      
      if (fileMakerData.vehicles) {
        await this.migrateVehicles(fileMakerData.vehicles);
      }
      
      if (fileMakerData.events) {
        await this.migrateEvents(fileMakerData.events);
      }
      
      console.log('Migration completed successfully!');
      
    } catch (error) {
      console.error('Migration failed:', error);
      throw error;
    }
  }
}
