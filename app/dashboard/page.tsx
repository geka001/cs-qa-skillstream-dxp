'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';
import { Module } from '@/types';
import { mockModules, getPersonalizedContentAsync, welcomeMessages } from '@/data/mockData';
import { 
  canAccessModule, 
  getUnmetPrerequisites, 
  getNextRecommendedModule,
  sortModulesByOrder,
  calculateModuleProgress,
  getAccessibleModulesCount
} from '@/lib/prerequisites';
import { calculateOnboardingRequirements } from '@/lib/onboarding';
import ModuleCard from '@/components/cards/ModuleCard';
import InterventionCard from '@/components/cards/InterventionCard';
import AdvancedPathwayCard from '@/components/cards/AdvancedPathwayCard';
import ModuleViewer from '@/components/modules/ModuleViewer';
import QuizModal from '@/components/quiz/QuizModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, TrendingUp, AlertCircle, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { trackEvent } from '@/lib/personalize';

export default function DashboardPage() {
  const { user, completeModule, isLoggedIn } = useApp();
  const router = useRouter();
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [personalizedModules, setPersonalizedModules] = useState<Module[]>([]);
  // Use ref to track if we've already shown notifications in this session
  const hasShownSegmentToast = useRef(false);
  const previousSegmentRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }

    async function loadContent() {
      if (user) {
        const content = await getPersonalizedContentAsync(user.segment, user.completedModules, user.team);
        
        // Sort modules using prerequisites logic with completed modules and segment awareness
        const sorted = sortModulesByOrder(content.modules, user.completedModules, user.segment);
        
        setPersonalizedModules(sorted);

        // Show toast only when segment ACTUALLY changes during this session
        // (not on initial load or page refresh)
        if (previousSegmentRef.current !== null && previousSegmentRef.current !== user.segment) {
          if (user.segment === 'AT_RISK' && !hasShownSegmentToast.current) {
            toast.error('Your manager has been notified about your learning progress', {
              description: 'Additional support resources have been prepared for you.',
              duration: 5000
            });
            hasShownSegmentToast.current = true;
          } else if (user.segment === 'HIGH_FLYER') {
            toast.success('Congratulations! Advanced content unlocked', {
              description: 'You now have access to expert-level modules.',
              duration: 5000
            });
          } else if (user.segment === 'ROOKIE' && previousSegmentRef.current === 'AT_RISK') {
            // User recovered from AT_RISK - toast already shown in AppContext
          }
        }
        
        // Update previous segment ref
        previousSegmentRef.current = user.segment;
      }
    }

    loadContent();
  }, [user, isLoggedIn, router]);

  const handleStartModule = (module: Module) => {
    // Track click event for Personalize analytics
    trackEvent('click', { moduleId: module.id, moduleTitle: module.title });
    setSelectedModule(module);
  };

  const handleStartQuiz = () => {
    setShowQuiz(true);
  };

  const handleCompleteQuiz = (score: number) => {
    if (selectedModule) {
      completeModule(selectedModule.id, score);
      
      if (score >= 90) {
        toast.success('Outstanding performance!', {
          description: `You scored ${Math.round(score)}% on ${selectedModule.title}`,
        });
      } else if (score >= 70) {
        toast.success('Module completed!', {
          description: `You scored ${Math.round(score)}% on ${selectedModule.title}`,
        });
      } else if (score >= 50) {
        toast.warning('Module completed with concerns', {
          description: `You scored ${Math.round(score)}%. Consider reviewing the material.`,
        });
      } else {
        toast.error('Additional support recommended', {
          description: `You scored ${Math.round(score)}%. Your manager has been notified.`,
        });
      }
      
      setSelectedModule(null);
      setShowQuiz(false);
    }
  };

  const handleViewRemedial = () => {
    // Navigate to modules page with remedial filter
    router.push('/dashboard/modules?category=Remedial');
  };

  const handleExploreAdvanced = () => {
    // Navigate to modules page with advanced filter
    router.push('/dashboard/modules?difficulty=advanced');
  };

  if (!user) return null;

  const welcomeMessage = welcomeMessages[user.segment];
  const completedModuleIds = user.completedModules;
  
  // Calculate onboarding requirements
  const onboardingReqs = calculateOnboardingRequirements(user);
  
  // Get next recommended module (segment-aware)
  const nextRecommendedModule = getNextRecommendedModule(personalizedModules, completedModuleIds, user.segment);
  
  // Get accessible modules count (segment-aware)
  const accessibleModulesCount = getAccessibleModulesCount(personalizedModules, completedModuleIds, user.segment);
  
  // Check if there are remaining remedial modules (for AT_RISK users)
  const remedialModules = personalizedModules.filter(m => 
    m.category === 'Remedial' || m.category === 'At-Risk Support'
  );
  const incompleteRemedialModules = remedialModules.filter(m => 
    !completedModuleIds.includes(m.id)
  );
  const hasRemainingRemedial = incompleteRemedialModules.length > 0;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-primary/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-primary" />
                  Welcome, {user.name}!
                </CardTitle>
                <p className="text-muted-foreground mt-2">{welcomeMessage}</p>
              </div>
              <Badge className="text-lg px-4 py-2">
                {user.segment}
              </Badge>
            </div>
          </CardHeader>
        </Card>
      </motion.div>

      {/* Segment-specific cards */}
      {user.segment === 'AT_RISK' && hasRemainingRemedial && (
        <InterventionCard onViewRemedial={handleViewRemedial} />
      )}

      {user.segment === 'HIGH_FLYER' && (
        <AdvancedPathwayCard 
          onExploreAdvanced={handleExploreAdvanced}
          availableModules={personalizedModules}
        />
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Modules Completed</p>
                <p className="text-3xl font-bold text-primary">{completedModuleIds.length}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-primary/50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {user.segment === 'AT_RISK' ? 'Accessible Now' : 'Total Modules'}
                </p>
                <p className="text-3xl font-bold">
                  {user.segment === 'AT_RISK' ? accessibleModulesCount : personalizedModules.length}
                </p>
                {user.segment === 'AT_RISK' && accessibleModulesCount < personalizedModules.length && (
                  <p className="text-xs text-muted-foreground">
                    +{personalizedModules.length - accessibleModulesCount} locked
                  </p>
                )}
              </div>
              <Sparkles className="w-8 h-8 text-primary/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-200 dark:border-amber-900">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {user.segment === 'AT_RISK' ? 'Remedial Progress' : 'Mandatory Modules'}
                </p>
                <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                  {onboardingReqs.modules.completed}/{onboardingReqs.modules.required}
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-amber-600/50 dark:text-amber-400/50" />
            </div>
          </CardContent>
        </Card>

        <Card className={onboardingReqs.overallComplete ? "border-green-200 dark:border-green-900" : "border-blue-200 dark:border-blue-900"}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Onboarding Status</p>
                <p className={`text-2xl font-bold ${onboardingReqs.overallComplete ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'}`}>
                  {onboardingReqs.overallComplete ? 'Complete' : `${Math.round(onboardingReqs.overallPercentage)}%`}
                </p>
              </div>
              {onboardingReqs.overallComplete ? (
                <Sparkles className="w-8 h-8 text-green-600/50 dark:text-green-400/50" />
              ) : (
                <TrendingUp className="w-8 h-8 text-blue-600/50 dark:text-blue-400/50" />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Continue Learning - Next Recommended Module */}
      {nextRecommendedModule ? (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-primary" />
              Continue Learning
            </h2>
            <Button 
              variant="outline" 
              onClick={() => router.push('/dashboard/modules')}
              className="flex items-center gap-2"
            >
              View All Modules
              <TrendingUp className="w-4 h-4" />
            </Button>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <ModuleCard
              module={nextRecommendedModule}
              isCompleted={completedModuleIds.includes(nextRecommendedModule.id)}
              onStart={handleStartModule}
              isNextRecommended={!selectedModule}
              isLocked={false}
              unmetPrerequisites={[]}
              progress={calculateModuleProgress(nextRecommendedModule.id, completedModuleIds, user.moduleProgress)}
            />
          </motion.div>
          
          <Card className="mt-4 bg-secondary/30">
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">
                      {personalizedModules.length - 1} more module{personalizedModules.length - 1 !== 1 ? 's' : ''} available
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Explore your complete learning path
                    </p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  onClick={() => router.push('/dashboard/modules')}
                  className="flex items-center gap-2"
                >
                  Browse All
                  <TrendingUp className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card className="p-12 text-center">
          <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">All Caught Up!</h3>
          <p className="text-muted-foreground mb-4">
            {personalizedModules.length === 0 
              ? "No modules available for your current segment."
              : "You've completed all recommended modules. Great work!"}
          </p>
          <Button 
            onClick={() => router.push('/dashboard/modules')}
            variant="outline"
          >
            View All Modules
          </Button>
        </Card>
      )}

      {/* Module Viewer Modal */}
      {selectedModule && !showQuiz && (
        <ModuleViewer
          module={selectedModule}
          onClose={() => setSelectedModule(null)}
          onStartQuiz={handleStartQuiz}
        />
      )}

      {/* Quiz Modal */}
      {selectedModule && showQuiz && (
        <QuizModal
          module={selectedModule}
          onClose={() => {
            setShowQuiz(false);
            setSelectedModule(null);
          }}
          onComplete={handleCompleteQuiz}
        />
      )}
    </div>
  );
}

