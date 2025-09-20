// Database health check utility
import { db } from './firebaseAdmin';

export async function checkDatabaseConnection(): Promise<{
  isConnected: boolean;
  error?: string;
  details?: any;
}> {
  try {
    // Test Firestore by a simple read/write
    const ref = db.collection('health').doc('_ping');
    await ref.set({ ts: Date.now() }, { merge: true });
    const snap = await ref.get();
    return { isConnected: snap.exists, details: snap.data() };
  } catch (error) {
    console.error('Database connection test failed:', error);
    
    let errorMessage = 'Unknown database error';
    
    if (error instanceof Error) {
      errorMessage = error.message;
      
      // Provide specific guidance based on error type
      if (error.message.includes('Error code 13') || error.message.includes('Unauthorized') || error.message.includes('auth required')) {
        errorMessage = 'MongoDB Atlas authentication failed: The database user lacks proper permissions or credentials are incorrect. Check Database Access settings in MongoDB Atlas.';
      } else if (error.message.includes('command insert not found')) {
        errorMessage = 'MongoDB Atlas connection issue: The database may not be properly configured or the user lacks proper permissions.';
      } else if (error.message.includes('authentication failed')) {
        errorMessage = 'MongoDB Atlas authentication failed: Check username/password in DATABASE_URL.';
      } else if (error.message.includes('network') || error.message.includes('timeout')) {
        errorMessage = 'Network connection to MongoDB Atlas failed: Check your internet connection and whitelist your IP.';
      }
    }

    return {
      isConnected: false,
      error: errorMessage,
      details: error,
    };
  }
}

export async function testDatabaseOperations(): Promise<{
  canRead: boolean;
  canWrite: boolean;
  errors: string[];
}> {
  const errors: string[] = [];
  let canRead = false;
  let canWrite = false;

  try {
    // Test read operation
    await db.collection('users').limit(1).get();
    canRead = true;
  } catch (error) {
    errors.push(`Read test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  try {
    // Test write operation (create and delete a test document)
    const coll = db.collection('health');
    const docRef = await coll.add({ type: 'write-test', ts: Date.now() });
    await coll.doc(docRef.id).delete();
    canWrite = true;
  } catch (error) {
    errors.push(`Write test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  return {
    canRead,
    canWrite,
    errors,
  };
}
