import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

let dbInstance: Firestore | null = null;
let appInstance: ReturnType<typeof initializeApp> | null = null;

function initializeFirebase() {
  // Return existing instance if already initialized
  if (appInstance && dbInstance) {
    return dbInstance;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  // Support base64-encoded private key as a fallback (safer for env storage)
  if (!privateKey && process.env.FIREBASE_PRIVATE_KEY_BASE64) {
    try {
      privateKey = Buffer.from(process.env.FIREBASE_PRIVATE_KEY_BASE64, 'base64').toString('utf8');
    } catch {}
  }

  if (privateKey) {
    // Remove surrounding quotes if present
    if ((privateKey.startsWith('"') && privateKey.endsWith('"')) || (privateKey.startsWith("'") && privateKey.endsWith("'"))) {
      privateKey = privateKey.slice(1, -1);
    }
    // Convert escaped \n to real newlines
    privateKey = privateKey.replace(/\\n/g, '\n');
  }

  if (!projectId || !clientEmail || !privateKey) {
    const missing = [
      !projectId ? 'FIREBASE_PROJECT_ID' : null,
      !clientEmail ? 'FIREBASE_CLIENT_EMAIL' : null,
      !privateKey ? 'FIREBASE_PRIVATE_KEY or FIREBASE_PRIVATE_KEY_BASE64' : null,
    ].filter(Boolean).join(', ');
    throw new Error(`Missing Firebase credentials. Please set: ${missing}`);
  }

  appInstance = getApps()[0] ?? initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });

  dbInstance = getFirestore(appInstance);
  return dbInstance;
}

// Lazy initialization - only initialize when db is actually accessed
export const db = new Proxy({} as Firestore, {
  get(_target, prop) {
    const db = initializeFirebase();
    const value = (db as any)[prop];
    if (typeof value === 'function') {
      return value.bind(db);
    }
    return value;
  },
});


