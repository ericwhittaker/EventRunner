// Debug function to check what's in localStorage
export function checkLocalStorage() {
  console.log('=== LocalStorage Debug ===');
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      const value = localStorage.getItem(key);
      console.log(`${key}:`, value);
    }
  }
  
  // Check for common Convex Auth token patterns
  const convexKeys = Object.keys(localStorage).filter(key => 
    key.includes('convex') || 
    key.includes('auth') || 
    key.includes('token') ||
    key.includes('scintillating-mandrill-776')
  );
  
  console.log('Convex-related keys:', convexKeys);
  
  convexKeys.forEach(key => {
    console.log(`${key}:`, localStorage.getItem(key));
  });
}

// Call this from browser console
(window as any).checkLocalStorage = checkLocalStorage;
