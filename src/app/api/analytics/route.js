import { NextResponse } from 'next/server';

// Mock analytics storage (in production, use a database)
let analyticsStorage = [];

export async function POST(request) {
  try {
    const body = await request.json();
    const { 
      sessionId,
      eventType,
      data,
      timestamp = Date.now()
    } = body;

    // Validate required fields
    if (!sessionId || !eventType) {
      return NextResponse.json(
        { error: 'SessionId and eventType are required' },
        { status: 400 }
      );
    }

    // Store analytics event
    const analyticsEvent = {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sessionId,
      eventType,
      data,
      timestamp,
      userAgent: request.headers.get('user-agent'),
      ip: request.headers.get('x-forwarded-for') || 'unknown'
    };

    analyticsStorage.push(analyticsEvent);

    // Keep only last 1000 events (prevent memory issues)
    if (analyticsStorage.length > 1000) {
      analyticsStorage = analyticsStorage.slice(-1000);
    }

    return NextResponse.json({
      success: true,
      eventId: analyticsEvent.id
    });

  } catch (error) {
    console.error('Analytics error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'Failed to store analytics data'
      },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const sessionId = url.searchParams.get('sessionId');
    const limit = parseInt(url.searchParams.get('limit') || '100');

    let results = analyticsStorage;

    // Filter by sessionId if provided
    if (sessionId) {
      results = results.filter(event => event.sessionId === sessionId);
    }

    // Limit results
    results = results.slice(-limit);

    // Calculate some basic statistics
    const stats = {
      totalEvents: results.length,
      eventTypes: [...new Set(results.map(e => e.eventType))],
      timeRange: results.length > 0 ? {
        start: Math.min(...results.map(e => e.timestamp)),
        end: Math.max(...results.map(e => e.timestamp))
      } : null
    };

    return NextResponse.json({
      success: true,
      events: results,
      statistics: stats
    });

  } catch (error) {
    console.error('Analytics retrieval error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'Failed to retrieve analytics data'
      },
      { status: 500 }
    );
  }
}