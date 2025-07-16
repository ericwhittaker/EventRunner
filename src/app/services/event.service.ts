import { Injectable, signal } from '@angular/core';
import { FirebaseService } from './firebase.service';

export interface Event {
  id: string;
  title: string;
  description: string;
  event_type: string;
  status: 'confirmed' | 'tentative' | 'cancelled' | 'completed' | 'pending' | 'in_progress';
  priority: 'high' | 'medium' | 'low';
  event_date: Date;
  event_time: string;
  duration_hours: number;
  venue_id: string;
  client_contact_id: string;
  coordinator_contact_id: string;
  budget: number;
  actual_cost: number;
  expected_attendance: number;
  actual_attendance?: number;
  special_requirements?: string;
  internal_notes?: string;
  client_notes?: string;
  setup_completed: boolean;
  event_completed: boolean;
  breakdown_completed: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Venue {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  capacity: number;
  type: string;
  contact_email: string;
  contact_phone: string;
}

export interface Contact {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: string;
  company?: string;
  title?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EventService {
  // Signals for reactive state
  events = signal<Event[]>([]);
  venues = signal<Venue[]>([]);
  contacts = signal<Contact[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(private firebase: FirebaseService) {}

  async loadAllData() {
    this.loading.set(true);
    this.error.set(null);

    try {
      // Load all data in parallel
      const [eventsData, venuesData, contactsData] = await Promise.all([
        this.firebase.getCollection('events'),
        this.firebase.getCollection('venues'),
        this.firebase.getCollection('contacts')
      ]);

      // Convert timestamps and set signals
      const events = eventsData.map((event: any) => ({
        ...event,
        event_date: event.event_date?.toDate ? event.event_date.toDate() : new Date(event.event_date),
        created_at: event.created_at?.toDate ? event.created_at.toDate() : new Date(event.created_at),
        updated_at: event.updated_at?.toDate ? event.updated_at.toDate() : new Date(event.updated_at)
      })) as Event[];

      this.events.set(events);
      this.venues.set(venuesData as Venue[]);
      this.contacts.set(contactsData as Contact[]);

    } catch (error) {
      this.error.set(`Failed to load data: ${error}`);
      console.error('Error loading data:', error);
    } finally {
      this.loading.set(false);
    }
  }

  // Get current and future events for main dashboard
  getCurrentAndFutureEvents(): Event[] {
    const now = new Date();
    return this.events()
      .filter(event => 
        event.event_date >= now && 
        event.status !== 'cancelled' && 
        event.status !== 'completed'
      )
      .sort((a, b) => a.event_date.getTime() - b.event_date.getTime());
  }

  // Get tentative events only
  getTentativeEvents(): Event[] {
    return this.events()
      .filter(event => event.status === 'tentative')
      .sort((a, b) => a.event_date.getTime() - b.event_date.getTime());
  }

  // Get post-show events (not marked as done/completed)
  getPostShowEvents(): Event[] {
    const now = new Date();
    return this.events()
      .filter(event => 
        event.event_date < now && 
        event.status !== 'completed' && 
        event.status !== 'cancelled'
      )
      .sort((a, b) => b.event_date.getTime() - a.event_date.getTime());
  }

  // Get venue by ID
  getVenueById(venueId: string): Venue | undefined {
    return this.venues().find(venue => venue.id === venueId);
  }

  // Get contact by ID
  getContactById(contactId: string): Contact | undefined {
    return this.contacts().find(contact => contact.id === contactId);
  }

  // Get event by ID
  getEventById(eventId: string): Event | undefined {
    return this.events().find(event => event.id === eventId);
  }

  // Get events by status
  getEventsByStatus(status: Event['status']): Event[] {
    return this.events()
      .filter(event => event.status === status)
      .sort((a, b) => a.event_date.getTime() - b.event_date.getTime());
  }

  // Get events by priority
  getEventsByPriority(priority: Event['priority']): Event[] {
    return this.events()
      .filter(event => event.priority === priority)
      .sort((a, b) => a.event_date.getTime() - b.event_date.getTime());
  }

  // Get upcoming events (next 7 days)
  getUpcomingEvents(): Event[] {
    const now = new Date();
    const weekFromNow = new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000));
    
    return this.events()
      .filter(event => 
        event.event_date >= now && 
        event.event_date <= weekFromNow &&
        event.status !== 'cancelled'
      )
      .sort((a, b) => a.event_date.getTime() - b.event_date.getTime());
  }

  // Format date for display
  formatEventDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  // Format time for display
  formatEventTime(time: string): string {
    try {
      const [hours, minutes] = time.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    } catch {
      return time;
    }
  }

  // Get status color class
  getStatusColor(status: Event['status']): string {
    switch (status) {
      case 'confirmed': return 'status-confirmed';
      case 'tentative': return 'status-tentative';
      case 'in_progress': return 'status-in-progress';
      case 'completed': return 'status-completed';
      case 'cancelled': return 'status-cancelled';
      case 'pending': return 'status-pending';
      default: return 'status-default';
    }
  }

  // Get priority color class
  getPriorityColor(priority: Event['priority']): string {
    switch (priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return 'priority-default';
    }
  }
}
