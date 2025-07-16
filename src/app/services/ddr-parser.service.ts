import { Injectable } from '@angular/core';

export interface DDRField {
  id: string;
  name: string;
  dataType: string;
  fieldType: string;
  comment?: string;
}

export interface DDRTable {
  id: string;
  name: string;
  records: number;
  fields: DDRField[];
  data: any[];
}

export interface DDRData {
  tables: { [tableName: string]: DDRTable };
  relationships: any[];
}

@Injectable({
  providedIn: 'root'
})
export class DDRParserService {
  
  async parseDDRFile(filePath: string): Promise<DDRData> {
    try {
      console.log('Attempting to fetch DDR file from:', filePath);
      
      // Fetch the DDR XML file from assets
      const response = await fetch(filePath);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch DDR file: ${response.status} ${response.statusText}`);
      }
      
      // Get the response as an ArrayBuffer to handle different encodings
      const arrayBuffer = await response.arrayBuffer();
      
      // Check if it's UTF-16 by looking for BOM
      const uint8Array = new Uint8Array(arrayBuffer);
      let xmlText: string;
      
      // Check for UTF-16 LE BOM (FF FE)
      if (uint8Array[0] === 0xFF && uint8Array[1] === 0xFE) {
        console.log('Detected UTF-16 LE encoding');
        // Use TextDecoder to handle UTF-16 LE
        const decoder = new TextDecoder('utf-16le');
        xmlText = decoder.decode(arrayBuffer);
      }
      // Check for UTF-16 BE BOM (FE FF)
      else if (uint8Array[0] === 0xFE && uint8Array[1] === 0xFF) {
        console.log('Detected UTF-16 BE encoding');
        // Use TextDecoder to handle UTF-16 BE
        const decoder = new TextDecoder('utf-16be');
        xmlText = decoder.decode(arrayBuffer);
      }
      // Default to UTF-8
      else {
        console.log('Using UTF-8 encoding');
        const decoder = new TextDecoder('utf-8');
        xmlText = decoder.decode(arrayBuffer);
      }
      
      console.log('Fetched XML length:', xmlText.length);
      console.log('XML starts with:', xmlText.substring(0, 500));
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      // Parse the XML
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
      
      // Check for parsing errors
      const parserError = xmlDoc.querySelector('parsererror');
      if (parserError) {
        console.error('XML parsing error:', parserError.textContent);
        throw new Error(`XML parsing error: ${parserError.textContent}`);
      }
      
      console.log('XML parsed successfully, root element:', xmlDoc.documentElement.tagName);
      
      return this.parseXMLDocument(xmlDoc);
    } catch (error) {
      console.error('Error parsing DDR file:', error);
      throw error;
    }
  }
  
  private parseXMLDocument(xmlDoc: Document): DDRData {
    const tables: { [tableName: string]: DDRTable } = {};
    const relationships: any[] = [];
    
    console.log('Parsing XML document, root element:', xmlDoc.documentElement.tagName);
    
    // Get all BaseTable elements
    const baseTableElements = xmlDoc.querySelectorAll('BaseTable');
    console.log('Found BaseTable elements:', baseTableElements.length);
    
    baseTableElements.forEach((tableElement, index) => {
      const tableName = tableElement.getAttribute('name') || '';
      const tableRecords = tableElement.getAttribute('records') || '0';
      console.log(`BaseTable ${index + 1}: name="${tableName}", records="${tableRecords}"`);
      
      const table = this.parseBaseTable(tableElement);
      if (table) {
        tables[table.name] = table;
        console.log(`Successfully parsed table: ${table.name} with ${table.fields.length} fields and ${table.data.length} data records`);
      }
    });
    
    // Parse relationships (we'll add this later if needed)
    const relationshipElements = xmlDoc.querySelectorAll('Relationship');
    relationshipElements.forEach(relElement => {
      // Parse relationships if needed
    });
    
    console.log('Final parsed tables:', Object.keys(tables));
    return { tables, relationships };
  }
  
  private parseBaseTable(tableElement: Element): DDRTable | null {
    const id = tableElement.getAttribute('id') || '';
    const name = tableElement.getAttribute('name') || '';
    const records = parseInt(tableElement.getAttribute('records') || '0');
    
    // Only parse tables we care about
    const tablesToParse = ['EVENTS', 'CONTACTS', 'VEHICLES', 'VENUES'];
    if (!tablesToParse.includes(name)) {
      return null;
    }
    
    console.log(`Parsing table: ${name} with ${records} records`);
    
    const fields: DDRField[] = [];
    const data: any[] = [];
    
    // Parse field definitions from FieldCatalog
    const fieldElements = tableElement.querySelectorAll('FieldCatalog > Field');
    console.log(`Found ${fieldElements.length} field elements for ${name}`);
    
    fieldElements.forEach(fieldElement => {
      const field = this.parseField(fieldElement);
      if (field) {
        fields.push(field);
        console.log(`  Field: ${field.name} (${field.dataType})`);
      }
    });
    
    // Since DDR doesn't contain actual data, generate sample data based on field definitions
    // Use the record count from the DDR to generate that many sample records
    const sampleCount = Math.min(records, 100); // Limit to 100 sample records for performance
    
    for (let i = 0; i < sampleCount; i++) {
      const sampleRecord = this.generateSampleRecord(fields, i, name);
      if (sampleRecord) {
        data.push(sampleRecord);
      }
    }
    
    console.log(`Generated ${data.length} sample records for ${name}`);
    
    return {
      id,
      name,
      records,
      fields,
      data
    };
  }
  
  private parseField(fieldElement: Element): DDRField | null {
    const id = fieldElement.getAttribute('id') || '';
    const name = fieldElement.getAttribute('name') || '';
    const dataType = fieldElement.getAttribute('dataType') || '';
    const fieldType = fieldElement.getAttribute('fieldType') || '';
    
    const commentElement = fieldElement.querySelector('Comment');
    const comment = commentElement?.textContent || '';
    
    return {
      id,
      name,
      dataType,
      fieldType,
      comment
    };
  }
  
  private parseRecord(recordElement: Element, fields: DDRField[]): any {
    const record: any = {};
    
    const dataElements = recordElement.querySelectorAll('Data');
    dataElements.forEach((dataElement, index) => {
      if (index < fields.length) {
        const field = fields[index];
        const value = this.parseDataValue(dataElement, field.dataType);
        record[field.name] = value;
      }
    });
    
    return record;
  }
  
  private parseDataValue(dataElement: Element, dataType: string): any {
    const textContent = dataElement.textContent || '';
    
    switch (dataType) {
      case 'Number':
        return textContent ? parseFloat(textContent) : null;
      case 'Date':
        return textContent ? new Date(textContent) : null;
      case 'Time':
        return textContent || null;
      case 'Timestamp':
        return textContent ? new Date(textContent) : null;
      case 'Text':
      default:
        return textContent || null;
    }
  }
  
  private generateSampleRecord(fields: DDRField[], index: number, tableName: string): any {
    const record: any = {};
    
    fields.forEach(field => {
      const value = this.generateSampleValue(field, index, tableName);
      if (value !== null) {
        record[field.name] = value;
      }
    });
    
    return record;
  }
  
  private generateSampleValue(field: DDRField, index: number, tableName: string): any {
    const fieldName = field.name.toLowerCase();
    
    // Handle primary keys
    if (fieldName.includes('pk') || fieldName.includes('id')) {
      return `${tableName.toLowerCase()}_${index + 1}`;
    }
    
    // Handle specific field patterns based on name
    if (fieldName.includes('name') || fieldName.includes('title')) {
      return `Sample ${tableName} ${index + 1}`;
    }
    
    if (fieldName.includes('email')) {
      return `user${index + 1}@example.com`;
    }
    
    if (fieldName.includes('phone')) {
      return `555-${String(index + 1).padStart(3, '0')}-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`;
    }
    
    if (fieldName.includes('address')) {
      return `${100 + index} Main St`;
    }
    
    if (fieldName.includes('city')) {
      const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia'];
      return cities[index % cities.length];
    }
    
    if (fieldName.includes('state')) {
      const states = ['NY', 'CA', 'IL', 'TX', 'AZ', 'PA'];
      return states[index % states.length];
    }
    
    if (fieldName.includes('zip')) {
      return `${10000 + index}`;
    }
    
    if (fieldName.includes('date')) {
      const baseDate = new Date('2024-01-01');
      baseDate.setDate(baseDate.getDate() + index);
      return baseDate.toISOString().split('T')[0];
    }
    
    if (fieldName.includes('time')) {
      const hour = (9 + (index % 12)).toString().padStart(2, '0');
      const minute = ((index * 15) % 60).toString().padStart(2, '0');
      return `${hour}:${minute}:00`;
    }
    
    if (fieldName.includes('price') || fieldName.includes('cost') || fieldName.includes('budget')) {
      return (100 + (index * 50));
    }
    
    if (fieldName.includes('capacity') || fieldName.includes('count')) {
      return (10 + (index * 5));
    }
    
    if (fieldName.includes('status')) {
      const statuses = ['active', 'inactive', 'pending', 'completed'];
      return statuses[index % statuses.length];
    }
    
    if (fieldName.includes('type')) {
      const types = ['standard', 'premium', 'basic', 'deluxe'];
      return types[index % types.length];
    }
    
    // Handle by data type
    switch (field.dataType) {
      case 'Number':
        return index + 1;
      case 'Date':
        const date = new Date('2024-01-01');
        date.setDate(date.getDate() + index);
        return date.toISOString().split('T')[0];
      case 'Time':
        return `${(9 + (index % 12)).toString().padStart(2, '0')}:00:00`;
      case 'Timestamp':
        const timestamp = new Date('2024-01-01');
        timestamp.setDate(timestamp.getDate() + index);
        return timestamp.toISOString();
      case 'Text':
      default:
        return `Sample text ${index + 1}`;
    }
  }
}
