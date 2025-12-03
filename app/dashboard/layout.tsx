'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import AnalyticsPanel from '@/components/layout/AnalyticsPanel';
import OnboardingCompleteModal from '@/components/modals/OnboardingCompleteModal';
import { Toaster } from 'sonner';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoggedIn, user, showOnboardingModal, setShowOnboardingModal } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <Topbar />

        {/* Content + Analytics */}
        <div className="flex-1 flex overflow-hidden">
          {/* Main Content */}
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>

          {/* Analytics Panel */}
          <AnalyticsPanel />
        </div>
      </div>

      {/* Toast Notifications */}
      <Toaster position="top-right" richColors />
      
      {/* Onboarding Complete Modal */}
      {user && (
        <OnboardingCompleteModal
          isOpen={showOnboardingModal}
          onClose={() => setShowOnboardingModal(false)}
          completionDate={user.onboardingCompletedDate || new Date().toISOString()}
          userName={user.name}
          userTeam={user.team}
        />
      )}
    </div>
  );
}

