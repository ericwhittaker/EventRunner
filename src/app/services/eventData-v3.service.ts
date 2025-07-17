/** ANGULAR (CORE) */
import { Injectable, inject, Injector, runInInjectionContext, signal, WritableSignal, computed } from '@angular/core';

/** APP (SERVICES) */
import { EventV3Service, Event, Venue, Contact, Vehicle } from './event-v3.service';

@Injectable({
  providedIn: 'root'
})
export class EventDataV3Service {

  /** DEV WORKAREA, NOTES, AND TODOs
   * ##############################################################################################
   * ##############################################################################################
   * @note This service handles data transformation and signals for event-related data
   * @todo Add data normalization methods
   * @todo Add computed signals for filtered/sorted data
   * @todo Add error handling and loading states
   */

  /** ALL INJECTABLES 
   * ##############################################################################################
   * ##############################################################################################
   */

  /** This is to get access to the Injector */
  private injector: Injector = inject(Injector);

  /** This is to get access to the EventV3Service */
  private eventV3Service: EventV3Service = inject(EventV3Service);

  /** ALL SIGNALS AND COMPUTED VALUES
   * ##############################################################################################
   * ##############################################################################################
   */

  /** Raw data signals from Firebase */
  public rtlEvents: WritableSignal<Event[]> = signal<Event[]>([]);
  public rtlVenues: WritableSignal<Venue[]> = signal<Venue[]>([]);
  public rtlContacts: WritableSignal<Contact[]> = signal<Contact[]>([]);
  public rtlVehicles: WritableSignal<Vehicle[]> = signal<Vehicle[]>([]);

  /** Real-time listener state tracking */
  private rtlEvents_IsActive: WritableSignal<boolean> = signal<boolean>(false);
  private rtlVenues_IsActive: WritableSignal<boolean> = signal<boolean>(false);
  private rtlContacts_IsActive: WritableSignal<boolean> = signal<boolean>(false);
  private rtlVehicles_IsActive: WritableSignal<boolean> = signal<boolean>(false);

  /** Unsubscribe functions for real-time listeners */
  private rtlEvents_ToUnsubscribe: (() => void) | null = null;
  private rtlVenues_ToUnsubscribe: (() => void) | null = null;
  private rtlContacts_ToUnsubscribe: (() => void) | null = null;
  private rtlVehicles_ToUnsubscribe: (() => void) | null = null;

  /** Computed signals for normalized/processed data */
  public normalizedEvents = computed(() => {
    return this.rtlEvents().map(event => this.normalizeEvent(event));
  });

  public normalizedVenues = computed(() => {
    return this.rtlVenues().map(venue => this.normalizeVenue(venue));
  });

  public normalizedContacts = computed(() => {
    return this.rtlContacts().map(contact => this.normalizeContact(contact));
  });

  public normalizedVehicles = computed(() => {
    return this.rtlVehicles().map(vehicle => this.normalizeVehicle(vehicle));
  });

  /** Computed statistics */
  public totalEvents = computed(() => this.normalizedEvents().length);
  public totalVenues = computed(() => this.normalizedVenues().length);
  public totalContacts = computed(() => this.normalizedContacts().length);
  public totalVehicles = computed(() => this.normalizedVehicles().length);

  /** Event-specific computed signals */
  public upcomingEvents = computed(() => {
    const now = new Date();
    return this.normalizedEvents().filter(event => {
      const eventDate = this.getEventDate(event);
      return eventDate && eventDate > now;
    }).sort((a, b) => {
      const dateA = this.getEventDate(a);
      const dateB = this.getEventDate(b);
      if (!dateA) return 1;
      if (!dateB) return -1;
      return dateA.getTime() - dateB.getTime();
    });
  });

  public pastEvents = computed(() => {
    const now = new Date();
    return this.normalizedEvents().filter(event => {
      const eventDate = this.getEventDate(event);
      return eventDate && eventDate <= now;
    }).sort((a, b) => {
      const dateA = this.getEventDate(a);
      const dateB = this.getEventDate(b);
      if (!dateA) return 1;
      if (!dateB) return -1;
      return dateB.getTime() - dateA.getTime(); // Newest first for past events
    });
  });

  public confirmedEvents = computed(() => {
    return this.normalizedEvents().filter(event => 
      event.eventStatus === 'Confirmed' || event.status === 'Confirmed'
    );
  });

  public tentativeEvents = computed(() => {
    return this.normalizedEvents().filter(event => 
      event.eventStatus === 'Tentative' || event.status === 'Tentative'
    );
  });

  public postShowEvents = computed(() => {
    return this.normalizedEvents().filter(event => 
      event.eventPostShowStatus === 'Pending'
    );
  });

  /** Check if all real-time listeners are initialized */
  public isAllRTLInitialized = computed(() => 
    this.rtlEvents_IsActive() && 
    this.rtlVenues_IsActive() && 
    this.rtlContacts_IsActive() && 
    this.rtlVehicles_IsActive()
  );

  /** CONSTRUCTOR
   * ##############################################################################################
   * ##############################################################################################
   */

  constructor() {
    /** DEV_NOTE Console logging that this is being called */
    console.log('(EventRunner) File: eventData-v3.service.ts #(Constructor)# Event Data V3 Service initialized');
  }

  /** METHODS - INITIALIZATION AND LISTENER SETUP
   * ##############################################################################################
   * ##############################################################################################
   */

  /**
   * @method - Initialize all real-time listeners
   * ______________________________________________________________________________________________
   */
  public initializeAllRealtimeListeners(): void {
    console.log('(EventRunner) File: eventData-v3.service.ts #(initializeAllRealtimeListeners)# Setting up all real-time listeners');

    this.setup_rtlEvents();
    this.setup_rtlVenues();
    this.setup_rtlContacts();
    this.setup_rtlVehicles();
  }

  /**
   * @method - Setting up the real-time listener for events
   * ______________________________________________________________________________________________
   */
  private setup_rtlEvents(): void {
    console.log('(EventRunner) File: eventData-v3.service.ts #(setup_rtlEvents)# Setting up events listener');
    
    this.rtlEvents_ToUnsubscribe = this.eventV3Service.rtlEvents_v3((eventsToUpdate) => {
      this.rtlEvents.set(eventsToUpdate);
      this.rtlEvents_IsActive.set(true);
      console.log('(EventRunner) File: eventData-v3.service.ts #(setup_rtlEvents)# Events updated:', eventsToUpdate.length, 'events');
    });
  }

  /**
   * @method - Setting up the real-time listener for venues
   * ______________________________________________________________________________________________
   */
  private setup_rtlVenues(): void {
    console.log('(EventRunner) File: eventData-v3.service.ts #(setup_rtlVenues)# Setting up venues listener');
    
    this.rtlVenues_ToUnsubscribe = this.eventV3Service.rtlVenues_v3((venuesToUpdate) => {
      this.rtlVenues.set(venuesToUpdate);
      this.rtlVenues_IsActive.set(true);
      console.log('(EventRunner) File: eventData-v3.service.ts #(setup_rtlVenues)# Venues updated:', venuesToUpdate.length, 'venues');
    });
  }

  /**
   * @method - Setting up the real-time listener for contacts
   * ______________________________________________________________________________________________
   */
  private setup_rtlContacts(): void {
    console.log('(EventRunner) File: eventData-v3.service.ts #(setup_rtlContacts)# Setting up contacts listener');
    
    this.rtlContacts_ToUnsubscribe = this.eventV3Service.rtlContacts_v3((contactsToUpdate) => {
      this.rtlContacts.set(contactsToUpdate);
      this.rtlContacts_IsActive.set(true);
      console.log('(EventRunner) File: eventData-v3.service.ts #(setup_rtlContacts)# Contacts updated:', contactsToUpdate.length, 'contacts');
    });
  }

  /**
   * @method - Setting up the real-time listener for vehicles
   * ______________________________________________________________________________________________
   */
  private setup_rtlVehicles(): void {
    console.log('(EventRunner) File: eventData-v3.service.ts #(setup_rtlVehicles)# Setting up vehicles listener');
    
    this.rtlVehicles_ToUnsubscribe = this.eventV3Service.rtlVehicles_v3((vehiclesToUpdate) => {
      this.rtlVehicles.set(vehiclesToUpdate);
      this.rtlVehicles_IsActive.set(true);
      console.log('(EventRunner) File: eventData-v3.service.ts #(setup_rtlVehicles)# Vehicles updated:', vehiclesToUpdate.length, 'vehicles');
    });
  }

  /** METHODS - STOP LISTENERS
   * ##############################################################################################
   * ##############################################################################################
   */

  /**
   * @method - Stop all real-time listeners
   * ______________________________________________________________________________________________
   */
  public stopAllRealtimeListeners(): void {
    this.stop_rtlEvents();
    this.stop_rtlVenues();
    this.stop_rtlContacts();
    this.stop_rtlVehicles();
  }

  /**
   * @method - Stop the events listener
   * ______________________________________________________________________________________________
   */
  public stop_rtlEvents(): void {
    if (this.rtlEvents_ToUnsubscribe) {
      console.log('(EventRunner) File: eventData-v3.service.ts #(stop_rtlEvents)# Stopping events listener');
      this.rtlEvents_ToUnsubscribe();
      this.rtlEvents_ToUnsubscribe = null;
      this.rtlEvents_IsActive.set(false);
    }
  }

  /**
   * @method - Stop the venues listener
   * ______________________________________________________________________________________________
   */
  public stop_rtlVenues(): void {
    if (this.rtlVenues_ToUnsubscribe) {
      console.log('(EventRunner) File: eventData-v3.service.ts #(stop_rtlVenues)# Stopping venues listener');
      this.rtlVenues_ToUnsubscribe();
      this.rtlVenues_ToUnsubscribe = null;
      this.rtlVenues_IsActive.set(false);
    }
  }

  /**
   * @method - Stop the contacts listener
   * ______________________________________________________________________________________________
   */
  public stop_rtlContacts(): void {
    if (this.rtlContacts_ToUnsubscribe) {
      console.log('(EventRunner) File: eventData-v3.service.ts #(stop_rtlContacts)# Stopping contacts listener');
      this.rtlContacts_ToUnsubscribe();
      this.rtlContacts_ToUnsubscribe = null;
      this.rtlContacts_IsActive.set(false);
    }
  }

  /**
   * @method - Stop the vehicles listener
   * ______________________________________________________________________________________________
   */
  public stop_rtlVehicles(): void {
    if (this.rtlVehicles_ToUnsubscribe) {
      console.log('(EventRunner) File: eventData-v3.service.ts #(stop_rtlVehicles)# Stopping vehicles listener');
      this.rtlVehicles_ToUnsubscribe();
      this.rtlVehicles_ToUnsubscribe = null;
      this.rtlVehicles_IsActive.set(false);
    }
  }

  /** METHODS - DATA NORMALIZATION
   * ##############################################################################################
   * ##############################################################################################
   */

  /**
   * @method - Normalize event data to handle legacy field names
   * ______________________________________________________________________________________________
   */
  private normalizeEvent(event: Event): Event {
    // Parse dates first
    const parsedStartDate = this.parseDate(event.startDate || event.event_date || event.date || event.dateStart);
    const parsedEndDate = this.parseDate(event.endDate || event.event_date || event.date || event.dateStart);
    
    return {
      // Spread original event first, then override with normalized values
      ...event,
      
      // Core identification
      id: event.id,
      title: event.title || event.name || '',
      name: event.name || event.title || '',
      
      // Modern date fields (primary) - these will override any raw timestamps
      startDate: parsedStartDate,
      endDate: parsedEndDate,
      
      // Legacy date fields (for backward compatibility)
      event_date: this.parseDate(event.event_date || event.date || event.dateStart),
      date: this.parseDate(event.date || event.event_date || event.dateStart),
      dateStart: this.parseDate(event.dateStart || event.event_date || event.date),
      
      // Event details
      event_type: event.event_type || event.type || '',
      type: event.type || event.event_type || '',
      
      // Status management (modern fields)
      eventStatus: (event.eventStatus || event.status || 'Confirmed') as 'Confirmed' | 'Tentative' | 'Cancelled',
      eventPostShowStatus: event.eventPostShowStatus || 'Pending',
      
      // Legacy status (for backward compatibility)
      status: event.status || event.eventStatus || 'Confirmed',
      
      budget: event.budget || 0,
      venue_id: event.venue_id || '',
      venue: event.venue || null,
      description: event.description || '',
      createdAt: this.parseDate(event.createdAt),
      updatedAt: this.parseDate(event.updatedAt)
    };
  }

  /**
   * @method - Normalize venue data to handle legacy field names
   * ______________________________________________________________________________________________
   */
  private normalizeVenue(venue: Venue): Venue {
    return {
      ...venue,
      name: venue.name || venue.venueName || '',
      venueName: venue.venueName || venue.name || '',
      city: venue.city || venue.venueCity || '',
      venueCity: venue.venueCity || venue.city || '',
      state: venue.state || venue.venueState || '',
      venueState: venue.venueState || venue.state || '',
      address: venue.address || venue.venueAddress || '',
      venueAddress: venue.venueAddress || venue.address || '',
      capacity: venue.capacity || 0,
      createdAt: this.parseDate(venue.createdAt),
      updatedAt: this.parseDate(venue.updatedAt)
    };
  }

  /**
   * @method - Normalize contact data to handle legacy field names
   * ______________________________________________________________________________________________
   */
  private normalizeContact(contact: Contact): Contact {
    return {
      ...contact,
      firstName: contact.firstName || contact.contactFirstName || '',
      contactFirstName: contact.contactFirstName || contact.firstName || '',
      lastName: contact.lastName || contact.contactLastName || '',
      contactLastName: contact.contactLastName || contact.lastName || '',
      email: contact.email || contact.contactEmail || '',
      contactEmail: contact.contactEmail || contact.email || '',
      phone: contact.phone || contact.contactPhone || '',
      contactPhone: contact.contactPhone || contact.phone || '',
      company: contact.company || contact.contactCompany || '',
      contactCompany: contact.contactCompany || contact.company || '',
      createdAt: this.parseDate(contact.createdAt),
      updatedAt: this.parseDate(contact.updatedAt)
    };
  }

  /**
   * @method - Normalize vehicle data to handle legacy field names
   * ______________________________________________________________________________________________
   */
  private normalizeVehicle(vehicle: Vehicle): Vehicle {
    return {
      ...vehicle,
      name: vehicle.name || vehicle.vehicleName || '',
      vehicleName: vehicle.vehicleName || vehicle.name || '',
      make: vehicle.make || vehicle.vehicleMake || '',
      vehicleMake: vehicle.vehicleMake || vehicle.make || '',
      model: vehicle.model || vehicle.vehicleModel || '',
      vehicleModel: vehicle.vehicleModel || vehicle.model || '',
      year: vehicle.year || vehicle.vehicleYear || '',
      vehicleYear: vehicle.vehicleYear || vehicle.year || '',
      licensePlate: vehicle.licensePlate || vehicle.vehicleLicensePlate || '',
      vehicleLicensePlate: vehicle.vehicleLicensePlate || vehicle.licensePlate || '',
      createdAt: this.parseDate(vehicle.createdAt),
      updatedAt: this.parseDate(vehicle.updatedAt)
    };
  }

  /** METHODS - HELPER FUNCTIONS
   * ##############################################################################################
   * ##############################################################################################
   */

  /**
   * @method - Get event date (handles multiple field names)
   * ______________________________________________________________________________________________
   */
  private getEventDate(event: Event): Date | null {
    const dateValue = event.startDate || event.event_date || event.date || event.dateStart;
    
    if (!dateValue) return null;
    
    if (dateValue instanceof Date) {
      return dateValue;
    }
    
    if (typeof dateValue === 'string') {
      const parsed = new Date(dateValue);
      return isNaN(parsed.getTime()) ? null : parsed;
    }
    
    return null;
  }

  /**
   * @method - Parse date from various formats
   * ______________________________________________________________________________________________
   */
  private parseDate(dateValue: any): Date | undefined {
    if (!dateValue) return undefined;
    
    if (dateValue instanceof Date) {
      return dateValue;
    }
    
    // Handle Firestore Timestamp
    if (dateValue.toDate && typeof dateValue.toDate === 'function') {
      return dateValue.toDate();
    }
    
    // Handle seconds/nanoseconds Timestamp object
    if (dateValue.seconds !== undefined) {
      return new Date(dateValue.seconds * 1000);
    }
    
    if (typeof dateValue === 'string') {
      const parsed = new Date(dateValue);
      return isNaN(parsed.getTime()) ? undefined : parsed;
    }
    
    // Handle numeric timestamp
    if (typeof dateValue === 'number') {
      return new Date(dateValue);
    }
    
    return undefined;
  }

  /**
   * @method - Get event by ID
   * ______________________________________________________________________________________________
   */
  public getEventById(eventId: string): Event | undefined {
    return this.normalizedEvents().find(event => event.id === eventId);
  }

  /**
   * @method - Get venue by ID
   * ______________________________________________________________________________________________
   */
  public getVenueById(venueId: string): Venue | undefined {
    return this.normalizedVenues().find(venue => venue.id === venueId);
  }

  /**
   * @method - Get venue name for display
   * ______________________________________________________________________________________________
   */
  public getVenueName(venueId: string): string {
    const venue = this.getVenueById(venueId);
    return venue?.name || venue?.venueName || 'Unknown Venue';
  }

  /**
   * @method - Get venue location string
   * ______________________________________________________________________________________________
   */
  public getVenueLocation(venueId: string): string {
    const venue = this.getVenueById(venueId);
    if (!venue) return 'Unknown Location';
    
    const city = venue.city || venue.venueCity || '';
    const state = venue.state || venue.venueState || '';
    
    if (city && state) {
      return `${city}, ${state}`;
    } else if (city) {
      return city;
    } else if (state) {
      return state;
    }
    
    return 'Unknown Location';
  }

  /** METHODS - CRUD OPERATIONS (PROXY TO EventV3Service)
   * ##############################################################################################
   * ##############################################################################################
   */

  /**
   * @method - Create a new event
   * ______________________________________________________________________________________________
   */
  public async createEvent(eventData: Partial<Event>): Promise<string> {
    return await this.eventV3Service.createEvent_v3(eventData);
  }

  /**
   * @method - Update an existing event
   * ______________________________________________________________________________________________
   */
  public async updateEvent(eventId: string, updates: Partial<Event>): Promise<void> {
    await this.eventV3Service.updateEvent_v3(eventId, updates);
  }

  /**
   * @method - Delete an event
   * ______________________________________________________________________________________________
   */
  public async deleteEvent(eventId: string): Promise<void> {
    await this.eventV3Service.deleteEvent_v3(eventId);
  }

  /**
   * @method - Create a new venue
   * ______________________________________________________________________________________________
   */
  public async createVenue(venueData: Partial<Venue>): Promise<string> {
    return await this.eventV3Service.createVenue_v3(venueData);
  }

  /**
   * @method - Create a new contact
   * ______________________________________________________________________________________________
   */
  public async createContact(contactData: Partial<Contact>): Promise<string> {
    return await this.eventV3Service.createContact_v3(contactData);
  }

  /**
   * @method - Create a new vehicle
   * ______________________________________________________________________________________________
   */
  public async createVehicle(vehicleData: Partial<Vehicle>): Promise<string> {
    return await this.eventV3Service.createVehicle_v3(vehicleData);
  }
}
