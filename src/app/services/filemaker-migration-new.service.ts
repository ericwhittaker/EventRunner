import { Injectable, signal } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { DDRParserService, DDRData } from './ddr-parser.service';

// Type definitions based on your FileMaker structure
interface FileMakerEvent {
  __pkEventID: string;
  eventName: string;
  eventDateStart: string;
  eventDateEnd: string;
  eventBillingEntity: string;
  eventBillingCity: string;
  eventNotesSchedule: string;
  eventVenue_SubVenueFullName_Out: string;
  eventVenue_SubVenueCity_Out: string;
  eventVenue_SubVenueState_Out: string;
  eventVenue_SubVenueAddress_Out: string;
  eventVenue_SubVenueZip_Out: string;
  eventVenue_SubVenueLatitude_Out: string;
  eventVenue_SubVenueLongitude_Out: string;
  // Add more fields as needed
}

interface FileMakerVenue {
  __pkVenueID: string;
  venueName: string;
  venueAddress: string;
  venueCity: string;
  venueState: string;
  venueZip: string;
  venuePhone: string;
  venueEmail: string;
  venueWebsite: string;
  venueNotes: string;
}

interface FileMakerContact {
  __pkContactID: string;
  contactFirstName: string;
  contactLastName: string;
  contactEmail: string;
  contactPhone: string;
  contactCompany: string;
  contactTitle: string;
  contactNotes: string;
}

interface FileMakerVehicle {
  __pkVehicleID: string;
  vehicleName: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: string;
  vehicleLicensePlate: string;
  vehicleVIN: string;
  vehicleNotes: string;
}

// Firestore document interfaces
interface FirestoreEvent {
  id?: string;
  name: string;
  dateStart: Date;
  dateEnd: Date;
  billingEntity: string;
  billingCity: string;
  notesSchedule: string;
  venue: {
    name: string;
    city: string;
    state: string;
    address: string;
    zip: string;
    latitude?: number;
    longitude?: number;
  };
  createdAt: Date;
  updatedAt: Date;
  originalFileMakerId: string;
}

interface FirestoreVenue {
  id?: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
  website: string;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
  originalFileMakerId: string;
}

interface FirestoreContact {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  title: string;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
  originalFileMakerId: string;
}

interface FirestoreVehicle {
  id?: string;
  name: string;
  make: string;
  model: string;
  year: string;
  licensePlate: string;
  vin: string;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
  originalFileMakerId: string;
}

@Injectable({
  providedIn: 'root'
})
export class FileMakerMigrationService {
  // Migration progress signals
  migrationProgress = signal(0);
  migrationStatus = signal<'idle' | 'running' | 'completed' | 'error'>('idle');
  migrationLogs = signal<string[]>([]);
  
  // Test mode - limits to 10 records
  private readonly TEST_RECORD_LIMIT = 10;

  constructor(private firebase: FirebaseService, private ddrParser: DDRParserService) {}

  // Main migration method
  async migrateFromFileMaker(csvData: { [tableName: string]: any[] }) {
    this.migrationStatus.set('running');
    this.migrationProgress.set(0);
    this.migrationLogs.set([]);

    try {
      this.addLog('Starting FileMaker to Firestore migration...');
      
      // Calculate total records to migrate (limited to TEST_RECORD_LIMIT per table)
      const totalRecords = Object.values(csvData).reduce((total, records) => 
        total + Math.min(records.length, this.TEST_RECORD_LIMIT), 0
      );

      let processedRecords = 0;

      // Migrate tables in order of dependencies
      if (csvData['VENUES']) {
        this.addLog(`Migrating ${Math.min(csvData['VENUES'].length, this.TEST_RECORD_LIMIT)} venues...`);
        await this.migrateVenues(csvData['VENUES'].slice(0, this.TEST_RECORD_LIMIT));
        processedRecords += Math.min(csvData['VENUES'].length, this.TEST_RECORD_LIMIT);
        this.updateProgress(processedRecords, totalRecords);
      }

      if (csvData['CONTACTS']) {
        this.addLog(`Migrating ${Math.min(csvData['CONTACTS'].length, this.TEST_RECORD_LIMIT)} contacts...`);
        await this.migrateContacts(csvData['CONTACTS'].slice(0, this.TEST_RECORD_LIMIT));
        processedRecords += Math.min(csvData['CONTACTS'].length, this.TEST_RECORD_LIMIT);
        this.updateProgress(processedRecords, totalRecords);
      }

      if (csvData['VEHICLES']) {
        this.addLog(`Migrating ${Math.min(csvData['VEHICLES'].length, this.TEST_RECORD_LIMIT)} vehicles...`);
        await this.migrateVehicles(csvData['VEHICLES'].slice(0, this.TEST_RECORD_LIMIT));
        processedRecords += Math.min(csvData['VEHICLES'].length, this.TEST_RECORD_LIMIT);
        this.updateProgress(processedRecords, totalRecords);
      }

      if (csvData['EVENTS']) {
        this.addLog(`Migrating ${Math.min(csvData['EVENTS'].length, this.TEST_RECORD_LIMIT)} events...`);
        await this.migrateEvents(csvData['EVENTS'].slice(0, this.TEST_RECORD_LIMIT));
        processedRecords += Math.min(csvData['EVENTS'].length, this.TEST_RECORD_LIMIT);
        this.updateProgress(processedRecords, totalRecords);
      }

      this.migrationStatus.set('completed');
      this.addLog('Migration completed successfully!');
      
    } catch (error) {
      this.migrationStatus.set('error');
      this.addLog(`Migration failed: ${error}`);
      throw error;
    }
  }

  // Migrate venues
  private async migrateVenues(venues: FileMakerVenue[]) {
    for (const venue of venues) {
      try {
        const firestoreVenue: FirestoreVenue = {
          name: venue.venueName || '',
          address: venue.venueAddress || '',
          city: venue.venueCity || '',
          state: venue.venueState || '',
          zip: venue.venueZip || '',
          phone: venue.venuePhone || '',
          email: venue.venueEmail || '',
          website: venue.venueWebsite || '',
          notes: venue.venueNotes || '',
          createdAt: new Date(),
          updatedAt: new Date(),
          originalFileMakerId: venue.__pkVenueID
        };

        const docId = await this.firebase.addDocument('venues', firestoreVenue);
        this.addLog(`✓ Migrated venue: ${venue.venueName} (${docId})`);
        
      } catch (error) {
        this.addLog(`✗ Failed to migrate venue ${venue.venueName}: ${error}`);
      }
    }
  }

  // Migrate contacts
  private async migrateContacts(contacts: FileMakerContact[]) {
    for (const contact of contacts) {
      try {
        const firestoreContact: FirestoreContact = {
          firstName: contact.contactFirstName || '',
          lastName: contact.contactLastName || '',
          email: contact.contactEmail || '',
          phone: contact.contactPhone || '',
          company: contact.contactCompany || '',
          title: contact.contactTitle || '',
          notes: contact.contactNotes || '',
          createdAt: new Date(),
          updatedAt: new Date(),
          originalFileMakerId: contact.__pkContactID
        };

        const docId = await this.firebase.addDocument('contacts', firestoreContact);
        this.addLog(`✓ Migrated contact: ${contact.contactFirstName} ${contact.contactLastName} (${docId})`);
        
      } catch (error) {
        this.addLog(`✗ Failed to migrate contact ${contact.contactFirstName} ${contact.contactLastName}: ${error}`);
      }
    }
  }

  // Migrate vehicles
  private async migrateVehicles(vehicles: FileMakerVehicle[]) {
    for (const vehicle of vehicles) {
      try {
        const firestoreVehicle: FirestoreVehicle = {
          name: vehicle.vehicleName || '',
          make: vehicle.vehicleMake || '',
          model: vehicle.vehicleModel || '',
          year: vehicle.vehicleYear || '',
          licensePlate: vehicle.vehicleLicensePlate || '',
          vin: vehicle.vehicleVIN || '',
          notes: vehicle.vehicleNotes || '',
          createdAt: new Date(),
          updatedAt: new Date(),
          originalFileMakerId: vehicle.__pkVehicleID
        };

        const docId = await this.firebase.addDocument('vehicles', firestoreVehicle);
        this.addLog(`✓ Migrated vehicle: ${vehicle.vehicleName} (${docId})`);
        
      } catch (error) {
        this.addLog(`✗ Failed to migrate vehicle ${vehicle.vehicleName}: ${error}`);
      }
    }
  }

  // Migrate events
  private async migrateEvents(events: FileMakerEvent[]) {
    for (const event of events) {
      try {
        const firestoreEvent: FirestoreEvent = {
          name: event.eventName || '',
          dateStart: this.parseFileMakerDate(event.eventDateStart),
          dateEnd: this.parseFileMakerDate(event.eventDateEnd),
          billingEntity: event.eventBillingEntity || '',
          billingCity: event.eventBillingCity || '',
          notesSchedule: event.eventNotesSchedule || '',
          venue: {
            name: event.eventVenue_SubVenueFullName_Out || '',
            city: event.eventVenue_SubVenueCity_Out || '',
            state: event.eventVenue_SubVenueState_Out || '',
            address: event.eventVenue_SubVenueAddress_Out || '',
            zip: event.eventVenue_SubVenueZip_Out || '',
            latitude: event.eventVenue_SubVenueLatitude_Out ? parseFloat(event.eventVenue_SubVenueLatitude_Out) : undefined,
            longitude: event.eventVenue_SubVenueLongitude_Out ? parseFloat(event.eventVenue_SubVenueLongitude_Out) : undefined
          },
          createdAt: new Date(),
          updatedAt: new Date(),
          originalFileMakerId: event.__pkEventID
        };

        const docId = await this.firebase.addDocument('events', firestoreEvent);
        this.addLog(`✓ Migrated event: ${event.eventName} (${docId})`);
        
      } catch (error) {
        this.addLog(`✗ Failed to migrate event ${event.eventName}: ${error}`);
      }
    }
  }

  // Helper method to parse FileMaker dates
  private parseFileMakerDate(dateString: string): Date {
    if (!dateString) return new Date();
    
    try {
      // FileMaker typically exports dates in MM/DD/YYYY format
      const parts = dateString.split('/');
      if (parts.length === 3) {
        const month = parseInt(parts[0]) - 1; // JS months are 0-indexed
        const day = parseInt(parts[1]);
        const year = parseInt(parts[2]);
        return new Date(year, month, day);
      }
      return new Date(dateString);
    } catch {
      return new Date();
    }
  }

  // Helper method to parse CSV data
  parseCsvData(csvContent: string): any[] {
    const lines = csvContent.split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const data: any[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const values = this.parseCsvLine(line);
      if (values.length === headers.length) {
        const record: any = {};
        headers.forEach((header, index) => {
          record[header] = values[index];
        });
        data.push(record);
      }
    }

    return data;
  }

  // Helper method to parse CSV line (handles quoted fields)
  private parseCsvLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }

    result.push(current.trim());
    return result;
  }

  // Helper methods for progress tracking
  private updateProgress(processed: number, total: number) {
    this.migrationProgress.set(Math.round((processed / total) * 100));
  }

  private addLog(message: string) {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `[${timestamp}] ${message}`;
    this.migrationLogs.update(logs => [...logs, logEntry]);
    console.log(logEntry);
  }

  // Method to clear migration data (for testing)
  async clearMigrationData() {
    this.addLog('🗑️ Starting to clear migration data - deleting entire collections...');
    
    const collections = ['events', 'venues', 'contacts', 'vehicles'];
    
    for (const collection of collections) {
      try {
        this.addLog(`� Clearing ${collection} collection...`);
        const deletedCount = await this.firebase.deleteCollection(collection);
        this.addLog(`✅ Successfully deleted ${deletedCount} documents from ${collection} collection`);
      } catch (error) {
        this.addLog(`❌ Failed to clear ${collection}: ${error}`);
      }
    }
    
    this.addLog('� Clear migration data operation completed - all collections cleared!');
  }

  // DDR-based migration method
  async migrateFromDDR(): Promise<void> {
    this.migrationStatus.set('running');
    this.migrationProgress.set(0);
    this.migrationLogs.set([]);

    try {
      this.addLog('🚀 Starting DDR-based migration with enhanced sample data...');
      this.addLog('📖 Reading FileMaker DDR schema...');
      this.addLog('✨ Generating realistic sample data based on your actual field definitions...');
      this.addLog('� Tip: For real data, export tables from FileMaker as XML files to public/data/');
      
      // Parse the actual DDR file
      const ddrData = await this.ddrParser.parseDDRFile('data/EventRunner_fmp12.xml');
      
      this.addLog(`📊 Found ${Object.keys(ddrData.tables).length} tables in DDR`);
      
      // Process each table
      const tableNames = Object.keys(ddrData.tables);
      const totalTables = tableNames.length;
      
      for (let i = 0; i < tableNames.length; i++) {
        const tableName = tableNames[i];
        const table = ddrData.tables[tableName];
        
        this.addLog(`📋 Processing ${tableName} table (${table.records} records, ${table.fields.length} fields)...`);
        
        // Convert table name to Firestore collection name
        const collectionName = this.getCollectionName(tableName);
        
        // Migrate the actual data
        let migratedCount = 0;
        for (const record of table.data) {
          const firestoreRecord = this.convertToFirestoreRecord(record, table.fields, tableName);
          if (firestoreRecord) {
            await this.firebase.addDocument(collectionName, firestoreRecord);
            migratedCount++;
          }
        }
        
        this.addLog(`✅ Migrated ${migratedCount} records from ${tableName} to ${collectionName}`);
        
        // Update progress
        const progress = Math.floor(((i + 1) / totalTables) * 100);
        this.migrationProgress.set(progress);
      }
      
      this.addLog('🎉 DDR migration completed successfully!');
      this.migrationStatus.set('completed');
      
    } catch (error) {
      this.addLog(`❌ Migration failed: ${error}`);
      this.migrationStatus.set('error');
      throw error;
    }
  }

  // Check if XML exports are available, otherwise use DDR + sample data
  async migrateWithXMLOrDDR(): Promise<void> {
    this.migrationStatus.set('running');
    this.migrationProgress.set(0);
    this.migrationLogs.set([]);

    try {
      // Check if XML exports are available
      const xmlFiles = ['events.xml', 'contacts.xml', 'venues.xml', 'vehicles.xml'];
      const availableFiles: string[] = [];
      
      for (const file of xmlFiles) {
        try {
          const response = await fetch(`data/${file}`);
          if (response.ok) {
            availableFiles.push(file);
          }
        } catch (error) {
          // File not available, skip
        }
      }
      
      if (availableFiles.length > 0) {
        this.addLog(`📄 Found ${availableFiles.length} XML export files: ${availableFiles.join(', ')}`);
        this.addLog('🔄 Using actual FileMaker data from XML exports...');
        await this.migrateFromXMLExports(availableFiles);
      } else {
        this.addLog('📋 No XML export files found, using DDR + sample data...');
        await this.migrateFromDDR();
      }
      
    } catch (error) {
      this.addLog(`❌ Migration failed: ${error}`);
      this.migrationStatus.set('error');
      throw error;
    }
  }

  // Parse FileMaker XML exports (FMPXMLRESULT format)
  private async migrateFromXMLExports(xmlFiles: string[]): Promise<void> {
    for (const xmlFile of xmlFiles) {
      try {
        this.addLog(`📖 Processing ${xmlFile}...`);
        
        const response = await fetch(`data/${xmlFile}`);
        const xmlText = await response.text();
        
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
        
        // Parse FMPXMLRESULT format
        const metadata = xmlDoc.querySelector('METADATA');
        const resultset = xmlDoc.querySelector('RESULTSET');
        
        if (!metadata || !resultset) {
          this.addLog(`⚠️ Invalid XML format in ${xmlFile}`);
          continue;
        }
        
        // Get field definitions
        const fields = Array.from(metadata.querySelectorAll('FIELD')).map(field => ({
          name: field.getAttribute('NAME') || '',
          type: field.getAttribute('TYPE') || 'TEXT'
        }));
        
        // Get records
        const rows = Array.from(resultset.querySelectorAll('ROW'));
        this.addLog(`📊 Found ${rows.length} records in ${xmlFile}`);
        
        // Convert to Firestore format
        const collectionName = xmlFile.replace('.xml', '');
        let migratedCount = 0;
        
        for (const row of rows) {
          const cols = Array.from(row.querySelectorAll('COL'));
          const record: any = {};
          
          cols.forEach((col, index) => {
            if (index < fields.length) {
              const field = fields[index];
              const dataElement = col.querySelector('DATA');
              const value = dataElement ? dataElement.textContent : '';
              record[field.name] = this.convertXMLValue(value, field.type);
            }
          });
          
          // Add system fields
          record.createdAt = new Date();
          record.updatedAt = new Date();
          record.migratedFrom = 'filemaker_xml';
          
          await this.firebase.addDocument(collectionName, record);
          migratedCount++;
          
          // Update progress
          if (migratedCount % 10 === 0) {
            this.addLog(`  📝 Processed ${migratedCount}/${rows.length} records...`);
          }
        }
        
        this.addLog(`✅ Successfully migrated ${migratedCount} records from ${xmlFile}`);
        
      } catch (error) {
        this.addLog(`❌ Error processing ${xmlFile}: ${error}`);
      }
    }
    
    this.migrationStatus.set('completed');
    this.addLog('🎉 XML migration completed successfully!');
  }

  private convertXMLValue(value: string | null, type: string): any {
    if (!value) return null;
    
    switch (type.toUpperCase()) {
      case 'NUMBER':
        return parseFloat(value) || 0;
      case 'DATE':
        return new Date(value);
      case 'TIME':
        return value;
      case 'TIMESTAMP':
        return new Date(value);
      case 'TEXT':
      default:
        return value;
    }
  }

  // Helper methods for DDR migration
  private getCollectionName(tableName: string): string {
    // Map FileMaker table names to Firestore collection names
    const tableMap: { [key: string]: string } = {
      'EVENTS': 'events',
      'CONTACTS': 'contacts',
      'VEHICLES': 'vehicles',
      'VENUES': 'venues',
      'LOGISTICS': 'logistics',
      'COMMUNICATIONS': 'communications',
      'FINANCIAL': 'financial',
      'INVENTORY': 'inventory'
    };
    
    return tableMap[tableName] || tableName.toLowerCase();
  }

  private convertToFirestoreRecord(record: any, fields: any[], tableName: string): any {
    if (!record || !fields) return null;
    
    const firestoreRecord: any = {};
    
    // Convert based on table type
    switch (tableName) {
      case 'EVENTS':
        return this.convertEventRecord(record, fields);
      case 'CONTACTS':
        return this.convertContactRecord(record, fields);
      case 'VEHICLES':
        return this.convertVehicleRecord(record, fields);
      case 'VENUES':
        return this.convertVenueRecord(record, fields);
      default:
        // Generic conversion
        return this.convertGenericRecord(record, fields);
    }
  }

  private convertEventRecord(record: any, fields: any[]): any {
    return {
      id: record.EVENT_ID || this.generateId(),
      title: record.EVENT_NAME || record.TITLE || '',
      date: this.parseDate(record.EVENT_DATE || record.DATE),
      time: record.EVENT_TIME || record.TIME || '',
      venue: record.VENUE_NAME || record.VENUE || '',
      description: record.DESCRIPTION || record.NOTES || '',
      status: record.STATUS || 'active',
      type: record.EVENT_TYPE || record.TYPE || 'event',
      capacity: parseInt(record.CAPACITY) || 0,
      price: parseFloat(record.PRICE) || 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  private convertContactRecord(record: any, fields: any[]): any {
    return {
      id: record.CONTACT_ID || this.generateId(),
      firstName: record.FIRST_NAME || record.FIRSTNAME || '',
      lastName: record.LAST_NAME || record.LASTNAME || '',
      email: record.EMAIL || '',
      phone: record.PHONE || record.PHONE_NUMBER || '',
      company: record.COMPANY || record.ORGANIZATION || '',
      role: record.ROLE || record.POSITION || '',
      address: record.ADDRESS || '',
      city: record.CITY || '',
      state: record.STATE || '',
      zipCode: record.ZIP_CODE || record.ZIP || '',
      notes: record.NOTES || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  private convertVehicleRecord(record: any, fields: any[]): any {
    return {
      id: record.VEHICLE_ID || this.generateId(),
      make: record.MAKE || '',
      model: record.MODEL || '',
      year: parseInt(record.YEAR) || 0,
      licensePlate: record.LICENSE_PLATE || record.PLATE || '',
      vin: record.VIN || '',
      color: record.COLOR || '',
      type: record.VEHICLE_TYPE || record.TYPE || '',
      capacity: parseInt(record.CAPACITY) || 0,
      status: record.STATUS || 'active',
      notes: record.NOTES || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  private convertVenueRecord(record: any, fields: any[]): any {
    return {
      id: record.VENUE_ID || this.generateId(),
      name: record.VENUE_NAME || record.NAME || '',
      address: record.ADDRESS || '',
      city: record.CITY || '',
      state: record.STATE || '',
      zipCode: record.ZIP_CODE || record.ZIP || '',
      capacity: parseInt(record.CAPACITY) || 0,
      type: record.VENUE_TYPE || record.TYPE || '',
      phone: record.PHONE || '',
      email: record.EMAIL || '',
      website: record.WEBSITE || '',
      notes: record.NOTES || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  private convertGenericRecord(record: any, fields: any[]): any {
    const genericRecord: any = {
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Add all fields from the record
    for (const [key, value] of Object.entries(record)) {
      if (key && value !== null && value !== undefined) {
        genericRecord[key.toLowerCase()] = value;
      }
    }
    
    return genericRecord;
  }

  private parseDate(dateString: string): Date {
    if (!dateString) return new Date();
    
    // Try different date formats
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? new Date() : date;
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  // Generate comprehensive sample data based on DDR analysis
  private generateSampleDataFromDDR(): { [tableName: string]: any[] } {
    const currentDate = new Date();
    
    // Generate realistic event types and statuses
    const eventTypes = ['Concert', 'Festival', 'Corporate Event', 'Wedding', 'Conference', 'Theater', 'Sports Event', 'Exhibition'];
    const eventStatuses = ['confirmed', 'tentative', 'cancelled', 'completed', 'pending', 'in_progress'];
    const eventPriorities = ['high', 'medium', 'low'];
    
    // Create venues first for relationships
    const venues = Array.from({ length: 25 }, (_, i) => ({
      id: `venue_${String(i + 1).padStart(3, '0')}`,
      name: [
        'Grand Theater', 'Convention Center', 'Park Pavilion', 'Hotel Ballroom', 
        'Outdoor Amphitheater', 'Sports Arena', 'Community Center', 'Concert Hall',
        'Exhibition Hall', 'Rooftop Venue', 'Warehouse Space', 'Beach Resort'
      ][i % 12] + ` ${Math.floor(i / 12) + 1}`,
      address: `${1000 + i} ${['Main St', 'Oak Ave', 'Pine Rd', 'Elm Blvd', 'Maple Dr'][i % 5]}`,
      city: ['Los Angeles', 'New York', 'Chicago', 'Houston', 'Phoenix'][i % 5],
      state: ['CA', 'NY', 'IL', 'TX', 'AZ'][i % 5],
      zip_code: `${90000 + i}`,
      capacity: 50 + (i * 75),
      type: ['indoor', 'outdoor', 'hybrid'][i % 3],
      contact_email: `venue${i + 1}@example.com`,
      contact_phone: `555-${String(i + 100).padStart(3, '0')}-${String(i + 5000).padStart(4, '0')}`,
      amenities: ['parking', 'catering', 'av_equipment', 'security', 'wifi'].slice(0, (i % 5) + 1),
      hourly_rate: 150 + (i * 25),
      setup_time_hours: 2 + (i % 4),
      breakdown_time_hours: 1 + (i % 3),
      created_at: currentDate,
      updated_at: currentDate
    }));

    // Create contacts with various roles
    const contacts = Array.from({ length: 50 }, (_, i) => ({
      id: `contact_${String(i + 1).padStart(3, '0')}`,
      first_name: ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Chris', 'Lisa', 'Mark', 'Anna'][i % 10],
      last_name: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'][i % 10],
      email: `contact${i + 1}@example.com`,
      phone: `555-${String(i + 200).padStart(3, '0')}-${String(i + 6000).padStart(4, '0')}`,
      mobile: `555-${String(i + 300).padStart(3, '0')}-${String(i + 7000).padStart(4, '0')}`,
      role: ['client', 'vendor', 'crew', 'security', 'catering', 'av_tech', 'coordinator', 'performer'][i % 8],
      company: i % 4 === 0 ? `Company ${Math.floor(i / 4) + 1}` : null,
      title: i % 3 === 0 ? ['Manager', 'Director', 'Coordinator', 'Supervisor'][i % 4] : null,
      emergency_contact: `Emergency Contact ${i + 1}`,
      emergency_phone: `555-${String(i + 400).padStart(3, '0')}-${String(i + 8000).padStart(4, '0')}`,
      notes: `Important notes about contact ${i + 1}`,
      created_at: currentDate,
      updated_at: currentDate
    }));

    // Create vehicles with detailed specs
    const vehicles = Array.from({ length: 35 }, (_, i) => ({
      id: `vehicle_${String(i + 1).padStart(3, '0')}`,
      make: ['Ford', 'Chevrolet', 'Toyota', 'Mercedes', 'Isuzu', 'Freightliner'][i % 6],
      model: ['Transit', 'Express', 'Sprinter', 'F-550', 'NPR', 'Cascadia'][i % 6],
      year: 2018 + (i % 7),
      license_plate: `${String.fromCharCode(65 + (i % 26))}${String.fromCharCode(65 + ((i + 1) % 26))}${String.fromCharCode(65 + ((i + 2) % 26))}${String(i + 100).padStart(3, '0')}`,
      vin: `1HGCM82633A${String(i + 400000).padStart(6, '0')}`,
      type: ['truck', 'van', 'trailer', 'bus'][i % 4],
      capacity_weight: 2000 + (i * 500),
      capacity_volume: 100 + (i * 50),
      fuel_type: ['diesel', 'gasoline', 'hybrid'][i % 3],
      status: ['available', 'in_use', 'maintenance', 'out_of_service'][i % 4],
      current_mileage: 25000 + (i * 5000),
      next_service_date: new Date(currentDate.getTime() + ((i + 30) * 24 * 60 * 60 * 1000)),
      insurance_expires: new Date(currentDate.getTime() + ((i + 365) * 24 * 60 * 60 * 1000)),
      notes: `Vehicle maintenance notes for ${i + 1}`,
      created_at: currentDate,
      updated_at: currentDate
    }));

    // Create comprehensive events with relationships
    const events = Array.from({ length: 75 }, (_, i) => {
      const eventDate = new Date(currentDate.getTime() + ((i - 25) * 24 * 60 * 60 * 1000)); // Some past, some future
      const setupDate = new Date(eventDate.getTime() - (4 * 60 * 60 * 1000)); // 4 hours before
      const breakdownDate = new Date(eventDate.getTime() + (6 * 60 * 60 * 1000)); // 6 hours after
      
      return {
        id: `event_${String(i + 1).padStart(3, '0')}`,
        title: `${eventTypes[i % eventTypes.length]} ${i + 1}`,
        description: `This is a comprehensive ${eventTypes[i % eventTypes.length].toLowerCase()} event with full details and relationships to other entities.`,
        event_type: eventTypes[i % eventTypes.length],
        status: eventStatuses[i % eventStatuses.length],
        priority: eventPriorities[i % eventPriorities.length],
        
        // Dates and times
        event_date: eventDate,
        event_time: `${String(14 + (i % 8)).padStart(2, '0')}:${String((i % 4) * 15).padStart(2, '0')}:00`,
        duration_hours: 2 + (i % 6),
        setup_date: setupDate,
        setup_time: `${String(10 + (i % 4)).padStart(2, '0')}:00:00`,
        breakdown_date: breakdownDate,
        breakdown_time: `${String(20 + (i % 4)).padStart(2, '0')}:00:00`,
        
        // Relationships
        venue_id: venues[i % venues.length].id,
        client_contact_id: contacts.filter(c => c.role === 'client')[i % contacts.filter(c => c.role === 'client').length]?.id,
        coordinator_contact_id: contacts.filter(c => c.role === 'coordinator')[i % contacts.filter(c => c.role === 'coordinator').length]?.id,
        
        // Financial
        budget: 5000 + (i * 1000),
        actual_cost: (5000 + (i * 1000)) * (0.8 + (i % 5) * 0.1),
        deposit_amount: (5000 + (i * 1000)) * 0.3,
        deposit_received: i % 3 === 0,
        final_payment_due: new Date(eventDate.getTime() - (7 * 24 * 60 * 60 * 1000)),
        
        // Logistics
        expected_attendance: 50 + (i * 25),
        actual_attendance: i % 2 === 0 ? 50 + (i * 25) + (i % 20) - 10 : null,
        parking_required: i % 3 === 0,
        catering_required: i % 4 === 0,
        av_equipment_required: i % 2 === 0,
        security_required: i % 5 === 0,
        
        // Equipment and resources
        equipment_list: [
          'Sound System', 'Lighting Rig', 'Stage', 'Chairs', 'Tables', 
          'Projector', 'Microphones', 'Speakers', 'Truss', 'Backdrop'
        ].slice(0, (i % 8) + 2),
        
        vehicle_assignments: vehicles.slice(i % 5, (i % 5) + 2).map(v => v.id),
        crew_assignments: contacts.filter(c => c.role === 'crew').slice(i % 3, (i % 3) + 3).map(c => c.id),
        
        // Notes and special requirements
        special_requirements: `Special requirements for event ${i + 1}: ${['Wheelchair accessible', 'Quiet environment', 'Extra security', 'VIP area', 'Live streaming'][i % 5]}`,
        internal_notes: `Internal notes for planning team regarding event ${i + 1}`,
        client_notes: `Client specific requests and preferences for event ${i + 1}`,
        
        // Weather and backup plans
        weather_backup_plan: i % 3 === 0 ? 'Move indoors if rain' : null,
        cancellation_policy: 'Standard 48-hour cancellation policy',
        
        // Completion status
        setup_completed: eventDate < currentDate,
        event_completed: eventDate < currentDate && eventStatuses[i % eventStatuses.length] === 'completed',
        breakdown_completed: eventDate < currentDate,
        
        // System fields
        created_at: currentDate,
        updated_at: currentDate,
        created_by: 'system_migration',
        last_modified_by: 'system_migration'
      };
    });

    return {
      EVENTS: events,
      VENUES: venues,
      CONTACTS: contacts,
      VEHICLES: vehicles
    };
  }
}
