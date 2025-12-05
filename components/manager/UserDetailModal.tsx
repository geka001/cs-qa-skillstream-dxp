'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  X, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  BookOpen, 
  FileText, 
  Wrench,
  Calendar,
  TrendingUp,
  Loader2
} from 'lucide-react';
import { UserProfile, Module, SOP, Tool } from '@/types';
import { getPersonalizedContentAsync } from '@/data/mockData';

interface UserDetailModalProps {
  user: UserProfile | null;
  isOpen: boolean;
  onClose: () => void;
}

interface ContentData {
  rookieModules: Module[];
  rookieSOPs: SOP[];
  currentModules: Module[];
  currentSOPs: SOP[];
  tools: Tool[];
  allAvailableModules: Module[]; // All unique modules across all segments
}

export default function UserDetailModal({ user, isOpen, onClose }: UserDetailModalProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [contentData, setContentData] = useState<ContentData | null>(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Fetch content asynchronously when modal opens
  useEffect(() => {
    if (!isOpen || !user) {
      setContentData(null);
      setIsLoading(true);
      return;
    }

    const fetchContent = async () => {
      setIsLoading(true);
      try {
        // Fetch ROOKIE content for onboarding tracking
        const rookieContent = await getPersonalizedContentAsync('ROOKIE', user.completedModules, user.team);
        
        // Fetch HIGH_FLYER content to get advanced modules
        const highFlyerContent = await getPersonalizedContentAsync('HIGH_FLYER', user.completedModules, user.team);
        
        // Fetch content for user's current segment
        const currentContent = await getPersonalizedContentAsync(user.segment, user.completedModules, user.team);
        
        // Combine all unique modules for overall progress calculation
        const allModulesMap = new Map<string, Module>();
        [...rookieContent.modules, ...highFlyerContent.modules, ...currentContent.modules].forEach(m => {
          allModulesMap.set(m.id, m);
        });
        const allAvailableModules = Array.from(allModulesMap.values());
        
        setContentData({
          rookieModules: rookieContent.modules,
          rookieSOPs: rookieContent.sops,
          currentModules: currentContent.modules,
          currentSOPs: currentContent.sops,
          tools: currentContent.tools,
          allAvailableModules
        });
      } catch (error) {
        console.error('Error fetching content for user detail:', error);
        // Set empty content on error
        setContentData({
          rookieModules: [],
          rookieSOPs: [],
          currentModules: [],
          currentSOPs: [],
          tools: [],
          allAvailableModules: []
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [isOpen, user]);

  if (!isOpen || !user) return null;

  // Use ROOKIE mandatory SOPs for onboarding count (matches QA dashboard)
  const mandatorySOPs = contentData?.rookieSOPs.filter(s => s.mandatory) || [];
  const completedMandatorySOPsCount = (user.completedSOPs || []).filter(id =>
    mandatorySOPs.some(s => s.id === id)
  ).length;
  
  // Use mandatory modules for onboarding count
  const mandatoryModules = contentData?.rookieModules.filter(m => m.mandatory) || [];
  const completedMandatoryModulesCount = (user.completedModules || []).filter(id =>
    mandatoryModules.some(m => m.id === id)
  ).length;
  
  // All modules available for this user's learning journey
  const allAvailableModules = contentData?.allAvailableModules || [];
  const currentModules = contentData?.currentModules || [];
  
  // Count completed modules that exist in the current module list (for segment-specific view)
  const completedInCurrentModules = (user.completedModules || []).filter(id =>
    currentModules.some(m => m.id === id)
  ).length;
  
  // Count completed modules that exist in ALL available modules (for overall progress)
  const completedInAllModules = (user.completedModules || []).filter(id =>
    allAvailableModules.some(m => m.id === id)
  ).length;
  
  const completedSOPsCount = user.completedSOPs?.length || 0;
  const exploredToolsCount = user.exploredTools?.length || 0;
  const requiredToolsCount = 3; // Minimum tools required for onboarding
  
  // Calculate overall progress based on ALL available modules
  const overallProgress = allAvailableModules.length > 0
    ? Math.round((completedInAllModules / allAvailableModules.length) * 100)
    : 0;
  
  const quizScores = Object.entries(user.quizScores || {});
  const avgScore = quizScores.length > 0
    ? Math.round(quizScores.reduce((sum, [, score]) => sum + score, 0) / quizScores.length)
    : 0;

  const segmentHistory = user.segmentHistory || [
    { segment: user.segment, date: user.joinDate || new Date().toISOString() }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="w-full max-w-4xl max-h-[90vh] flex flex-col"
          >
            <Card className="flex flex-col max-h-full overflow-hidden">
              {/* Sticky Header - Always visible */}
              <CardHeader className="border-b bg-card flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white font-semibold text-2xl flex-shrink-0">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <CardTitle className="text-2xl">{user.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <Badge variant="outline">{user.team}</Badge>
                        <Badge variant="secondary">{user.role}</Badge>
                        <Badge className={
                          user.segment === 'AT_RISK' ? 'bg-red-500' :
                          user.segment === 'HIGH_FLYER' ? 'bg-green-500' :
                          'bg-blue-500'
                        }>
                          {user.segment}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={onClose} className="flex-shrink-0">
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </CardHeader>

              {/* Scrollable Content */}
              <CardContent className="p-6 space-y-6 overflow-y-auto flex-grow">
                {/* Loading State */}
                {isLoading && (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <span className="ml-2 text-muted-foreground">Loading user details...</span>
                  </div>
                )}

                {!isLoading && (
                  <>
                {/* Overall Progress Banner */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-blue-900 dark:text-blue-100">Overall Learning Progress</span>
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{overallProgress}%</span>
                  </div>
                  <Progress value={overallProgress} className="h-3" />
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                    {completedInAllModules} of {allAvailableModules.length} total modules completed
                    {allAvailableModules.length - completedInAllModules > 0 && (
                      <span className="ml-1">• {allAvailableModules.length - completedInAllModules} remaining</span>
                    )}
                  </p>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <div className="text-3xl font-bold text-primary">
                        {completedInCurrentModules}/{currentModules.length}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {user.segment} Modules
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <div className="text-3xl font-bold text-primary">{avgScore}%</div>
                      <div className="text-sm text-muted-foreground">Avg Score</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <div className="text-3xl font-bold text-primary">{user.timeSpent || 0}m</div>
                      <div className="text-sm text-muted-foreground">Time Spent</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <div className="text-3xl font-bold text-primary">
                        {user.onboardingComplete ? (
                          <CheckCircle2 className="w-8 h-8 mx-auto text-green-500" />
                        ) : (
                          <Clock className="w-8 h-8 mx-auto text-orange-500" />
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {user.onboardingComplete ? 'Onboarded' : 'Onboarding'}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Remaining Modules Notice */}
                {currentModules.length > completedInCurrentModules && (
                  <div className={`border rounded-lg p-4 ${
                    user.segment === 'HIGH_FLYER' 
                      ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800' 
                      : user.segment === 'AT_RISK'
                      ? 'bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800'
                      : 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800'
                  }`}>
                    <div className={`flex items-center gap-2 ${
                      user.segment === 'HIGH_FLYER' 
                        ? 'text-green-700 dark:text-green-300'
                        : user.segment === 'AT_RISK'
                        ? 'text-amber-700 dark:text-amber-300'
                        : 'text-blue-700 dark:text-blue-300'
                    }`}>
                      <BookOpen className="w-5 h-5" />
                      <span className="font-semibold">
                        {currentModules.length - completedInCurrentModules} Module{currentModules.length - completedInCurrentModules !== 1 ? 's' : ''} Remaining
                      </span>
                    </div>
                    <p className={`text-sm mt-1 ${
                      user.segment === 'HIGH_FLYER' 
                        ? 'text-green-600 dark:text-green-400'
                        : user.segment === 'AT_RISK'
                        ? 'text-amber-600 dark:text-amber-400'
                        : 'text-blue-600 dark:text-blue-400'
                    }`}>
                      {user.segment === 'HIGH_FLYER' && user.onboardingComplete
                        ? 'Advanced HIGH_FLYER modules available to continue learning journey'
                        : user.segment === 'AT_RISK'
                        ? 'Remedial modules to complete for recovery'
                        : 'Continue with onboarding modules'
                      }
                    </p>
                  </div>
                )}

                {/* Module Progress */}
                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Mandatory Modules ({completedMandatoryModulesCount}/{mandatoryModules.length})
                  </h3>
                  <Progress value={mandatoryModules.length > 0 ? (completedMandatoryModulesCount / mandatoryModules.length) * 100 : 0} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-2">
                    Modules required for onboarding
                  </p>
                </div>

                {/* All Modules (Expandable List) */}
                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    {user.segment} Modules ({completedInCurrentModules}/{currentModules.length})
                  </h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {currentModules.map((module) => {
                      const isCompleted = user.completedModules?.includes(module.id);
                      const score = user.quizScores?.[module.id];
                      
                      return (
                        <div
                          key={module.id}
                          className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            {isCompleted ? (
                              <CheckCircle2 className="w-5 h-5 text-green-500" />
                            ) : (
                              <XCircle className="w-5 h-5 text-gray-400" />
                            )}
                            <div>
                              <div className="font-medium text-sm">{module.title}</div>
                              <div className="text-xs text-muted-foreground">{module.category}</div>
                            </div>
                          </div>
                          {score !== undefined && (
                            <Badge variant={score >= 70 ? 'default' : 'destructive'}>
                              {Math.round(score)}%
                            </Badge>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* SOPs Progress */}
                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    SOPs Completed ({completedMandatorySOPsCount}/{mandatorySOPs.length})
                  </h3>
                  <Progress value={mandatorySOPs.length > 0 ? (completedMandatorySOPsCount / mandatorySOPs.length) * 100 : 0} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-2">
                    Mandatory SOPs required for onboarding
                  </p>
                </div>

                {/* Tools Progress */}
                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <Wrench className="w-5 h-5" />
                    Tools Explored ({exploredToolsCount}/{requiredToolsCount})
                  </h3>
                  <Progress value={requiredToolsCount > 0 ? Math.min((exploredToolsCount / requiredToolsCount) * 100, 100) : 0} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-2">
                    Minimum {requiredToolsCount} tools required for onboarding
                  </p>
                </div>

                {/* Segment History */}
                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Segment History
                  </h3>
                  <div className="space-y-2">
                    {segmentHistory.slice(-5).reverse().map((history, index) => (
                      <div key={index} className="flex items-center gap-3 p-2 bg-muted/50 rounded">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <Badge className={
                          history.segment === 'AT_RISK' ? 'bg-red-500' :
                          history.segment === 'HIGH_FLYER' ? 'bg-green-500' :
                          'bg-blue-500'
                        }>
                          {history.segment}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {new Date(history.date).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Join Date */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground pt-4 border-t">
                  <Calendar className="w-4 h-4" />
                  <span>Joined: {new Date(user.joinDate).toLocaleDateString()}</span>
                </div>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

