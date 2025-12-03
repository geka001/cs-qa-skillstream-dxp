'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';
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
  Activity
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
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

  // Generate weekly progress from user's actual activity
  // For now, we'll show aggregate data. In future, track daily activity.
  const totalDays = Math.ceil(user.timeSpent / 60 / 8); // Assuming 8 hours of learning per day
  const weeklyProgress = Array.from({ length: 7 }, (_, i) => {
    const dayIndex = 6 - i; // Last 7 days (today = 0, yesterday = 1, etc.)
    // Distribute completed modules across days
    const modulesForDay = i < user.completedModules.length ? 1 : 0;
    const timeForDay = modulesForDay > 0 ? Math.round(user.timeSpent / user.completedModules.length || 0) : 0;
    const scoreForDay = modulesForDay > 0 ? Math.round(analytics.averageQuizScore) : 0;
    
    return {
      day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date(Date.now() - dayIndex * 24 * 60 * 60 * 1000).getDay()],
      modules: modulesForDay,
      time: timeForDay,
      score: scoreForDay
    };
  }).reverse();

  const quizScores = Object.entries(user.quizScores).map(([moduleId, score], index) => ({
    name: `Module ${index + 1}`,
    score: score
  }));

  // Get actual module count from onboarding requirements
  const totalModulesRequired = 7; // This should come from onboarding requirements
  const completionData = [
    { name: 'Completed', value: user.completedModules.length, color: '#10b981' },
    { name: 'Remaining', value: Math.max(0, totalModulesRequired - user.completedModules.length), color: '#e5e7eb' }
  ];

  // Calculate category progress from actual completed modules
  // Group modules by category (you'll need to fetch this from modules data)
  // For now, showing a simplified version
  const completedCount = user.completedModules.length;
  const categoryProgress = [
    { 
      category: 'Completed Modules', 
      completed: completedCount, 
      total: totalModulesRequired,
      percentage: Math.round((completedCount / totalModulesRequired) * 100)
    }
  ];

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
              Detailed insights into your learning journey
            </p>
          </div>
          <Badge className={`text-lg px-4 py-2 ${currentSegmentColor.bg} ${currentSegmentColor.text}`}>
            {user.segment}
          </Badge>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="text-3xl font-bold">{user.completedModules.length}</div>
            <p className="text-sm text-muted-foreground">Modules Completed</p>
            <Progress value={(user.completedModules.length / 7) * 100} className="mt-2 h-1" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <Award className="w-8 h-8 text-primary" />
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="text-3xl font-bold">{Math.round(analytics.averageQuizScore)}%</div>
            <p className="text-sm text-muted-foreground">Average Score</p>
            <Progress value={analytics.averageQuizScore} className="mt-2 h-1" />
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

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-8 h-8 text-purple-500" />
              {user.interventionsReceived > 0 && <AlertTriangle className="w-4 h-4 text-red-500" />}
            </div>
            <div className="text-3xl font-bold">{user.interventionsReceived}</div>
            <p className="text-sm text-muted-foreground">Interventions</p>
            <p className="text-xs text-muted-foreground mt-1">Support notifications sent</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Weekly Activity
            </CardTitle>
            <CardDescription>Your learning activity over the past week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={weeklyProgress}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} className="text-muted-foreground" />
                <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" />
                <Tooltip />
                <Line type="monotone" dataKey="time" stroke="#3b82f6" strokeWidth={2} name="Minutes" />
                <Line type="monotone" dataKey="modules" stroke="#10b981" strokeWidth={2} name="Modules" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Module Completion */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Module Completion
            </CardTitle>
            <CardDescription>Overall progress through the curriculum</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={completionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {completionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center mt-4">
              <div className="text-4xl font-bold text-primary">{Math.round(analytics.moduleCompletion)}%</div>
              <p className="text-sm text-muted-foreground mt-1">
                {user.completedModules.length} of 7 modules completed
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quiz Performance */}
        {quizScores.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Quiz Performance
              </CardTitle>
              <CardDescription>Your scores across all completed quizzes</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={quizScores}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} className="text-muted-foreground" />
                  <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="score" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="text-center mt-4">
                <div className="text-3xl font-bold text-primary">{Math.round(analytics.averageQuizScore)}%</div>
                <p className="text-sm text-muted-foreground">Average Score</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Learning Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              Learning Summary
            </CardTitle>
            <CardDescription>Your overall progress and completion status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {categoryProgress.map((cat) => (
                <div key={cat.category}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium">{cat.category}</span>
                    <span className="text-sm font-semibold text-primary">
                      {cat.completed}/{cat.total} ({cat.percentage}%)
                    </span>
                  </div>
                  <Progress value={cat.percentage} className="h-3" />
                </div>
              ))}
              
              {/* Additional Stats */}
              <div className="pt-4 border-t space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">SOPs Completed</span>
                  <span className="font-semibold">{user.completedSOPs?.length || 0}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Tools Explored</span>
                  <span className="font-semibold">{user.exploredTools?.length || 0}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Average Quiz Score</span>
                  <span className="font-semibold">{Math.round(analytics.averageQuizScore)}%</span>
                </div>
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
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {new Date(entry.date).toLocaleString()}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

