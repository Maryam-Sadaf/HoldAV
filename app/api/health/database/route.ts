import { NextResponse } from "next/server";
import { checkDatabaseConnection, testDatabaseOperations } from "@/lib/database-health";

export async function GET() {
  try {
    const connectionResult = await checkDatabaseConnection();
    
    if (!connectionResult.isConnected) {
      return NextResponse.json({
        status: 'error',
        message: 'Database connection failed',
        error: connectionResult.error,
        timestamp: new Date().toISOString(),
      }, { status: 500 });
    }

    const operationsResult = await testDatabaseOperations();

    return NextResponse.json({
      status: 'success',
      database: {
        connected: connectionResult.isConnected,
        canRead: operationsResult.canRead,
        canWrite: operationsResult.canWrite,
      },
      errors: operationsResult.errors,
      timestamp: new Date().toISOString(),
      environment: {
        hasFirebaseProjectId: !!process.env.FIREBASE_PROJECT_ID,
        hasFirebaseClientEmail: !!process.env.FIREBASE_CLIENT_EMAIL,
        hasFirebasePrivateKey: !!process.env.FIREBASE_PRIVATE_KEY,
        nodeEnv: process.env.NODE_ENV,
      },
    });

  } catch (error) {
    console.error('Database health check failed:', error);
    
    return NextResponse.json({
      status: 'error',
      message: 'Health check failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
