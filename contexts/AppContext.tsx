'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useRef, useCallback } from 'react';
import { UserProfile, UserSegment, AnalyticsData } from '@/types';
import { notifyManager } from '@/lib/managerConfig';
import { toast } from 'sonner';
import { getUserByNameAndTeam, createUser, updateUser } from '@/lib/userService';
import { calculateOnboardingRequirements } from '@/lib/onboarding';
import OnboardingCompleteModal from '@/components/modals/OnboardingCompleteModal';
import { setPersonalizeAttributes, initializePersonalize, trackEvent } from '@/lib/personalize';
import { clearVariantAliasCache } from '@/lib/contentstack';
import { notifyOnboardingComplete, notifyQuizFailure, notifyAtRiskRecovery } from '@/lib/slackNotifications';
import { getPersonalizedContent } from '@/data/mockData';

interface AppContextType {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => Promise<void>;
  analytics: AnalyticsData;
  updateAnalytics: (data: Partial<AnalyticsData>) => void;
  completeModule: (moduleId: string, score: number) => void;
  updateSegment: (segment: UserSegment) => void;
  resetProfile: () => void;
  isLoggedIn: boolean;
  isLoading: boolean;
  markContentRead: (moduleId: string) => void;
  markVideoWatched: (moduleId: string) => void;
  markSOPComplete: (sopId: string) => void;
  markToolExplored: (toolId: string) => void;
  checkOnboardingCompletion: () => void;
  showOnboardingModal: boolean;
  setShowOnboardingModal: (show: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    // Return a safe default during initial render to prevent errors
    return {
      user: null,
      setUser: async () => {},
      analytics: { moduleCompletion: 0, averageQuizScore: 0, timeSpent: 0, lastActivity: '', segmentHistory: [] },
      updateAnalytics: () => {},
      completeModule: () => {},
      updateSegment: () => {},
      resetProfile: () => {},
      isLoggedIn: false,
      isLoading: true,
      markContentRead: () => {},
      markVideoWatched: () => {},
      markSOPComplete: () => {},
      markToolExplored: () => {},
      checkOnboardingCompletion: () => {},
      showOnboardingModal: false,
      setShowOnboardingModal: () => {},
    } as AppContextType;
  }
  return context;
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<UserProfile | null>(null);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    moduleCompletion: 0,
    averageQuizScore: 0,
    timeSpent: 0,
    lastActivity: new Date().toISOString(),
    segmentHistory: []
  });

  // Debounce timer for auto-save
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Debounced save to Contentstack (2 seconds after last change)
  const debouncedSave = useCallback((updatedUser: UserProfile) => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }

    saveTimerRef.current = setTimeout(async () => {
      try {
        await updateUser(updatedUser.name, updatedUser.team, updatedUser);
      } catch (error) {
        console.error('Failed to save user:', error);
      }
    }, 2000); // 2 second debounce
  }, []);

  // Initialize Personalize SDK on app load (non-blocking)
  useEffect(() => {
    initializePersonalize().catch(() => {
      // Silent fail - don't block app if SDK fails
    });
  }, []);

  // Remove localStorage save effects (now using Contentstack)
  // Analytics are derived from user data, no separate storage needed

  const setUser = async (newUser: UserProfile | null) => {
    if (!newUser) {
      setUserState(null);
      return;
    }

    setIsLoading(true);
    try {
      // Check if user exists in Contentstack
      const existingUser = await getUserByNameAndTeam(newUser.name, newUser.team);
      
      if (existingUser) {
        // Pre-populate cache by fetching personalized content
        const { getPersonalizedContentAsync } = await import('@/data/mockData');
        await getPersonalizedContentAsync('ROOKIE', existingUser.completedModules, existingUser.team);
        
        // Check if AT_RISK user should be promoted back to ROOKIE
        let userToSet = existingUser;
        if (existingUser.segment === 'AT_RISK') {
          // Get all AT_RISK content (includes both AT_RISK and ROOKIE modules)
          const atRiskContent = await getPersonalizedContentAsync('AT_RISK', existingUser.completedModules, existingUser.team);
          
          // Find remedial/at-risk support modules
          const remedialModules = atRiskContent.modules.filter((m: any) => 
            m.category === 'Remedial' || 
            m.category === 'At-Risk Support' ||
            m.targetSegments?.includes('AT_RISK')
          );
          
          // Calculate average score
          const scores = Object.values(existingUser.quizScores as Record<string, number>);
          const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
          
          // Conditions to promote back to ROOKIE:
          // 1. All mandatory modules for AT_RISK are completed
          // 2. Average quiz score is >= 70%
          const mandatoryModules = atRiskContent.modules.filter((m: any) => m.mandatory);
          const allMandatoryComplete = mandatoryModules.every((m: any) => 
            existingUser.completedModules.includes(m.id)
          );
          
          // If remedial modules exist, they must also be completed
          const allRemedialComplete = remedialModules.length === 0 || remedialModules.every((m: any) => 
            existingUser.completedModules.includes(m.id)
          );
          
          const hasPassingScore = avgScore >= 70;
          
          console.log('AT_RISK check:', {
            mandatoryModules: mandatoryModules.length,
            allMandatoryComplete,
            remedialModules: remedialModules.length,
            allRemedialComplete,
            avgScore,
            hasPassingScore
          });
          
          if (allMandatoryComplete && allRemedialComplete && hasPassingScore) {
            // Promote back to ROOKIE
            userToSet = {
              ...existingUser,
              segment: 'ROOKIE' as UserSegment,
              segmentHistory: [
                ...(existingUser.segmentHistory || []),
                { segment: 'ROOKIE' as UserSegment, date: new Date().toISOString() }
              ]
            };
            // Save the updated segment to Contentstack
            await updateUser(userToSet.name, userToSet.team, userToSet);
            // Re-populate cache with ROOKIE content for the promoted user
            await getPersonalizedContentAsync('ROOKIE', userToSet.completedModules, userToSet.team);
            toast.success('🎉 Great progress! You\'re back on track!', {
              description: 'You\'ve completed all required modules.'
            });
            
            // Send Slack notification for AT_RISK recovery
            notifyAtRiskRecovery({
              userName: userToSet.name,
              userTeam: userToSet.team,
              recoveryDate: new Date().toISOString(),
              totalInterventions: userToSet.interventionsReceived || 1
            });
          }
        }
        
        // Load existing user from Contentstack
        setUserState(userToSet);
        
        // IMPORTANT: Set Personalize attributes BEFORE fetching content
        // This ensures variant aliases are available when fetching modules
        if (userToSet.team) {
          clearVariantAliasCache();
          await setPersonalizeAttributes({
            QA_LEVEL: userToSet.segment,
            TEAM_NAME: userToSet.team
          });
          // Small delay to allow SDK to process attributes
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        // Pre-populate cache for the user's current segment (after attributes are set)
        await getPersonalizedContentAsync(userToSet.segment, userToSet.completedModules, userToSet.team);
        
        // Check onboarding completion for returning user (after cache is populated)
        setTimeout(() => checkOnboardingCompletionForUser(userToSet), 100);
        
        // Calculate proper analytics using onboarding requirements
        const onboardingReqs = calculateOnboardingRequirements(userToSet);
        const scores = Object.values(userToSet.quizScores);
        const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
        setAnalytics({
          moduleCompletion: onboardingReqs.overallPercentage,
          averageQuizScore: avgScore,
          timeSpent: userToSet.timeSpent,
          lastActivity: new Date().toISOString(),
          segmentHistory: userToSet.segmentHistory || []
        });
      } else {
        // Create new user in Contentstack
        await createUser(newUser);
        setUserState(newUser);
        
        // IMPORTANT: Set Personalize attributes BEFORE fetching content
        if (newUser.team) {
          clearVariantAliasCache();
          await setPersonalizeAttributes({
            QA_LEVEL: newUser.segment,
            TEAM_NAME: newUser.team
          });
        }
        
        // Pre-populate cache for new user (after attributes are set)
        const { getPersonalizedContentAsync } = await import('@/data/mockData');
        await getPersonalizedContentAsync('ROOKIE', [], newUser.team);
        
        setAnalytics({
          moduleCompletion: 0,
          averageQuizScore: 0,
          timeSpent: 0,
          lastActivity: new Date().toISOString(),
          segmentHistory: [{ segment: newUser.segment, date: new Date().toISOString() }]
        });
      }
    } catch (error) {
      console.error('Error in setUser:', error);
      // Fallback: set user locally even if Contentstack fails
      setUserState(newUser);
    } finally {
      setIsLoading(false);
    }
  };

  // Update analytics when user data changes
  useEffect(() => {
    if (user) {
      const onboardingReqs = calculateOnboardingRequirements(user);
      const scores = Object.values(user.quizScores);
      const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
      
      setAnalytics({
        moduleCompletion: onboardingReqs.overallPercentage,
        averageQuizScore: avgScore,
        timeSpent: user.timeSpent,
        lastActivity: user.lastActivity || new Date().toISOString(),
        segmentHistory: user.segmentHistory || []
      });
    }
  }, [user]);

  // Refresh Contentstack cache when segment changes
  useEffect(() => {
    const refreshCacheForSegment = async () => {
      if (user && user.team) {
        const { getPersonalizedContentAsync } = await import('@/data/mockData');
        await getPersonalizedContentAsync(user.segment, user.completedModules, user.team);
      }
    };
    
    refreshCacheForSegment();
  }, [user?.segment, user?.team]);

  const updateAnalytics = (data: Partial<AnalyticsData>) => {
    setAnalytics(prev => ({
      ...prev,
      ...data,
      lastActivity: new Date().toISOString()
    }));
  };

  const completeModule = (moduleId: string, score: number) => {
    if (!user) return;

    const updatedUser = {
      ...user,
      completedModules: [...new Set([...user.completedModules, moduleId])],
      quizScores: { ...user.quizScores, [moduleId]: score },
      timeSpent: user.timeSpent + 30 // Add 30 minutes
    };

    // Calculate completion percentage using onboarding requirements (matches onboarding progress)
    const onboardingReqs = calculateOnboardingRequirements(updatedUser);
    const completionPercentage = onboardingReqs.overallPercentage;

    // Calculate average quiz score
    const scores = Object.values(updatedUser.quizScores);
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;

    setUserState(updatedUser);
    debouncedSave(updatedUser); // Auto-save to Contentstack
    
    updateAnalytics({
      moduleCompletion: completionPercentage,
      averageQuizScore: avgScore,
      timeSpent: updatedUser.timeSpent
    });
    
    // Track Personalize events for analytics
    trackEvent('module_complete', { moduleId, score });
    
    // Track quiz pass/fail based on score
    if (score >= 70) {
      trackEvent('quiz_pass', { moduleId, score });
    } else if (score < 50) {
      trackEvent('quiz_fail', { moduleId, score });
      
      // Send Slack notification for quiz failure
      // Get module title from cache/mockData
      const content = getPersonalizedContent(user.segment, user.completedModules, user.team);
      const failedModule = content.modules.find((m: any) => m.id === moduleId);
      
      notifyQuizFailure({
        userName: user.name,
        userTeam: user.team,
        moduleTitle: failedModule?.title || moduleId,
        score: Math.round(score)
      });
    }
    
    // Check onboarding completion with updatedUser (not from state)
    checkOnboardingCompletionForUser(updatedUser);

    // Auto-update segment based on performance
    // AT_RISK flow only applies to ROOKIE users (not HIGH_FLYER)
    if (score < 50 && updatedUser.segment === 'ROOKIE') {
      updateSegment('AT_RISK');
    } else if (score >= 70 && updatedUser.segment === 'AT_RISK') {
      // Check if all AT_RISK/remedial modules are completed - if so, promote back to ROOKIE
      const content = getPersonalizedContent('AT_RISK', updatedUser.completedModules, user.team);
      
      // Find all remedial/AT_RISK specific modules
      const remedialModules = content.modules.filter((m: any) => 
        m.category === 'Remedial' || 
        m.category === 'At-Risk Support' ||
        (m.targetSegments && m.targetSegments.includes('AT_RISK') && !m.targetSegments.includes('ROOKIE'))
      );
      
      // Find all mandatory modules for AT_RISK
      const mandatoryModules = content.modules.filter((m: any) => m.mandatory);
      
      // Check completion
      const allRemedialComplete = remedialModules.length === 0 || remedialModules.every((m: any) => 
        updatedUser.completedModules.includes(m.id)
      );
      const allMandatoryComplete = mandatoryModules.every((m: any) => 
        updatedUser.completedModules.includes(m.id)
      );
      
      // Calculate average score
      const allScores = Object.values(updatedUser.quizScores as Record<string, number>);
      const avgScore = allScores.length > 0 ? allScores.reduce((a, b) => a + b, 0) / allScores.length : 0;
      
      if ((allRemedialComplete || allMandatoryComplete) && avgScore >= 70) {
        // User has completed all required modules with passing score
        updateSegment('ROOKIE');
        toast.success('🎉 Great progress! You\'re back on track!', {
          description: 'You\'ve completed all required modules. Keep up the good work!'
        });
        
        // Send Slack notification for AT_RISK recovery
        notifyAtRiskRecovery({
          userName: updatedUser.name,
          userTeam: updatedUser.team,
          recoveryDate: new Date().toISOString(),
          totalInterventions: updatedUser.interventionsReceived || 1
        });
      }
    } else if (score >= 90 && updatedUser.onboardingComplete && updatedUser.segment !== 'HIGH_FLYER') {
      // Only allow HIGH_FLYER after onboarding is complete
      updateSegment('HIGH_FLYER');
    }
  };

  const updateSegment = async (segment: UserSegment) => {
    if (!user) return;

    const previousSegment = user.segment;
    const updatedUser = {
      ...user,
      segment,
      interventionsReceived: segment === 'AT_RISK' ? user.interventionsReceived + 1 : user.interventionsReceived
    };

    setUserState(updatedUser);
    debouncedSave(updatedUser); // Auto-save to Contentstack
    
    setAnalytics(prev => ({
      ...prev,
      segmentHistory: [
        ...prev.segmentHistory,
        { segment, date: new Date().toISOString() }
      ]
    }));

    // Send manager notification when user becomes AT_RISK
    if (segment === 'AT_RISK' && previousSegment !== 'AT_RISK' && user.team) {
      notifyManager(user.team, 'at_risk', user.name);
      toast.error('Your manager has been notified about your learning progress.');
    }
    
    // Update Personalize attributes FIRST when segment changes
    // This ensures variant aliases are available when content is re-fetched
    if (user.team) {
      clearVariantAliasCache();
      await setPersonalizeAttributes({
        QA_LEVEL: segment,
        TEAM_NAME: user.team
      });
      // Small delay to allow SDK to process attributes
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  };

  const resetProfile = () => {
    if (!user) return;

    const resetUser: UserProfile = {
      ...user,
      segment: 'ROOKIE',
      completedModules: [],
      quizScores: {},
      timeSpent: 0,
      interventionsReceived: 0,
      joinDate: new Date().toISOString(),
      moduleProgress: {},
      completedSOPs: [],
      exploredTools: [],
      onboardingComplete: false,
      onboardingCompletedDate: undefined
    };

    setUserState(resetUser);
    setAnalytics({
      moduleCompletion: 0,
      averageQuizScore: 0,
      timeSpent: 0,
      lastActivity: new Date().toISOString(),
      segmentHistory: [{ segment: 'ROOKIE', date: new Date().toISOString() }]
    });
  };

  const markContentRead = (moduleId: string) => {
    if (!user) return;

    const updatedUser = {
      ...user,
      moduleProgress: {
        ...user.moduleProgress,
        [moduleId]: {
          contentRead: true,
          videoWatched: user.moduleProgress?.[moduleId]?.videoWatched || false,
          lastAccessed: new Date().toISOString(),
          timeSpentOnModule: user.moduleProgress?.[moduleId]?.timeSpentOnModule
        }
      }
    };

    setUserState(updatedUser);
    debouncedSave(updatedUser); // Auto-save to Contentstack
  };

  const markVideoWatched = (moduleId: string) => {
    if (!user) return;

    const updatedUser = {
      ...user,
      moduleProgress: {
        ...user.moduleProgress,
        [moduleId]: {
          contentRead: user.moduleProgress?.[moduleId]?.contentRead || false,
          videoWatched: true,
          lastAccessed: new Date().toISOString(),
          timeSpentOnModule: user.moduleProgress?.[moduleId]?.timeSpentOnModule
        }
      }
    };

    setUserState(updatedUser);
    debouncedSave(updatedUser); // Auto-save to Contentstack
  };

  const markSOPComplete = (sopId: string) => {
    if (!user) return;

    // Ensure completedSOPs array exists
    const completedSOPs = user.completedSOPs || [];
    
    const updatedUser = {
      ...user,
      completedSOPs: [...new Set([...completedSOPs, sopId])],
      lastActivity: new Date().toISOString()
    };
    
    setUserState(updatedUser);
    debouncedSave(updatedUser); // Auto-save to Contentstack
    checkOnboardingCompletionForUser(updatedUser);
  };

  const markToolExplored = (toolId: string) => {
    if (!user) return;

    // Ensure exploredTools array exists
    const exploredTools = user.exploredTools || [];
    
    const updatedUser = {
      ...user,
      exploredTools: [...new Set([...exploredTools, toolId])]
    };

    setUserState(updatedUser);
    debouncedSave(updatedUser); // Auto-save to Contentstack
    checkOnboardingCompletionForUser(updatedUser);
  };

  const checkOnboardingCompletion = () => {
    if (!user || user.onboardingComplete) return;
    checkOnboardingCompletionForUser(user);
  };

  const checkOnboardingCompletionForUser = (currentUser: UserProfile) => {
    if (!currentUser || currentUser.onboardingComplete) return;

    // Get personalized content for user's segment
    const { modules: allModules, sops: allSOPs } = getPersonalizedContent(currentUser.segment, currentUser.completedModules, currentUser.team);
    
    // Define requirements
    const mandatoryModules = allModules.filter((m: any) => m.mandatory);
    const mandatorySOPs = allSOPs.filter((s: any) => s.mandatory);
    const requiredTools = 3; // Minimum tools to explore
    
    // Calculate completion
    const modulesComplete = mandatoryModules.every((m: any) => currentUser.completedModules.includes(m.id));
    const sopsComplete = mandatorySOPs.every((s: any) => (currentUser.completedSOPs || []).includes(s.id));
    const toolsComplete = (currentUser.exploredTools || []).length >= requiredTools;
    
    // Calculate average score
    const scores = Object.values(currentUser.quizScores);
    const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
    const scorePass = avgScore >= 70;
    
    const notAtRisk = currentUser.segment !== 'AT_RISK';
    
    // Check if all requirements met
    if (modulesComplete && sopsComplete && toolsComplete && scorePass && notAtRisk) {
      const updatedUser = {
        ...currentUser,
        onboardingComplete: true,
        onboardingCompletedDate: new Date().toISOString(),
        segment: 'HIGH_FLYER' as UserSegment, // Auto-promote to HIGH_FLYER
        segmentHistory: [
          ...(currentUser.segmentHistory || []),
          { segment: 'HIGH_FLYER' as UserSegment, date: new Date().toISOString() }
        ]
      };
      
      setUserState(updatedUser);
      debouncedSave(updatedUser); // Auto-save to Contentstack
      
      // Track onboarding_complete event for Personalize analytics
      trackEvent('onboarding_complete', { 
        team: currentUser.team, 
        avgScore: Math.round(avgScore) 
      });
      
      // Show modal instead of toast
      setShowOnboardingModal(true);

      // Send manager notification about onboarding completion
      if (currentUser.team) {
        notifyManager(currentUser.team, 'onboarding_complete', currentUser.name);
        toast.success('🎉 Onboarding complete! You\'re now a High-Flyer!');
      }
      
      // Send Slack notification for onboarding completion
      notifyOnboardingComplete({
        userName: currentUser.name,
        userTeam: currentUser.team,
        avgScore: Math.round(avgScore),
        completionDate: new Date().toISOString()
      });
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        analytics,
        updateAnalytics,
        completeModule,
        updateSegment,
        resetProfile,
        isLoggedIn: !!user,
        isLoading,
        markContentRead,
        markVideoWatched,
        markSOPComplete,
        markToolExplored,
        checkOnboardingCompletion,
        showOnboardingModal,
        setShowOnboardingModal
      }}
    >
      {children}
      {showOnboardingModal && user && (
        <OnboardingCompleteModal
          isOpen={showOnboardingModal}
          userName={user.name}
          userTeam={user.team}
          completionDate={user.onboardingCompletedDate || new Date().toISOString()}
          onClose={() => setShowOnboardingModal(false)}
        />
      )}
    </AppContext.Provider>
  );
};

