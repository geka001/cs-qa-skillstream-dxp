/**
 * Onboarding Requirements and Completion Logic
 */

import { UserProfile, OnboardingRequirements } from '@/types';
import { getPersonalizedContent } from '@/data/mockData';

/**
 * Calculate onboarding requirements and progress
 */
export function calculateOnboardingRequirements(user: UserProfile): OnboardingRequirements {
  // IMPORTANT: Onboarding always counts ROOKIE mandatory content FOR USER'S TEAM
  // Even if user is now HIGH_FLYER, we check if they completed ROOKIE onboarding
  const { modules: rookieModules, sops: rookieSOPs } = getPersonalizedContent('ROOKIE', user.completedModules, user.team);
  
  // Define what's required for ROOKIE onboarding
  const mandatoryModules = rookieModules.filter(m => m.mandatory);
  const mandatorySOPs = rookieSOPs.filter(s => s.mandatory);
  const requiredToolsCount = 3; // Minimum tools to explore
  
  // Safety check: ensure arrays exist (for backwards compatibility)
  const completedSOPs = user.completedSOPs || [];
  const exploredTools = user.exploredTools || [];
  
  // Calculate completed counts
  const completedMandatoryModules = user.completedModules.filter(id => 
    mandatoryModules.some(m => m.id === id)
  ).length;
  
  const completedMandatorySOPs = completedSOPs.filter(id =>
    mandatorySOPs.some(s => s.id === id)
  ).length;
  
  // Calculate average score
  const scores = Object.values(user.quizScores);
  const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
  const requiredScore = 70;
  
  // Calculate percentages
  const modulesPercentage = mandatoryModules.length > 0
    ? (completedMandatoryModules / mandatoryModules.length) * 100
    : 0;
    
  const sopsPercentage = mandatorySOPs.length > 0
    ? (completedMandatorySOPs / mandatorySOPs.length) * 100
    : 0;
    
  const toolsPercentage = Math.min((exploredTools.length / requiredToolsCount) * 100, 100);
  
  // Check individual requirements
  const modulesComplete = completedMandatoryModules >= mandatoryModules.length;
  const sopsComplete = completedMandatorySOPs >= mandatorySOPs.length;
  const toolsComplete = exploredTools.length >= requiredToolsCount;
  const scorePass = avgScore >= requiredScore;
  const notAtRisk = user.segment !== 'AT_RISK';
  
  // Overall completion
  const overallComplete = modulesComplete && sopsComplete && toolsComplete && scorePass && notAtRisk;
  
  // Calculate overall percentage (weighted average)
  const overallPercentage = (
    (modulesPercentage * 0.5) +  // Modules are 50% of onboarding
    (sopsPercentage * 0.25) +    // SOPs are 25%
    (toolsPercentage * 0.15) +   // Tools are 15%
    (scorePass ? 10 : 0)         // Score is 10%
  );
  
  return {
    modules: {
      required: mandatoryModules.length,
      completed: completedMandatoryModules,
      percentage: Math.round(modulesPercentage)
    },
    sops: {
      required: mandatorySOPs.length,
      completed: completedMandatorySOPs,
      percentage: Math.round(sopsPercentage)
    },
    tools: {
      required: requiredToolsCount,
      completed: Math.min(exploredTools.length, requiredToolsCount), // Cap at required count
      percentage: Math.round(Math.min(toolsPercentage, 100))
    },
    averageScore: {
      required: requiredScore,
      current: Math.round(avgScore),
      passing: scorePass
    },
    notAtRisk,
    overallComplete,
    overallPercentage: Math.round(Math.min(overallPercentage, 100))
  };
}

/**
 * Check if user has completed onboarding
 */
export function isOnboardingComplete(user: UserProfile): boolean {
  if (user.onboardingComplete) return true;
  
  const requirements = calculateOnboardingRequirements(user);
  return requirements.overallComplete;
}

/**
 * Get onboarding status message
 */
export function getOnboardingStatusMessage(requirements: OnboardingRequirements): string {
  if (requirements.overallComplete) {
    return '🎉 Onboarding Complete! You\'re ready to join the team.';
  }
  
  const remaining: string[] = [];
  
  if (requirements.modules.completed < requirements.modules.required) {
    remaining.push(`${requirements.modules.required - requirements.modules.completed} module(s)`);
  }
  
  if (requirements.sops.completed < requirements.sops.required) {
    remaining.push(`${requirements.sops.required - requirements.sops.completed} SOP(s)`);
  }
  
  if (requirements.tools.completed < requirements.tools.required) {
    remaining.push(`${requirements.tools.required - requirements.tools.completed} tool(s)`);
  }
  
  if (!requirements.averageScore.passing) {
    remaining.push('improve quiz scores');
  }
  
  if (!requirements.notAtRisk) {
    remaining.push('complete remedial modules');
  }
  
  if (remaining.length === 0) {
    return '✨ Almost there! Just a few more steps...';
  }
  
  return `Complete: ${remaining.join(', ')}`;
}

/**
 * Get next onboarding step
 */
export function getNextOnboardingStep(user: UserProfile): string {
  const requirements = calculateOnboardingRequirements(user);
  
  if (!requirements.notAtRisk) {
    return 'Complete all remedial modules to get back on track';
  }
  
  if (requirements.modules.completed < requirements.modules.required) {
    return 'Complete mandatory learning modules';
  }
  
  if (requirements.sops.completed < requirements.sops.required) {
    return 'Review mandatory SOPs';
  }
  
  if (requirements.tools.completed < requirements.tools.required) {
    return 'Explore essential QA tools';
  }
  
  if (!requirements.averageScore.passing) {
    return 'Improve your quiz scores (target: 70%+)';
  }
  
  return 'You\'re all set! 🎉';
}

