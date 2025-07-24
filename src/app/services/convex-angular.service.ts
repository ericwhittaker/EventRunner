import { Injectable, signal, computed } from '@angular/core';
import { injectConvex, injectQuery, injectMutation } from 'convex-angular';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';

// Types based on your Convex schema
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
export class ConvexAngularService {
  private convex = injectConvex();

  // Real-time queries using convex-angular
  public events = injectQuery(api.events.list, () => ({}));
  public venues = injectQuery(api.venues.list, () => ({}));
  
  // Mutations using convex-angular
  public createEventMutation = injectMutation(api.events.create);
  public updateEventMutation = injectMutation(api.events.update);
  public deleteEventMutation = injectMutation(api.events.remove);
  
  public createVenueMutation = injectMutation(api.venues.create);
  public updateVenueMutation = injectMutation(api.venues.update);
  public deleteVenueMutation = injectMutation(api.venues.remove);

  // Computed signals for different event types
  public tentativeEvents = computed(() => 
    this.events.data()?.filter(event => event.status === 'tentative') || []
  );
  
  public confirmedEvents = computed(() => 
    this.events.data()?.filter(event => event.status === 'confirmed') || []
  );
  
  public postShowEvents = computed(() => 
    this.events.data()?.filter(event => event.status === 'postshow') || []
  );

  // Connection state
  public isConnected = computed(() => !this.events.isLoading() && !this.events.error());

  constructor() {
    console.log('(EventRunner) ConvexAngularService initialized with convex-angular');
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
      const result = await this.createEventMutation.mutate(eventData);
      console.log('Event created with ID:', result);
      return result;
    } catch (error) {
      console.error('Error creating event:', error);
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
      await this.updateEventMutation.mutate({ id, ...updates });
      console.log('Event updated:', id);
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  }

  async deleteEvent(id: Id<"events">): Promise<void> {
    try {
      await this.deleteEventMutation.mutate({ id });
      console.log('Event deleted:', id);
    } catch (error) {
      console.error('Error deleting event:', error);
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
      const result = await this.createVenueMutation.mutate(venueData);
      console.log('Venue created with ID:', result);
      return result;
    } catch (error) {
      console.error('Error creating venue:', error);
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
      await this.updateVenueMutation.mutate({ id, ...updates });
      console.log('Venue updated:', id);
    } catch (error) {
      console.error('Error updating venue:', error);
      throw error;
    }
  }

  async deleteVenue(id: Id<"venues">): Promise<void> {
    try {
      await this.deleteVenueMutation.mutate({ id });
      console.log('Venue deleted:', id);
    } catch (error) {
      console.error('Error deleting venue:', error);
      throw error;
    }
  }

  // Direct access to ConvexClient for custom operations
  getConvexClient() {
    return this.convex;
  }
}
