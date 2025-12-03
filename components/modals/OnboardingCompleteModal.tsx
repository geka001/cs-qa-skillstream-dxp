'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GraduationCap, Trophy, Sparkles, X, Star } from 'lucide-react';

interface OnboardingCompleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  completionDate: string;
  userName: string;
  userTeam?: string;
}

export default function OnboardingCompleteModal({ 
  isOpen, 
  onClose, 
  completionDate,
  userName,
  userTeam
}: OnboardingCompleteModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Animated Background Stars */}
          <div className="fixed inset-0 pointer-events-none z-40">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                initial={{ 
                  opacity: 0,
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                  scale: 0
                }}
                animate={{ 
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0],
                  rotate: [0, 180, 360]
                }}
                transition={{ 
                  duration: 2,
                  delay: i * 0.1,
                  repeat: 2
                }}
              >
                <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
              </motion.div>
            ))}
          </div>

          {/* Modal Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
          >
            {/* Modal Content */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl max-h-[85vh] overflow-y-auto"
            >
              <Card className="relative overflow-hidden border-2 border-primary shadow-2xl">
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-950 dark:via-emerald-950 dark:to-teal-950 opacity-50" />

                {/* Animated Gradient Overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                />

                {/* Close Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-4 z-10"
                  onClick={onClose}
                >
                  <X className="w-5 h-5" />
                </Button>

                {/* Content */}
                <div className="relative">
                  <CardHeader className="text-center pt-12 pb-6">
                    {/* Icon Animation */}
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                      className="mx-auto mb-6 relative"
                    >
                      <div className="relative">
                        <motion.div 
                          className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full blur-xl opacity-50"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                        <div className="relative bg-gradient-to-r from-green-500 to-emerald-600 rounded-full p-6">
                          <GraduationCap className="w-16 h-16 text-white" />
                        </div>
                      </div>
                      
                      {/* Floating Icons */}
                      <motion.div
                        animate={{ 
                          y: [-10, 10, -10],
                          rotate: [0, 5, 0, -5, 0]
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="absolute -top-2 -right-2"
                      >
                        <Trophy className="w-8 h-8 text-yellow-500" />
                      </motion.div>
                      
                      <motion.div
                        animate={{ 
                          y: [10, -10, 10],
                          rotate: [0, -5, 0, 5, 0]
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="absolute -bottom-2 -left-2"
                      >
                        <Sparkles className="w-8 h-8 text-purple-500" />
                      </motion.div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <CardTitle className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3">
                        🎉 Congratulations, {userName}!
                      </CardTitle>
                      <CardDescription className="text-lg text-foreground font-medium">
                        You've Successfully Completed Your {userTeam ? `${userTeam} Team ` : ''}QA Onboarding!
                      </CardDescription>
                    </motion.div>
                  </CardHeader>

                  <CardContent className="space-y-6 pb-8">
                    {/* Achievement Summary */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-6 space-y-4"
                    >
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-yellow-600" />
                        What You've Accomplished:
                      </h3>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <span className="text-green-600 font-bold">✓</span>
                          <span>Completed all mandatory learning modules</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-green-600 font-bold">✓</span>
                          <span>Reviewed essential SOPs and procedures</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-green-600 font-bold">✓</span>
                          <span>Explored critical QA tools</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-green-600 font-bold">✓</span>
                          <span>Achieved passing scores on all assessments</span>
                        </li>
                      </ul>
                    </motion.div>

                    {/* Next Steps */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-6 space-y-3"
                    >
                      <h3 className="font-semibold text-lg flex items-center gap-2 text-blue-700 dark:text-blue-300">
                        <Sparkles className="w-5 h-5" />
                        What's Next?
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        You're now ready to contribute to real QA projects! Continue learning and growing with our advanced modules. 
                        Maintain excellence in your work (90%+ scores), and you'll be promoted to <strong>High-Flyer</strong> status with access to 
                        expert-level content and advanced certifications.
                      </p>
                    </motion.div>

                    {/* Completion Date */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                      className="text-center text-sm text-muted-foreground"
                    >
                      Completed on {new Date(completionDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </motion.div>

                    {/* Action Button */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.2 }}
                    >
                      <Button 
                        onClick={onClose}
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-6 text-lg"
                        size="lg"
                      >
                        Continue Learning Journey
                      </Button>
                    </motion.div>
                  </CardContent>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
