import { NextRequest, NextResponse } from 'next/server';
import { getUsersByTeam } from '@/lib/contentstackUser';

// Force dynamic rendering - this route uses request.url
export const dynamic = 'force-dynamic';

// GET: Fetch all users for a team
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const team = searchParams.get('team');

    if (!team) {
      return NextResponse.json(
        { error: 'Team is required' },
        { status: 400 }
      );
    }

    const users = await getUsersByTeam(team as any);
    return NextResponse.json({ users });
  } catch (error: any) {
    console.error('Error fetching team users:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch team users' },
      { status: 500 }
    );
  }
}


