'use client';

import { useState, useEffect, useRef } from 'react';
import { Module } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Clock, Tag, Video, FileText, Play, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';
import AITutor from '@/components/ai/AITutor';
import { getEditTagProps } from '@/lib/livePreview';

interface ModuleViewerProps {
  module: Module;
  onClose: () => void;
  onStartQuiz: () => void;
}

export default function ModuleViewer({ module, onClose, onStartQuiz }: ModuleViewerProps) {
  const [activeTab, setActiveTab] = useState<'content' | 'video'>('content');
  const [showAITutor, setShowAITutor] = useState(false);
  const { markContentRead, markVideoWatched } = useApp();
  
  // Use refs to track if actions have been performed
  const contentReadRef = useRef(false);
  const videoWatchedRef = useRef(false);

  // Track content reading - mark as read after 15 seconds
  useEffect(() => {
    if (activeTab === 'content' && !contentReadRef.current) {
      const timer = setTimeout(() => {
        markContentRead(module.id);
        contentReadRef.current = true;
      }, 15000); // 15 seconds
      
      return () => clearTimeout(timer);
    }
  }, [activeTab, module.id, markContentRead]);

  // Track video watching - mark as watched when video tab is opened
  useEffect(() => {
    if (activeTab === 'video' && module.videoUrl && !videoWatchedRef.current) {
      // Mark video as started immediately when tab opens
      const timer = setTimeout(() => {
        markVideoWatched(module.id);
        videoWatchedRef.current = true;
      }, 3000); // 3 seconds to give user time
      
      return () => clearTimeout(timer);
    }
  }, [activeTab, module.id, module.videoUrl, markVideoWatched]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl my-8 max-h-[90vh] overflow-y-auto"
      >
        <Card className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 z-10 bg-background/80 backdrop-blur-sm hover:bg-background"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </Button>

          <CardHeader className="border-b">
            <div className="flex items-start gap-4 pr-12">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">{module.category}</Badge>
                  <Badge>{module.difficulty}</Badge>
                  {module.mandatory && <Badge variant="destructive">Required</Badge>}
                </div>
                <CardTitle 
                  className="text-2xl mb-2"
                  {...(module.uid ? getEditTagProps({ uid: module.uid }, 'module', 'title') : {})}
                >
                  {module.title}
                </CardTitle>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {module.estimatedTime} min
                  </div>
                  <div className="flex items-center gap-1">
                    <Tag className="w-4 h-4" />
                    {module.tags.length} tags
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {/* Tabs */}
            <div className="border-b">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('content')}
                  className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-colors ${
                    activeTab === 'content'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  Content
                </button>
                {module.videoUrl && (
                  <button
                    onClick={() => setActiveTab('video')}
                    className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-colors ${
                      activeTab === 'video'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Video className="w-4 h-4" />
                    Video
                  </button>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {activeTab === 'content' && (
                <div 
                  className="prose dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: module.content }}
                  {...(module.uid ? getEditTagProps({ uid: module.uid }, 'module', 'content') : {})}
                />
              )}

              {activeTab === 'video' && module.videoUrl && (
                <div className="space-y-4">
                  <div className="aspect-video bg-black rounded-lg overflow-hidden">
                    <iframe
                      width="100%"
                      height="100%"
                      src={module.videoUrl}
                      title={module.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="w-full h-full"
                    ></iframe>
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    If video doesn't load, it may be restricted in your region or require accepting cookies.
                  </p>
                </div>
              )}

              {activeTab === 'video' && !module.videoUrl && (
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Video className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-muted-foreground">No video available for this module</p>
                  </div>
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="px-6 pb-6">
              <div className="flex flex-wrap gap-2">
                {module.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Quiz Section */}
            <div className="border-t bg-secondary/30 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold mb-1">Ready to test your knowledge?</h3>
                  <p className="text-sm text-muted-foreground">
                    {module.quiz?.length 
                      ? `Take the quiz to complete this module (${module.quiz.length} questions)` 
                      : 'Quiz content is being prepared and will be available soon'}
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button 
                    size="lg" 
                    variant="outline"
                    onClick={() => setShowAITutor(true)}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Ask AI Tutor
                  </Button>
                  <Button 
                    size="lg" 
                    onClick={onStartQuiz}
                    disabled={!module.quiz?.length}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start Quiz
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* AI Tutor */}
      <AnimatePresence>
        {showAITutor && (
          <AITutor 
            moduleTitle={module.title}
            onClose={() => setShowAITutor(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

