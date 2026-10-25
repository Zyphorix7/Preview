/**
 * AUREVIA — Firebase Initialization & Data Layer
 * File: firebase-config.js
 * 
 * Provides production-ready Firebase Authentication & Cloud Firestore integration.
 * In environments where live Firebase project credentials have not yet been configured,
 * it operates in a seamless, resilient local-persistence mode while logging configuration guidance.
 */

// Global configuration object (populated from environment, window, or placeholder)
const config = window.AUREVIA_FIREBASE_CONFIG || {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

let app = null;
let auth = null;
let db = null;
let isConfigured = false;

// Check if valid credentials exist
if (config && config.apiKey && config.projectId && config.apiKey !== "PASTE_YOUR_API_KEY_HERE") {
  try {
    const { initializeApp, getApps, getApp } = await import('https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js');
    const { getAuth } = await import('https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js');
    const { getFirestore } = await import('https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js');

    app = getApps().length === 0 ? initializeApp(config) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    isConfigured = true;
    console.info('[Aurevia Firebase] Connected successfully to project:', config.projectId);
  } catch (err) {
    console.warn('[Aurevia Firebase] Live initialization error, operating in resilient local mode:', err.message);
    isConfigured = false;
  }
} else {
  console.info('[Aurevia Firebase] Credentials not supplied in .env. Running in resilient local fallback mode. See .env.example to connect live Firebase.');
}

/**
 * Returns whether live Firebase is connected
 */
export function isLiveFirebase() {
  return isConfigured;
}

/**
 * Returns Firestore instance or null
 */
export function getDb() {
  return db;
}

/**
 * Returns Auth instance or null
 */
export function getAuthInstance() {
  return auth;
}

/* ==========================================================================
   AUTHENTICATION API (Live + Resilient Fallback)
   ========================================================================== */

const LOCAL_USER_KEY = 'aurevia_current_user';
const LOCAL_USERS_DB = 'aurevia_registered_users';

function getLocalUsers() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_USERS_DB) || '[]');
  } catch {
    return [];
  }
}

function saveLocalUsers(users) {
  try {
    localStorage.setItem(LOCAL_USERS_DB, JSON.stringify(users));
  } catch (e) {
    console.warn('LocalStorage save failed:', e);
  }
}

/**
 * Register a customer
 */
export async function registerCustomer(email, password, displayName = '') {
  if (isConfigured && auth) {
    const { createUserWithEmailAndPassword, updateProfile } = await import('https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js');
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      await updateProfile(userCredential.user, { displayName });
    }
    // Also save user profile record in Firestore
    if (db) {
      const { doc, setDoc, serverTimestamp } = await import('https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js');
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email,
        displayName: displayName || email.split('@')[0],
        role: 'customer',
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp()
      }, { merge: true });
    }
    return {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      displayName: userCredential.user.displayName || displayName
    };
  }

  // Local fallback
  const users = getLocalUsers();
  const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    throw new Error('An account with this email already exists.');
  }

  const newUser = {
    uid: 'usr_' + Date.now().toString(36),
    email,
    displayName: displayName || email.split('@')[0],
    role: 'customer',
    createdAt: new Date().toISOString()
  };
  users.push({ ...newUser, passwordHash: btoa(password) });
  saveLocalUsers(users);
  localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(newUser));
  window.dispatchEvent(new CustomEvent('auth-state-changed', { detail: { user: newUser } }));
  return newUser;
}

/**
 * Log in a customer
 */
export async function loginCustomer(email, password) {
  if (isConfigured && auth) {
    const { signInWithEmailAndPassword } = await import('https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js');
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      displayName: userCredential.user.displayName
    };
  }

  // Local fallback
  const users = getLocalUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.passwordHash === btoa(password));
  if (!user) {
    throw new Error('Invalid email or password.');
  }
  const sessionUser = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    role: user.role
  };
  localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(sessionUser));
  window.dispatchEvent(new CustomEvent('auth-state-changed', { detail: { user: sessionUser } }));
  return sessionUser;
}

/**
 * Log out
 */
export async function logoutCustomer() {
  if (isConfigured && auth) {
    const { signOut } = await import('https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js');
    await signOut(auth);
  }
  localStorage.removeItem(LOCAL_USER_KEY);
  window.dispatchEvent(new CustomEvent('auth-state-changed', { detail: { user: null } }));
}

/**
 * Get currently authenticated user
 */
export function getCurrentCustomer() {
  if (isConfigured && auth && auth.currentUser) {
    return {
      uid: auth.currentUser.uid,
      email: auth.currentUser.email,
      displayName: auth.currentUser.displayName
    };
  }
  try {
    const saved = localStorage.getItem(LOCAL_USER_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

/**
 * Listen to auth state transitions
 */
export function subscribeToAuth(callback) {
  if (isConfigured && auth) {
    import('https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js').then(({ onAuthStateChanged }) => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          callback({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName
          });
        } else {
          callback(null);
        }
      });
    });
  }

  // Also support custom event for local fallback
  window.addEventListener('auth-state-changed', (e) => {
    callback(e.detail.user);
  });
}

/* ==========================================================================
   FIRESTORE ORDERS & DATA API
   ========================================================================== */

const LOCAL_ORDERS_KEY = 'aurevia_orders_v1';
const LOCAL_WISHLIST_KEY = 'aurevia_wishlist_v1';

/**
 * Save an order to Firestore (or local persistent storage)
 */
export async function saveOrder(orderData) {
  const user = getCurrentCustomer();
  const orderRecord = {
    ...orderData,
    userId: user ? user.uid : 'guest',
    customerEmail: orderData.customerEmail || (user ? user.email : 'guest@aurevia.com'),
    createdAt: new Date().toISOString(),
    status: 'confirmed'
  };

  if (isConfigured && db) {
    try {
      const { collection, addDoc, serverTimestamp } = await import('https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js');
      const docRef = await addDoc(collection(db, 'orders'), {
        ...orderRecord,
        timestamp: serverTimestamp()
      });
      orderRecord.id = docRef.id;
      return orderRecord;
    } catch (err) {
      console.warn('[Aurevia Firestore] Order save to cloud failed, storing locally:', err);
    }
  }

  // Local fallback
  try {
    const orders = JSON.parse(localStorage.getItem(LOCAL_ORDERS_KEY) || '[]');
    orderRecord.id = orderRecord.id || ('AUR-' + Math.floor(100000 + Math.random() * 900000));
    orders.unshift(orderRecord);
    localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(orders));
    return orderRecord;
  } catch {
    return orderRecord;
  }
}

/**
 * Retrieve user's order history
 */
export async function fetchUserOrders() {
  const user = getCurrentCustomer();
  if (isConfigured && db && user) {
    try {
      const { collection, query, where, getDocs, orderBy } = await import('https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js');
      const q = query(
        collection(db, 'orders'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      const cloudOrders = [];
      snapshot.forEach(doc => cloudOrders.push({ id: doc.id, ...doc.data() }));
      return cloudOrders;
    } catch (err) {
      console.warn('[Aurevia Firestore] Cloud order fetch failed, falling back to local orders:', err);
    }
  }

  // Local fallback
  try {
    const orders = JSON.parse(localStorage.getItem(LOCAL_ORDERS_KEY) || '[]');
    if (user) {
      return orders.filter(o => o.userId === user.uid || o.customerEmail === user.email);
    }
    return orders;
  } catch {
    return [];
  }
}

/**
 * Wishlist management
 */
export function getWishlist() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_WISHLIST_KEY) || '[]');
  } catch {
    return [];
  }
}

export function toggleWishlistItem(productId) {
  const current = getWishlist();
  const index = current.indexOf(productId);
  let updated;
  if (index >= 0) {
    updated = current.filter(id => id !== productId);
  } else {
    updated = [...current, productId];
  }
  try {
    localStorage.setItem(LOCAL_WISHLIST_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('wishlist-updated', { detail: { wishlist: updated } }));
  } catch (e) {
    console.warn('Wishlist save error:', e);
  }
  return updated;
}
