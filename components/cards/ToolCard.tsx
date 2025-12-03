'use client';

import { Tool } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Wrench, ExternalLink, Boxes } from 'lucide-react';
import { motion } from 'framer-motion';

interface ToolCardProps {
  tool: Tool;
}

export default function ToolCard({ tool }: ToolCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.03 }}
    >
      <Card className="h-full hover:shadow-lg transition-all bg-gradient-to-br from-card to-card/50">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
              <Wrench className="w-6 h-6 text-primary" />
            </div>
            <Badge variant="secondary">{tool.category}</Badge>
          </div>
          <CardTitle className="text-lg">{tool.name}</CardTitle>
          <CardDescription className="line-clamp-2">{tool.purpose}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tool.integrations.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Boxes className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs font-semibold text-muted-foreground">Integrations:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tool.integrations.slice(0, 3).map((integration) => (
                    <Badge key={integration} variant="outline" className="text-xs">
                      {integration}
                    </Badge>
                  ))}
                  {tool.integrations.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{tool.integrations.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            )}
            
            <Button 
              className="w-full" 
              variant="outline"
              onClick={() => window.open(tool.docsLink, '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View Documentation
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

