/**
 * Manager Authentication Utilities
 * Simple password-based authentication for manager portal
 */

import { Team } from '@/types';

// Manager password from environment variable with fallback
const MANAGER_PASSWORD = process.env.NEXT_PUBLIC_MANAGER_PASSWORD || 'Test@123';

/**
 * Validate manager credentials
 */
export function validateManagerCredentials(team: Team, password: string): boolean {
  return password === MANAGER_PASSWORD;
}

/**
 * Get all users from localStorage for a specific team
 */
export function getUsersFromLocalStorage(team: Team) {
  const allUsers = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    
    if (key && key.startsWith('skillstream_') && key !== 'skillstream_user' && key !== 'skillstream_analytics') {
      try {
        const userData = localStorage.getItem(key);
        if (userData) {
          const user = JSON.parse(userData);
          
          // Filter by team
          if (user.team === team) {
            allUsers.push({
              ...user,
              storageKey: key,
              lastModified: new Date(user.moduleProgress?.[Object.keys(user.moduleProgress || {})[0]]?.lastAccessed || user.joinDate)
            });
          }
        }
      } catch (error) {
        console.error(`Error parsing user data for key: ${key}`, error);
      }
    }
  }
  
  // Sort by last activity (most recent first)
  return allUsers.sort((a, b) => 
    new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
  );
}

/**
 * Calculate team statistics
 * 
 * Note: This function now uses ROOKIE mandatory modules as the baseline for 
 * completion percentage. This is consistent with onboarding requirements.
 * HIGH_FLYER users may have completed more modules than the baseline,
 * which is expected and shows as >100% in some cases.
 */
export function calculateTeamStats(users: any[]) {
  if (users.length === 0) {
    return {
      totalUsers: 0,
      completedOnboarding: 0,
      completionRate: 0,
      atRiskCount: 0,
      atRiskRate: 0,
      rookieCount: 0,
      highFlyerCount: 0,
      averageCompletion: 0,
      averageQuizScore: 0,
      totalTimeSpent: 0,
      totalInterventions: 0,
      usersWithInterventions: 0
    };
  }

  const completedOnboarding = users.filter(u => u.onboardingComplete).length;
  const atRiskUsers = users.filter(u => u.segment === 'AT_RISK');
  const rookieUsers = users.filter(u => u.segment === 'ROOKIE');
  const highFlyerUsers = users.filter(u => u.segment === 'HIGH_FLYER');
  
  // Calculate average completion percentage
  // Use a consistent baseline: count completed modules / total available for their segment
  // For users who completed onboarding, they're at 100%
  // For others, calculate based on mandatory modules completed
  const totalCompletion = users.reduce((sum, user) => {
    // If onboarding is complete, count as 100%
    if (user.onboardingComplete) {
      return sum + 100;
    }
    
    // Use completed modules count as a percentage
    // For users in progress, calculate based on their completion
    const completed = user.completedModules?.length || 0;
    const completedSOPs = user.completedSOPs?.length || 0;
    const exploredTools = user.exploredTools?.length || 0;
    
    // Simplified calculation: 
    // - Module completion: 60% weight (out of ~4 mandatory)
    // - SOP completion: 20% weight (out of ~2 mandatory)
    // - Tools exploration: 20% weight (out of 3 required)
    const moduleProgress = Math.min((completed / 4) * 60, 60);
    const sopProgress = Math.min((completedSOPs / 2) * 20, 20);
    const toolProgress = Math.min((exploredTools / 3) * 20, 20);
    
    return sum + moduleProgress + sopProgress + toolProgress;
  }, 0);
  
  // Calculate average quiz score
  const allScores = users.flatMap(user => Object.values(user.quizScores || {}) as number[]);
  const averageQuizScore = allScores.length > 0
    ? allScores.reduce((a: number, b: number) => a + b, 0) / allScores.length
    : 0;
  
  // Total time spent
  const totalTimeSpent = users.reduce((sum, user) => sum + (user.timeSpent || 0), 0);
  
  // Total interventions (users who went to AT_RISK at some point)
  const totalInterventions = users.reduce((sum, user) => sum + (user.interventionsReceived || 0), 0);
  const usersWithInterventions = users.filter(u => (u.interventionsReceived || 0) > 0).length;

  return {
    totalUsers: users.length,
    completedOnboarding,
    completionRate: (completedOnboarding / users.length) * 100,
    atRiskCount: atRiskUsers.length,
    atRiskRate: (atRiskUsers.length / users.length) * 100,
    rookieCount: rookieUsers.length,
    highFlyerCount: highFlyerUsers.length,
    averageCompletion: totalCompletion / users.length,
    averageQuizScore,
    totalTimeSpent,
    totalInterventions,
    usersWithInterventions
  };
}

/**
 * Format last activity timestamp
 */
export function formatLastActivity(date: Date | string | undefined): string {
  if (!date) return 'Never';
  
  const activityDate = new Date(date);
  
  // Check if date is invalid
  if (isNaN(activityDate.getTime())) {
    return 'Never';
  }
  
  const now = new Date();
  const diffMs = now.getTime() - activityDate.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  
  return activityDate.toLocaleDateString();
}

