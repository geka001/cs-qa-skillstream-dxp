'use client';

import { SOP } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, FileText, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface SOPCardProps {
  sop: SOP;
  onView: (sop: SOP) => void;
}

export default function SOPCard({ sop, onView }: SOPCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const criticalityColors = {
    critical: { bg: 'bg-red-100 dark:bg-red-950', text: 'text-red-700 dark:text-red-300', border: 'border-red-300 dark:border-red-800' },
    high: { bg: 'bg-orange-100 dark:bg-orange-950', text: 'text-orange-700 dark:text-orange-300', border: 'border-orange-300 dark:border-orange-800' },
    medium: { bg: 'bg-yellow-100 dark:bg-yellow-950', text: 'text-yellow-700 dark:text-yellow-300', border: 'border-yellow-300 dark:border-yellow-800' },
    low: { bg: 'bg-blue-100 dark:bg-blue-950', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-300 dark:border-blue-800' }
  };

  const colors = criticalityColors[sop.criticality];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`border-l-4 ${colors.border} hover:shadow-md transition-shadow`}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-5 h-5 text-primary" />
                <Badge className={`${colors.bg} ${colors.text}`}>
                  {sop.criticality.toUpperCase()}
                </Badge>
                {sop.mandatory && (
                  <Badge variant="destructive">
                    Required
                  </Badge>
                )}
              </div>
              <CardTitle className="text-lg">{sop.title}</CardTitle>
              <CardDescription>{sop.steps.length} steps</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {isExpanded ? (
              <div className="space-y-2">
                <div className="font-semibold text-sm">Steps:</div>
                <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                  {sop.steps.slice(0, 3).map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                  {sop.steps.length > 3 && (
                    <li className="text-xs italic">...and {sop.steps.length - 3} more steps</li>
                  )}
                </ol>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {sop.steps[0]}
              </p>
            )}
            
            <div className="flex gap-2 pt-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? 'Show Less' : 'Show More'}
              </Button>
              <Button 
                size="sm"
                onClick={() => onView(sop)}
              >
                View Full SOP
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

