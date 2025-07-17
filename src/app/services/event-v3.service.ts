/** ANGULAR (CORE) */
import { Injectable, inject, Injector, runInInjectionContext } from '@angular/core';

/** FIREBASE SDK */
import { 
  initializeApp,
  getApp
} from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  doc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  Timestamp, 
  setDoc, 
  where, 
  query, 
  orderBy, 
  limit,
  QuerySnapshot,
  DocumentData,
  QueryDocumentSnapshot,
  Firestore
} from 'firebase/firestore';

/** APP (DATA MODELS) */
// Using existing interfaces from event-v2.service.ts for now
export interface Event {
  id: string;
  title?: string;
  name?: string;
  
  // Date fields - using Date objects for start and end dates
  startDate?: Date;
  endDate?: Date;
  
  // Legacy date fields (for backward compatibility)
  event_date?: Date;
  date?: Date;
  dateStart?: Date;
  
  // Event details
  event_type?: string;
  type?: string;
  
  // Status management
  eventStatus?: 'Confirmed' | 'Tentative' | 'Cancelled';
  eventPostShowStatus?: 'Pending' | 'Complete';
  
  // Legacy status (for backward compatibility)
  status?: string;
  
  budget?: number;
  venue_id?: string;
  venue?: any;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
  [key: string]: any; // Allow additional properties
}

export interface Venue {
  id: string;
  name?: string;
  venueName?: string;
  city?: string;
  venueCity?: string;
  state?: string;
  venueState?: string;
  address?: string;
  venueAddress?: string;
  capacity?: number;
  createdAt?: Date;
  updatedAt?: Date;
  [key: string]: any;
}

export interface Contact {
  id: string;
  firstName?: string;
  contactFirstName?: string;
  lastName?: string;
  contactLastName?: string;
  email?: string;
  contactEmail?: string;
  phone?: string;
  contactPhone?: string;
  company?: string;
  contactCompany?: string;
  createdAt?: Date;
  updatedAt?: Date;
  [key: string]: any;
}

export interface Vehicle {
  id: string;
  name?: string;
  vehicleName?: string;
  make?: string;
  vehicleMake?: string;
  model?: string;
  vehicleModel?: string;
  year?: string | number;
  vehicleYear?: string | number;
  licensePlate?: string;
  vehicleLicensePlate?: string;
  createdAt?: Date;
  updatedAt?: Date;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class EventV3Service {

  /** DEV WORKAREA, NOTES, AND TODOs
   * ##############################################################################################
   * ##############################################################################################
   * @note This service handles direct Firebase interaction for events, venues, contacts, and vehicles
   * @todo Add collection name constants
   * @todo Add error handling for all methods
   * @todo Add batch operations if needed
   */

  /** ALL INJECTABLES 
   * ##############################################################################################
   * ##############################################################################################
   */

  /** This is to get access to the Injector */
  private injector: Injector = inject(Injector);

  /** This is to get access to the Firebase Firestore Service */
  private fbServiceFirestore: Firestore;

  /** Collection name constants */
  public readonly COLLECTION_PATHS = {
    EVENTS: 'events',
    VENUES: 'venues', 
    CONTACTS: 'contacts',
    VEHICLES: 'vehicles'
  } as const;

  /** CONSTRUCTOR
   * ##############################################################################################
   * ##############################################################################################
   */

  constructor() {
    /** DEV_NOTE Console logging that this is being called */
    console.log('(EventRunner) File: event-v3.service.ts #(Constructor)# Event V3 Service initialized');
    
    /** Initialize Firestore */
    try {
      // Try to get existing app, fallback to default
      const app = getApp();
      this.fbServiceFirestore = getFirestore(app);
    } catch (error) {
      // If no app exists, we'll need to initialize it elsewhere
      console.error('(EventRunner) File: event-v3.service.ts #(Constructor)# Firebase app not initialized');
      throw new Error('Firebase app must be initialized before using EventV3Service');
    }
  }

  /** METHODS - REAL TIME LISTENERS
   * ##############################################################################################
   * ##############################################################################################
   */

  /**
   * @method - Real-time listener for events collection
   * ______________________________________________________________________________________________
   * @param callback - The callback function to call when events change
   * @returns A function to unsubscribe from the listener
   */
  public rtlEvents_v3(callback: (events: Event[]) => void): () => void {
    console.log('(EventRunner) File: event-v3.service.ts #(rtlEvents_v3())# Setting up real-time listener for events');
    
    const eventsCollectionRef = collection(this.fbServiceFirestore, this.COLLECTION_PATHS.EVENTS);
    const eventsQuery = query(eventsCollectionRef, orderBy('createdAt', 'desc'));
    
    return onSnapshot(eventsQuery, (querySnapshot: QuerySnapshot<DocumentData>) => {
      const events = querySnapshot.docs.map((docToMap: QueryDocumentSnapshot<DocumentData>) => ({
        id: docToMap.id,
        ...docToMap.data()
      } as Event));
      
      console.log('(EventRunner) File: event-v3.service.ts #(rtlEvents_v3())# Events data updated:', events.length, 'events');
      callback(events);
    }, (error: any) => {
      console.error('(EventRunner) File: event-v3.service.ts #(rtlEvents_v3())# Error:', error);
    });
  }

  /**
   * @method - Real-time listener for venues collection
   * ______________________________________________________________________________________________
   * @param callback - The callback function to call when venues change
   * @returns A function to unsubscribe from the listener
   */
  public rtlVenues_v3(callback: (venues: Venue[]) => void): () => void {
    console.log('(EventRunner) File: event-v3.service.ts #(rtlVenues_v3())# Setting up real-time listener for venues');
    
    const venuesCollectionRef = collection(this.fbServiceFirestore, this.COLLECTION_PATHS.VENUES);
    const venuesQuery = query(venuesCollectionRef, orderBy('name', 'asc'));
    
    return onSnapshot(venuesQuery, (querySnapshot: QuerySnapshot<DocumentData>) => {
      const venues = querySnapshot.docs.map((docToMap: QueryDocumentSnapshot<DocumentData>) => ({
        id: docToMap.id,
        ...docToMap.data()
      } as Venue));
      
      console.log('(EventRunner) File: event-v3.service.ts #(rtlVenues_v3())# Venues data updated:', venues.length, 'venues');
      callback(venues);
    }, (error: any) => {
      console.error('(EventRunner) File: event-v3.service.ts #(rtlVenues_v3())# Error:', error);
    });
  }

  /**
   * @method - Real-time listener for contacts collection
   * ______________________________________________________________________________________________
   * @param callback - The callback function to call when contacts change
   * @returns A function to unsubscribe from the listener
   */
  public rtlContacts_v3(callback: (contacts: Contact[]) => void): () => void {
    console.log('(EventRunner) File: event-v3.service.ts #(rtlContacts_v3())# Setting up real-time listener for contacts');
    
    const contactsCollectionRef = collection(this.fbServiceFirestore, this.COLLECTION_PATHS.CONTACTS);
    const contactsQuery = query(contactsCollectionRef, orderBy('firstName', 'asc'));
    
    return onSnapshot(contactsQuery, (querySnapshot: QuerySnapshot<DocumentData>) => {
      const contacts = querySnapshot.docs.map((docToMap: QueryDocumentSnapshot<DocumentData>) => ({
        id: docToMap.id,
        ...docToMap.data()
      } as Contact));
      
      console.log('(EventRunner) File: event-v3.service.ts #(rtlContacts_v3())# Contacts data updated:', contacts.length, 'contacts');
      callback(contacts);
    }, (error: any) => {
      console.error('(EventRunner) File: event-v3.service.ts #(rtlContacts_v3())# Error:', error);
    });
  }

  /**
   * @method - Real-time listener for vehicles collection
   * ______________________________________________________________________________________________
   * @param callback - The callback function to call when vehicles change
   * @returns A function to unsubscribe from the listener
   */
  public rtlVehicles_v3(callback: (vehicles: Vehicle[]) => void): () => void {
    console.log('(EventRunner) File: event-v3.service.ts #(rtlVehicles_v3())# Setting up real-time listener for vehicles');
    
    const vehiclesCollectionRef = collection(this.fbServiceFirestore, this.COLLECTION_PATHS.VEHICLES);
    const vehiclesQuery = query(vehiclesCollectionRef, orderBy('name', 'asc'));
    
    return onSnapshot(vehiclesQuery, (querySnapshot: QuerySnapshot<DocumentData>) => {
      const vehicles = querySnapshot.docs.map((docToMap: QueryDocumentSnapshot<DocumentData>) => ({
        id: docToMap.id,
        ...docToMap.data()
      } as Vehicle));
      
      console.log('(EventRunner) File: event-v3.service.ts #(rtlVehicles_v3())# Vehicles data updated:', vehicles.length, 'vehicles');
      callback(vehicles);
    }, (error: any) => {
      console.error('(EventRunner) File: event-v3.service.ts #(rtlVehicles_v3())# Error:', error);
    });
  }

  /** METHODS - CRUD OPERATIONS - EVENTS
   * ##############################################################################################
   * ##############################################################################################
   */

  /**
   * @method - Create a new event
   * ______________________________________________________________________________________________
   * @param eventData - The event data to create
   * @returns Promise<string> - The ID of the created event
   */
  public async createEvent_v3(eventData: Partial<Event>): Promise<string> {
    try {
      const eventsCollectionRef = collection(this.fbServiceFirestore, this.COLLECTION_PATHS.EVENTS);
      
      // Add timestamps
      const eventToCreate = {
        ...eventData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      const createdEventDocRef = await addDoc(eventsCollectionRef, eventToCreate);
      console.log('(EventRunner) File: event-v3.service.ts #(createEvent_v3)# Event Created:', createdEventDocRef.id);
      return createdEventDocRef.id;
    } catch (error) {
      console.error('(EventRunner) File: event-v3.service.ts #(createEvent_v3)# Error creating event:', error);
      throw error;
    }
  }

  /**
   * @method - Update an existing event
   * ______________________________________________________________________________________________
   * @param eventId - The ID of the event to update
   * @param updates - The updates to apply
   * @returns Promise<void>
   */
  public async updateEvent_v3(eventId: string, updates: Partial<Event>): Promise<void> {
    try {
      const eventDocRef = doc(this.fbServiceFirestore, this.COLLECTION_PATHS.EVENTS, eventId);
      
      // Add updated timestamp
      const updatesToApply = {
        ...updates,
        updatedAt: Timestamp.now()
      };

      await updateDoc(eventDocRef, updatesToApply);
      console.log('(EventRunner) File: event-v3.service.ts #(updateEvent_v3)# Event updated successfully:', eventId);
    } catch (error) {
      console.error('(EventRunner) File: event-v3.service.ts #(updateEvent_v3)# Error updating event:', error);
      throw error;
    }
  }

  /**
   * @method - Delete an event
   * ______________________________________________________________________________________________
   * @param eventId - The ID of the event to delete
   * @returns Promise<void>
   */
  public async deleteEvent_v3(eventId: string): Promise<void> {
    try {
      const eventDocRef = doc(this.fbServiceFirestore, this.COLLECTION_PATHS.EVENTS, eventId);
      await deleteDoc(eventDocRef);
      console.log('(EventRunner) File: event-v3.service.ts #(deleteEvent_v3)# Event deleted successfully:', eventId);
    } catch (error) {
      console.error('(EventRunner) File: event-v3.service.ts #(deleteEvent_v3)# Error deleting event:', error);
      throw error;
    }
  }

  /**
   * @method - Get a single event by ID
   * ______________________________________________________________________________________________
   * @param eventId - The ID of the event to get
   * @returns Promise<Event | null>
   */
  public async getEvent_v3(eventId: string): Promise<Event | null> {
    try {
      const eventDocRef = doc(this.fbServiceFirestore, this.COLLECTION_PATHS.EVENTS, eventId);
      const docSnap = await getDoc(eventDocRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as Event;
      }
      
      return null;
    } catch (error) {
      console.error('(EventRunner) File: event-v3.service.ts #(getEvent_v3)# Error getting event:', error);
      throw error;
    }
  }

  /** METHODS - CRUD OPERATIONS - VENUES
   * ##############################################################################################
   * ##############################################################################################
   */

  /**
   * @method - Create a new venue
   * ______________________________________________________________________________________________
   * @param venueData - The venue data to create
   * @returns Promise<string> - The ID of the created venue
   */
  public async createVenue_v3(venueData: Partial<Venue>): Promise<string> {
    try {
      const venuesCollectionRef = collection(this.fbServiceFirestore, this.COLLECTION_PATHS.VENUES);
      
      const venueToCreate = {
        ...venueData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      const createdVenueDocRef = await addDoc(venuesCollectionRef, venueToCreate);
      console.log('(EventRunner) File: event-v3.service.ts #(createVenue_v3)# Venue Created:', createdVenueDocRef.id);
      return createdVenueDocRef.id;
    } catch (error) {
      console.error('(EventRunner) File: event-v3.service.ts #(createVenue_v3)# Error creating venue:', error);
      throw error;
    }
  }

  /**
   * @method - Update an existing venue
   * ______________________________________________________________________________________________
   * @param venueId - The ID of the venue to update
   * @param updates - The updates to apply
   * @returns Promise<void>
   */
  public async updateVenue_v3(venueId: string, updates: Partial<Venue>): Promise<void> {
    try {
      const venueDocRef = doc(this.fbServiceFirestore, this.COLLECTION_PATHS.VENUES, venueId);
      
      const updatesToApply = {
        ...updates,
        updatedAt: Timestamp.now()
      };

      await updateDoc(venueDocRef, updatesToApply);
      console.log('(EventRunner) File: event-v3.service.ts #(updateVenue_v3)# Venue updated successfully:', venueId);
    } catch (error) {
      console.error('(EventRunner) File: event-v3.service.ts #(updateVenue_v3)# Error updating venue:', error);
      throw error;
    }
  }

  /**
   * @method - Delete a venue
   * ______________________________________________________________________________________________
   * @param venueId - The ID of the venue to delete
   * @returns Promise<void>
   */
  public async deleteVenue_v3(venueId: string): Promise<void> {
    try {
      const venueDocRef = doc(this.fbServiceFirestore, this.COLLECTION_PATHS.VENUES, venueId);
      await deleteDoc(venueDocRef);
      console.log('(EventRunner) File: event-v3.service.ts #(deleteVenue_v3)# Venue deleted successfully:', venueId);
    } catch (error) {
      console.error('(EventRunner) File: event-v3.service.ts #(deleteVenue_v3)# Error deleting venue:', error);
      throw error;
    }
  }

  /** METHODS - CRUD OPERATIONS - CONTACTS
   * ##############################################################################################
   * ##############################################################################################
   */

  /**
   * @method - Create a new contact
   * ______________________________________________________________________________________________
   * @param contactData - The contact data to create
   * @returns Promise<string> - The ID of the created contact
   */
  public async createContact_v3(contactData: Partial<Contact>): Promise<string> {
    try {
      const contactsCollectionRef = collection(this.fbServiceFirestore, this.COLLECTION_PATHS.CONTACTS);
      
      const contactToCreate = {
        ...contactData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      const createdContactDocRef = await addDoc(contactsCollectionRef, contactToCreate);
      console.log('(EventRunner) File: event-v3.service.ts #(createContact_v3)# Contact Created:', createdContactDocRef.id);
      return createdContactDocRef.id;
    } catch (error) {
      console.error('(EventRunner) File: event-v3.service.ts #(createContact_v3)# Error creating contact:', error);
      throw error;
    }
  }

  /**
   * @method - Update an existing contact
   * ______________________________________________________________________________________________
   * @param contactId - The ID of the contact to update
   * @param updates - The updates to apply
   * @returns Promise<void>
   */
  public async updateContact_v3(contactId: string, updates: Partial<Contact>): Promise<void> {
    try {
      const contactDocRef = doc(this.fbServiceFirestore, this.COLLECTION_PATHS.CONTACTS, contactId);
      
      const updatesToApply = {
        ...updates,
        updatedAt: Timestamp.now()
      };

      await updateDoc(contactDocRef, updatesToApply);
      console.log('(EventRunner) File: event-v3.service.ts #(updateContact_v3)# Contact updated successfully:', contactId);
    } catch (error) {
      console.error('(EventRunner) File: event-v3.service.ts #(updateContact_v3)# Error updating contact:', error);
      throw error;
    }
  }

  /**
   * @method - Delete a contact
   * ______________________________________________________________________________________________
   * @param contactId - The ID of the contact to delete
   * @returns Promise<void>
   */
  public async deleteContact_v3(contactId: string): Promise<void> {
    try {
      const contactDocRef = doc(this.fbServiceFirestore, this.COLLECTION_PATHS.CONTACTS, contactId);
      await deleteDoc(contactDocRef);
      console.log('(EventRunner) File: event-v3.service.ts #(deleteContact_v3)# Contact deleted successfully:', contactId);
    } catch (error) {
      console.error('(EventRunner) File: event-v3.service.ts #(deleteContact_v3)# Error deleting contact:', error);
      throw error;
    }
  }

  /** METHODS - CRUD OPERATIONS - VEHICLES
   * ##############################################################################################
   * ##############################################################################################
   */

  /**
   * @method - Create a new vehicle
   * ______________________________________________________________________________________________
   * @param vehicleData - The vehicle data to create
   * @returns Promise<string> - The ID of the created vehicle
   */
  public async createVehicle_v3(vehicleData: Partial<Vehicle>): Promise<string> {
    try {
      const vehiclesCollectionRef = collection(this.fbServiceFirestore, this.COLLECTION_PATHS.VEHICLES);
      
      const vehicleToCreate = {
        ...vehicleData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      const createdVehicleDocRef = await addDoc(vehiclesCollectionRef, vehicleToCreate);
      console.log('(EventRunner) File: event-v3.service.ts #(createVehicle_v3)# Vehicle Created:', createdVehicleDocRef.id);
      return createdVehicleDocRef.id;
    } catch (error) {
      console.error('(EventRunner) File: event-v3.service.ts #(createVehicle_v3)# Error creating vehicle:', error);
      throw error;
    }
  }

  /**
   * @method - Update an existing vehicle
   * ______________________________________________________________________________________________
   * @param vehicleId - The ID of the vehicle to update
   * @param updates - The updates to apply
   * @returns Promise<void>
   */
  public async updateVehicle_v3(vehicleId: string, updates: Partial<Vehicle>): Promise<void> {
    try {
      const vehicleDocRef = doc(this.fbServiceFirestore, this.COLLECTION_PATHS.VEHICLES, vehicleId);
      
      const updatesToApply = {
        ...updates,
        updatedAt: Timestamp.now()
      };

      await updateDoc(vehicleDocRef, updatesToApply);
      console.log('(EventRunner) File: event-v3.service.ts #(updateVehicle_v3)# Vehicle updated successfully:', vehicleId);
    } catch (error) {
      console.error('(EventRunner) File: event-v3.service.ts #(updateVehicle_v3)# Error updating vehicle:', error);
      throw error;
    }
  }

  /**
   * @method - Delete a vehicle
   * ______________________________________________________________________________________________
   * @param vehicleId - The ID of the vehicle to delete
   * @returns Promise<void>
   */
  public async deleteVehicle_v3(vehicleId: string): Promise<void> {
    try {
      const vehicleDocRef = doc(this.fbServiceFirestore, this.COLLECTION_PATHS.VEHICLES, vehicleId);
      await deleteDoc(vehicleDocRef);
      console.log('(EventRunner) File: event-v3.service.ts #(deleteVehicle_v3)# Vehicle deleted successfully:', vehicleId);
    } catch (error) {
      console.error('(EventRunner) File: event-v3.service.ts #(deleteVehicle_v3)# Error deleting vehicle:', error);
      throw error;
    }
  }

  /** METHODS - UTILITY AND READ OPERATIONS
   * ##############################################################################################
   * ##############################################################################################
   */

  /**
   * @method - Get all events (one-time read, no real-time updates)
   * ______________________________________________________________________________________________
   * @returns Promise<Event[]>
   */
  public async getAllEvents_v3(): Promise<Event[]> {
    try {
      const eventsCollectionRef = collection(this.fbServiceFirestore, this.COLLECTION_PATHS.EVENTS);
      const eventsQuery = query(eventsCollectionRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(eventsQuery);
      
      return querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
        id: doc.id,
        ...doc.data()
      } as Event));
    } catch (error) {
      console.error('(EventRunner) File: event-v3.service.ts #(getAllEvents_v3)# Error getting all events:', error);
      throw error;
    }
  }

  /**
   * @method - Get all venues (one-time read, no real-time updates)
   * ______________________________________________________________________________________________
   * @returns Promise<Venue[]>
   */
  public async getAllVenues_v3(): Promise<Venue[]> {
    try {
      const venuesCollectionRef = collection(this.fbServiceFirestore, this.COLLECTION_PATHS.VENUES);
      const venuesQuery = query(venuesCollectionRef, orderBy('name', 'asc'));
      const querySnapshot = await getDocs(venuesQuery);
      
      return querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
        id: doc.id,
        ...doc.data()
      } as Venue));
    } catch (error) {
      console.error('(EventRunner) File: event-v3.service.ts #(getAllVenues_v3)# Error getting all venues:', error);
      throw error;
    }
  }

  /**
   * @method - Get all contacts (one-time read, no real-time updates)
   * ______________________________________________________________________________________________
   * @returns Promise<Contact[]>
   */
  public async getAllContacts_v3(): Promise<Contact[]> {
    try {
      const contactsCollectionRef = collection(this.fbServiceFirestore, this.COLLECTION_PATHS.CONTACTS);
      const contactsQuery = query(contactsCollectionRef, orderBy('firstName', 'asc'));
      const querySnapshot = await getDocs(contactsQuery);
      
      return querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
        id: doc.id,
        ...doc.data()
      } as Contact));
    } catch (error) {
      console.error('(EventRunner) File: event-v3.service.ts #(getAllContacts_v3)# Error getting all contacts:', error);
      throw error;
    }
  }

  /**
   * @method - Get all vehicles (one-time read, no real-time updates)
   * ______________________________________________________________________________________________
   * @returns Promise<Vehicle[]>
   */
  public async getAllVehicles_v3(): Promise<Vehicle[]> {
    try {
      const vehiclesCollectionRef = collection(this.fbServiceFirestore, this.COLLECTION_PATHS.VEHICLES);
      const vehiclesQuery = query(vehiclesCollectionRef, orderBy('name', 'asc'));
      const querySnapshot = await getDocs(vehiclesQuery);
      
      return querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
        id: doc.id,
        ...doc.data()
      } as Vehicle));
    } catch (error) {
      console.error('(EventRunner) File: event-v3.service.ts #(getAllVehicles_v3)# Error getting all vehicles:', error);
      throw error;
    }
  }
}
