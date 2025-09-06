import { NextResponse } from 'next/server';
import { calculateHumanScore, generateSessionId } from '@/lib/securityAnalytics';

export async function POST(request) {
  try {
    const body = await request.json();
    const { analytics, gameType = 'shooter', score = 0 } = body;

    // Validate required data
    if (!analytics) {
      return NextResponse.json(
        { error: 'Analytics data is required' },
        { status: 400 }
      );
    }

    // Perform security analysis
    const humanAnalysis = calculateHumanScore(analytics);
    const sessionId = generateSessionId();

    // Log verification attempt (in production, store in database)
    console.log('Verification attempt:', {
      sessionId,
      gameType,
      score,
      humanScore: humanAnalysis.totalScore,
      isHuman: humanAnalysis.isHuman,
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get('user-agent'),
      ip: request.headers.get('x-forwarded-for') || 'unknown'
    });

    // Return verification result
    return NextResponse.json({
      success: true,
      verification: {
        isHuman: humanAnalysis.isHuman,
        score: humanAnalysis.totalScore,
        confidence: humanAnalysis.confidence,
        recommendation: humanAnalysis.recommendation,
        sessionId,
        timestamp: new Date().toISOString()
      },
      analytics: {
        breakdown: humanAnalysis.breakdown,
        gameData: {
          type: gameType,
          finalScore: score,
          duration: analytics.endTime ? analytics.endTime - analytics.startTime : null,
          shots: analytics.shots || 0,
          hits: analytics.hits || 0,
          accuracy: analytics.shots > 0 ? analytics.hits / analytics.shots : 0
        }
      }
    });

  } catch (error) {
    console.error('Verification error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'Failed to process verification request'
      },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}