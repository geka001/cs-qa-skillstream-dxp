'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { Module } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Clock, Tag, Video, FileText, Play, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';
import AITutor from '@/components/ai/AITutor';
import { getEditTagProps } from '@/lib/livePreview';
import { marked } from 'marked';

// Configure marked for safe rendering
marked.setOptions({
  breaks: true,       // Convert \n to <br>
  gfm: true,          // GitHub Flavored Markdown
});

/**
 * Check if content is HTML (has HTML tags) or Markdown
 */
function isHtml(content: string): boolean {
  // Check for common HTML tags
  const htmlPattern = /<(h[1-6]|p|div|span|ul|ol|li|a|strong|em|table|tr|td|th|img|br|hr)[^>]*>/i;
  return htmlPattern.test(content);
}

/**
 * Clean up HTML content - remove excessive whitespace between tags
 */
function cleanHtml(content: string): string {
  return content
    // Remove multiple newlines between closing and opening tags
    .replace(/>\s*\n\s*\n+\s*</g, '>\n<')
    // Remove excessive whitespace between tags
    .replace(/>\s+</g, '> <')
    // Clean up whitespace around block elements
    .replace(/(<\/(h[1-6]|p|div|ul|ol|li|table|tr|td|th|blockquote)>)\s*\n*\s*(<(h[1-6]|p|div|ul|ol|li|table|tr|td|th|blockquote))/gi, '$1$3')
    .trim();
}

/**
 * Parse content - convert Markdown to HTML if needed, clean HTML if already formatted
 */
function parseContent(content: string): string {
  if (!content) return '';
  
  // If content already has HTML tags, clean it up and return
  if (isHtml(content)) {
    return cleanHtml(content);
  }
  
  // Otherwise, parse as Markdown
  try {
    return marked.parse(content) as string;
  } catch (error) {
    console.error('Error parsing markdown:', error);
    return content;
  }
}

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
  
  // Parse markdown content to HTML (memoized to avoid re-parsing)
  const parsedContent = useMemo(() => {
    return parseContent(module.content);
  }, [module.content]);

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
                  className="prose dark:prose-invert max-w-none prose-headings:scroll-mt-20 prose-h1:text-3xl prose-h1:font-bold prose-h1:mb-6 prose-h2:text-2xl prose-h2:font-semibold prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-xl prose-h3:font-semibold prose-h3:mt-6 prose-h3:mb-3 prose-h4:text-lg prose-h4:font-medium prose-h4:mt-4 prose-h4:mb-2 prose-p:mb-4 prose-ul:mb-4 prose-ol:mb-4 prose-li:mb-1 prose-strong:font-semibold prose-hr:my-8"
                  dangerouslySetInnerHTML={{ __html: parsedContent }}
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

