import { Injectable, signal, computed, effect } from '@angular/core';
import { FirebaseService } from './firebase-v2.service';

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
export class EventService {
  // Signals for reactive state
  private _events = signal<Event[]>([]);
  private _venues = signal<Venue[]>([]);
  private _contacts = signal<Contact[]>([]);
  private _vehicles = signal<Vehicle[]>([]);
  private _loading = signal(false);
  private _error = signal<string | null>(null);

  // Public computed signals
  events = computed(() => this._events());
  venues = computed(() => this._venues());
  contacts = computed(() => this._contacts());
  vehicles = computed(() => this._vehicles());
  loading = computed(() => this._loading());
  error = computed(() => this._error());

  // Computed statistics
  totalEvents = computed(() => this._events().length);
  totalVenues = computed(() => this._venues().length);
  totalContacts = computed(() => this._contacts().length);
  totalVehicles = computed(() => this._vehicles().length);

  // Event statistics
  upcomingEvents = computed(() => {
    const now = new Date();
    return this._events().filter(event => {
      const eventDate = this.getEventDate(event);
      return eventDate && eventDate > now;
    });
  });

  pastEvents = computed(() => {
    const now = new Date();
    return this._events().filter(event => {
      const eventDate = this.getEventDate(event);
      return eventDate && eventDate <= now;
    });
  });

  constructor(private firebaseService: FirebaseService) {
    console.log('🎉 Modern Event Service initialized with real-time listeners');
    
    // Set up effects in constructor (injection context)
    this.setupRealtimeEffects();
  }

  // =====================
  // INITIALIZATION
  // =====================

  /**
   * Set up real-time effects in constructor (injection context)
   */
  private setupRealtimeEffects(): void {
    // Get signals for real-time data (these will be created when needed)
    const eventsSignal = this.firebaseService.getCollectionSignal('events', {
      orderBy: [{ field: 'createdAt', direction: 'desc' }]
    });

    const venuesSignal = this.firebaseService.getCollectionSignal('venues', {
      orderBy: [{ field: 'name', direction: 'asc' }]
    });

    const contactsSignal = this.firebaseService.getCollectionSignal('contacts', {
      orderBy: [{ field: 'firstName', direction: 'asc' }]
    });

    const vehiclesSignal = this.firebaseService.getCollectionSignal('vehicles', {
      orderBy: [{ field: 'name', direction: 'asc' }]
    });

    // Create effects to sync Firebase signals with our local signals
    effect(() => {
      const events = eventsSignal();
      console.log(`📅 Raw events from Firebase:`, events.length, 'events');
      
      const normalizedEvents = events.map(event => this.normalizeEvent(event));
      console.log(`📅 Normalized events:`, normalizedEvents.length, 'events');
      
      // Log first event's dates to verify parsing
      if (normalizedEvents.length > 0) {
        const first = normalizedEvents[0];
        console.log(`📅 First event "${first.title}": startDate=${first.startDate}, endDate=${first.endDate}`);
      }
      
      this._events.set(normalizedEvents);
      console.log(`📅 Events updated: ${normalizedEvents.length} items`);
    });

    effect(() => {
      const venues = venuesSignal();
      this._venues.set(venues.map(venue => this.normalizeVenue(venue)));
      console.log(`🏢 Venues updated: ${venues.length} items`);
    });

    effect(() => {
      const contacts = contactsSignal();
      this._contacts.set(contacts.map(contact => this.normalizeContact(contact)));
      console.log(`👥 Contacts updated: ${contacts.length} items`);
    });

    effect(() => {
      const vehicles = vehiclesSignal();
      this._vehicles.set(vehicles.map(vehicle => this.normalizeVehicle(vehicle)));
      console.log(`🚗 Vehicles updated: ${vehicles.length} items`);
    });

    console.log('🔄 All real-time effects set up with signals');
  }

  /**
   * Start real-time listeners for all collections (simplified - effects already set up)
   */
  startRealtimeListeners(): void {
    this._loading.set(true);
    this._error.set(null);

    try {
      // Effects are already set up in constructor, just mark as loaded
      this._loading.set(false);
      console.log('🔄 Real-time listeners already active via effects');

    } catch (error) {
      this._loading.set(false);
      this._error.set('Failed to start real-time listeners');
      console.error('❌ Error starting listeners:', error);
    }
  }

  /**
   * Load all data once (no real-time updates)
   */
  async loadAllData(): Promise<void> {
    this._loading.set(true);
    this._error.set(null);

    try {
      const [events, venues, contacts, vehicles] = await Promise.all([
        this.firebaseService.getCollection('events', { orderBy: [{ field: 'createdAt', direction: 'desc' }] }),
        this.firebaseService.getCollection('venues', { orderBy: [{ field: 'name', direction: 'asc' }] }),
        this.firebaseService.getCollection('contacts', { orderBy: [{ field: 'firstName', direction: 'asc' }] }),
        this.firebaseService.getCollection('vehicles', { orderBy: [{ field: 'name', direction: 'asc' }] })
      ]);

      this._events.set(events.map(this.normalizeEvent));
      this._venues.set(venues.map(this.normalizeVenue));
      this._contacts.set(contacts.map(this.normalizeContact));
      this._vehicles.set(vehicles.map(this.normalizeVehicle));

      this._loading.set(false);
      console.log('📊 All data loaded successfully');

    } catch (error) {
      this._loading.set(false);
      this._error.set('Failed to load data');
      console.error('❌ Error loading data:', error);
      throw error;
    }
  }

  // =====================
  // CRUD OPERATIONS
  // =====================

  async addEvent(event: Partial<Event>): Promise<string> {
    const docId = await this.firebaseService.addDocument('events', event);
    console.log('✅ Event added:', docId);
    return docId;
  }

  async updateEvent(eventId: string, updates: Partial<Event>): Promise<void> {
    await this.firebaseService.updateDocument('events', eventId, updates);
    console.log('✅ Event updated:', eventId);
  }

  async deleteEvent(eventId: string): Promise<void> {
    await this.firebaseService.deleteDocument('events', eventId);
    console.log('✅ Event deleted:', eventId);
  }

  // Similar methods for venues, contacts, vehicles...
  async addVenue(venue: Partial<Venue>): Promise<string> {
    return await this.firebaseService.addDocument('venues', venue);
  }

  async addContact(contact: Partial<Contact>): Promise<string> {
    return await this.firebaseService.addDocument('contacts', contact);
  }

  async addVehicle(vehicle: Partial<Vehicle>): Promise<string> {
    return await this.firebaseService.addDocument('vehicles', vehicle);
  }

  // =====================
  // HELPER METHODS
  // =====================

  /**
   * Get event by ID
   */
  getEventById(eventId: string): Event | undefined {
    return this._events().find(event => event.id === eventId);
  }

  /**
   * Get venue by ID
   */
  getVenueById(venueId: string): Venue | undefined {
    return this._venues().find(venue => venue.id === venueId);
  }

  /**
   * Get venue name for display
   */
  getVenueName(venueId: string): string {
    const venue = this.getVenueById(venueId);
    return venue?.name || venue?.venueName || 'Unknown Venue';
  }

  /**
   * Get venue location string
   */
  getVenueLocation(venueId: string): string {
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

  /**
   * Get event date (handles multiple field names)
   */
  private getEventDate(event: Event): Date | null {
    const dateValue = event.event_date || event.date || event.dateStart;
    
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

  // =====================
  // DATA NORMALIZATION
  // =====================

  private normalizeEvent(event: any): Event {
    // Parse dates first
    const parsedStartDate = this.parseDate(event.startDate || event.event_date || event.date || event.dateStart);
    const parsedEndDate = this.parseDate(event.endDate || event.event_date || event.date || event.dateStart);
    
    return {
      // Spread original event first, then override with normalized values
      ...event,
      
      // Core identification
      id: event.id,
      title: event.title || event.name || event.eventName || '',
      name: event.name || event.title || event.eventName || '',
      
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
      eventStatus: event.eventStatus || event.status || 'Confirmed',
      eventPostShowStatus: event.eventPostShowStatus || 'Pending',
      
      // Legacy status (for backward compatibility)
      status: event.status || event.eventStatus || 'Confirmed',
      
      budget: event.budget || 0,
      venue_id: event.venue_id || '',
      venue: event.venue || null,
      description: event.description || event.notes || '',
      createdAt: this.parseDate(event.createdAt),
      updatedAt: this.parseDate(event.updatedAt)
    };
  }

  private normalizeVenue(venue: any): Venue {
    return {
      id: venue.id,
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
      updatedAt: this.parseDate(venue.updatedAt),
      ...venue
    };
  }

  private normalizeContact(contact: any): Contact {
    return {
      id: contact.id,
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
      updatedAt: this.parseDate(contact.updatedAt),
      ...contact
    };
  }

  private normalizeVehicle(vehicle: any): Vehicle {
    return {
      id: vehicle.id,
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
      updatedAt: this.parseDate(vehicle.updatedAt),
      ...vehicle
    };
  }

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

  // =====================
  // CLEANUP
  // =====================

  /**
   * Stop all real-time listeners
   */
  stopRealtimeListeners(): void {
    this.firebaseService.stopAllListeners();
    console.log('🔇 Event Service listeners stopped');
  }

  ngOnDestroy(): void {
    this.stopRealtimeListeners();
  }
}
