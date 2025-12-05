import { NextRequest, NextResponse } from 'next/server';
import { getUserByNameAndTeam, createUser, updateUser } from '@/lib/contentstackUser';
import { UserProfile } from '@/types';

// Force dynamic rendering - this route uses request.url
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');
    const team = searchParams.get('team');

    if (!name || !team) {
      return NextResponse.json({ error: 'Name and team are required' }, { status: 400 });
    }

    const user = await getUserByNameAndTeam(name, team as any);
    if (!user) {
      return NextResponse.json({ user: null }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch user' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const user: UserProfile = body.user;

    if (!user || !user.name || !user.team) {
      return NextResponse.json({ error: 'Valid user object with name and team is required' }, { status: 400 });
    }

    await createUser(user);
    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create user' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, team, updates } = body;

    if (!name || !team || !updates) {
      return NextResponse.json({ error: 'Name, team, and updates are required' }, { status: 400 });
    }

    await updateUser(name, team, updates);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update user' }, { status: 500 });
  }
}
