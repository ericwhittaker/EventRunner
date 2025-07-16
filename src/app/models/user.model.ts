export interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  
  // User role and permissions
  role: 'Admin' | 'Manager' | 'User' | 'Viewer';
  permissions: string[];
  
  // User preferences
  preferences?: {
    defaultView?: string;
    notifications?: boolean;
    theme?: 'light' | 'dark';
  };
  
  // System fields
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  isActive: boolean;
}

export interface Vehicle {
  id: string;
  name: string;
  vehicleType: string;
  make?: string;
  model?: string;
  year?: number;
  
  // Vehicle specs
  capacity?: string;
  rampType?: string;
  liftGateType?: string;
  
  // Maintenance
  licensePlate?: string;
  vinNumber?: string;
  registrationExpiry?: Date;
  inspectionExpiry?: Date;
  
  // Status
  status: 'Active' | 'Maintenance' | 'Out of Service' | 'Retired';
  
  // System fields
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy?: string;
}

export interface VehicleIssue {
  id: string;
  vehicleId: string;
  reportedBy: string;
  assignedTo?: string;
  
  // Issue details
  title: string;
  description: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low' | 'Maintenance';
  category?: string;
  
  // Status tracking
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  reportedDate: Date;
  resolvedDate?: Date;
  
  // Cost tracking
  estimatedCost?: number;
  actualCost?: number;
  
  // System fields
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy?: string;
}

export interface VehicleIssueLog {
  id: string;
  vehicleIssueId: string;
  userId: string;
  
  // Log entry
  action: string;
  description: string;
  timestamp: Date;
  
  // System fields
  createdAt: Date;
  createdBy: string;
}
