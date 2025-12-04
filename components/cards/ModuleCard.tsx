'use client';

import { Module } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Clock, Play, CheckCircle2, Lock, AlertCircle, Star, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import { getEditTagProps } from '@/lib/livePreview';

interface ModuleCardProps {
  module: Module;
  isCompleted: boolean;
  onStart: (module: Module) => void;
  isLocked?: boolean;
  isNextRecommended?: boolean;
  unmetPrerequisites?: Module[];
  progress?: number;
  lockedReason?: string;
}

export default function ModuleCard({ 
  module, 
  isCompleted, 
  onStart,
  isLocked = false,
  isNextRecommended = false,
  unmetPrerequisites = [],
  progress = 0,
  lockedReason
}: ModuleCardProps) {
  const difficultyColors = {
    beginner: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    intermediate: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
    advanced: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={!isLocked ? { scale: 1.02 } : {}}
    >
      <Card className={`h-full flex flex-col hover:shadow-lg transition-shadow relative ${
        isLocked ? 'opacity-60' : ''
      } ${
        isNextRecommended ? 'border-primary border-2 shadow-lg' : ''
      }`}>
        {/* Lock Overlay */}
        {isLocked && (
          <div className="absolute top-3 right-3 z-10">
            <div className="bg-background rounded-full p-2 shadow-md">
              <Lock className="w-5 h-5 text-muted-foreground" />
            </div>
          </div>
        )}

        {/* Next Recommended Badge */}
        {isNextRecommended && !isLocked && !isCompleted && (
          <div className="absolute -top-2 -right-2 z-10">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="bg-primary rounded-full p-2 shadow-lg">
                <Star className="w-5 h-5 text-primary-foreground fill-current" />
              </div>
            </motion.div>
          </div>
        )}

        <CardHeader>
          <div className="flex items-start justify-between mb-2 gap-2">
            <Badge className={difficultyColors[module.difficulty]}>
              {module.difficulty}
            </Badge>
            <div className="flex gap-1">
              {module.mandatory && (
                <Badge variant="destructive" className="text-xs">Required</Badge>
              )}
              {isCompleted && (
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              )}
            </div>
          </div>
          <CardTitle 
            className="text-lg line-clamp-2"
            {...(module.uid ? getEditTagProps({ uid: module.uid }, 'module', 'title') : {})}
          >
            {module.title}
          </CardTitle>
          <CardDescription
            {...(module.uid ? getEditTagProps({ uid: module.uid }, 'module', 'category') : {})}
          >
            {module.category}
          </CardDescription>
          
          {/* Module Order Badge */}
          {module.order && (
            <Badge variant="outline" className="w-fit text-xs mt-2">
              Module {module.order}
            </Badge>
          )}
        </CardHeader>

        <CardContent className="flex-1 space-y-4">
          {/* Progress Bar */}
          {progress > 0 && !isCompleted && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {/* Time and Tags */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{module.estimatedTime} minutes</span>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {module.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {module.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{module.tags.length - 3}
                </Badge>
              )}
            </div>
          </div>

          {/* Locked Reason / Prerequisites Warning */}
          {isLocked && (lockedReason || unmetPrerequisites.length > 0) && (
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs font-medium text-amber-700 dark:text-amber-300 mb-1">
                    {lockedReason ? 'Module Locked' : 'Prerequisites Required'}
                  </p>
                  <p className="text-xs text-amber-600 dark:text-amber-400">
                    {lockedReason || `Complete: ${unmetPrerequisites.map(m => m.title).join(', ')}`}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Next Recommended Badge */}
          {isNextRecommended && !isLocked && !isCompleted && (
            <div className="bg-primary/10 border border-primary rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-primary fill-current" />
                <p className="text-xs font-medium text-primary">
                  Recommended Next
                </p>
              </div>
            </div>
          )}

          {/* Completed Score */}
          {isCompleted && (
            <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="text-xs font-medium text-green-700 dark:text-green-300">
                    Completed
                  </span>
                </div>
                <Badge variant="outline" className="bg-green-100 dark:bg-green-900">
                  100%
                </Badge>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter>
          <Button 
            className="w-full" 
            onClick={() => !isLocked && onStart(module)}
            variant={isCompleted ? "outline" : isNextRecommended ? "default" : "secondary"}
            disabled={isLocked}
          >
            {isLocked ? (
              <>
                <Lock className="w-4 h-4 mr-2" />
                Locked
              </>
            ) : isCompleted ? (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Review Module
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                {isNextRecommended ? 'Start Next' : 'Start Learning'}
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
