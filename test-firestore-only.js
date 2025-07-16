const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyBWqKsIyRgjc9spUhLKmbAW8uyFbtHOp7I",
  authDomain: "eventrunner-ca01b.firebaseapp.com",
  projectId: "eventrunner-ca01b",
  storageBucket: "eventrunner-ca01b.firebasestorage.app",
  messagingSenderId: "530362809216",
  appId: "1:530362809216:web:a84b269ffae1d4a3cc1f65",
  measurementId: "G-8EXK86GVK3"
};

async function testFirestoreOnly() {
  try {
    console.log('🔧 Initializing Firebase...');
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    console.log('📝 Testing Firestore write (no auth)...');
    const docRef = await addDoc(collection(db, 'test'), {
      message: 'Hello from test script (no auth)',
      timestamp: new Date()
    });
    console.log('✅ Document written with ID:', docRef.id);

    console.log('🎉 Firestore connection test successful!');
  } catch (error) {
    console.error('❌ Firestore test failed:', error);
  }
}

testFirestoreOnly();
