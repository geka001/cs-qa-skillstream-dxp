'use client';

import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Clock, 
  Target, 
  Award,
  AlertTriangle,
  CheckCircle2,
  GraduationCap,
  FileText,
  Wrench
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { calculateOnboardingRequirements, getOnboardingStatusMessage } from '@/lib/onboarding';
import { getPersonalizedContent } from '@/data/mockData';

export default function AnalyticsPanel() {
  const { user, analytics } = useApp();

  if (!user) return null;

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
        <Card className={currentSegmentColor.bg}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Target className={`w-4 h-4 ${currentSegmentColor.icon}`} />
              Current Segment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${currentSegmentColor.text}`}>
              {user.segment}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {user.segment === 'ROOKIE' && 'Building foundational skills'}
              {user.segment === 'AT_RISK' && 'Needs additional support'}
              {user.segment === 'HIGH_FLYER' && 'Exceeding expectations'}
            </p>
          </CardContent>
        </Card>

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
