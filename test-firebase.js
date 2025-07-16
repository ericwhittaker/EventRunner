const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc } = require('firebase/firestore');
const { getAuth, signInAnonymously } = require('firebase/auth');

const firebaseConfig = {
  apiKey: "AIzaSyBWqKsIyRgjc9spUhLKmbAW8uyFbtHOp7I",
  authDomain: "eventrunner-ca01b.firebaseapp.com",
  projectId: "eventrunner-ca01b",
  storageBucket: "eventrunner-ca01b.firebasestorage.app",
  messagingSenderId: "530362809216",
  appId: "1:530362809216:web:a84b269ffae1d4a3cc1f65",
  measurementId: "G-8EXK86GVK3"
};

async function testFirebase() {
  try {
    console.log('🔧 Initializing Firebase...');
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const auth = getAuth(app);

    console.log('🔐 Attempting anonymous authentication...');
    const userCredential = await signInAnonymously(auth);
    console.log('✅ Anonymous authentication successful:', userCredential.user.uid);

    console.log('📝 Testing Firestore write...');
    const docRef = await addDoc(collection(db, 'test'), {
      message: 'Hello from test script',
      timestamp: new Date()
    });
    console.log('✅ Document written with ID:', docRef.id);

    console.log('🎉 Firebase connection test successful!');
  } catch (error) {
    console.error('❌ Firebase test failed:', error);
  }
}

testFirebase();
