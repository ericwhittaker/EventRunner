export interface Event {
  id: string;
  dashboardId?: string;
  installId?: string;
  userId?: string;
  
  // Event Details
  name: string;
  description?: string;
  eventType?: string;
  status?: string;
  
  // Dates and Times
  artistsDoorsDate?: Date;
  artistsDoorsTime?: string;
  artistsInDate?: Date;
  artistsInTime?: string;
  eventDate?: Date;
  eventTime?: string;
  loadInDate?: Date;
  loadInTime?: string;
  loadOutDate?: Date;
  loadOutTime?: string;
  
  // Billing Information
  billingEntity?: string;
  billingCity?: string;
  billingDeposit?: string;
  billingInfoFrom?: string;
  
  // Venue Information
  venueId?: string;
  subVenueId?: string;
  
  // Notes - FileMaker has many specialized note fields
  notesLts?: string;      // Lights Notes
  notesStg?: string;      // Stage Notes
  notesBkl?: string;      // Backline Notes
  notesVid?: string;      // Video Notes
  notesPandD?: string;    // P&D Notes
  notesSite?: string;     // Site Notes
  notesPwr?: string;      // Power Notes
  notesRig?: string;      // Rigging Notes
  notesPers?: string;     // Personnel Notes
  notesMisc?: string;     // Misc Notes
  
  // System fields
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy?: string;
}

export interface EventArtist {
  id: string;
  eventId: string;
  artistName: string;
  artistType?: string;
  contactInfo?: string;
  requirements?: string;
  
  // System fields
  createdAt: Date;
  updatedAt: Date;
}

export interface EventTodo {
  id: string;
  eventId: string;
  userId: string;
  title: string;
  description?: string;
  priority: 'New' | 'ASAP' | 'Medium' | 'Waiting' | 'Critical' | 'Maintenance';
  status: 'Open' | 'In Progress' | 'Completed' | 'Cancelled';
  dueDate?: Date;
  completedDate?: Date;
  
  // System fields
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy?: string;
}
