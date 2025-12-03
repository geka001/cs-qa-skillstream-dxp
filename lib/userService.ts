/**
 * Client-side service for Contentstack user operations via API routes
 */

import { UserProfile, Team } from '@/types';

const API_BASE = '/api/users';

export async function getUserByNameAndTeam(name: string, team: Team): Promise<UserProfile | null> {
  try {
    const response = await fetch(`${API_BASE}?name=${encodeURIComponent(name)}&team=${encodeURIComponent(team)}`);
    if (response.status === 404) return null;
    if (!response.ok) throw new Error('Failed to fetch user');
    const data = await response.json();
    return data.user;
  } catch (error) {
    return null;
  }
}

export async function createUser(user: UserProfile): Promise<UserProfile> {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create user');
  }
  
  const data = await response.json();
  return data.user;
}

export async function updateUser(name: string, team: Team, updates: Partial<UserProfile>): Promise<void> {
  const response = await fetch(API_BASE, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, team, updates }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update user');
  }
}

export async function getUsersByTeam(team: Team): Promise<UserProfile[]> {
  try {
    const response = await fetch(`${API_BASE}/team?team=${encodeURIComponent(team)}`);
    if (!response.ok) return [];
    const data = await response.json();
    return data.users;
  } catch (error) {
    return [];
  }
}
