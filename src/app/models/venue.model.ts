export interface Venue {
  id: string;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  
  // Contact Information
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  
  // Venue Details
  capacity?: number;
  venueType?: string;
  description?: string;
  
  // System fields
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy?: string;
}

export interface SubVenue {
  id: string;
  venueId: string;
  name: string;
  description?: string;
  capacity?: number;
  
  // Technical specs
  dimensions?: string;
  powerSpecs?: string;
  audioSpecs?: string;
  videoSpecs?: string;
  
  // System fields
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy?: string;
}

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  company?: string;
  title?: string;
  
  // Address
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  
  // Contact type
  contactType?: 'Internal' | 'External' | 'Artist' | 'Venue' | 'Vendor';
  
  // System fields
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy?: string;
}
