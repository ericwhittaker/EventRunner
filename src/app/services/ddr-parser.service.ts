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
      // Fetch the DDR XML file from assets
      const response = await fetch(filePath);
      const xmlText = await response.text();
      
      // Parse the XML
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
      
      return this.parseXMLDocument(xmlDoc);
    } catch (error) {
      console.error('Error parsing DDR file:', error);
      throw error;
    }
  }
  
  private parseXMLDocument(xmlDoc: Document): DDRData {
    const tables: { [tableName: string]: DDRTable } = {};
    const relationships: any[] = [];
    
    // Get all BaseTable elements
    const baseTableElements = xmlDoc.querySelectorAll('BaseTable');
    
    baseTableElements.forEach(tableElement => {
      const table = this.parseBaseTable(tableElement);
      if (table) {
        tables[table.name] = table;
      }
    });
    
    // Parse relationships (we'll add this later if needed)
    const relationshipElements = xmlDoc.querySelectorAll('Relationship');
    relationshipElements.forEach(relElement => {
      // Parse relationships if needed
    });
    
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
    
    // Parse field definitions
    const fieldElements = tableElement.querySelectorAll('FieldCatalog > Field');
    fieldElements.forEach(fieldElement => {
      const field = this.parseField(fieldElement);
      if (field) {
        fields.push(field);
      }
    });
    
    // Parse actual data records
    const recordElements = tableElement.querySelectorAll('RecordCatalog > Record');
    recordElements.forEach(recordElement => {
      const record = this.parseRecord(recordElement, fields);
      if (record) {
        data.push(record);
      }
    });
    
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
}
