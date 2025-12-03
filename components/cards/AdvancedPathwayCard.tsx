'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Trophy, TrendingUp, Rocket } from 'lucide-react';
import { motion } from 'framer-motion';
import { Module } from '@/types';

interface AdvancedPathwayCardProps {
  onExploreAdvanced: () => void;
  availableModules?: Module[];
}

export default function AdvancedPathwayCard({ onExploreAdvanced, availableModules = [] }: AdvancedPathwayCardProps) {
  // Show actual HIGH_FLYER modules from Contentstack (max 3)
  const advancedModules = availableModules
    .filter(m => !m.mandatory) // Filter out onboarding modules
    .slice(0, 3); // Show first 3

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-green-500 border-2 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-green-700 dark:text-green-300 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Outstanding Progress!
              </CardTitle>
              <CardDescription className="text-green-600 dark:text-green-400">
                You're a High-Flyer
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-green-700 dark:text-green-300">
              Congratulations! Your exceptional performance has unlocked advanced learning pathways. 
              You're ready to master complex QA techniques and automation frameworks.
            </p>
            
            <div className="bg-white dark:bg-gray-900 rounded-lg p-4 space-y-3">
              <div className="font-semibold text-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                Advanced Modules Now Available:
              </div>
              <div className="space-y-2">
                {advancedModules.length > 0 ? (
                  advancedModules.map((module) => (
                    <div key={module.id} className="flex items-center gap-2">
                      <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                        New
                      </Badge>
                      <span className="text-sm">{module.title}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-muted-foreground">
                    New advanced modules will be available soon!
                  </div>
                )}
              </div>
            </div>

            <Button 
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              onClick={onExploreAdvanced}
            >
              <Rocket className="w-4 h-4 mr-2" />
              Explore Advanced Content
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

