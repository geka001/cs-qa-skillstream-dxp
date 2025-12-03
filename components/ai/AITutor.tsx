/**
 * AI Tutor Placeholder Component
 * A chat-like AI assistant for helping learners with questions
 * Currently a placeholder - can be integrated with actual AI service later
 */

'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Send, Sparkles, X, Minimize2, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: string;
}

interface AITutorProps {
  moduleTitle?: string;
  onClose?: () => void;
}

export default function AITutor({ moduleTitle, onClose }: AITutorProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Hi! I'm your AI QA Tutor. I'm here to help you with questions about ${moduleTitle || 'this module'}. Ask me anything!`,
      sender: 'ai',
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);

  // Placeholder AI responses
  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    // Simple keyword-based responses (placeholder)
    if (lowerMessage.includes('test case')) {
      return "A test case is a set of conditions or variables under which a tester will determine whether a system under test satisfies requirements. Key components include: Test Case ID, Description, Preconditions, Test Steps, Expected Results, and Actual Results.";
    } else if (lowerMessage.includes('defect') || lowerMessage.includes('bug')) {
      return "A good defect report should include: Clear Summary, Detailed Steps to Reproduce, Expected vs Actual Behavior, Environment Details (OS, browser, version), Severity & Priority, and Supporting Evidence (screenshots, logs).";
    } else if (lowerMessage.includes('automation')) {
      return "Test automation is best for: Repetitive tests, Regression testing, Tests that need to run on multiple configurations, Performance and load tests. Not ideal for: Exploratory testing, One-time tests, Tests with frequently changing requirements.";
    } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return "Hello! How can I help you with your QA learning today?";
    } else if (lowerMessage.includes('thank')) {
      return "You're welcome! Keep up the great work with your learning. Feel free to ask more questions anytime!";
    } else {
      return "That's a great question! While I'm currently a placeholder AI assistant, I'm here to help guide your learning. For detailed answers, please refer to the module content or reach out to your mentor. In the future, I'll be powered by advanced AI to provide more specific assistance!";
    }
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    // Simulate AI response after a short delay
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getAIResponse(inputMessage),
        sender: 'ai',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 800);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (isMinimized) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-4 right-4 z-50"
      >
        <Button
          onClick={() => setIsMinimized(false)}
          className="rounded-full w-16 h-16 shadow-lg"
          size="lg"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
        <Badge className="absolute -top-2 -right-2 bg-green-500 animate-pulse">
          AI
        </Badge>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-4 right-4 z-50 w-96 max-h-[600px] shadow-2xl"
    >
      <Card className="h-full flex flex-col">
        <CardHeader className="pb-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              <CardTitle className="text-lg">AI QA Tutor</CardTitle>
              <Badge variant="secondary" className="text-xs bg-white/20">
                Beta
              </Badge>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(true)}
                className="h-8 w-8 p-0 text-white hover:bg-white/20"
              >
                <Minimize2 className="w-4 h-4" />
              </Button>
              {onClose && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="h-8 w-8 p-0 text-white hover:bg-white/20"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
          <CardDescription className="text-white/80 text-sm">
            Ask me anything about QA and testing!
          </CardDescription>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0 max-h-[450px]">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask a question..."
                className="flex-1"
              />
              <Button onClick={handleSendMessage} size="icon" disabled={!inputMessage.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              💡 This is a placeholder AI. Full integration coming soon!
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

