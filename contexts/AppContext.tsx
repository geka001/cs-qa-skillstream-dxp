'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useRef, useCallback } from 'react';
import { UserProfile, UserSegment, AnalyticsData } from '@/types';
import { notifyManager } from '@/lib/managerConfig';
import { toast } from 'sonner';
import { getUserByNameAndTeam, createUser, updateUser } from '@/lib/userService';
import { calculateOnboardingRequirements } from '@/lib/onboarding';
import OnboardingCompleteModal from '@/components/modals/OnboardingCompleteModal';
import { setPersonalizeAttributes, initializePersonalize, trackEvent } from '@/lib/personalize';

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
    throw new Error('useApp must be used within AppProvider');
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
        console.log('💾 Auto-saving user to Contentstack...');
        await updateUser(updatedUser.name, updatedUser.team, updatedUser);
        console.log('✅ User saved to Contentstack');
      } catch (error) {
        console.error('❌ Failed to save user to Contentstack:', error);
      }
    }, 2000); // 2 second debounce
  }, []);

  // Initialize Personalize SDK on app load
  useEffect(() => {
    // Initialize Personalize SDK for analytics tracking
    initializePersonalize().then((success) => {
      if (success) {
        console.log('📊 Personalize SDK ready for analytics');
      }
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
        // Load existing user from Contentstack
        console.log('✅ Loaded existing user from Contentstack');
        setUserState(existingUser);
        
        // Pre-populate cache by fetching personalized content
        // This ensures calculateOnboardingRequirements has data available
        const { getPersonalizedContentAsync } = await import('@/data/mockData');
        await getPersonalizedContentAsync('ROOKIE', existingUser.completedModules, existingUser.team);
        console.log('✅ Cache pre-populated for onboarding calculations');
        
        // Calculate proper analytics using onboarding requirements
        const onboardingReqs = calculateOnboardingRequirements(existingUser);
        const scores = Object.values(existingUser.quizScores);
        const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
        setAnalytics({
          moduleCompletion: onboardingReqs.overallPercentage,
          averageQuizScore: avgScore,
          timeSpent: existingUser.timeSpent,
          lastActivity: new Date().toISOString(),
          segmentHistory: existingUser.segmentHistory || []
        });
        
        // Send user attributes to Personalize for analytics tracking
        if (existingUser.team) {
          setPersonalizeAttributes({
            QA_LEVEL: existingUser.segment,
            TEAM_NAME: existingUser.team
          });
        }
      } else {
        // Create new user in Contentstack
        console.log('✨ Creating new user in Contentstack');
        await createUser(newUser);
        setUserState(newUser);
        
        // Pre-populate cache for new user too
        const { getPersonalizedContentAsync } = await import('@/data/mockData');
        await getPersonalizedContentAsync('ROOKIE', [], newUser.team);
        console.log('✅ Cache pre-populated for new user');
        
        setAnalytics({
          moduleCompletion: 0,
          averageQuizScore: 0,
          timeSpent: 0,
          lastActivity: new Date().toISOString(),
          segmentHistory: [{ segment: newUser.segment, date: new Date().toISOString() }]
        });
        
        // Send user attributes to Personalize for analytics tracking
        if (newUser.team) {
          setPersonalizeAttributes({
            QA_LEVEL: newUser.segment,
            TEAM_NAME: newUser.team
          });
        }
      }
    } catch (error) {
      console.error('❌ Error in setUser:', error);
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
        console.log(`🔄 Segment changed to ${user.segment}, refreshing Contentstack cache...`);
        const { getPersonalizedContentAsync } = await import('@/data/mockData');
        await getPersonalizedContentAsync(user.segment, user.completedModules, user.team);
        console.log(`✅ Cache refreshed for ${user.segment}`);
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
    }
    
    // Check onboarding completion with updatedUser (not from state)
    checkOnboardingCompletionForUser(updatedUser);

    // Auto-update segment based on performance
    // AT_RISK flow only applies to ROOKIE users (not HIGH_FLYER)
    if (score < 50 && updatedUser.segment === 'ROOKIE') {
      updateSegment('AT_RISK');
    } else if (score >= 90 && updatedUser.onboardingComplete && updatedUser.segment !== 'HIGH_FLYER') {
      // Only allow HIGH_FLYER after onboarding is complete
      updateSegment('HIGH_FLYER');
    }
    
    // Check onboarding completion
    setTimeout(() => checkOnboardingCompletion(), 100);
  };

  const updateSegment = (segment: UserSegment) => {
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
    
    // Update Personalize attributes when segment changes
    if (user.team) {
      setPersonalizeAttributes({
        QA_LEVEL: segment,
        TEAM_NAME: user.team
      });
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
    if (!user) {
      console.log('❌ markSOPComplete: No user found');
      return;
    }

    console.log('📋 markSOPComplete called for:', sopId);
    console.log('📋 Current completedSOPs:', user.completedSOPs);

    // Ensure completedSOPs array exists
    const completedSOPs = user.completedSOPs || [];
    
    const updatedUser = {
      ...user,
      completedSOPs: [...new Set([...completedSOPs, sopId])],
      lastActivity: new Date().toISOString()
    };

    console.log('📋 Updated completedSOPs:', updatedUser.completedSOPs);
    
    setUserState(updatedUser);
    debouncedSave(updatedUser); // Auto-save to Contentstack
    checkOnboardingCompletionForUser(updatedUser);
    
    console.log('✅ markSOPComplete: State updated and save triggered');
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
    const { modules: allModules, sops: allSOPs } = require('@/data/mockData').getPersonalizedContent(currentUser.segment, currentUser.completedModules, currentUser.team);
    
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

