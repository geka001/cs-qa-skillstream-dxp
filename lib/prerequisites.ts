/**
 * Prerequisites and Module Access Logic
 */

import { Module, UserSegment } from '@/types';

/**
 * Check if user can access a module based on prerequisites AND segment
 * For AT_RISK users: Only remedial modules are unlocked until all remedial are complete
 */
export function canAccessModule(
  module: Module,
  completedModules: string[],
  userSegment?: UserSegment,
  allModules?: Module[]
): boolean {
  // Already completed modules are always accessible
  if (completedModules.includes(module.id)) {
    return true;
  }
  
  // AT_RISK segment locking: Only allow remedial modules until all are complete
  if (userSegment === 'AT_RISK' && allModules) {
    const isRemedial = module.category === 'Remedial' || 
                       module.category === 'At-Risk Support' ||
                       (module.targetSegments && module.targetSegments.includes('AT_RISK') && 
                        !module.targetSegments.includes('ROOKIE'));
    
    // If this is NOT a remedial module, check if all remedial are complete
    if (!isRemedial) {
      const remedialModules = allModules.filter(m => 
        m.category === 'Remedial' || 
        m.category === 'At-Risk Support' ||
        (m.targetSegments && m.targetSegments.includes('AT_RISK') && !m.targetSegments.includes('ROOKIE'))
      );
      
      const allRemedialComplete = remedialModules.length === 0 || 
        remedialModules.every(m => completedModules.includes(m.id));
      
      // Lock non-remedial modules until all remedial are complete
      if (!allRemedialComplete) {
        return false;
      }
    }
  }
  
  // No prerequisites means module is accessible (if not blocked by segment)
  if (!module.prerequisites || module.prerequisites.length === 0) {
    return true;
  }
  
  // Check if all prerequisites are completed
  return module.prerequisites.every(prereqId => 
    completedModules.includes(prereqId)
  );
}

/**
 * Check if module is locked due to AT_RISK status (not just prerequisites)
 */
export function isLockedDueToAtRisk(
  module: Module,
  completedModules: string[],
  userSegment: UserSegment,
  allModules: Module[]
): boolean {
  if (userSegment !== 'AT_RISK') return false;
  if (completedModules.includes(module.id)) return false;
  
  const isRemedial = module.category === 'Remedial' || 
                     module.category === 'At-Risk Support' ||
                     (module.targetSegments && module.targetSegments.includes('AT_RISK') && 
                      !module.targetSegments.includes('ROOKIE'));
  
  if (isRemedial) return false; // Remedial modules are not locked
  
  // Check if all remedial modules are complete
  const remedialModules = allModules.filter(m => 
    m.category === 'Remedial' || 
    m.category === 'At-Risk Support' ||
    (m.targetSegments && m.targetSegments.includes('AT_RISK') && !m.targetSegments.includes('ROOKIE'))
  );
  
  return remedialModules.some(m => !completedModules.includes(m.id));
}

/**
 * Get list of unmet prerequisites for a module
 * For AT_RISK users, show remedial modules as prerequisites if applicable
 */
export function getUnmetPrerequisites(
  module: Module,
  completedModules: string[],
  allModules: Module[],
  userSegment?: UserSegment
): Module[] {
  const unmet: Module[] = [];
  
  // For AT_RISK users, if module is locked due to segment, show remedial as prerequisites
  if (userSegment === 'AT_RISK' && isLockedDueToAtRisk(module, completedModules, userSegment, allModules)) {
    const incompleteRemedial = allModules.filter(m => {
      const isRemedial = m.category === 'Remedial' || 
                         m.category === 'At-Risk Support' ||
                         (m.targetSegments && m.targetSegments.includes('AT_RISK') && !m.targetSegments.includes('ROOKIE'));
      return isRemedial && !completedModules.includes(m.id);
    });
    return incompleteRemedial;
  }
  
  // Standard prerequisite check
  if (!module.prerequisites || module.prerequisites.length === 0) {
    return [];
  }
  
  return module.prerequisites
    .filter(prereqId => !completedModules.includes(prereqId))
    .map(prereqId => allModules.find(m => m.id === prereqId))
    .filter(Boolean) as Module[];
}

/**
 * Get next recommended module for user
 * For AT_RISK: Only recommend remedial modules until all are complete
 */
export function getNextRecommendedModule(
  modules: Module[],
  completedModules: string[],
  userSegment?: UserSegment
): Module | null {
  // For AT_RISK users, only recommend remedial modules first
  if (userSegment === 'AT_RISK') {
    const incompleteRemedial = modules.filter(m => {
      const isRemedial = m.category === 'Remedial' || 
                         m.category === 'At-Risk Support' ||
                         (m.targetSegments && m.targetSegments.includes('AT_RISK') && !m.targetSegments.includes('ROOKIE'));
      return isRemedial && !completedModules.includes(m.id);
    }).sort((a, b) => (a.order || 999) - (b.order || 999));
    
    if (incompleteRemedial.length > 0) {
      return incompleteRemedial[0];
    }
  }
  
  // First, check for any unlocked remedial modules that are NOT completed
  const remedialModules = modules.filter(m => {
    const isRemedialCategory = m.category === 'Remedial' || m.category === 'At-Risk Support';
    const isNotCompleted = !completedModules.includes(m.id);
    const canAccess = canAccessModule(m, completedModules, userSegment, modules);
    return isRemedialCategory && isNotCompleted && canAccess;
  });
  
  if (remedialModules.length > 0) {
    return remedialModules.sort((a, b) => (a.order || 999) - (b.order || 999))[0];
  }
  
  // Find first incomplete module where prerequisites are met
  const sortedModules = [...modules].sort((a, b) => (a.order || 999) - (b.order || 999));
  
  return sortedModules.find(module => {
    const isNotCompleted = !completedModules.includes(module.id);
    const canAccess = canAccessModule(module, completedModules, userSegment, modules);
    return isNotCompleted && canAccess;
  }) || null;
}

/**
 * Get modules sorted by order with AT_RISK awareness
 */
export function sortModulesByOrder(
  modules: Module[], 
  completedModules: string[] = [],
  userSegment?: UserSegment
): Module[] {
  return [...modules].sort((a, b) => {
    const aCompleted = completedModules.includes(a.id);
    const bCompleted = completedModules.includes(b.id);
    
    // Completed modules first
    if (aCompleted && !bCompleted) return -1;
    if (!aCompleted && bCompleted) return 1;
    
    // Among incomplete modules
    if (!aCompleted && !bCompleted) {
      // For HIGH_FLYER users, put Challenge Pro modules first (order 0 or has challenge-pro tag)
      if (userSegment === 'HIGH_FLYER') {
        const aIsChallengePro = a.order === 0 || 
                                a.tags?.includes('challenge-pro') ||
                                a.title?.toLowerCase().includes('pro:') ||
                                a.difficulty === 'advanced';
        const bIsChallengePro = b.order === 0 || 
                                b.tags?.includes('challenge-pro') ||
                                b.title?.toLowerCase().includes('pro:') ||
                                b.difficulty === 'advanced';
        
        // Challenge Pro modules appear first for HIGH_FLYER
        if (aIsChallengePro && !bIsChallengePro) return -1;
        if (!aIsChallengePro && bIsChallengePro) return 1;
      }
      
      const aIsRemedial = a.category === 'Remedial' || a.category === 'At-Risk Support';
      const bIsRemedial = b.category === 'Remedial' || b.category === 'At-Risk Support';
      
      // For AT_RISK users, put remedial modules first
      if (userSegment === 'AT_RISK') {
        if (aIsRemedial && !bIsRemedial) return -1;
        if (!aIsRemedial && bIsRemedial) return 1;
      }
      
      // Remedial/at-risk support categories next
      if (aIsRemedial && !bIsRemedial) return -1;
      if (!aIsRemedial && bIsRemedial) return 1;
    }
    
    // Mandatory modules next
    if (a.mandatory && !b.mandatory) return -1;
    if (!a.mandatory && b.mandatory) return 1;
    
    // Then by order
    const orderA = a.order || 999;
    const orderB = b.order || 999;
    if (orderA !== orderB) return orderA - orderB;
    
    // Finally by title
    return a.title.localeCompare(b.title);
  });
}

/**
 * Calculate module progress percentage
 */
export function calculateModuleProgress(
  moduleId: string,
  completedModules: string[],
  moduleProgress?: {
    [moduleId: string]: {
      contentRead: boolean;
      videoWatched: boolean;
    };
  }
): number {
  const progress = {
    content: moduleProgress?.[moduleId]?.contentRead ? 40 : 0,
    video: moduleProgress?.[moduleId]?.videoWatched ? 30 : 0,
    quiz: completedModules.includes(moduleId) ? 30 : 0
  };
  
  return progress.content + progress.video + progress.quiz;
}

/**
 * Get learning path completion percentage
 */
export function getLearningPathCompletion(
  pathModules: Module[],
  completedModules: string[]
): number {
  if (pathModules.length === 0) return 0;
  
  const completed = pathModules.filter(m => 
    completedModules.includes(m.id)
  ).length;
  
  return Math.round((completed / pathModules.length) * 100);
}

/**
 * Check if module is the next recommended one
 */
export function isNextRecommended(
  module: Module,
  modules: Module[],
  completedModules: string[],
  userSegment?: UserSegment
): boolean {
  const nextModule = getNextRecommendedModule(modules, completedModules, userSegment);
  return nextModule?.id === module.id;
}

/**
 * Get accessible modules count for a user segment
 */
export function getAccessibleModulesCount(
  modules: Module[],
  completedModules: string[],
  userSegment: UserSegment
): number {
  return modules.filter(m => 
    canAccessModule(m, completedModules, userSegment, modules) || 
    completedModules.includes(m.id)
  ).length;
}
