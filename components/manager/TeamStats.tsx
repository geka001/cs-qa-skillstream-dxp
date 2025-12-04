'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Users, CheckCircle2, AlertTriangle, TrendingUp, Clock, Trophy, Bell } from 'lucide-react';

interface TeamStatsProps {
  stats: {
    totalUsers: number;
    completedOnboarding: number;
    completionRate: number;
    atRiskCount: number;
    atRiskRate: number;
    rookieCount: number;
    highFlyerCount: number;
    averageCompletion: number;
    averageQuizScore: number;
    totalTimeSpent: number;
    totalInterventions?: number;
    usersWithInterventions?: number;
  };
}

export default function TeamStats({ stats }: TeamStatsProps) {
  const statCards = [
    {
      icon: Users,
      label: 'Total Team Members',
      value: stats.totalUsers,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950'
    },
    {
      icon: CheckCircle2,
      label: 'Onboarding Complete',
      value: `${stats.completedOnboarding} (${Math.round(stats.completionRate)}%)`,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-950'
    },
    {
      icon: AlertTriangle,
      label: 'Currently At-Risk',
      value: `${stats.atRiskCount} member${stats.atRiskCount !== 1 ? 's' : ''}`,
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-50 dark:bg-red-950'
    },
    {
      icon: Bell,
      label: 'Total Interventions',
      value: `${stats.totalInterventions || 0} (${stats.usersWithInterventions || 0} users)`,
      subtext: 'Members who needed support',
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-50 dark:bg-amber-950'
    },
    {
      icon: Trophy,
      label: 'Average Quiz Score',
      value: `${Math.round(stats.averageQuizScore)}%`,
      color: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-50 dark:bg-yellow-950'
    },
    {
      icon: TrendingUp,
      label: 'Average Completion',
      value: `${Math.round(stats.averageCompletion)}%`,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-950'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Segment Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Team Segment Distribution</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                Rookie
              </span>
              <span className="font-semibold">{stats.rookieCount} members</span>
            </div>
            <Progress 
              value={stats.totalUsers > 0 ? (stats.rookieCount / stats.totalUsers) * 100 : 0} 
              className="h-2"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                At-Risk
              </span>
              <span className="font-semibold">{stats.atRiskCount} members</span>
            </div>
            <Progress 
              value={stats.totalUsers > 0 ? (stats.atRiskCount / stats.totalUsers) * 100 : 0} 
              className="h-2"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                High-Flyer
              </span>
              <span className="font-semibold">{stats.highFlyerCount} members</span>
            </div>
            <Progress 
              value={stats.totalUsers > 0 ? (stats.highFlyerCount / stats.totalUsers) * 100 : 0} 
              className="h-2"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

