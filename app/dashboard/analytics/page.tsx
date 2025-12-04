'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';
import { getPersonalizedContent } from '@/data/mockData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Clock, 
  Target, 
  Award,
  AlertTriangle,
  CheckCircle2,
  BarChart3,
  Activity,
  BookOpen,
  Trophy,
  Star
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

export default function AnalyticsPage() {
  const { user, analytics, isLoggedIn } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
    }
  }, [isLoggedIn, router]);

  if (!user) return null;

  const segmentColors = {
    ROOKIE: { bg: 'bg-blue-50 dark:bg-blue-950', text: 'text-blue-700 dark:text-blue-300', fill: '#3b82f6' },
    AT_RISK: { bg: 'bg-red-50 dark:bg-red-950', text: 'text-red-700 dark:text-red-300', fill: '#ef4444' },
    HIGH_FLYER: { bg: 'bg-green-50 dark:bg-green-950', text: 'text-green-700 dark:text-green-300', fill: '#10b981' }
  };

  const currentSegmentColor = segmentColors[user.segment];

  // Get personalized content for the user's segment - this includes ALL modules they have access to
  const personalizedContent = getPersonalizedContent(user.segment, user.completedModules, user.team);
  
  // Total modules they can see
  const totalAvailableModules = personalizedContent.modules.length;
  // Modules they've completed
  const totalCompletedModules = user.completedModules.length;
  // Progress percentage
  const moduleProgress = totalAvailableModules > 0 
    ? Math.round((totalCompletedModules / totalAvailableModules) * 100) 
    : 0;

  // Quiz scores with module names
  const quizScores = Object.entries(user.quizScores).map(([moduleId, score], index) => {
    const module = personalizedContent.modules.find(m => m.id === moduleId);
    return {
      name: module ? module.title.substring(0, 15) + '...' : `Quiz ${index + 1}`,
      score: score,
      fullName: module?.title || moduleId
    };
  });

  // Calculate stats
  const avgScore = quizScores.length > 0 
    ? Math.round(quizScores.reduce((sum, q) => sum + q.score, 0) / quizScores.length)
    : 0;
  
  const highestScore = quizScores.length > 0 
    ? Math.max(...quizScores.map(q => q.score))
    : 0;

  const perfectScores = quizScores.filter(q => q.score >= 90).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-primary" />
              Learning Analytics
            </h1>
            <p className="text-muted-foreground mt-2">
              Your complete learning journey
            </p>
          </div>
          <Badge className={`text-lg px-4 py-2 ${currentSegmentColor.bg} ${currentSegmentColor.text}`}>
            {user.segment === 'HIGH_FLYER' && <Trophy className="w-4 h-4 mr-1" />}
            {user.segment}
          </Badge>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <BookOpen className="w-8 h-8 text-blue-500" />
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="text-3xl font-bold">{totalCompletedModules}</div>
            <p className="text-sm text-muted-foreground">Modules Completed</p>
            <p className="text-xs text-muted-foreground mt-1">of {totalAvailableModules} available</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <Award className="w-8 h-8 text-primary" />
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="text-3xl font-bold">{avgScore}%</div>
            <p className="text-sm text-muted-foreground">Average Quiz Score</p>
            <p className="text-xs text-muted-foreground mt-1">Best: {highestScore}%</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-8 h-8 text-orange-500" />
              <Activity className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="text-3xl font-bold">{analytics.timeSpent}</div>
            <p className="text-sm text-muted-foreground">Minutes Invested</p>
            <p className="text-xs text-muted-foreground mt-1">≈ {Math.round(analytics.timeSpent / 60)} hours</p>
          </CardContent>
        </Card>

        <Card className={perfectScores > 0 ? "border-green-200 dark:border-green-800" : user.interventionsReceived > 0 ? "border-amber-200 dark:border-amber-800" : ""}>
          <CardContent className="pt-6">
            {perfectScores > 0 ? (
              <>
                <div className="flex items-center justify-between mb-2">
                  <Star className="w-8 h-8 text-yellow-500" />
                  <Trophy className="w-4 h-4 text-yellow-500" />
                </div>
                <div className="text-3xl font-bold">{perfectScores}</div>
                <p className="text-sm text-muted-foreground">Perfect Scores (90%+)</p>
                <p className="text-xs text-muted-foreground mt-1">Keep up the excellence!</p>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between mb-2">
                  <AlertTriangle className={`w-8 h-8 ${user.interventionsReceived > 0 ? 'text-amber-500' : 'text-gray-300'}`} />
                  {user.interventionsReceived > 0 && <Target className="w-4 h-4 text-amber-500" />}
                </div>
                <div className="text-3xl font-bold">{user.interventionsReceived}</div>
                <p className="text-sm text-muted-foreground">Interventions</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {user.interventionsReceived > 0 ? 'Support provided' : 'No interventions needed'}
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Progress Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quiz Performance Chart - only show if has scores */}
        {quizScores.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Quiz Performance
              </CardTitle>
              <CardDescription>Your scores across {quizScores.length} completed quizzes</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={quizScores}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} className="text-muted-foreground" angle={-45} textAnchor="end" height={60} />
                  <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" domain={[0, 100]} />
                  <Tooltip 
                    content={({ payload }) => {
                      if (payload && payload.length > 0) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-background border rounded-lg p-2 shadow-lg">
                            <p className="font-medium text-sm">{data.fullName}</p>
                            <p className="text-primary font-bold">{data.score}%</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar 
                    dataKey="score" 
                    fill="hsl(var(--primary))" 
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
              <div className="flex justify-around mt-4 pt-4 border-t">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{avgScore}%</div>
                  <p className="text-xs text-muted-foreground">Average</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{highestScore}%</div>
                  <p className="text-xs text-muted-foreground">Highest</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-600">{quizScores.length}</div>
                  <p className="text-xs text-muted-foreground">Quizzes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Learning Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              Learning Progress
            </CardTitle>
            <CardDescription>
              {user.onboardingComplete 
                ? 'Onboarding complete! Continue learning to master more skills.'
                : 'Track your progress towards onboarding completion'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              {/* Module Progress */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Modules Completed</span>
                  <span className="text-sm font-semibold text-primary">
                    {totalCompletedModules}/{totalAvailableModules}
                  </span>
                </div>
                <Progress value={moduleProgress} className="h-3" />
                <p className="text-xs text-muted-foreground mt-1">
                  {totalAvailableModules - totalCompletedModules > 0 
                    ? `${totalAvailableModules - totalCompletedModules} more to explore`
                    : '🎉 All available modules completed!'
                  }
                </p>
              </div>
              
              {/* SOPs */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">SOPs Reviewed</span>
                  <span className="text-sm font-semibold text-primary">
                    {user.completedSOPs?.length || 0}
                  </span>
                </div>
                <Progress value={Math.min((user.completedSOPs?.length || 0) * 25, 100)} className="h-2" />
              </div>
              
              {/* Tools */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Tools Explored</span>
                  <span className="text-sm font-semibold text-primary">
                    {user.exploredTools?.length || 0}
                  </span>
                </div>
                <Progress value={Math.min((user.exploredTools?.length || 0) * 33, 100)} className="h-2" />
              </div>
              
              {/* Onboarding Status */}
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Onboarding Status</span>
                  <Badge variant={user.onboardingComplete ? "default" : "secondary"} className={user.onboardingComplete ? "bg-green-500" : ""}>
                    {user.onboardingComplete ? (
                      <><CheckCircle2 className="w-3 h-3 mr-1" /> Complete</>
                    ) : (
                      'In Progress'
                    )}
                  </Badge>
                </div>
                {user.onboardingCompletedDate && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Completed on {new Date(user.onboardingCompletedDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Segment History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Segment Journey
          </CardTitle>
          <CardDescription>Your progression through learning segments</CardDescription>
        </CardHeader>
        <CardContent>
          {analytics.segmentHistory.length > 0 ? (
            <div className="space-y-3">
              {analytics.segmentHistory.slice(-10).reverse().map((entry, index) => {
                const color = segmentColors[entry.segment];
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-lg border"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: color.fill }} />
                      <Badge variant="outline" className={color.text}>
                        {entry.segment}
                      </Badge>
                      {index === 0 && (
                        <Badge variant="secondary" className="text-xs">Current</Badge>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {new Date(entry.date).toLocaleString()}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Your segment journey will appear here as you progress.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats Summary for HIGH_FLYER */}
      {user.segment === 'HIGH_FLYER' && (
        <Card className="border-green-200 dark:border-green-800 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4 mb-4">
              <Trophy className="w-10 h-10 text-green-600" />
              <div>
                <h3 className="text-xl font-bold text-green-700 dark:text-green-300">High Flyer Achievement</h3>
                <p className="text-sm text-green-600 dark:text-green-400">You've mastered the fundamentals and unlocked advanced content!</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-green-200 dark:border-green-800">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-700 dark:text-green-300">{totalCompletedModules}</div>
                <p className="text-xs text-green-600 dark:text-green-400">Total Modules</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-700 dark:text-green-300">{avgScore}%</div>
                <p className="text-xs text-green-600 dark:text-green-400">Avg Score</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-700 dark:text-green-300">{analytics.timeSpent}m</div>
                <p className="text-xs text-green-600 dark:text-green-400">Time Invested</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-700 dark:text-green-300">{perfectScores}</div>
                <p className="text-xs text-green-600 dark:text-green-400">Perfect Scores</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
