'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';
import { Module } from '@/types';
import { getPersonalizedContentAsync } from '@/data/mockData';
import { 
  canAccessModule, 
  getUnmetPrerequisites, 
  getNextRecommendedModule,
  sortModulesByOrder,
  calculateModuleProgress,
  isLockedDueToAtRisk
} from '@/lib/prerequisites';
import ModuleCard from '@/components/cards/ModuleCard';
import ModuleViewer from '@/components/modules/ModuleViewer';
import QuizModal from '@/components/quiz/QuizModal';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { BookOpen, Search, Filter, ListFilter } from 'lucide-react';
import { toast } from 'sonner';
import { trackEvent } from '@/lib/personalize';

export default function ModulesPage() {
  const { user, completeModule, isLoggedIn } = useApp();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [personalizedModules, setPersonalizedModules] = useState<Module[]>([]);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }

    if (user) {
      const loadContent = async () => {
        setLoading(true);
        const content = await getPersonalizedContentAsync(user.segment, user.completedModules, user.team);
        setPersonalizedModules(content.modules);
        setLoading(false);
        
        // Check for URL parameters
        const categoryParam = searchParams.get('category');
        const difficultyParam = searchParams.get('difficulty');
        
        if (categoryParam) {
          setSelectedCategory(categoryParam);
        }
        if (difficultyParam) {
          setSelectedDifficulty(difficultyParam);
        }
      };
      
      loadContent();
    }
  }, [user, isLoggedIn, router, searchParams]);

  const handleStartModule = (module: Module) => {
    // Track click event for Personalize analytics
    trackEvent('click', { moduleId: module.id, moduleTitle: module.title });
    setSelectedModule(module);
  };

  const handleStartQuiz = () => {
    setShowQuiz(true);
  };

  const handleCompleteQuiz = (score: number) => {
    if (selectedModule) {
      completeModule(selectedModule.id, score);
      
      if (score >= 90) {
        toast.success('Outstanding performance!', {
          description: `You scored ${Math.round(score)}% on ${selectedModule.title}`,
        });
      } else if (score >= 70) {
        toast.success('Module completed!', {
          description: `You scored ${Math.round(score)}% on ${selectedModule.title}`,
        });
      } else if (score >= 50) {
        toast.warning('Module completed with concerns', {
          description: `You scored ${Math.round(score)}%. Consider reviewing the material.`,
        });
      } else {
        toast.error('Additional support recommended', {
          description: `You scored ${Math.round(score)}%. Your manager has been notified.`,
        });
      }
      
      setSelectedModule(null);
      setShowQuiz(false);
    }
  };

  if (!user) return null;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <BookOpen className="w-12 h-12 mx-auto animate-pulse text-primary" />
          <p className="text-muted-foreground">Loading modules...</p>
        </div>
      </div>
    );
  }

  const difficulties = ['all', 'beginner', 'intermediate', 'advanced'];
  const categories = ['all', ...Array.from(new Set(personalizedModules.map(m => m.category)))];

  // Filter modules
  const filteredModules = personalizedModules.filter(module => {
    const matchesSearch = module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         module.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         module.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesDifficulty = selectedDifficulty === 'all' || module.difficulty === selectedDifficulty;
    const matchesCategory = selectedCategory === 'all' || module.category === selectedCategory;
    return matchesSearch && matchesDifficulty && matchesCategory;
  });

  const completedCount = filteredModules.filter(m => user.completedModules.includes(m.id)).length;
  
  // Get next recommended module for the entire personalized set (segment-aware)
  const nextRecommendedModule = getNextRecommendedModule(personalizedModules, user.completedModules, user.segment);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-primary" />
            My Learning Modules
          </h1>
          <p className="text-muted-foreground mt-2">
            {completedCount} of {filteredModules.length} modules completed
          </p>
        </div>
        <Badge className="text-lg px-4 py-2">
          {user.segment}
        </Badge>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search modules, categories, tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              {/* Difficulty Filter */}
              <div className="flex gap-2 items-center flex-wrap">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Difficulty:</span>
                {difficulties.map((difficulty) => (
                  <Badge
                    key={difficulty}
                    variant={selectedDifficulty === difficulty ? "default" : "outline"}
                    className="cursor-pointer capitalize"
                    onClick={() => setSelectedDifficulty(difficulty)}
                  >
                    {difficulty}
                  </Badge>
                ))}
              </div>

              {/* Category Filter */}
              <div className="flex gap-2 items-center flex-wrap">
                <span className="text-sm font-medium">Category:</span>
                {categories.slice(0, 5).map((category) => (
                  <Badge
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    className="cursor-pointer capitalize"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {difficulties.slice(1).map((difficulty) => {
          const count = personalizedModules.filter(m => m.difficulty === difficulty).length;
          const completed = personalizedModules.filter(m => 
            m.difficulty === difficulty && user.completedModules.includes(m.id)
          ).length;
          
          return (
            <Card key={difficulty}>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground capitalize mb-1">{difficulty}</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-primary">{completed}</p>
                  <p className="text-muted-foreground">/ {count}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModules.map((module) => {
          const isCompleted = user.completedModules.includes(module.id);
          // Use segment-aware locking
          const isLocked = !canAccessModule(module, user.completedModules, user.segment, personalizedModules);
          const lockedByAtRisk = isLockedDueToAtRisk(module, user.completedModules, user.segment, personalizedModules);
          // Get prerequisites with segment awareness
          const unmetPrereqs = isLocked ? getUnmetPrerequisites(module, user.completedModules, personalizedModules, user.segment) : [];
          // Hide recommendation highlight if user is viewing a module
          const isNextRecommended = (nextRecommendedModule?.id === module.id) && !selectedModule;
          const progress = calculateModuleProgress(module.id, user.completedModules, user.moduleProgress);

          return (
            <ModuleCard
              key={module.id}
              module={module}
              isCompleted={isCompleted}
              onStart={handleStartModule}
              isLocked={isLocked}
              isNextRecommended={isNextRecommended}
              unmetPrerequisites={unmetPrereqs}
              progress={progress}
              lockedReason={lockedByAtRisk ? 'Complete remedial modules first' : undefined}
            />
          );
        })}
      </div>

      {filteredModules.length === 0 && (
        <Card className="p-12 text-center">
          <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">
            {searchQuery ? 'No modules match your search.' : 'No modules available for your current segment.'}
          </p>
        </Card>
      )}

      {/* Module Viewer Modal */}
      {selectedModule && !showQuiz && (
        <ModuleViewer
          module={selectedModule}
          onClose={() => setSelectedModule(null)}
          onStartQuiz={handleStartQuiz}
        />
      )}

      {/* Quiz Modal */}
      {selectedModule && showQuiz && (
        <QuizModal
          module={selectedModule}
          onClose={() => {
            setShowQuiz(false);
            setSelectedModule(null);
          }}
          onComplete={handleCompleteQuiz}
        />
      )}
    </div>
  );
}

