'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';
import { Tool } from '@/types';
import { getTools } from '@/data/mockData';
import ToolCard from '@/components/cards/ToolCard';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Wrench, Search } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ToolsPage() {
  const { user, isLoggedIn, markToolExplored } = useApp();
  const router = useRouter();
  const [personalizedTools, setPersonalizedTools] = useState<Tool[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }

    async function loadTools() {
      if (user) {
        setLoading(true);
        try {
          const tools = await getTools(user.team, user.segment);
          // Show only generic tools on the tools page
          const genericTools = tools.filter(t => t.isGeneric);
          setPersonalizedTools(genericTools);
        } catch (error) {
          console.error('Error loading tools:', error);
        } finally {
          setLoading(false);
        }
      }
    }

    loadTools();
    // Only reload when team or segment changes, NOT when exploredTools changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.team, user?.segment, isLoggedIn, router]);

  const handleToolClick = (toolId: string) => {
    markToolExplored(toolId);
  };

  if (!user) return null;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading tools...</p>
        </div>
      </div>
    );
  }

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(personalizedTools.map(t => t.category)))];

  // Filter tools
  const filteredTools = personalizedTools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tool.purpose.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Wrench className="w-8 h-8 text-primary" />
            QA Tools & Resources
          </h1>
          <p className="text-muted-foreground mt-2">
            Essential tools for your QA workflow
          </p>
        </div>
        <Badge className="text-lg px-4 py-2">
          {personalizedTools.length} Tools
        </Badge>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
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
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.slice(1).map((category) => {
          const count = personalizedTools.filter(t => t.category === category).length;
          return (
            <Card key={category}>
              <CardContent className="pt-6">
                <p className="text-2xl font-bold text-primary">{count}</p>
                <p className="text-sm text-muted-foreground capitalize">{category}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTools.map((tool) => {
          const isExplored = user.exploredTools?.includes(tool.id) || false;
          return (
            <div key={tool.id} onClick={() => handleToolClick(tool.id)} className="cursor-pointer">
              <ToolCard tool={tool} />
              {isExplored && (
                <div className="mt-2 text-center">
                  <Badge className="bg-green-500 text-xs">
                    ✓ Explored
                  </Badge>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredTools.length === 0 && (
        <Card className="p-12 text-center">
          <Wrench className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">
            {searchQuery ? 'No tools match your search.' : 'No tools available for your current segment.'}
          </p>
        </Card>
      )}
    </div>
  );
}

