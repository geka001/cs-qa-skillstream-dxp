'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, TrendingDown, Video } from 'lucide-react';
import { motion } from 'framer-motion';

interface InterventionCardProps {
  onViewRemedial: () => void;
}

export default function InterventionCard({ onViewRemedial }: InterventionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-red-500 border-2 bg-red-50 dark:bg-red-950/30">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-red-700 dark:text-red-300 flex items-center gap-2">
                <TrendingDown className="w-5 h-5" />
                Learning Support Required
              </CardTitle>
              <CardDescription className="text-red-600 dark:text-red-400">
                Your manager has been notified
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-red-700 dark:text-red-300">
              We've noticed you're facing challenges with recent modules. Don't worry - 
              we've curated special remedial content to help you get back on track. 
              Your manager has been automatically notified and will reach out to provide additional support.
            </p>
            
            <div className="bg-white dark:bg-gray-900 rounded-lg p-4 space-y-2">
              <div className="font-semibold text-sm">Recommended Actions:</div>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Review foundational modules</li>
                <li>Watch remedial video tutorials</li>
                <li>Schedule 1:1 with your mentor</li>
                <li>Join weekly Q&A sessions</li>
              </ul>
            </div>

            <Button 
              className="w-full bg-red-600 hover:bg-red-700"
              onClick={onViewRemedial}
            >
              <Video className="w-4 h-4 mr-2" />
              View Remedial Content
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

