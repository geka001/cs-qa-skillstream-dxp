'use client';

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
  TrendingUp
} from 'lucide-react';
import { UserProfile } from '@/types';
import { getPersonalizedContent } from '@/data/mockData';

interface UserDetailModalProps {
  user: UserProfile | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function UserDetailModal({ user, isOpen, onClose }: UserDetailModalProps) {
  if (!isOpen || !user) return null;

  // For consistent onboarding tracking, always use ROOKIE content like QA dashboard
  const { modules: rookieModules, sops: rookieSOPs } = getPersonalizedContent('ROOKIE', user.completedModules, user.team);
  const { modules: currentModules, sops: currentSOPs, tools } = getPersonalizedContent(user.segment, user.completedModules, user.team);
  
  // Use ROOKIE mandatory SOPs for onboarding count (matches QA dashboard)
  const mandatorySOPs = rookieSOPs.filter(s => s.mandatory);
  const completedMandatorySOPsCount = (user.completedSOPs || []).filter(id =>
    mandatorySOPs.some(s => s.id === id)
  ).length;
  
  // Use mandatory modules for onboarding count
  const mandatoryModules = rookieModules.filter(m => m.mandatory);
  const completedMandatoryModulesCount = (user.completedModules || []).filter(id =>
    mandatoryModules.some(m => m.id === id)
  ).length;
  
  const completedModulesCount = user.completedModules?.length || 0;
  const completedSOPsCount = user.completedSOPs?.length || 0;
  const exploredToolsCount = user.exploredTools?.length || 0;
  const requiredToolsCount = 3; // Minimum tools required for onboarding
  
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="w-full max-w-4xl my-8"
          >
            <Card>
              <CardHeader className="border-b sticky top-0 bg-card z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white font-semibold text-2xl">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <CardTitle className="text-2xl">{user.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
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
                  <Button variant="ghost" size="icon" onClick={onClose}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <div className="text-3xl font-bold text-primary">{completedModulesCount}</div>
                      <div className="text-sm text-muted-foreground">Modules</div>
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
                        {user.onboardingComplete ? 'Complete' : 'In Progress'}
                      </div>
                    </CardContent>
                  </Card>
                </div>

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
                    All Learning Modules ({completedModulesCount}/{currentModules.length})
                  </h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {currentModules.slice(0, 10).map((module) => {
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
                    {currentModules.length > 10 && (
                      <div className="text-sm text-muted-foreground text-center py-2">
                        + {currentModules.length - 10} more modules
                      </div>
                    )}
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
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

