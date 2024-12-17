import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || (
  process.env.NODE_ENV === 'production' 
    ? 'https://your-production-backend.com'  // Replace with your actual production URL
    : 'http://localhost:8009'
);

// Add deployment environment logging
console.log('Environment:', {
  NODE_ENV: process.env.NODE_ENV,
  BACKEND_URL,
  deploymentEnv: process.env.DEPLOYMENT_ENV || 'local'
});

export async function GET() {
  try {
   
    const backendResponse = await fetch(`${BACKEND_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Add timeout of 5 seconds
      signal: AbortSignal.timeout(5000)
    });

    if (!backendResponse.ok) {
      return NextResponse.json(
        { 
          status: 'unhealthy',
          frontend: 'healthy',
          backend: 'unhealthy',
          message: `Backend health check failed: ${backendResponse.status}`
        },
        { status: 503 }
      );
    }

    // If we reach here, both frontend and backend are healthy
    return NextResponse.json(
      { 
        status: 'healthy',
        frontend: 'healthy',
        backend: 'healthy',
        timestamp: new Date().toISOString()
      },
      { status: 200 }
    );
  } catch (error) {
    // More specific error handling
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const isTimeoutError = error instanceof DOMException && error.name === 'TimeoutError';

    return NextResponse.json(
      { 
        status: 'unhealthy',
        frontend: 'healthy',
        backend: 'unhealthy',
        message: isTimeoutError ? 'Backend health check timed out' : 'Health check failed',
        error: errorMessage
      },
      { status: 503 }
    );
  }
} 