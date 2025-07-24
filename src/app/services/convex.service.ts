import { Injectable, signal } from '@angular/core';
import { ConvexClient } from 'convex/browser';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';

// Define types based on your Convex schema
export interface ConvexEvent {
  _id: Id<"events">;
  name: string;
  description?: string;
  eventType?: "concert" | "corporate" | "conference" | "festival" | "wedding" | "other";
  status?: "tentative" | "confirmed" | "postshow" | "nogo";
  eventDate?: number;
  eventTime?: string;
  venueId?: Id<"venues">;
  createdAt: number;
  updatedAt: number;
  createdBy: string;
  updatedBy?: string;
}

export interface ConvexVenue {
  _id: Id<"venues">;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  capacity?: number;
  venueType?: string;
  description?: string;
  createdAt: number;
  updatedAt: number;
  createdBy: string;
  updatedBy?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConvexService {
  private client: ConvexClient;
  
  // Signals for reactive data
  public events = signal<ConvexEvent[]>([]);
  public venues = signal<ConvexVenue[]>([]);
  public isConnected = signal(false);

  constructor() {
    console.log('(EventRunner) File: convex.service.ts #(Constructor)# Convex Service initialized');
    
    // Initialize Convex client
    const convexUrl = this.getConvexUrl();
    this.client = new ConvexClient(convexUrl);
    
    this.setupRealtimeListeners();
  }

  private getConvexUrl(): string {
    // Get URL from .env.local file - hardcoded for now
    return 'https://scintillating-mandrill-776.convex.cloud';
  }

  private async setupRealtimeListeners(): Promise<void> {
    try {
      console.log('(EventRunner) File: convex.service.ts #(setupRealtimeListeners)# Setting up Convex real-time subscriptions...');
      
      // Load initial data
      await this.loadInitialData();
      
      // Set up polling for real-time-like updates (Convex handles this internally)
      // The ConvexClient automatically maintains real-time connections
      // We'll refresh periodically to ensure we have the latest data
      setInterval(async () => {
        try {
          const events = await this.client.query(api.events.list, {});
          const venues = await this.client.query(api.venues.list, {});
          
          // Update signals if data changed
          if (JSON.stringify(events) !== JSON.stringify(this.events())) {
            this.events.set(events);
            console.log('(EventRunner) File: convex.service.ts #(realtime)# Events updated:', events.length);
          }
          
          if (JSON.stringify(venues) !== JSON.stringify(this.venues())) {
            this.venues.set(venues);
            console.log('(EventRunner) File: convex.service.ts #(realtime)# Venues updated:', venues.length);
          }
        } catch (error) {
          console.error('(EventRunner) File: convex.service.ts #(realtime)# Update error:', error);
        }
      }, 1000); // Check every second for updates
      
      this.isConnected.set(true);
      console.log('(EventRunner) File: convex.service.ts #(setupRealtimeListeners)# Real-time polling established');
    } catch (error) {
      console.error('(EventRunner) File: convex.service.ts #(setupRealtimeListeners)# Failed to setup subscriptions:', error);
      this.isConnected.set(false);
    }
  }

  private async loadInitialData(): Promise<void> {
    try {
      // Load events
      const events = await this.client.query(api.events.list, {});
      this.events.set(events);
      console.log('(EventRunner) File: convex.service.ts #(loadInitialData)# Events loaded:', events.length, 'events');

      // Load venues
      const venues = await this.client.query(api.venues.list, {});
      this.venues.set(venues);
      console.log('(EventRunner) File: convex.service.ts #(loadInitialData)# Venues loaded:', venues.length, 'venues');
    } catch (error) {
      console.error('(EventRunner) File: convex.service.ts #(loadInitialData)# Error:', error);
      throw error;
    }
  }

  // Method to refresh data manually
  public async refreshData(): Promise<void> {
    await this.loadInitialData();
  }

  // Event CRUD operations
  async createEvent(eventData: {
    name: string;
    description?: string;
    eventType?: "concert" | "corporate" | "conference" | "festival" | "wedding" | "other";
    status?: "tentative" | "confirmed" | "postshow" | "nogo";
    eventDate?: number;
    eventTime?: string;
    venueId?: Id<"venues">;
    createdBy: string;
  }): Promise<Id<"events">> {
    try {
      const id = await this.client.mutation(api.events.create, eventData);
      console.log('(EventRunner) File: convex.service.ts #(createEvent)# Event created with ID:', id);
      // Real-time subscription will automatically update the signals
      return id;
    } catch (error) {
      console.error('(EventRunner) File: convex.service.ts #(createEvent)# Error:', error);
      throw error;
    }
  }

  async updateEvent(id: Id<"events">, updates: {
    name?: string;
    description?: string;
    eventType?: "concert" | "corporate" | "conference" | "festival" | "wedding" | "other";
    status?: "tentative" | "confirmed" | "postshow" | "nogo";
    eventDate?: number;
    eventTime?: string;
    venueId?: Id<"venues">;
    updatedBy: string;
  }): Promise<void> {
    try {
      await this.client.mutation(api.events.update, { id, ...updates });
      console.log('(EventRunner) File: convex.service.ts #(updateEvent)# Event updated:', id);
      // Real-time subscription will automatically update the signals
    } catch (error) {
      console.error('(EventRunner) File: convex.service.ts #(updateEvent)# Error:', error);
      throw error;
    }
  }

  async deleteEvent(id: Id<"events">): Promise<void> {
    try {
      await this.client.mutation(api.events.remove, { id });
      console.log('(EventRunner) File: convex.service.ts #(deleteEvent)# Event deleted:', id);
      // Real-time subscription will automatically update the signals
    } catch (error) {
      console.error('(EventRunner) File: convex.service.ts #(deleteEvent)# Error:', error);
      throw error;
    }
  }

  // Venue CRUD operations
  async createVenue(venueData: {
    name: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
    contactName?: string;
    contactEmail?: string;
    contactPhone?: string;
    capacity?: number;
    venueType?: string;
    description?: string;
    createdBy: string;
  }): Promise<Id<"venues">> {
    try {
      const id = await this.client.mutation(api.venues.create, venueData);
      console.log('(EventRunner) File: convex.service.ts #(createVenue)# Venue created with ID:', id);
      await this.refreshData(); // Refresh data after creation
      return id;
    } catch (error) {
      console.error('(EventRunner) File: convex.service.ts #(createVenue)# Error:', error);
      throw error;
    }
  }

  async updateVenue(id: Id<"venues">, updates: {
    name?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
    contactName?: string;
    contactEmail?: string;
    contactPhone?: string;
    capacity?: number;
    venueType?: string;
    description?: string;
    updatedBy: string;
  }): Promise<void> {
    try {
      await this.client.mutation(api.venues.update, { id, ...updates });
      console.log('(EventRunner) File: convex.service.ts #(updateVenue)# Venue updated:', id);
      await this.refreshData(); // Refresh data after update
    } catch (error) {
      console.error('(EventRunner) File: convex.service.ts #(updateVenue)# Error:', error);
      throw error;
    }
  }

  async deleteVenue(id: Id<"venues">): Promise<void> {
    try {
      await this.client.mutation(api.venues.remove, { id });
      console.log('(EventRunner) File: convex.service.ts #(deleteVenue)# Venue deleted:', id);
      await this.refreshData(); // Refresh data after deletion
    } catch (error) {
      console.error('(EventRunner) File: convex.service.ts #(deleteVenue)# Error:', error);
      throw error;
    }
  }

  // Query methods for one-time data fetching
  async getEvents(): Promise<ConvexEvent[]> {
    try {
      return await this.client.query(api.events.list, {});
    } catch (error) {
      console.error('(EventRunner) File: convex.service.ts #(getEvents)# Error:', error);
      return [];
    }
  }

  async getVenues(): Promise<ConvexVenue[]> {
    try {
      return await this.client.query(api.venues.list, {});
    } catch (error) {
      console.error('(EventRunner) File: convex.service.ts #(getVenues)# Error:', error);
      return [];
    }
  }

  async getEvent(id: Id<"events">): Promise<ConvexEvent | null> {
    try {
      return await this.client.query(api.events.get, { id });
    } catch (error) {
      console.error('(EventRunner) File: convex.service.ts #(getEvent)# Error:', error);
      return null;
    }
  }

  async getVenue(id: Id<"venues">): Promise<ConvexVenue | null> {
    try {
      return await this.client.query(api.venues.get, { id });
    } catch (error) {
      console.error('(EventRunner) File: convex.service.ts #(getVenue)# Error:', error);
      return null;
    }
  }
}
