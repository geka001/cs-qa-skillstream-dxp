'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';
import { useManager } from '@/contexts/ManagerContext';
import { UserProfile, TeamConfig } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, Rocket, Layers, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { validateManagerCredentials } from '@/lib/managerAuth';
import { getLoginPageData, HeroBanner } from '@/lib/teamService';

type UserType = 'qa' | 'manager';

// Team colors for visual distinction (with fallback for dynamic teams)
const TEAM_COLORS: Record<string, string> = {
  'Launch': 'bg-purple-500',
  'Data & Insights': 'bg-blue-500',
  'AutoDraft': 'bg-orange-500',
  'DAM': 'bg-cyan-500',
};

// Dynamic color palette for teams not in the predefined list
const DYNAMIC_COLORS = [
  'bg-emerald-500',
  'bg-rose-500',
  'bg-amber-500',
  'bg-indigo-500',
  'bg-teal-500',
  'bg-pink-500',
];

export default function LoginPage() {
  const [userType, setUserType] = useState<UserType>('qa');
  const [name, setName] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [teams, setTeams] = useState<TeamConfig[]>([]);
  const [heroBanner, setHeroBanner] = useState<HeroBanner>({
    heading: 'Welcome to Your Product Team Training',
    description: 'Get onboarded to your Contentstack product team with personalized QA training. Learn the tools, processes, and testing strategies specific to your product.',
  });
  const [cardBanner, setCardBanner] = useState<HeroBanner>({
    heading: 'Get Started',
    description: 'Enter your details to begin your team-specific QA training',
  });
  const [pageLoading, setPageLoading] = useState(true);
  const { setUser, isLoading } = useApp();
  const { login: managerLogin } = useManager();
  const router = useRouter();

  // Fetch login page data (hero banners + teams) from Contentstack on mount
  useEffect(() => {
    async function loadPageData() {
      setPageLoading(true);
      try {
        const pageData = await getLoginPageData();
        setHeroBanner(pageData.heroBanner);
        setCardBanner(pageData.cardBanner);
        setTeams(pageData.teams);
        // Set default selection to first team
        if (pageData.teams.length > 0 && !selectedTeam) {
          setSelectedTeam(pageData.teams[0].team);
        }
      } catch (error) {
        // Will use fallback defaults
      } finally {
        setPageLoading(false);
      }
    }
    loadPageData();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (userType === 'qa') {
      if (!name.trim()) {
        setError('Please enter your name');
        return;
      }

      const newUser: UserProfile = {
        name: name.trim(),
        role: 'QA Engineer',
        team: selectedTeam,
        segment: 'ROOKIE',
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

      await setUser(newUser);
      router.push('/dashboard');
    } else {
      if (!password) {
        setError('Please enter password');
        return;
      }

      const isValid = validateManagerCredentials(selectedTeam, password);

      if (isValid) {
        managerLogin(selectedTeam);
        setTimeout(() => {
          router.replace('/manager/dashboard');
        }, 100);
      } else {
        setError('Invalid password. Please try again.');
      }
    }
  };

  // Get team color (with dynamic fallback)
  const getTeamColor = (teamName: string, index: number) => {
    if (TEAM_COLORS[teamName]) {
      return TEAM_COLORS[teamName];
    }
    // Use dynamic color based on index for new teams
    return DYNAMIC_COLORS[index % DYNAMIC_COLORS.length];
  };

  // Get team description from API data or fallback
  const getTeamDescription = (team: TeamConfig) => {
    return team.description || `${team.team} team`;
  };

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
                ? heroBanner.heading
                : 'Monitor Your Team\'s Progress'
              }
            </h2>
            <p className="text-lg text-muted-foreground">
              {userType === 'qa'
                ? heroBanner.description
                : 'View real-time onboarding progress, identify at-risk team members, and track completion rates across your QA team.'
              }
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="p-4 bg-card rounded-lg border">
              <div className="text-3xl font-bold text-primary">{teams.length || 4}</div>
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
              {cardBanner.heading}
            </CardTitle>
            <CardDescription>
              {userType === 'qa'
                ? cardBanner.description
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

              {/* Name input for QA */}
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

              {/* Team Selection - Dynamic from Contentstack */}
              <div className="space-y-3">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  {userType === 'qa' ? 'Select Your Product Team' : 'Select Your Team'}
                </label>
                
                {pageLoading ? (
                  <div className="flex items-center justify-center p-8">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    <span className="ml-2 text-muted-foreground">Loading teams...</span>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {teams.map((team, index) => (
                      <button
                        key={team.uid || team.team}
                        type="button"
                        onClick={() => setSelectedTeam(team.team)}
                        className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                          selectedTeam === team.team
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-4 h-4 rounded-full mt-1 ${getTeamColor(team.team, index)}`} />
                          <div className="flex-1">
                            <div className="font-semibold text-foreground">{team.displayName || team.team}</div>
                            {userType === 'qa' && (
                              <div className="text-sm text-muted-foreground">
                                {getTeamDescription(team)}
                              </div>
                            )}
                          </div>
                          {selectedTeam === team.team && (
                            <div className="text-primary">✓</div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Password for Manager */}
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

              <Button 
                type="submit" 
                className="w-full" 
                size="lg" 
                disabled={isLoading || pageLoading || !selectedTeam}
              >
                {isLoading ? 'Loading...' : userType === 'qa' ? 'Start Learning' : 'Access Dashboard'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
