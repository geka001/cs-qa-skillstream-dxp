'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Rocket, Zap, Trophy, CheckCircle, Loader2, Sparkles, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { activateChallengePro } from '@/lib/challengePro';
import { toast } from 'sonner';

interface ChallengeProCardProps {
  teamName: string;
  userName: string;
  isEnabled: boolean;
  onActivate: () => void;
}

/**
 * Small blinking Challenge Pro button to embed in other cards
 */
export function ChallengeProButton({ 
  teamName, 
  userName,
  isEnabled,
  onActivate 
}: ChallengeProCardProps) {
  const [isActivating, setIsActivating] = useState(false);
  const [isActivated, setIsActivated] = useState(isEnabled);
  const [showDetails, setShowDetails] = useState(false);
  
  useEffect(() => {
    setIsActivated(isEnabled);
  }, [isEnabled]);

  const handleActivate = async () => {
    setIsActivating(true);
    
    try {
      const result = await activateChallengePro(teamName, userName);
      
      if (result.success) {
        setIsActivated(true);
        onActivate();
        setShowDetails(false);
        toast.success('🚀 Challenge Pro Activated!', {
          description: 'You now have access to advanced enterprise-level content.'
        });
      } else {
        toast.error('Activation Failed', {
          description: result.message
        });
      }
    } catch (error) {
      toast.error('Error', {
        description: 'Something went wrong. Please try again.'
      });
    } finally {
      setIsActivating(false);
    }
  };

  // Already activated - show badge
  if (isActivated) {
    return (
      <Badge className="bg-purple-500 text-white animate-pulse">
        <Trophy className="w-3 h-3 mr-1" />
        Pro Active
      </Badge>
    );
  }

  // Show details panel
  if (showDetails) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="absolute right-0 top-full mt-2 w-80 z-50"
      >
        <Card className="border-2 border-purple-500 shadow-xl bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/90 dark:to-indigo-950/90">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-purple-700 dark:text-purple-300 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Challenge Pro
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowDetails(false)}
                className="h-6 w-6 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <CardDescription className="text-purple-600 dark:text-purple-400">
              Unlock enterprise-level content
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-white dark:bg-gray-900 rounded-lg p-3 space-y-1 border border-purple-200 dark:border-purple-800 text-sm">
              <div className="font-semibold text-purple-700 dark:text-purple-300">What You'll Get:</div>
              <ul className="space-y-1 text-muted-foreground text-xs">
                <li className="flex items-center gap-1.5">
                  <div className="w-1 h-1 rounded-full bg-purple-500" />
                  Enterprise architecture patterns
                </li>
                <li className="flex items-center gap-1.5">
                  <div className="w-1 h-1 rounded-full bg-purple-500" />
                  Advanced compliance strategies
                </li>
                <li className="flex items-center gap-1.5">
                  <div className="w-1 h-1 rounded-full bg-purple-500" />
                  Expert-level challenges
                </li>
              </ul>
            </div>

            <Button 
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg"
              size="sm"
              onClick={handleActivate}
              disabled={isActivating}
            >
              {isActivating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Activating...
                </>
              ) : (
                <>
                  <Rocket className="w-4 h-4 mr-2" />
                  Accept Challenge
                </>
              )}
            </Button>
            
            <p className="text-[10px] text-center text-muted-foreground">
              Level stays HIGH_FLYER • Unlocks bonus content
            </p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Blinking button (default state)
  return (
    <Button
      onClick={() => setShowDetails(true)}
      size="sm"
      className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg shadow-purple-500/30 transition-all duration-300 hover:scale-105"
    >
      {/* Blinking/Flickering effect */}
      <motion.div
        className="absolute inset-0 bg-white/20"
        animate={{
          opacity: [0, 0.4, 0, 0.3, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Sparkle */}
      <motion.span
        className="absolute -top-0.5 -right-0.5"
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, 10, -10, 0],
        }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
        }}
      >
        <Sparkles className="w-3 h-3 text-yellow-300" />
      </motion.span>
      
      <Rocket className="w-3.5 h-3.5 mr-1.5 relative z-10" />
      <span className="relative z-10 text-xs font-semibold">Challenge Pro</span>
    </Button>
  );
}

/**
 * Full Challenge Pro Card (used when activated)
 */
export default function ChallengeProCard({ 
  teamName, 
  userName,
  isEnabled,
  onActivate 
}: ChallengeProCardProps) {
  const [isActivating, setIsActivating] = useState(false);
  const [isActivated, setIsActivated] = useState(isEnabled);
  const [isExpanded, setIsExpanded] = useState(false);
  
  useEffect(() => {
    setIsActivated(isEnabled);
    if (isEnabled) {
      setIsExpanded(true);
    }
  }, [isEnabled]);

  const handleActivate = async () => {
    setIsActivating(true);
    
    try {
      const result = await activateChallengePro(teamName, userName);
      
      if (result.success) {
        setIsActivated(true);
        onActivate();
        toast.success('🚀 Challenge Pro Activated!', {
          description: 'You now have access to advanced enterprise-level content.'
        });
      } else {
        toast.error('Activation Failed', {
          description: result.message
        });
      }
    } catch (error) {
      toast.error('Error', {
        description: 'Something went wrong. Please try again.'
      });
    } finally {
      setIsActivating(false);
    }
  };

  // If already activated, show the active card
  if (isActivated) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="border-2 border-purple-500 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/40 dark:to-indigo-950/40 shadow-lg shadow-purple-500/20">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg shadow-purple-500/30">
                <Trophy className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-purple-700 dark:text-purple-300 flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Challenge Pro
                  </CardTitle>
                  <Badge className="bg-purple-500 text-white">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Active
                  </Badge>
                </div>
                <CardDescription className="text-purple-600 dark:text-purple-400">
                  Enterprise-level content unlocked!
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300 font-medium mb-2">
                <Trophy className="w-4 h-4" />
                Pro Content Unlocked
              </div>
              <p className="text-sm text-muted-foreground">
                You now have access to advanced {teamName} training modules with enterprise-level topics,
                complex scenarios, and expert-level quiz questions.
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400 mt-3">
              <CheckCircle className="w-4 h-4" />
              <span>Pro modules appear at the top of your learning path</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Not activated - don't show card (use ChallengeProButton instead)
  return null;
}
