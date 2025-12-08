'use client';

import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  Target, 
  Award,
  AlertTriangle,
  CheckCircle2,
  GraduationCap,
  FileText,
  Wrench,
  Rocket,
  Zap,
  Trophy,
  Loader2,
  Sparkles,
  CheckCircle,
  Lock
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { calculateOnboardingRequirements, getOnboardingStatusMessage } from '@/lib/onboarding';
import { getPersonalizedContent } from '@/data/mockData';
import { activateChallengePro } from '@/lib/challengePro';
import { toast } from 'sonner';
export default function AnalyticsPanel() {
  const { user, analytics, challengeProEnabled, setChallengeProEnabled } = useApp();
  
  // Local UI state only
  const [isActivating, setIsActivating] = useState(false);
  const [showChallengeDetails, setShowChallengeDetails] = useState(false);

  if (!user) return null;
  
  // Check if user is HIGH_FLYER (eligible for Challenge Pro)
  const isHighFlyer = user.segment === 'HIGH_FLYER';
  
  // Challenge Pro is ONLY active if:
  // 1. User is HIGH_FLYER AND
  // 2. User has explicitly enabled Challenge Pro (clicked the button)
  const isChallengeProActive = isHighFlyer && (challengeProEnabled || user.challengeProEnabled);
  
  // Check if user has unlocked Challenge Pro (completed prerequisite HIGH_FLYER module)
  // This is set in user profile when they complete a module with unlocksChallengePro: true
  const hasUnlockedChallengePro = isHighFlyer && (user.challengeProUnlocked || false);
  
  // Challenge Pro button is available only if:
  // 1. User is HIGH_FLYER
  // 2. User has completed a module that unlocks Challenge Pro
  // 3. OR Challenge Pro is already active
  const canActivateChallengePro = isHighFlyer && (hasUnlockedChallengePro || isChallengeProActive);

  const segmentColors = {
    ROOKIE: { bg: 'bg-blue-50 dark:bg-blue-950', text: 'text-blue-700 dark:text-blue-300', icon: 'text-blue-500' },
    AT_RISK: { bg: 'bg-red-50 dark:bg-red-950', text: 'text-red-700 dark:text-red-300', icon: 'text-red-500' },
    HIGH_FLYER: { bg: 'bg-green-50 dark:bg-green-950', text: 'text-green-700 dark:text-green-300', icon: 'text-green-500' }
  };

  const currentSegmentColor = segmentColors[user.segment];

  const quizScores = Object.entries(user.quizScores).map(([moduleId, score], index) => ({
    name: `Quiz ${index + 1}`,
    score: score
  }));

  // Calculate onboarding progress
  const onboardingRequirements = calculateOnboardingRequirements(user);
  const onboardingMessage = getOnboardingStatusMessage(onboardingRequirements);

  return (
    <aside className="w-80 bg-card border-l border-border h-screen sticky top-0 overflow-y-auto pb-6">
      <div className="p-6 space-y-6 pb-20">
        {/* Header */}
        <div>
          <h2 className="text-lg font-bold mb-1">Analytics</h2>
          <p className="text-xs text-muted-foreground">Your learning insights</p>
        </div>

        {/* Onboarding Progress */}
        {!user.onboardingComplete && (
          <Card className={
            onboardingRequirements.overallPercentage >= 80 
              ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800'
              : onboardingRequirements.overallPercentage >= 50
              ? 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800'
              : 'bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800'
          }>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" />
                  Onboarding Progress
                </span>
                <span className="font-bold text-primary">
                  {onboardingRequirements.overallPercentage}%
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Modules */}
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-3 h-3" />
                  Modules
                </span>
                <span className="font-semibold">
                  {onboardingRequirements.modules.completed}/{onboardingRequirements.modules.required}
                  {onboardingRequirements.modules.percentage === 100 && ' ✓'}
                </span>
              </div>
              <Progress value={onboardingRequirements.modules.percentage} className="h-1.5" />

              {/* SOPs */}
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2">
                  <FileText className="w-3 h-3" />
                  SOPs
                </span>
                <span className="font-semibold">
                  {onboardingRequirements.sops.completed}/{onboardingRequirements.sops.required}
                  {onboardingRequirements.sops.percentage === 100 && ' ✓'}
                </span>
              </div>
              <Progress value={onboardingRequirements.sops.percentage} className="h-1.5" />

              {/* Tools */}
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2">
                  <Wrench className="w-3 h-3" />
                  Tools
                </span>
                <span className="font-semibold">
                  {onboardingRequirements.tools.completed}/{onboardingRequirements.tools.required}
                  {onboardingRequirements.tools.percentage >= 100 && ' ✓'}
                </span>
              </div>
              <Progress value={onboardingRequirements.tools.percentage} className="h-1.5" />

              {/* Average Score */}
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2">
                  <Award className="w-3 h-3" />
                  Avg Score
                </span>
                <span className="font-semibold">
                  {onboardingRequirements.averageScore.current}%
                  {onboardingRequirements.averageScore.passing && ' ✓'}
                </span>
              </div>
              <Progress value={(onboardingRequirements.averageScore.current / onboardingRequirements.averageScore.required) * 100} className="h-1.5" />

              {/* Status Message */}
              <div className="pt-2 text-xs font-medium text-center">
                {onboardingMessage}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Onboarding Complete Badge */}
        {user.onboardingComplete && (
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-green-300 dark:border-green-700">
            <CardContent className="pt-6 text-center">
              <GraduationCap className="w-12 h-12 mx-auto mb-3 text-green-600 dark:text-green-400" />
              <div className="font-bold text-green-700 dark:text-green-300 mb-1">
                🎉 Onboarding Complete!
              </div>
              <div className="text-xs text-green-600 dark:text-green-400">
                Completed on {new Date(user.onboardingCompletedDate!).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Current Segment */}
        <Card className={isChallengeProActive ? "border-2 border-purple-500 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/40 dark:to-indigo-950/40" : currentSegmentColor.bg}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Target className={`w-4 h-4 ${isChallengeProActive ? 'text-purple-600' : currentSegmentColor.icon}`} />
              Current Segment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${isChallengeProActive ? 'text-purple-700 dark:text-purple-300' : currentSegmentColor.text}`}>
              {isChallengeProActive ? (
                <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  HIGH_FLYER_PRO
                </span>
              ) : (
                user.segment
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {user.segment === 'ROOKIE' && !isChallengeProActive && 'Building foundational skills'}
              {user.segment === 'AT_RISK' && !isChallengeProActive && 'Needs additional support'}
              {user.segment === 'HIGH_FLYER' && !isChallengeProActive && 'Exceeding expectations'}
              {isChallengeProActive && 'Enterprise-level advanced content unlocked'}
            </p>
            {/* Level indicator for Challenge Pro */}
            {isChallengeProActive && (
              <div className="mt-2 flex items-center gap-2">
                <Badge className="bg-purple-600 text-white">
                  Level: Advanced
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Challenge Pro - Only for HIGH_FLYER users who completed prerequisite */}
        {isHighFlyer && (canActivateChallengePro ? (
          <Card className={
            isChallengeProActive 
              ? "border-2 border-purple-500 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/40 dark:to-indigo-950/40 shadow-lg shadow-purple-500/20"
              : "border border-purple-300 dark:border-purple-700 bg-gradient-to-br from-purple-50/50 to-indigo-50/50 dark:from-purple-950/20 dark:to-indigo-950/20"
          }>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center justify-between">
                <span className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
                  {isChallengeProActive ? (
                    <Trophy className="w-4 h-4" />
                  ) : (
                    <Zap className="w-4 h-4" />
                  )}
                  Challenge Pro
                </span>
                {isChallengeProActive && (
                  <Badge className="bg-purple-500 text-white text-[10px]">
                    <CheckCircle className="w-2.5 h-2.5 mr-1" />
                    Active
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {isChallengeProActive ? (
                // Activated state
                <>
                  <div className="text-xs text-purple-600 dark:text-purple-400">
                    🎉 Enterprise-level content unlocked!
                  </div>
                  <div className="bg-white dark:bg-gray-900 rounded-lg p-2 border border-purple-200 dark:border-purple-800">
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                      <CheckCircle2 className="w-3 h-3 text-purple-500" />
                      Advanced {user.team} modules available
                    </div>
                  </div>
                </>
              ) : isActivating ? (
                // Loading state
                <div className="py-4 text-center">
                  <Loader2 className="w-8 h-8 mx-auto mb-2 animate-spin text-purple-500" />
                  <div className="text-sm font-medium text-purple-700 dark:text-purple-300">
                    Activating...
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Creating personalized content
                  </div>
                </div>
              ) : showChallengeDetails ? (
                // Expanded details
                <>
                  <div className="bg-white dark:bg-gray-900 rounded-lg p-2 space-y-1 border border-purple-200 dark:border-purple-800 text-xs">
                    <div className="font-semibold text-purple-700 dark:text-purple-300">What You'll Get:</div>
                    <ul className="space-y-0.5 text-muted-foreground text-[10px]">
                      <li className="flex items-center gap-1">
                        <div className="w-1 h-1 rounded-full bg-purple-500" />
                        Enterprise architecture patterns
                      </li>
                      <li className="flex items-center gap-1">
                        <div className="w-1 h-1 rounded-full bg-purple-500" />
                        Advanced compliance strategies
                      </li>
                      <li className="flex items-center gap-1">
                        <div className="w-1 h-1 rounded-full bg-purple-500" />
                        Expert-level challenges
                      </li>
                    </ul>
                  </div>

                  <Button 
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg text-xs h-8"
                    onClick={async () => {
                      setIsActivating(true);
                      try {
                        const result = await activateChallengePro(user.team, user.name);
                        if (result.success) {
                          // Update context state with variant alias (persists to user profile)
                          // This triggers content refresh via contentRefreshKey
                          await setChallengeProEnabled(true, result.variantAlias);
                          
                          toast.success('🚀 Challenge Pro Activated!', {
                            description: 'Advanced content is loading... Check your dashboard for new modules!',
                            duration: 5000
                          });
                          
                          // Reset activating state - isChallengeProActive will show the "Active" UI
                          setIsActivating(false);
                          setShowChallengeDetails(false);
                        } else {
                          toast.error('Activation Failed', {
                            description: result.message
                          });
                          setIsActivating(false);
                          setShowChallengeDetails(false);
                        }
                      } catch (error) {
                        toast.error('Error', {
                          description: 'Something went wrong. Please try again.'
                        });
                        setIsActivating(false);
                        setShowChallengeDetails(false);
                      }
                    }}
                  >
                    <Rocket className="w-3 h-3 mr-1" />
                    Accept Challenge
                  </Button>
                  
                  <button 
                    onClick={() => setShowChallengeDetails(false)}
                    className="w-full text-[10px] text-muted-foreground hover:text-purple-600 transition-colors"
                  >
                    Maybe later
                  </button>
                </>
              ) : (
                // Collapsed - show blinking button
                <>
                  <p className="text-xs text-muted-foreground">
                    Ready for advanced content?
                  </p>
                  <Button
                    onClick={() => setShowChallengeDetails(true)}
                    className="w-full relative overflow-hidden bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg shadow-purple-500/30 transition-all duration-300 text-xs h-8"
                  >
                    {/* Blinking effect */}
                    <span 
                      className="absolute inset-0 bg-white/20 animate-pulse"
                      style={{ animationDuration: '1.5s' }}
                    />
                    
                    {/* Sparkle indicator */}
                    <span className="absolute -top-1 -right-1 animate-bounce">
                      <Sparkles className="w-3 h-3 text-yellow-300" />
                    </span>
                    
                    <Rocket className="w-3 h-3 mr-1 relative z-10" />
                    <span className="relative z-10">🔥 Challenge Pro</span>
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        ) : (
          // Show locked state when prerequisite not met
          <Card className="border border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-950/20 opacity-75">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center justify-between">
                <span className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                  <Lock className="w-4 h-4" />
                  Challenge Pro
                </span>
                <Badge variant="secondary" className="text-[10px]">
                  Locked
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Complete your HIGH_FLYER module to unlock Challenge Pro
              </p>
            </CardContent>
          </Card>
        ))}

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <div className="text-xs text-muted-foreground">Modules</div>
              </div>
              <div className="text-2xl font-bold">{user.completedModules.length}</div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-primary" />
                <div className="text-xs text-muted-foreground">Time</div>
              </div>
              <div className="text-2xl font-bold">{user.timeSpent}</div>
              <div className="text-xs text-muted-foreground">Minutes</div>
            </CardContent>
          </Card>
        </div>

        {/* Average Quiz Score */}
        {quizScores.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Award className="w-4 h-4" />
                Average Quiz Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary mb-4">
                {Math.round(analytics.averageQuizScore)}%
              </div>
              <ResponsiveContainer width="100%" height={120}>
                <BarChart data={quizScores}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} className="text-muted-foreground" />
                  <YAxis tick={{ fontSize: 10 }} className="text-muted-foreground" />
                  <Tooltip />
                  <Bar dataKey="score" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Segment History */}
        {analytics.segmentHistory.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Segment History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {analytics.segmentHistory.slice(-5).reverse().map((entry, index) => {
                  const color = segmentColors[entry.segment];
                  return (
                    <div key={index} className="flex items-center justify-between text-xs py-1">
                      <Badge variant="outline" className={color.text}>
                        {entry.segment}
                      </Badge>
                      <span className="text-muted-foreground">
                        {new Date(entry.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  );
                })}
              </div>
              {analytics.segmentHistory.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-4">
                  No segment changes yet
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Interventions (if any) */}
        {user.interventionsReceived > 0 && (
          <Card className="bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-900">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2 text-red-700 dark:text-red-300">
                <AlertTriangle className="w-4 h-4" />
                Interventions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-700 dark:text-red-300">
                {user.interventionsReceived}
              </div>
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                Support notifications sent to your manager
              </p>
            </CardContent>
          </Card>
        )}

        {/* Last Activity */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Last Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {new Date(analytics.lastActivity).toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </CardContent>
        </Card>
      </div>
    </aside>
  );
}
