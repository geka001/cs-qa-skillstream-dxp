/**
 * Unified Data Provider
 * Provides content from Contentstack or falls back to mock data
 */

import { Module, SOP, Tool, UserSegment } from '@/types';
import {
  isContentstackConfigured,
  getModulesFromContentstack,
  getSOPsFromContentstack,
  getToolsFromContentstack,
  getPersonalizedContentFromContentstack,
  getPersonalizationConfig as getContentstackPersonalizationConfig,
  getMandatoryModules as getContentstackMandatoryModules,
  getRemedialModules as getContentstackRemedialModules,
  getBonusModules as getContentstackBonusModules,
  getModulesByDifficulty as getContentstackModulesByDifficulty
} from './contentstack';

import {
  mockModules,
  mockSOPs,
  mockTools,
  getPersonalizedContent as getMockPersonalizedContent,
  welcomeMessages,
  atRiskIntervention,
  getMandatoryModules as getMockMandatoryModules,
  getRemedialModules as getMockRemedialModules,
  getBonusModules as getMockBonusModules,
  getModulesByDifficulty as getMockModulesByDifficulty
} from '@/data/mockData';

// Determine data source
const USE_CONTENTSTACK = process.env.NEXT_PUBLIC_USE_CONTENTSTACK === 'true' && isContentstackConfigured();

console.log(`📊 Data Source: ${USE_CONTENTSTACK ? 'Contentstack CMS' : 'Mock Data'}`);

/**
 * Get all modules with optional segment filter
 */
export async function getModules(segment?: UserSegment): Promise<Module[]> {
  if (USE_CONTENTSTACK) {
    return await getModulesFromContentstack(segment);
  }
  
  if (segment) {
    return mockModules.filter(m => m.targetSegments.includes(segment));
  }
  
  return mockModules;
}

/**
 * Get all SOPs with optional segment filter
 */
export async function getSOPs(segment?: UserSegment): Promise<SOP[]> {
  if (USE_CONTENTSTACK) {
    return await getSOPsFromContentstack(segment);
  }
  
  if (segment) {
    return mockSOPs.filter(s => s.targetSegments.includes(segment));
  }
  
  return mockSOPs;
}

/**
 * Get all tools with optional segment filter
 */
export async function getTools(segment?: UserSegment): Promise<Tool[]> {
  if (USE_CONTENTSTACK) {
    return await getToolsFromContentstack(segment);
  }
  
  if (segment) {
    return mockTools.filter(t => t.targetSegments.includes(segment));
  }
  
  return mockTools;
}

/**
 * Get personalized content for a user segment
 */
export async function getPersonalizedContent(segment: UserSegment) {
  if (USE_CONTENTSTACK) {
    return await getPersonalizedContentFromContentstack(segment);
  }
  
  return getMockPersonalizedContent(segment);
}

/**
 * Get personalization configuration for a segment
 */
export async function getPersonalizationConfig(segment: UserSegment) {
  if (USE_CONTENTSTACK) {
    const config = await getContentstackPersonalizationConfig(segment);
    if (config) return config;
  }
  
  // Fallback to mock data
  return {
    welcomeMessage: welcomeMessages[segment],
    interventionConfig: segment === 'AT_RISK' ? atRiskIntervention : null,
    badgeColor: segment === 'ROOKIE' ? '#3B82F6' : segment === 'AT_RISK' ? '#EF4444' : '#10B981',
    description: ''
  };
}

/**
 * Get mandatory modules for a segment
 */
export async function getMandatoryModules(segment: UserSegment): Promise<Module[]> {
  if (USE_CONTENTSTACK) {
    return await getContentstackMandatoryModules(segment);
  }
  
  return getMockMandatoryModules(segment);
}

/**
 * Get remedial modules (for At-Risk users)
 */
export async function getRemedialModules(): Promise<Module[]> {
  if (USE_CONTENTSTACK) {
    return await getContentstackRemedialModules();
  }
  
  return getMockRemedialModules();
}

/**
 * Get high-flyer bonus modules
 */
export async function getBonusModules(): Promise<Module[]> {
  if (USE_CONTENTSTACK) {
    return await getContentstackBonusModules();
  }
  
  return getMockBonusModules();
}

/**
 * Get modules by difficulty level
 */
export async function getModulesByDifficulty(
  difficulty: 'beginner' | 'intermediate' | 'advanced'
): Promise<Module[]> {
  if (USE_CONTENTSTACK) {
    return await getContentstackModulesByDifficulty(difficulty);
  }
  
  return getMockModulesByDifficulty(difficulty);
}

/**
 * Get a single module by ID
 */
export async function getModuleById(moduleId: string): Promise<Module | null> {
  const modules = await getModules();
  return modules.find(m => m.id === moduleId) || null;
}

/**
 * Get a single SOP by ID
 */
export async function getSOPById(sopId: string): Promise<SOP | null> {
  const sops = await getSOPs();
  return sops.find(s => s.id === sopId) || null;
}

/**
 * Get a single tool by ID
 */
export async function getToolById(toolId: string): Promise<Tool | null> {
  const tools = await getTools();
  return tools.find(t => t.id === toolId) || null;
}

/**
 * Get modules by category
 */
export async function getModulesByCategory(category: string): Promise<Module[]> {
  const modules = await getModules();
  return modules.filter(m => m.category === category);
}

/**
 * Get modules by tags
 */
export async function getModulesByTag(tag: string): Promise<Module[]> {
  const modules = await getModules();
  return modules.filter(m => m.tags.includes(tag));
}

/**
 * Search modules by title or content
 */
export async function searchModules(query: string): Promise<Module[]> {
  const modules = await getModules();
  const lowerQuery = query.toLowerCase();
  
  return modules.filter(m => 
    m.title.toLowerCase().includes(lowerQuery) ||
    m.content.toLowerCase().includes(lowerQuery) ||
    m.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Get module categories
 */
export async function getModuleCategories(): Promise<string[]> {
  const modules = await getModules();
  const categories = new Set(modules.map(m => m.category));
  return Array.from(categories).sort();
}

/**
 * Get all tags
 */
export async function getAllTags(): Promise<string[]> {
  const modules = await getModules();
  const tags = new Set<string>();
  modules.forEach(m => m.tags.forEach(tag => tags.add(tag)));
  return Array.from(tags).sort();
}

/**
 * Get data source information
 */
export function getDataSourceInfo() {
  return {
    source: USE_CONTENTSTACK ? 'contentstack' : 'mock',
    configured: isContentstackConfigured(),
    enabled: USE_CONTENTSTACK
  };
}

/**
 * Export for backward compatibility
 */
export const dataProvider = {
  getModules,
  getSOPs,
  getTools,
  getPersonalizedContent,
  getPersonalizationConfig,
  getMandatoryModules,
  getRemedialModules,
  getBonusModules,
  getModulesByDifficulty,
  getModuleById,
  getSOPById,
  getToolById,
  getModulesByCategory,
  getModulesByTag,
  searchModules,
  getModuleCategories,
  getAllTags,
  getDataSourceInfo
};

export default dataProvider;

