import { Injectable, signal } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, orderBy, limit } from 'firebase/firestore';
import { getAuth, signInAnonymously, User } from 'firebase/auth';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private app = initializeApp(environment.firebase);
  private db = getFirestore(this.app);
  private auth = getAuth(this.app);
  
  // Signals for reactive state
  user = signal<User | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  constructor() {
    // For development, we'll skip authentication
    // In production, you should enable proper authentication
    console.log('🔧 Firebase initialized for development (no auth)');
  }

  private async initAuth() {
    try {
      const result = await signInAnonymously(this.auth);
      this.user.set(result.user);
    } catch (error) {
      this.error.set('Failed to initialize authentication');
      console.error('Auth error:', error);
    }
  }

  // Generic Firestore operations with signals
  async addDocument(collectionName: string, data: any) {
    this.loading.set(true);
    this.error.set(null);
    
    try {
      const docRef = await addDoc(collection(this.db, collectionName), data);
      this.loading.set(false);
      return docRef.id;
    } catch (error) {
      this.error.set(`Failed to add document: ${error}`);
      this.loading.set(false);
      throw error;
    }
  }

  async getDocuments(collectionName: string, queryOptions?: any) {
    this.loading.set(true);
    this.error.set(null);
    
    try {
      let q = collection(this.db, collectionName);
      
      if (queryOptions) {
        // Add query filters, ordering, limits etc.
        // q = query(q, where(...), orderBy(...), limit(...));
      }
      
      const querySnapshot = await getDocs(q);
      const documents = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      this.loading.set(false);
      return documents;
    } catch (error) {
      this.error.set(`Failed to get documents: ${error}`);
      this.loading.set(false);
      throw error;
    }
  }

  // Get all documents from a collection
  async getCollection(collectionName: string): Promise<any[]> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const querySnapshot = await getDocs(collection(this.db, collectionName));
      const documents = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      return documents;
    } catch (error) {
      this.error.set(`Failed to get collection: ${error}`);
      throw error;
    } finally {
      this.loading.set(false);
    }
  }

  async updateDocument(collectionName: string, id: string, data: any) {
    this.loading.set(true);
    this.error.set(null);
    
    try {
      const docRef = doc(this.db, collectionName, id);
      await updateDoc(docRef, data);
      this.loading.set(false);
    } catch (error) {
      this.error.set(`Failed to update document: ${error}`);
      this.loading.set(false);
      throw error;
    }
  }

  async deleteDocument(collectionName: string, id: string) {
    this.loading.set(true);
    this.error.set(null);
    
    try {
      const docRef = doc(this.db, collectionName, id);
      await deleteDoc(docRef);
      this.loading.set(false);
    } catch (error) {
      this.error.set(`Failed to delete document: ${error}`);
      this.loading.set(false);
      throw error;
    }
  }

  async deleteCollection(collectionName: string) {
    this.loading.set(true);
    this.error.set(null);
    
    try {
      const collectionRef = collection(this.db, collectionName);
      const snapshot = await getDocs(collectionRef);
      
      // Delete all documents in the collection
      const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      
      this.loading.set(false);
      return snapshot.size; // Return the number of documents deleted
    } catch (error) {
      this.error.set(`Failed to delete collection: ${error}`);
      this.loading.set(false);
      throw error;
    }
  }
}
