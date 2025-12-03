'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, LogOut, GraduationCap } from 'lucide-react';
import { useManager } from '@/contexts/ManagerContext';
import { getUsersByTeam } from '@/lib/userService';
import { calculateTeamStats } from '@/lib/managerAuth';
import TeamStats from '@/components/manager/TeamStats';
import UserList from '@/components/manager/UserList';
import UserDetailModal from '@/components/manager/UserDetailModal';
import { UserProfile } from '@/types';

export default function ManagerDashboardPage() {
  const { isAuthenticated, selectedTeam, logout } = useManager();
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated || !selectedTeam) {
      router.push('/');
    }
  }, [isAuthenticated, selectedTeam, router]);

  // Load users and calculate stats
  const loadData = async () => {
    if (!selectedTeam) return;
    
    setIsRefreshing(true);
    try {
      console.log(`📊 Loading users for team: ${selectedTeam}`);
      const teamUsers = await getUsersByTeam(selectedTeam);
      console.log(`✅ Loaded ${teamUsers.length} users from Contentstack`);
      
      const teamStats = calculateTeamStats(teamUsers);
      
      setUsers(teamUsers);
      setStats(teamStats);
      setLastRefresh(new Date());
    } catch (error) {
      console.error('❌ Error loading team data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadData();
  }, [selectedTeam]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      loadData();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [selectedTeam]);

  const handleLogout = () => {
    logout();
    // Small delay to ensure manager state clears before redirect
    setTimeout(() => {
      router.push('/login');
    }, 100);
  };

  const handleViewDetails = (user: UserProfile) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  if (!isAuthenticated || !selectedTeam) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-card border-b sticky top-0 z-20 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    SkillStream
                  </h1>
                  <Badge variant="secondary" className="text-xs">Manager</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {selectedTeam} Team Overview
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-medium">Manager</div>
                <div className="text-xs text-muted-foreground">{selectedTeam}</div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={loadData}
                disabled={isRefreshing}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* Last Updated */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Team Overview</h2>
          <Badge variant="outline" className="text-xs">
            Last updated: {lastRefresh.toLocaleTimeString()}
          </Badge>
        </div>

        {/* Stats */}
        {stats && <TeamStats stats={stats} />}

        {/* Team Members */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Team Members ({users.length})</h2>
          <UserList users={users} onViewDetails={handleViewDetails} />
        </div>

        {/* Footer Info */}
        <div className="text-center py-8 border-t">
          <p className="text-sm text-muted-foreground">
            Data refreshes automatically every 30 seconds
          </p>
        </div>
      </main>

      {/* User Detail Modal */}
      <UserDetailModal
        user={selectedUser}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedUser(null);
        }}
      />
    </div>
  );
}

