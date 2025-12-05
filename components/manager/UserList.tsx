'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  TrendingUp,
  Eye,
  Trophy,
  BookOpen,
  ChevronDown,
  ChevronUp,
  History,
  Shield,
  Loader2
} from 'lucide-react';
import { UserProfile, UserSegment, OnboardingRequirements, Module } from '@/types';
import { formatLastActivity } from '@/lib/managerAuth';
import { calculateOnboardingRequirementsAsync } from '@/lib/onboarding';
import { getPersonalizedContentAsync } from '@/data/mockData';

interface UserListProps {
  users: (UserProfile & { lastModified: Date; storageKey: string })[];
  onViewDetails: (user: UserProfile) => void;
}

// Extended requirements with overall progress
interface ExtendedRequirements extends OnboardingRequirements {
  totalModules: number;
  completedModules: number;
  overallLearningProgress: number;
}

export default function UserList({ users, onViewDetails }: UserListProps) {
  const [sortBy, setSortBy] = useState<'name' | 'progress' | 'activity'>('activity');
  const [expandedUsers, setExpandedUsers] = useState<Set<string>>(new Set());
  const [isLoadingRequirements, setIsLoadingRequirements] = useState(true);
  const [userRequirements, setUserRequirements] = useState<Record<string, ExtendedRequirements>>({});

  // Pre-calculate requirements for all users when the list changes
  useEffect(() => {
    const calculateAllRequirements = async () => {
      if (users.length === 0) {
        setIsLoadingRequirements(false);
        return;
      }

      setIsLoadingRequirements(true);
      const requirements: Record<string, ExtendedRequirements> = {};

      // Calculate requirements for each user in parallel
      await Promise.all(
        users.map(async (user) => {
          try {
            const reqs = await calculateOnboardingRequirementsAsync(user);
            
            // Fetch all available modules (ROOKIE + HIGH_FLYER + current segment)
            const rookieContent = await getPersonalizedContentAsync('ROOKIE', user.completedModules, user.team);
            const highFlyerContent = await getPersonalizedContentAsync('HIGH_FLYER', user.completedModules, user.team);
            const currentContent = await getPersonalizedContentAsync(user.segment, user.completedModules, user.team);
            
            // Combine all unique modules
            const allModulesMap = new Map<string, Module>();
            [...rookieContent.modules, ...highFlyerContent.modules, ...currentContent.modules].forEach(m => {
              allModulesMap.set(m.id, m);
            });
            const totalModules = allModulesMap.size;
            
            // Count completed modules that exist in all modules
            const completedModules = (user.completedModules || []).filter(id =>
              allModulesMap.has(id)
            ).length;
            
            const overallLearningProgress = totalModules > 0
              ? Math.round((completedModules / totalModules) * 100)
              : 0;
            
            requirements[user.storageKey || `${user.name}_${user.team}`] = {
              ...reqs,
              totalModules,
              completedModules,
              overallLearningProgress
            };
          } catch (error) {
            console.error(`Error calculating requirements for ${user.name}:`, error);
            // Provide default requirements on error
            requirements[user.storageKey || `${user.name}_${user.team}`] = {
              modules: { required: 4, completed: user.completedModules?.length || 0, percentage: 0 },
              sops: { required: 2, completed: user.completedSOPs?.length || 0, percentage: 0 },
              tools: { required: 3, completed: user.exploredTools?.length || 0, percentage: 0 },
              averageScore: { required: 70, current: 0, passing: false },
              notAtRisk: user.segment !== 'AT_RISK',
              overallComplete: user.onboardingComplete || false,
              overallPercentage: 0,
              totalModules: 10,
              completedModules: user.completedModules?.length || 0,
              overallLearningProgress: 0
            };
          }
        })
      );

      setUserRequirements(requirements);
      setIsLoadingRequirements(false);
    };

    calculateAllRequirements();
  }, [users]);

  const toggleExpand = (key: string) => {
    setExpandedUsers(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  if (users.length === 0) {
    return (
      <Card className="p-12 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">No Team Members Yet</h3>
            <p className="text-muted-foreground text-sm">
              Users from this team will appear here once they start their onboarding.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  // Only show full loading state on initial load (when we have no cached requirements)
  const hasAnyRequirements = Object.keys(userRequirements).length > 0;
  if (isLoadingRequirements && !hasAnyRequirements) {
    return (
      <Card className="p-12 text-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <div>
            <h3 className="font-semibold text-lg mb-2">Loading Team Data</h3>
            <p className="text-muted-foreground text-sm">
              Calculating onboarding progress...
            </p>
          </div>
        </div>
      </Card>
    );
  }

  // Sort users
  const sortedUsers = [...users].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortBy === 'progress') {
      const aProgress = (a.completedModules?.length || 0);
      const bProgress = (b.completedModules?.length || 0);
      return bProgress - aProgress;
    } else {
      return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime();
    }
  });

  const getSegmentStyle = (segment: string) => {
    switch (segment) {
      case 'ROOKIE':
        return { bg: 'bg-blue-50 dark:bg-blue-950', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-200 dark:border-blue-800' };
      case 'AT_RISK':
        return { bg: 'bg-red-50 dark:bg-red-950', text: 'text-red-700 dark:text-red-300', border: 'border-red-200 dark:border-red-800' };
      case 'HIGH_FLYER':
        return { bg: 'bg-green-50 dark:bg-green-950', text: 'text-green-700 dark:text-green-300', border: 'border-green-200 dark:border-green-800' };
      default:
        return { bg: 'bg-gray-50 dark:bg-gray-950', text: 'text-gray-700 dark:text-gray-300', border: 'border-gray-200 dark:border-gray-800' };
    }
  };

  const getSegmentIcon = (segment: string) => {
    switch (segment) {
      case 'AT_RISK':
        return <AlertTriangle className="w-4 h-4" />;
      case 'HIGH_FLYER':
        return <Trophy className="w-4 h-4" />;
      default:
        return <TrendingUp className="w-4 h-4" />;
    }
  };

  // Get onboarding requirements for a user from pre-calculated cache
  const getOnboardingReqs = (user: UserProfile & { storageKey?: string }): ExtendedRequirements => {
    const key = user.storageKey || `${user.name}_${user.team}`;
    return userRequirements[key] || {
      modules: { required: 4, completed: user.completedModules?.length || 0, percentage: 0 },
      sops: { required: 2, completed: user.completedSOPs?.length || 0, percentage: 0 },
      tools: { required: 3, completed: user.exploredTools?.length || 0, percentage: 0 },
      averageScore: { required: 70, current: 0, passing: false },
      notAtRisk: user.segment !== 'AT_RISK',
      overallComplete: user.onboardingComplete || false,
      overallPercentage: 0,
      totalModules: 10,
      completedModules: user.completedModules?.length || 0,
      overallLearningProgress: 0
    };
  };

  // Calculate overall learning progress (all modules, not just onboarding)
  const calculateCompletion = (user: UserProfile & { storageKey?: string }) => {
    const reqs = getOnboardingReqs(user);
    return reqs.overallLearningProgress;
  };

  const calculateAverageScore = (user: UserProfile) => {
    const scores = Object.values(user.quizScores || {});
    if (scores.length === 0) return 0;
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  };

  // Check if user was ever AT_RISK
  const wasEverAtRisk = (user: UserProfile) => {
    if (!user.segmentHistory) return false;
    return user.segmentHistory.some(entry => entry.segment === 'AT_RISK');
  };

  // Get AT_RISK periods from segment history
  const getAtRiskPeriods = (user: UserProfile) => {
    if (!user.segmentHistory || user.segmentHistory.length === 0) return [];
    
    const periods: { start: string; end?: string; recovered: boolean }[] = [];
    let currentAtRiskStart: string | null = null;
    
    for (let i = 0; i < user.segmentHistory.length; i++) {
      const entry = user.segmentHistory[i];
      
      if (entry.segment === 'AT_RISK' && !currentAtRiskStart) {
        currentAtRiskStart = entry.date;
      } else if (entry.segment !== 'AT_RISK' && currentAtRiskStart) {
        periods.push({
          start: currentAtRiskStart,
          end: entry.date,
          recovered: true
        });
        currentAtRiskStart = null;
      }
    }
    
    // If still in AT_RISK
    if (currentAtRiskStart) {
      periods.push({
        start: currentAtRiskStart,
        recovered: false
      });
    }
    
    return periods;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-4">
      {/* Sort Controls */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">Sort by:</span>
        <Button
          variant={sortBy === 'activity' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSortBy('activity')}
        >
          Recent Activity
        </Button>
        <Button
          variant={sortBy === 'progress' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSortBy('progress')}
        >
          Progress
        </Button>
        <Button
          variant={sortBy === 'name' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSortBy('name')}
        >
          Name
        </Button>
      </div>

      {/* User Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {sortedUsers.map((user) => {
          const segmentStyle = getSegmentStyle(user.segment);
          const completion = calculateCompletion(user);
          const avgScore = calculateAverageScore(user);
          const onboardingReqs = getOnboardingReqs(user);
          const SegmentIcon = () => getSegmentIcon(user.segment);
          const hadInterventions = wasEverAtRisk(user);
          const atRiskPeriods = getAtRiskPeriods(user);
          const isExpanded = expandedUsers.has(user.storageKey);

          return (
            <Card key={user.storageKey} className={`hover:shadow-lg transition-shadow border-l-4 ${segmentStyle.border}`}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-semibold text-lg">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{user.name}</h3>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <Badge variant="outline" className="text-xs">
                            {user.team}
                          </Badge>
                          <Badge 
                            className={`text-xs ${segmentStyle.bg} ${segmentStyle.text} border-0`}
                          >
                            <SegmentIcon />
                            <span className="ml-1">{user.segment}</span>
                          </Badge>
                          {/* Intervention indicator */}
                          {hadInterventions && user.segment !== 'AT_RISK' && (
                            <Badge 
                              variant="outline" 
                              className="text-xs bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-300"
                            >
                              <History className="w-3 h-3 mr-1" />
                              Had {user.interventionsReceived || atRiskPeriods.length} intervention{(user.interventionsReceived || atRiskPeriods.length) !== 1 ? 's' : ''}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    {onboardingReqs.overallComplete ? (
                      <Badge className="bg-green-500">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Complete
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs">
                        {Math.round(onboardingReqs.overallPercentage)}% Done
                      </Badge>
                    )}
                  </div>

                  {/* Onboarding Progress */}
                  <div className="space-y-2 bg-amber-50 dark:bg-amber-950 p-3 rounded-lg border border-amber-200 dark:border-amber-800">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-amber-900 dark:text-amber-100">Onboarding Progress</span>
                      <span className="font-semibold text-amber-700 dark:text-amber-300">{Math.round(onboardingReqs.overallPercentage)}%</span>
                    </div>
                    <Progress value={onboardingReqs.overallPercentage} className="h-2" />
                    <div className="text-xs text-amber-700 dark:text-amber-300">
                      Mandatory: {onboardingReqs.modules.completed}/{onboardingReqs.modules.required} modules • {onboardingReqs.sops.completed}/{onboardingReqs.sops.required} SOPs • {onboardingReqs.tools.completed}/{onboardingReqs.tools.required} tools
                    </div>
                  </div>

                  {/* Intervention History - Expandable */}
                  {(hadInterventions || user.segment === 'AT_RISK') && (
                    <div className="border rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleExpand(user.storageKey)}
                        className={`w-full flex items-center justify-between p-3 text-left transition-colors ${
                          user.segment === 'AT_RISK' 
                            ? 'bg-red-50 dark:bg-red-950 hover:bg-red-100 dark:hover:bg-red-900' 
                            : 'bg-amber-50 dark:bg-amber-950 hover:bg-amber-100 dark:hover:bg-amber-900'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {user.segment === 'AT_RISK' ? (
                            <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
                          ) : (
                            <Shield className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                          )}
                          <span className={`text-sm font-medium ${
                            user.segment === 'AT_RISK' 
                              ? 'text-red-700 dark:text-red-300' 
                              : 'text-amber-700 dark:text-amber-300'
                          }`}>
                            {user.segment === 'AT_RISK' 
                              ? 'Currently At-Risk' 
                              : `Intervention History (${atRiskPeriods.length} time${atRiskPeriods.length !== 1 ? 's' : ''})`
                            }
                          </span>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        )}
                      </button>
                      
                      {isExpanded && (
                        <div className="p-3 bg-background border-t space-y-3">
                          {atRiskPeriods.length > 0 ? (
                            atRiskPeriods.map((period, idx) => (
                              <div 
                                key={idx} 
                                className={`p-3 rounded-lg border ${
                                  period.recovered 
                                    ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800' 
                                    : 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800'
                                }`}
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-xs font-medium text-muted-foreground">
                                    Period {atRiskPeriods.length - idx}
                                  </span>
                                  {period.recovered ? (
                                    <Badge className="bg-green-500 text-xs">
                                      <CheckCircle2 className="w-3 h-3 mr-1" />
                                      Recovered
                                    </Badge>
                                  ) : (
                                    <Badge variant="destructive" className="text-xs">
                                      <AlertTriangle className="w-3 h-3 mr-1" />
                                      Active
                                    </Badge>
                                  )}
                                </div>
                                <div className="space-y-1 text-xs">
                                  <div className="flex items-center gap-2">
                                    <span className="text-muted-foreground">Entered AT_RISK:</span>
                                    <span className="font-medium">{formatDate(period.start)}</span>
                                  </div>
                                  {period.end && (
                                    <div className="flex items-center gap-2">
                                      <span className="text-muted-foreground">Recovered:</span>
                                      <span className="font-medium text-green-600 dark:text-green-400">{formatDate(period.end)}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center text-sm text-muted-foreground py-2">
                              No detailed history available
                            </div>
                          )}
                          
                          {/* Summary */}
                          <div className="pt-2 border-t text-xs text-muted-foreground">
                            <div className="flex items-center justify-between">
                              <span>Total Interventions:</span>
                              <span className="font-semibold">{user.interventionsReceived || atRiskPeriods.length}</span>
                            </div>
                            {atRiskPeriods.filter(p => p.recovered).length > 0 && (
                              <div className="flex items-center justify-between mt-1">
                                <span>Times Recovered:</span>
                                <span className="font-semibold text-green-600 dark:text-green-400">
                                  {atRiskPeriods.filter(p => p.recovered).length}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Overall Progress - All Modules */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Overall Progress</span>
                      <span className="font-semibold">{completion}%</span>
                    </div>
                    <Progress value={completion} className="h-2" />
                    <div className="text-xs text-muted-foreground">
                      {onboardingReqs.completedModules}/{onboardingReqs.totalModules} modules completed
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 pt-2 border-t">
                    <div className="text-center">
                      <div className="text-lg font-bold text-primary">
                        {user.completedModules?.length || 0}
                      </div>
                      <div className="text-xs text-muted-foreground">Completed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-primary">{avgScore}%</div>
                      <div className="text-xs text-muted-foreground">Avg Score</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-primary">{user.timeSpent || 0}m</div>
                      <div className="text-xs text-muted-foreground">Time</div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>{formatLastActivity(user.lastModified)}</span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onViewDetails(user)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
