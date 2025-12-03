'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';
import { useManager } from '@/contexts/ManagerContext';
import { UserProfile, Team } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, Rocket, Layers, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { validateManagerCredentials } from '@/lib/managerAuth';

type UserType = 'qa' | 'manager';

export default function LoginPage() {
  const [userType, setUserType] = useState<UserType>('qa');
  const [name, setName] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<Team>('Launch');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { setUser, isLoading } = useApp();
  const { login: managerLogin } = useManager();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    console.log('🔍 Login attempt:', { userType, selectedTeam, hasPassword: !!password, hasName: !!name });

    if (userType === 'qa') {
      // QA Login Flow
      console.log('📝 QA Login flow');
      if (!name.trim()) {
        setError('Please enter your name');
        return;
      }

      // Create user profile (Contentstack will check if exists)
      const newUser: UserProfile = {
        name: name.trim(),
        role: 'QA Engineer', // Default role, kept internally
        team: selectedTeam,
        segment: 'ROOKIE', // All new users start as ROOKIE (or load existing)
        joinDate: new Date().toISOString(),
        completedModules: [],
        quizScores: {},
        timeSpent: 0,
        interventionsReceived: 0,
        moduleProgress: {},
        completedSOPs: [],
        exploredTools: [],
        onboardingComplete: false
      };

      console.log('🔄 Setting user (will check Contentstack)...');
      await setUser(newUser);
      console.log('✅ User set, redirecting to dashboard');
      router.push('/dashboard');
    } else {
      // Manager Login Flow
      console.log('👔 Manager Login flow');
      if (!password) {
        setError('Please enter password');
        return;
      }

      console.log('🔐 Validating credentials for team:', selectedTeam);
      const isValid = validateManagerCredentials(selectedTeam, password);
      console.log('🔐 Validation result:', isValid);

      if (isValid) {
        console.log('✅ Manager credentials valid, logging in...');
        managerLogin(selectedTeam);
        console.log('✅ Manager login successful, redirecting to /manager/dashboard');
        
        // Use setTimeout to ensure context state updates before navigation
        setTimeout(() => {
          router.replace('/manager/dashboard');
        }, 100);
      } else {
        console.log('❌ Invalid password');
        setError('Invalid password. Please try again.');
      }
    }
  };

  const teams: { value: Team; label: string; description: string; color: string }[] = [
    { 
      value: 'Launch', 
      label: 'Launch', 
      description: 'Experience optimization and personalization platform',
      color: 'bg-purple-500'
    },
    { 
      value: 'Data & Insights', 
      label: 'Data & Insights', 
      description: 'Analytics and intelligence platform',
      color: 'bg-blue-500'
    },
    { 
      value: 'Visual Builder', 
      label: 'Visual Builder', 
      description: 'Visual page builder and experience composer',
      color: 'bg-green-500'
    },
    { 
      value: 'AutoDraft', 
      label: 'AutoDraft', 
      description: 'AI-powered content generation',
      color: 'bg-orange-500'
    },
    { 
      value: 'DAM', 
      label: 'DAM', 
      description: 'Digital Asset Management system',
      color: 'bg-cyan-500'
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding */}
        <div className="text-center md:text-left space-y-6">
          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center">
              <GraduationCap className="w-10 h-10 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  SkillStream
                </h1>
                {userType === 'manager' && (
                  <Badge variant="secondary" className="text-xs">Manager</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">Contentstack QA Onboarding</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-foreground">
              {userType === 'qa' 
                ? 'Welcome to Your Product Team Training'
                : 'Monitor Your Team\'s Progress'
              }
            </h2>
            <p className="text-lg text-muted-foreground">
              {userType === 'qa'
                ? 'Get onboarded to your Contentstack product team with personalized QA training. Learn the tools, processes, and testing strategies specific to your product.'
                : 'View real-time onboarding progress, identify at-risk team members, and track completion rates across your QA team.'
              }
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="p-4 bg-card rounded-lg border">
              <div className="text-3xl font-bold text-primary">5</div>
              <div className="text-sm text-muted-foreground">Product Teams</div>
            </div>
            <div className="p-4 bg-card rounded-lg border">
              <div className="text-3xl font-bold text-primary">
                {userType === 'qa' ? '15+' : 'Real-time'}
              </div>
              <div className="text-sm text-muted-foreground">
                {userType === 'qa' ? 'Training Modules' : 'Progress Tracking'}
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <Card className="w-full shadow-2xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Rocket className="w-6 h-6 text-primary" />
              Get Started
            </CardTitle>
            <CardDescription>
              {userType === 'qa'
                ? 'Enter your details to begin your team-specific QA training'
                : 'Select your team and enter credentials to view team progress'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Role Selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium">
                  I am a:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setUserType('qa');
                      setError('');
                    }}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      userType === 'qa'
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="font-semibold text-foreground">QA Team Member</div>
                    <div className="text-xs text-muted-foreground">Start learning</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setUserType('manager');
                      setError('');
                    }}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      userType === 'manager'
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="font-semibold text-foreground">Manager</div>
                    <div className="text-xs text-muted-foreground">View team progress</div>
                  </button>
                </div>
              </div>

              {/* Conditional Fields */}
              {userType === 'qa' && (
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Your Name
                  </label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={userType === 'qa'}
                    className="w-full"
                    autoComplete="off"
                  />
                </div>
              )}

              <div className="space-y-3">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  {userType === 'qa' ? 'Select Your Product Team' : 'Select Your Team'}
                </label>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {teams.map((team) => (
                    <button
                      key={team.value}
                      type="button"
                      onClick={() => setSelectedTeam(team.value)}
                      className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                        selectedTeam === team.value
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-4 h-4 rounded-full mt-1 ${team.color}`} />
                        <div className="flex-1">
                          <div className="font-semibold text-foreground">{team.label}</div>
                          {userType === 'qa' && (
                            <div className="text-sm text-muted-foreground">{team.description}</div>
                          )}
                        </div>
                        {selectedTeam === team.value && (
                          <div className="text-primary">✓</div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {userType === 'manager' && (
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">
                    Manager Password
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter manager password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required={userType === 'manager'}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? 'Loading...' : userType === 'qa' ? 'Start Learning' : 'Access Dashboard'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

