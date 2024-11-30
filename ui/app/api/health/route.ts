import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Check backend health with timeout
    const backendResponse = await fetch('http://localhost:8002/health', {
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