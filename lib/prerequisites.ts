/**
 * Prerequisites and Module Access Logic
 */

import { Module } from '@/types';

/**
 * Check if user can access a module based on prerequisites
 */
export function canAccessModule(
  module: Module,
  completedModules: string[]
): boolean {
  // Already completed modules are always accessible
  if (completedModules.includes(module.id)) {
    return true;
  }
  
  // No prerequisites means module is always accessible
  if (!module.prerequisites || module.prerequisites.length === 0) {
    return true;
  }
  
  // Check if all prerequisites are completed
  return module.prerequisites.every(prereqId => 
    completedModules.includes(prereqId)
  );
}

/**
 * Get list of unmet prerequisites for a module
 */
export function getUnmetPrerequisites(
  module: Module,
  completedModules: string[],
  allModules: Module[]
): Module[] {
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
 * Prioritizes remedial modules, then follows normal order
 */
export function getNextRecommendedModule(
  modules: Module[],
  completedModules: string[]
): Module | null {
  // First, check for any unlocked remedial modules that are NOT completed
  const remedialModules = modules.filter(m => {
    const isRemedialCategory = m.category === 'Remedial' || m.category === 'At-Risk Support';
    const isNotCompleted = !completedModules.includes(m.id);
    const canAccess = canAccessModule(m, completedModules);
    
    return isRemedialCategory && isNotCompleted && canAccess;
  });
  
  if (remedialModules.length > 0) {
    // Return first remedial module by order
    const recommended = remedialModules.sort((a, b) => (a.order || 999) - (b.order || 999))[0];
    console.log('📌 Recommending remedial module:', recommended.title, recommended.id);
    return recommended;
  }
  
  // If no remedial modules, find first incomplete module where prerequisites are met
  const sortedModules = [...modules].sort((a, b) => (a.order || 999) - (b.order || 999));
  
  const nextModule = sortedModules.find(module => {
    const isNotCompleted = !completedModules.includes(module.id);
    const canAccess = canAccessModule(module, completedModules);
    return isNotCompleted && canAccess;
  });
  
  if (nextModule) {
    console.log('📌 Recommending next module:', nextModule.title, nextModule.id);
  } else {
    console.log('📌 No recommendation available');
  }
  
  return nextModule || null;
}

/**
 * Get modules sorted by order
 * Priority: Completed first, then remedial (unlocked), then locked modules
 */
export function sortModulesByOrder(modules: Module[], completedModules: string[] = []): Module[] {
  return [...modules].sort((a, b) => {
    const aCompleted = completedModules.includes(a.id);
    const bCompleted = completedModules.includes(b.id);
    
    // Completed modules first
    if (aCompleted && !bCompleted) return -1;
    if (!aCompleted && bCompleted) return 1;
    
    // Among incomplete modules: remedial/at-risk support first
    if (!aCompleted && !bCompleted) {
      const aIsRemedial = a.category === 'Remedial' || a.category === 'At-Risk Support';
      const bIsRemedial = b.category === 'Remedial' || b.category === 'At-Risk Support';
      
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
  completedModules: string[]
): boolean {
  const nextModule = getNextRecommendedModule(modules, completedModules);
  return nextModule?.id === module.id;
}

