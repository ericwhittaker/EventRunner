import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConvexService } from '../../services/convex.service';
import { AuthService } from '../../services/auth.service';

export interface AddEventConvexDialogData {
  name: string;
  description?: string;
  eventType: "concert" | "corporate" | "conference" | "festival" | "wedding" | "other" | "";
  status: "tentative" | "confirmed" | "postshow" | "nogo" | "";
  eventDate?: Date;
  eventTime?: string;
  venueId?: string;
}

@Component({
  selector: 'app-add-event-convex-dialog',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="dialog-overlay" (click)="onOverlayClick($event)">
      <div class="dialog-container" (click)="$event.stopPropagation()">
        <div class="dialog-header">
          <h2>Add New Event (Convex)</h2>
          <button class="close-btn" (click)="onCancel()" aria-label="Close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="dialog-content">
          <form (ngSubmit)="onSubmit()" #eventForm="ngForm">
            <div class="form-group">
              <label for="name">Event Name *</label>
              <input 
                id="name"
                type="text" 
                [(ngModel)]="eventData.name" 
                name="name"
                required
                placeholder="Enter event name"
                class="form-control"
              />
            </div>

            <div class="form-group">
              <label for="eventType">Event Type *</label>
              <select 
                id="eventType"
                [(ngModel)]="eventData.eventType" 
                name="eventType"
                required
                class="form-control"
              >
                <option value="">Select event type</option>
                <option value="concert">Concert</option>
                <option value="corporate">Corporate Event</option>
                <option value="conference">Conference</option>
                <option value="festival">Festival</option>
                <option value="wedding">Wedding</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div class="form-group">
              <label for="status">Event Status *</label>
              <select 
                id="status"
                [(ngModel)]="eventData.status" 
                name="status"
                required
                class="form-control"
              >
                <option value="">Select event status</option>
                <option value="confirmed">Confirmed</option>
                <option value="tentative">Tentative</option>
                <option value="nogo">No Go</option>
                <option value="postshow">Post-Show</option>
              </select>
            </div>

            <div class="form-group">
              <label for="eventDate">Event Date</label>
              <input 
                id="eventDate"
                type="date" 
                [(ngModel)]="eventDateString" 
                name="eventDate"
                class="form-control"
              />
            </div>

            <div class="form-group">
              <label for="eventTime">Event Time</label>
              <input 
                id="eventTime"
                type="time" 
                [(ngModel)]="eventData.eventTime" 
                name="eventTime"
                class="form-control"
              />
            </div>

            <div class="form-group">
              <label for="venueId">Venue</label>
              <select 
                id="venueId"
                [(ngModel)]="eventData.venueId" 
                name="venueId"
                class="form-control"
              >
                <option value="">Select venue (optional)</option>
                @for (venue of convexService.venues() || []; track venue._id) {
                  <option [value]="venue._id">{{ venue.name }}</option>
                }
              </select>
            </div>

            <div class="form-group">
              <label for="description">Description</label>
              <textarea 
                id="description"
                [(ngModel)]="eventData.description" 
                name="description"
                placeholder="Event description (optional)"
                rows="3"
                class="form-control"
              ></textarea>
            </div>

            <div class="dialog-actions">
              <button type="button" class="btn btn-secondary" (click)="onCancel()">
                Cancel
              </button>
              <button 
                type="submit" 
                class="btn btn-primary" 
                [disabled]="!eventForm.valid || loading()"
              >
                <i class="fas fa-spinner fa-spin" *ngIf="loading()"></i>
                {{ loading() ? 'Creating...' : 'Create Event' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Debug info -->
        <div class="debug-info" *ngIf="showDebug">
          <h4>🔧 Debug Info</h4>
          <pre>{{ debugInfo() | json }}</pre>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dialog-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .dialog-container {
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      width: 90%;
      max-width: 600px;
      max-height: 90vh;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      border-bottom: 1px solid #e0e0e0;
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    }

    .dialog-header h2 {
      margin: 0;
      color: #333;
      font-size: 1.25rem;
      font-weight: 600;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 1.2rem;
      color: #666;
      cursor: pointer;
      padding: 0.25rem;
      border-radius: 4px;
      transition: all 0.2s ease;
    }

    .close-btn:hover {
      background: #e9ecef;
      color: #333;
    }

    .dialog-content {
      padding: 1.5rem;
      overflow-y: auto;
      flex: 1;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #333;
    }

    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      transition: border-color 0.2s ease;
    }

    .form-control:focus {
      outline: none;
      border-color: #00BAFB;
      box-shadow: 0 0 0 2px rgba(0, 186, 251, 0.25);
    }

    .form-control:invalid {
      border-color: #dc3545;
    }

    textarea.form-control {
      resize: vertical;
      min-height: 80px;
    }

    .dialog-actions {
      display: flex;
      gap: 0.75rem;
      justify-content: flex-end;
      margin-top: 1.5rem;
      padding-top: 1rem;
      border-top: 1px solid #e0e0e0;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-secondary {
      background: #6c757d;
      color: white;
    }

    .btn-secondary:hover:not(:disabled) {
      background: #5a6268;
    }

    .btn-primary {
      background: #00BAFB;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: #0099cc;
    }

    .fa-spin {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .debug-info {
      padding: 1rem;
      background: #f8f9fa;
      border-top: 1px solid #e0e0e0;
      margin-top: auto;
    }

    .debug-info h4 {
      margin: 0 0 0.5rem 0;
      font-size: 0.9rem;
      color: #666;
    }

    .debug-info pre {
      font-size: 0.8rem;
      margin: 0;
      background: white;
      padding: 0.5rem;
      border-radius: 4px;
      border: 1px solid #ddd;
      max-height: 200px;
      overflow-y: auto;
    }
  `]
})
export class AddEventConvexDialogComponent {
  protected convexService = inject(ConvexService);
  private authService = inject(AuthService);

  loading = signal(false);
  showDebug = false; // Set to true for debugging
  
  eventData: AddEventConvexDialogData = {
    name: '',
    description: '',
    eventType: '',
    status: '',
    eventTime: '10:00'
  };

  debugInfo = signal({
    formData: this.eventData,
    venues: this.convexService.venues(),
    currentUser: this.authService.user()
  });

  // Helper to convert Date to date input format (YYYY-MM-DD)
  get eventDateString(): string {
    const date = this.eventData.eventDate;
    if (!date) return '';
    return date.toISOString().split('T')[0];
  }

  set eventDateString(value: string) {
    if (value) {
      this.eventData.eventDate = new Date(value);
    } else {
      this.eventData.eventDate = undefined;
    }
  }

  onOverlayClick(event: MouseEvent): void {
    this.onCancel();
  }

  onCancel(): void {
    this.closeDialog();
  }

  async onSubmit(): Promise<void> {
    if (this.loading()) return;

    this.loading.set(true);

    try {
      const currentUser = this.authService.user();
      if (!currentUser) {
        console.error('❌ No authenticated user found');
        return;
      }

      // Prepare event data for Convex
      const eventToCreate = {
        name: this.eventData.name,
        description: this.eventData.description || '',
        eventType: this.eventData.eventType === '' ? undefined : this.eventData.eventType as any,
        status: this.eventData.status === '' ? undefined : this.eventData.status as any,
        eventDate: this.eventData.eventDate ? this.eventData.eventDate.getTime() : undefined,
        eventTime: this.eventData.eventTime || '',
        venueId: this.eventData.venueId as any || undefined, // Cast to Id<"venues">
        createdBy: currentUser.email || 'unknown@demo.com'
      };

      console.log('🔥 Creating Convex event:', eventToCreate);

      // Create the event using Convex
      const eventId = await this.convexService.createEvent(eventToCreate);
      
      console.log(`✅ Convex event created successfully with ID: ${eventId}`);
      
      // Real-time updates handled automatically by convex-angular
      
      // Close the dialog
      this.closeDialog();
      
    } catch (error) {
      console.error('❌ Error creating Convex event:', error);
    } finally {
      this.loading.set(false);
    }
  }

  private closeDialog(): void {
    // Remove the dialog from DOM
    const dialogElement = document.querySelector('app-add-event-convex-dialog');
    if (dialogElement) {
      dialogElement.remove();
    }
  }
}
