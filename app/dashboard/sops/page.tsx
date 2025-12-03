'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';
import { SOP } from '@/types';
import { getSOPs } from '@/data/mockData';
import SOPCard from '@/components/cards/SOPCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, FileText, CheckSquare } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SOPsPage() {
  const { user, isLoggedIn, markSOPComplete } = useApp();
  const router = useRouter();
  const [personalizedSOPs, setPersonalizedSOPs] = useState<SOP[]>([]);
  const [selectedSOP, setSelectedSOP] = useState<SOP | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }

    async function loadSOPs() {
      if (user) {
        setLoading(true);
        try {
          const sops = await getSOPs(user.team, user.segment);
          
          // Sort by criticality: critical > high > medium > low
          const criticalityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
          const sortedSOPs = sops.sort((a, b) => 
            criticalityOrder[a.criticality] - criticalityOrder[b.criticality]
          );
          
          setPersonalizedSOPs(sortedSOPs);
        } catch (error) {
          console.error('Error loading SOPs:', error);
        } finally {
          setLoading(false);
        }
      }
    }

    loadSOPs();
    // Only reload when team or segment changes, NOT when completedSOPs changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.team, user?.segment, isLoggedIn, router]);

  const handleViewSOP = (sop: SOP) => {
    setSelectedSOP(sop);
  };

  const handleCloseSOP = () => {
    if (selectedSOP) {
      console.log('📝 Closing SOP and marking complete:', selectedSOP.id);
      console.log('📝 Current completed SOPs:', user?.completedSOPs);
      
      // Mark SOP as complete when closing
      markSOPComplete(selectedSOP.id);
    }
    setSelectedSOP(null);
  };

  if (!user) return null;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading SOPs...</p>
        </div>
      </div>
    );
  }

  const criticalityColors = {
    critical: 'bg-red-500',
    high: 'bg-orange-500',
    medium: 'bg-yellow-500',
    low: 'bg-blue-500'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <FileText className="w-8 h-8 text-primary" />
            Standard Operating Procedures
          </h1>
          <p className="text-muted-foreground mt-2">
            Essential procedures and workflows for your QA role
          </p>
        </div>
        <Badge className="text-lg px-4 py-2">
          {personalizedSOPs.length} SOPs
        </Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {(['critical', 'high', 'medium', 'low'] as const).map((level) => {
          const count = personalizedSOPs.filter(s => s.criticality === level).length;
          return (
            <Card key={level}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${criticalityColors[level]}`} />
                  <div>
                    <p className="text-2xl font-bold">{count}</p>
                    <p className="text-sm text-muted-foreground capitalize">{level}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* SOPs List */}
      <div className="space-y-4">
        {personalizedSOPs.map((sop) => {
          const isCompleted = user.completedSOPs?.includes(sop.id) || false;
          return (
            <div key={sop.id} className="relative">
              <SOPCard sop={sop} onView={handleViewSOP} />
              {isCompleted && (
                <div className="absolute top-4 right-4 z-10">
                  <Badge className="bg-green-500 hover:bg-green-600">
                    <CheckSquare className="w-3 h-3 mr-1" />
                    Read
                  </Badge>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {personalizedSOPs.length === 0 && (
        <Card className="p-12 text-center">
          <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">
            No SOPs available for your current segment.
          </p>
        </Card>
      )}

      {/* SOP Detail Modal */}
      {selectedSOP && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-3xl my-8"
          >
            <Card className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-4 z-10 bg-card/80 backdrop-blur-sm"
                onClick={handleCloseSOP}
              >
                <X className="w-5 h-5" />
              </Button>

              <CardHeader className="border-b pb-6">
                <div className="flex items-start gap-4 pr-12">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className={
                        selectedSOP.criticality === 'critical' ? 'bg-red-500' :
                        selectedSOP.criticality === 'high' ? 'bg-orange-500' :
                        selectedSOP.criticality === 'medium' ? 'bg-yellow-500' :
                        'bg-blue-500'
                      }>
                        {selectedSOP.criticality.toUpperCase()}
                      </Badge>
                      {selectedSOP.mandatory && (
                        <Badge variant="destructive">
                          Required for Onboarding
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-2xl">{selectedSOP.title}</CardTitle>
                    <CardDescription className="mt-2">
                      {selectedSOP.steps.length} steps to complete
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6 pt-6 max-h-[60vh] overflow-y-auto">
                {/* Steps */}
                <div>
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <CheckSquare className="w-5 h-5 text-primary" />
                    Procedure Steps
                  </h3>
                  <ol className="space-y-3 pb-4">
                    {selectedSOP.steps.map((step, index) => (
                      <li key={index} className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
                          {index + 1}
                        </div>
                        <div className="flex-1 pt-1">
                          <p className="text-sm">{step}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Related Tools */}
                {selectedSOP.relatedTools.length > 0 && (
                  <div className="border-t pt-6 pb-4">
                    <h3 className="font-semibold mb-3">Related Tools</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedSOP.relatedTools.map((toolId) => (
                        <Badge key={toolId} variant="outline">
                          Tool {toolId}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>

              <div className="flex gap-2 p-6 border-t bg-card">
                <Button className="flex-1" onClick={handleCloseSOP}>
                  Got it!
                </Button>
                <Button variant="outline" onClick={() => window.print()}>
                  Print SOP
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      )}
    </div>
  );
}

