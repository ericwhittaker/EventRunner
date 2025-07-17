import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventService } from '../../services/event-v2.service';

export interface AddEventDialogData {
  title: string;
  startDate: Date;
  endDate: Date;
  event_type: string;
  eventStatus: 'Confirmed' | 'Tentative' | 'Cancelled' | '';
  venue_id?: string;
  description?: string;
}

@Component({
  selector: 'app-add-event-dialog',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="dialog-overlay" (click)="onOverlayClick($event)">
      <div class="dialog-container" (click)="$event.stopPropagation()">
        <div class="dialog-header">
          <h2>Add New Event</h2>
          <button class="close-btn" (click)="onCancel()" aria-label="Close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="dialog-content">
          <form (ngSubmit)="onSubmit()" #eventForm="ngForm">
            <div class="form-group">
              <label for="title">Event Title *</label>
              <input 
                id="title"
                type="text" 
                [(ngModel)]="eventData.title" 
                name="title"
                required
                placeholder="Enter event title"
                class="form-control"
              />
            </div>

            <div class="form-group">
              <label for="startDate">Start Date *</label>
              <input 
                id="startDate"
                type="date" 
                [(ngModel)]="startDateString" 
                name="startDate"
                required
                class="form-control"
              />
            </div>

            <div class="form-group">
              <label for="endDate">End Date *</label>
              <input 
                id="endDate"
                type="date" 
                [(ngModel)]="endDateString" 
                name="endDate"
                required
                class="form-control"
              />
            </div>

            <div class="form-group">
              <label for="event_type">Event Type *</label>
              <select 
                id="event_type"
                [(ngModel)]="eventData.event_type" 
                name="event_type"
                required
                class="form-control"
              >
                <option value="">Select event type</option>
                <option value="Concert">Concert</option>
                <option value="Corporate">Corporate Event</option>
                <option value="Wedding">Wedding</option>
                <option value="Festival">Festival</option>
                <option value="Conference">Conference</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div class="form-group">
              <label for="eventStatus">Event Status *</label>
              <select 
                id="eventStatus"
                [(ngModel)]="eventData.eventStatus" 
                name="eventStatus"
                required
                class="form-control"
              >
                <option value="">Select event status</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Tentative">Tentative</option>
                <option value="Cancelled">Cancelled</option>
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
                {{ loading() ? 'Adding...' : 'Add Event' }}
              </button>
            </div>
          </form>
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
      max-width: 500px;
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
      background: #f8f9fa;
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
      border-color: #007bff;
      box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
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
      background: #007bff;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: #0056b3;
    }

    .fa-spin {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `]
})
export class AddEventDialogComponent {
  private eventService = inject(EventService);

  loading = signal(false);
  
  eventData: AddEventDialogData = {
    title: '',
    startDate: new Date(),
    endDate: new Date(),
    event_type: '',
    eventStatus: '', // No default - user must choose
    description: ''
  };

  // Helper to convert Date to date input format (YYYY-MM-DD)
  get startDateString(): string {
    const date = this.eventData.startDate;
    if (!date) return '';
    return date.toISOString().split('T')[0];
  }

  set startDateString(value: string) {
    if (value) {
      // Set time to 8:00 AM for start date
      const date = new Date(value);
      date.setHours(8, 0, 0, 0);
      this.eventData.startDate = date;
    }
  }

  get endDateString(): string {
    const date = this.eventData.endDate;
    if (!date) return '';
    return date.toISOString().split('T')[0];
  }

  set endDateString(value: string) {
    if (value) {
      // Set time to 8:00 AM for end date
      const date = new Date(value);
      date.setHours(8, 0, 0, 0);
      this.eventData.endDate = date;
    }
  }

  onOverlayClick(event: MouseEvent): void {
    // Close dialog when clicking overlay
    this.onCancel();
  }

  onCancel(): void {
    // Emit close event or call parent method
    this.closeDialog();
  }

  async onSubmit(): Promise<void> {
    if (this.loading()) return;

    this.loading.set(true);

    try {
      // Prepare event data for Firebase
      const eventToAdd = {
        title: this.eventData.title,
        startDate: this.eventData.startDate,
        endDate: this.eventData.endDate,
        event_type: this.eventData.event_type,
        eventStatus: this.eventData.eventStatus as 'Confirmed' | 'Tentative' | 'Cancelled',
        eventPostShowStatus: 'Pending' as const, // Default to pending
        description: this.eventData.description || '',
        venue_id: this.eventData.venue_id || '',
        // Add legacy fields for backward compatibility
        event_date: this.eventData.startDate,
        status: this.eventData.eventStatus,
        // Add default values
        duration_hours: 4, // Default 4 hour event
        client_contact_id: '',
        crew_size: 1,
        equipment_needed: '',
        notes: ''
      };

      // Add the event using the service
      const eventId = await this.eventService.addEvent(eventToAdd);
      
      console.log(`✅ Event added successfully with ID: ${eventId}`);
      
      // Close the dialog
      this.closeDialog();
      
    } catch (error) {
      console.error('❌ Error adding event:', error);
      // You could show an error message here
    } finally {
      this.loading.set(false);
    }
  }

  private closeDialog(): void {
    // Remove the dialog from DOM
    const dialogElement = document.querySelector('app-add-event-dialog');
    if (dialogElement) {
      dialogElement.remove();
    }
  }
}
