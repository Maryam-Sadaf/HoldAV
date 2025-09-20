import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

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

const app = getApps()[0] ?? initializeApp({
  credential: cert({
    projectId,
    clientEmail,
    privateKey,
  }),
});

export const db = getFirestore(app);


