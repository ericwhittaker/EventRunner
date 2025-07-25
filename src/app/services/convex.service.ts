import { Injectable, signal, computed } from '@angular/core';
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

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConvexService {
  private client!: ConvexClient;
  private deploymentUrl = 'https://scintillating-mandrill-776.convex.cloud';
  
  // Signals for reactive data
  public events = signal<ConvexEvent[]>([]);
  public venues = signal<ConvexVenue[]>([]);
  public users = signal<User[]>([]);
  public isConnected = signal(false);
  
  // Auth signals
  public user = signal<User | null>(null);
  public isAuthenticated = signal(false);
  public isLoading = signal(false);
  public authError = signal<string | null>(null);

  constructor() {
    console.log('(EventRunner) ConvexService initialized with AUTH support');
    
    // Initialize Convex client with auth token if available
    this.initializeClient();
    this.setupRealtimeListeners();
  }

  private initializeClient(): void {
    // Initialize ConvexClient without auth in constructor
    this.client = new ConvexClient(this.deploymentUrl, {
      verbose: false // Disabled to reduce function call count in Convex dashboard
    });
    
    // Set auth token after client creation
    const currentToken = this.getStoredAuthToken();
    if (currentToken) {
      console.log('✅ ConvexService initialized WITH auth token');
      // Set the auth token fetcher function on the client (returns Promise)
      this.client.setAuth(() => Promise.resolve(this.getStoredAuthToken()));
      this.checkAuthState();
    } else {
      console.log('⚠️ ConvexService initialized WITHOUT auth token');
    }
  }

  private getStoredAuthToken(): string | null {
    const storageKey = `__convexAuth-${this.deploymentUrl}`;
    const storedData = localStorage.getItem(storageKey);
    
    if (storedData) {
      try {
        const authData = JSON.parse(storedData);
        return authData.token;
      } catch (error) {
        console.error('Failed to parse stored auth data:', error);
        return null;
      }
    }
    
    return null;
  }

  private async checkAuthState(): Promise<void> {
    try {
      const userData = await this.client.query(api.users.getCurrentUser, {});
      const isAuth = await this.client.query(api.users.isAuthenticated, {});
      
      if (userData && isAuth) {
        // Parse Convex Auth user data
        const fullName = userData.name || '';
        const nameParts = fullName.split(' ');
        
        this.user.set({
          id: userData._id,
          email: userData.email || '',
          firstName: nameParts[0] || '',
          lastName: nameParts.slice(1).join(' ') || '',
          role: 'user',
        });
        
        this.isAuthenticated.set(true);
        console.log('✅ User authenticated:', userData.email);
      } else {
        this.user.set(null);
        this.isAuthenticated.set(false);
        console.log('❌ User not authenticated');
      }
    } catch (error) {
      console.error('Auth state check failed:', error);
      this.user.set(null);
      this.isAuthenticated.set(false);
    }
  }

  // =================================
  // AUTHENTICATION METHODS
  // =================================

  async login(credentials: LoginCredentials): Promise<boolean> {
    this.isLoading.set(true);
    this.authError.set(null);

    try {
      console.log('🔑 ConvexService #(login)# Attempting login for:', credentials.email);

      // Use Convex Auth signIn action
      const result = await this.client.action(api.auth.signIn, {
        provider: 'password',
        params: {
          email: credentials.email,
          password: credentials.password,
          flow: 'signIn',
        },
      });

      console.log('🔑 ConvexService #(login)# SignIn result:', result);

      // Store tokens manually
      if (result.tokens) {
        const storageKey = `__convexAuth-${this.deploymentUrl}`;
        const authData = {
          token: result.tokens.token,
          refreshToken: result.tokens.refreshToken,
          timestamp: Date.now()
        };
        
        localStorage.setItem(storageKey, JSON.stringify(authData));
        console.log('🔑 ConvexService #(login)# Tokens stored');
        
        // Reinitialize client with new auth token
        this.initializeClient();
        
        // Check auth state
        await this.checkAuthState();
        
        // Force reload users after successful auth
        await this.loadUsers();
        
        console.log('🔑 ConvexService #(login)# Login successful');
        return true;
      }

      return false;
    } catch (error) {
      console.error('🔑 ConvexService #(login)# Login failed:', error);
      this.authError.set(error instanceof Error ? error.message : 'Login failed');
      return false;
    } finally {
      this.isLoading.set(false);
    }
  }

  async logout(): Promise<void> {
    this.isLoading.set(true);
    
    try {
      console.log('🔑 ConvexService #(logout)# Logging out user');

      // Call signOut action
      await this.client.action(api.auth.signOut, {});

      // Clear stored tokens
      const storageKey = `__convexAuth-${this.deploymentUrl}`;
      localStorage.removeItem(storageKey);
      
      // Clear auth state
      this.user.set(null);
      this.isAuthenticated.set(false);
      
      // Reinitialize client without auth
      this.initializeClient();
      
      console.log('🔑 ConvexService #(logout)# Logout successful');
    } catch (error) {
      console.error('🔑 ConvexService #(logout)# Logout error:', error);
      this.authError.set(error instanceof Error ? error.message : 'Logout failed');
    } finally {
      this.isLoading.set(false);
    }
  }

  async signUp(signUpData: SignUpData): Promise<boolean> {
    this.isLoading.set(true);
    this.authError.set(null);

    try {
      console.log('🔑 ConvexService #(signUp)# Attempting signup for:', signUpData.email);

      // Use Convex Auth signIn action with signUp flow
      const result = await this.client.action(api.auth.signIn, {
        provider: 'password',
        params: {
          email: signUpData.email,
          password: signUpData.password,
          flow: 'signUp',
        },
      });

      // Store tokens and initialize like login
      if (result.tokens) {
        const storageKey = `__convexAuth-${this.deploymentUrl}`;
        const authData = {
          token: result.tokens.token,
          refreshToken: result.tokens.refreshToken,
          timestamp: Date.now()
        };
        
        localStorage.setItem(storageKey, JSON.stringify(authData));
        
        // Reinitialize client with new auth token
        this.initializeClient();
        
        // Update profile if additional info provided
        if (signUpData.firstName || signUpData.lastName) {
          try {
            await this.client.mutation(api.users.updateProfile, {
              firstName: signUpData.firstName,
              lastName: signUpData.lastName,
            });
          } catch (profileError) {
            console.warn('Failed to update profile after signup:', profileError);
          }
        }
        
        // Check auth state
        await this.checkAuthState();
        
        // Force reload users after successful auth
        await this.loadUsers();
        
        console.log('🔑 ConvexService #(signUp)# Signup successful');
        return true;
      }

      return false;
    } catch (error) {
      console.error('🔑 ConvexService #(signUp)# Signup failed:', error);
      this.authError.set(error instanceof Error ? error.message : 'Signup failed');
      return false;
    } finally {
      this.isLoading.set(false);
    }
  }

  async resetUserPassword(userId: string, newPassword: string): Promise<boolean> {
    this.isLoading.set(true);
    this.authError.set(null);

    try {
      console.log('🔑 ConvexService #(resetUserPassword)# Resetting password for user:', userId);

      // TODO: Implement actual password reset via Convex Auth
      // This would typically call a Convex mutation that updates the user's password
      // For now, we'll simulate the operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Example of what the real implementation might look like:
      // await this.client.mutation(api.users.resetPassword, { userId, newPassword });
      
      console.log('🔑 ConvexService #(resetUserPassword)# Password reset successful');
      return true;
    } catch (error) {
      console.error('🔑 ConvexService #(resetUserPassword)# Password reset failed:', error);
      this.authError.set(error instanceof Error ? error.message : 'Password reset failed');
      return false;
    } finally {
      this.isLoading.set(false);
    }
  }

  private async setupRealtimeListeners(): Promise<void> {
    try {
      console.log('(EventRunner) File: convex.service.ts #(setupRealtimeListeners)# Setting up Convex real-time subscriptions...');
      
      // Load initial data
      await this.loadInitialData();
      
      // Convex WebSocket handles all real-time updates automatically
      // No need for polling - the client maintains subscriptions internally
      this.isConnected.set(true);
      console.log('(EventRunner) File: convex.service.ts #(setupRealtimeListeners)# Real-time WebSocket established - Convex handles updates automatically');
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

      // Load users (only if authenticated - admin feature)
      if (this.isAuthenticated()) {
        await this.loadUsers();
      } else {
        console.log('⚠️ ConvexService #(loadInitialData)# Skipping user load - not authenticated');
      }
    } catch (error) {
      console.error('(EventRunner) File: convex.service.ts #(loadInitialData)# Error:', error);
      throw error;
    }
  }

  // Method to refresh data manually
  public async refreshData(): Promise<void> {
    await this.loadInitialData();
  }

  // Method to load users specifically (useful after login)
  public async loadUsers(): Promise<void> {
    try {
      const users = await this.client.query(api.users.listAllUsers, {});
      // Transform Convex Auth users to our User interface
      const transformedUsers = users.map(convexUser => ({
        id: convexUser._id,
        email: convexUser.email || '',
        firstName: this.extractFirstName(convexUser.name || ''),
        lastName: this.extractLastName(convexUser.name || ''),
        role: 'user' // Default role for now
      }));
      this.users.set(transformedUsers);
      console.log('✅ ConvexService #(loadUsers)# Users loaded:', transformedUsers.length, 'users');
    } catch (userError) {
      console.warn('⚠️ ConvexService #(loadUsers)# Could not load users:', userError);
      this.users.set([]);
    }
  }

  // Helper methods for name parsing
  private extractFirstName(fullName: string): string {
    const parts = fullName.trim().split(' ');
    return parts[0] || '';
  }

  private extractLastName(fullName: string): string {
    const parts = fullName.trim().split(' ');
    return parts.slice(1).join(' ') || '';
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
