import { Injectable, inject, signal, effect } from '@angular/core';
import { 
  Firestore, 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot,
  DocumentData,
  QueryConstraint,
  CollectionReference,
  DocumentReference,
  WriteBatch,
  writeBatch,
  Unsubscribe
} from 'firebase/firestore';
import { FIRESTORE } from '../providers/firebase.provider';

export interface FirestoreQueryOptions {
  where?: { field: string; operator: any; value: any }[];
  orderBy?: { field: string; direction?: 'asc' | 'desc' }[];
  limit?: number;
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private firestore = inject(FIRESTORE);
  
  // Signal-based real-time data storage
  private dataSignals = new Map<string, ReturnType<typeof signal<any[]>>>();
  private unsubscribers = new Map<string, Unsubscribe>();

  constructor() {
    console.log('🔥 Firebase Service initialized with modern SDK + Signals');
  }

  // =====================
  // DOCUMENT OPERATIONS
  // =====================

  /**
   * Add a new document to a collection
   */
  async addDocument(collectionName: string, data: any): Promise<string> {
    try {
      const collectionRef = collection(this.firestore, collectionName);
      const docRef = await addDoc(collectionRef, {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log(`✅ Document added to ${collectionName}:`, docRef.id);
      return docRef.id;
    } catch (error) {
      console.error(`❌ Error adding document to ${collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Get a single document by ID
   */
  async getDocument(collectionName: string, docId: string): Promise<any | null> {
    try {
      const docRef = doc(this.firestore, collectionName, docId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        console.log(`📭 Document ${docId} not found in ${collectionName}`);
        return null;
      }
    } catch (error) {
      console.error(`❌ Error getting document ${docId} from ${collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Update a document
   */
  async updateDocument(collectionName: string, docId: string, data: any): Promise<void> {
    try {
      const docRef = doc(this.firestore, collectionName, docId);
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date()
      });
      console.log(`✅ Document ${docId} updated in ${collectionName}`);
    } catch (error) {
      console.error(`❌ Error updating document ${docId} in ${collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Delete a document
   */
  async deleteDocument(collectionName: string, docId: string): Promise<void> {
    try {
      const docRef = doc(this.firestore, collectionName, docId);
      await deleteDoc(docRef);
      console.log(`✅ Document ${docId} deleted from ${collectionName}`);
    } catch (error) {
      console.error(`❌ Error deleting document ${docId} from ${collectionName}:`, error);
      throw error;
    }
  }

  // =====================
  // COLLECTION OPERATIONS
  // =====================

  /**
   * Get all documents from a collection with optional query
   */
  async getCollection(collectionName: string, options?: FirestoreQueryOptions): Promise<any[]> {
    try {
      const collectionRef = collection(this.firestore, collectionName);
      const constraints = this.buildQueryConstraints(options);
      const q = query(collectionRef, ...constraints);
      
      const querySnapshot = await getDocs(q);
      const documents = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      console.log(`📋 Retrieved ${documents.length} documents from ${collectionName}`);
      return documents;
    } catch (error) {
      console.error(`❌ Error getting collection ${collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Delete entire collection (batch operation)
   */
  async deleteCollection(collectionName: string): Promise<number> {
    try {
      const collectionRef = collection(this.firestore, collectionName);
      const snapshot = await getDocs(collectionRef);
      
      if (snapshot.empty) {
        console.log(`📭 Collection ${collectionName} is already empty`);
        return 0;
      }

      // Batch delete in chunks of 500 (Firestore limit)
      const batchSize = 500;
      let deletedCount = 0;
      
      for (let i = 0; i < snapshot.docs.length; i += batchSize) {
        const batch = writeBatch(this.firestore);
        const chunk = snapshot.docs.slice(i, i + batchSize);
        
        chunk.forEach(doc => {
          batch.delete(doc.ref);
        });
        
        await batch.commit();
        deletedCount += chunk.length;
        console.log(`🗑️ Deleted ${chunk.length} documents from ${collectionName} (${deletedCount}/${snapshot.docs.length})`);
      }
      
      console.log(`✅ Successfully deleted ${deletedCount} documents from ${collectionName}`);
      return deletedCount;
    } catch (error) {
      console.error(`❌ Error deleting collection ${collectionName}:`, error);
      throw error;
    }
  }

  // =====================
  // REAL-TIME LISTENERS (Signal-based)
  // =====================

  /**
   * Get or create a signal for real-time collection data
   */
  getCollectionSignal(collectionName: string, options?: FirestoreQueryOptions): ReturnType<typeof signal<any[]>> {
    // Return existing signal if already created
    if (this.dataSignals.has(collectionName)) {
      return this.dataSignals.get(collectionName)!;
    }

    // Create new signal
    const dataSignal = signal<any[]>([]);
    this.dataSignals.set(collectionName, dataSignal);

    // Set up Firebase real-time listener
    this.startRealtimeListener(collectionName, dataSignal, options);
    
    console.log(`📡 Created signal for ${collectionName}`);
    return dataSignal;
  }

  /**
   * Start real-time listener for a collection (private helper)
   */
  private startRealtimeListener(
    collectionName: string, 
    dataSignal: ReturnType<typeof signal<any[]>>, 
    options?: FirestoreQueryOptions
  ): void {
    try {
      const collectionRef = collection(this.firestore, collectionName);
      const constraints = this.buildQueryConstraints(options);
      const q = query(collectionRef, ...constraints);

      const unsubscribe = onSnapshot(q, 
        (snapshot) => {
          const documents = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          
          // Update the signal - this triggers reactivity throughout the app
          dataSignal.set(documents);
          console.log(`🔄 Signal updated for ${collectionName}: ${documents.length} documents`);
        },
        (error) => {
          console.error(`❌ Real-time listener error for ${collectionName}:`, error);
          // Signal stays with current data on error
        }
      );

      this.unsubscribers.set(collectionName, unsubscribe);
      console.log(`👂 Started real-time listener for ${collectionName}`);
      
    } catch (error) {
      console.error(`❌ Error setting up listener for ${collectionName}:`, error);
    }
  }

  /**
   * Stop listening to a collection and clean up signal
   */
  stopListening(collectionName: string): void {
    const unsubscribe = this.unsubscribers.get(collectionName);
    if (unsubscribe) {
      unsubscribe();
      this.unsubscribers.delete(collectionName);
      console.log(`🔇 Stopped listening to ${collectionName}`);
    }

    // Remove the signal
    this.dataSignals.delete(collectionName);
  }

  /**
   * Stop all listeners and clean up all signals
   */
  stopAllListeners(): void {
    this.unsubscribers.forEach((unsubscribe, collectionName) => {
      unsubscribe();
      console.log(`🔇 Stopped listening to ${collectionName}`);
    });
    
    this.unsubscribers.clear();
    this.dataSignals.clear();
    console.log('🔇 All listeners stopped and signals cleaned up');
  }

  /**
   * Get current data from signal (read-only)
   */
  getSignalData(collectionName: string): any[] {
    const dataSignal = this.dataSignals.get(collectionName);
    return dataSignal ? dataSignal() : [];
  }

  // =====================
  // BATCH OPERATIONS
  // =====================

  /**
   * Batch write operations
   */
  async batchWrite(operations: { type: 'add' | 'update' | 'delete'; collection: string; id?: string; data?: any }[]): Promise<void> {
    try {
      const batch = writeBatch(this.firestore);
      
      operations.forEach(op => {
        switch (op.type) {
          case 'add':
            const newDocRef = doc(collection(this.firestore, op.collection));
            batch.set(newDocRef, { ...op.data, createdAt: new Date(), updatedAt: new Date() });
            break;
          case 'update':
            if (op.id) {
              const updateDocRef = doc(this.firestore, op.collection, op.id);
              batch.update(updateDocRef, { ...op.data, updatedAt: new Date() });
            }
            break;
          case 'delete':
            if (op.id) {
              const deleteDocRef = doc(this.firestore, op.collection, op.id);
              batch.delete(deleteDocRef);
            }
            break;
        }
      });
      
      await batch.commit();
      console.log(`✅ Batch operation completed: ${operations.length} operations`);
    } catch (error) {
      console.error(`❌ Batch operation failed:`, error);
      throw error;
    }
  }

  // =====================
  // HELPER METHODS
  // =====================

  private buildQueryConstraints(options?: FirestoreQueryOptions): QueryConstraint[] {
    const constraints: QueryConstraint[] = [];
    
    if (options?.where) {
      options.where.forEach(w => {
        constraints.push(where(w.field, w.operator, w.value));
      });
    }
    
    if (options?.orderBy) {
      options.orderBy.forEach(o => {
        constraints.push(orderBy(o.field, o.direction || 'asc'));
      });
    }
    
    if (options?.limit) {
      constraints.push(limit(options.limit));
    }
    
    return constraints;
  }

  /**
   * Cleanup on service destroy
   */
  ngOnDestroy(): void {
    this.stopAllListeners();
  }
}
