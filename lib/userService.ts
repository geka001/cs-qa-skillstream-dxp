/**
 * Client-side service for Contentstack user operations via API routes
 * These functions call Next.js API routes which then call the Contentstack Management API
 */

import { UserProfile, Team } from '@/types';

const API_BASE = '/api/users';

/**
 * Get user by name and team from Contentstack (via API route)
 */
export async function getUserByNameAndTeam(name: string, team: Team): Promise<UserProfile | null> {
  try {
    console.log(`📦 Fetching user from API: ${name}_${team}`);
    
    const response = await fetch(`${API_BASE}?name=${encodeURIComponent(name)}&team=${encodeURIComponent(team)}`);
    
    if (response.status === 404) {
      console.log(`⚠️  User not found: ${name}_${team}`);
      return null;
    }
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch user');
    }
    
    const data = await response.json();
    console.log(`✅ User found: ${name}_${team}`);
    return data.user;
  } catch (error) {
    console.error('❌ Error fetching user:', error);
    return null;
  }
}

/**
 * Create new user in Contentstack (via API route)
 */
export async function createUser(user: UserProfile): Promise<UserProfile> {
  try {
    console.log(`📦 Creating user via API: ${user.name}_${user.team}`);
    
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create user');
    }
    
    const data = await response.json();
    console.log(`✅ User created: ${user.name}_${user.team}`);
    return data.user;
  } catch (error) {
    console.error('❌ Error creating user:', error);
    throw error;
  }
}

/**
 * Update existing user in Contentstack (via API route)
 */
export async function updateUser(name: string, team: Team, updates: Partial<UserProfile>): Promise<void> {
  try {
    console.log(`📦 Updating user via API: ${name}_${team}`);
    
    const response = await fetch(API_BASE, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, team, updates }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update user');
    }
    
    console.log(`✅ User updated: ${name}_${team}`);
  } catch (error) {
    console.error('❌ Error updating user:', error);
    throw error;
  }
}

/**
 * Get all users for a specific team (for manager dashboard)
 */
export async function getUsersByTeam(team: Team): Promise<UserProfile[]> {
  try {
    console.log(`📦 Fetching users for team: ${team}`);
    
    const response = await fetch(`${API_BASE}/team?team=${encodeURIComponent(team)}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch team users');
    }
    
    const data = await response.json();
    console.log(`✅ Found ${data.users.length} users for team ${team}`);
    return data.users;
  } catch (error) {
    console.error(`❌ Error fetching users for team ${team}:`, error);
    return [];
  }
}


