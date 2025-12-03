'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';
import { useManager } from '@/contexts/ManagerContext';

export default function HomePage() {
  const router = useRouter();
  const { isLoggedIn } = useApp();
  const { isAuthenticated: isManagerAuthenticated } = useManager();

  useEffect(() => {
    // Priority: Check manager session first, then QA session
    if (isManagerAuthenticated) {
      console.log('🏢 Manager authenticated, redirecting to manager dashboard');
      router.push('/manager/dashboard');
    } else if (isLoggedIn) {
      console.log('👤 QA user authenticated, redirecting to dashboard');
      router.push('/dashboard');
    } else {
      console.log('🔓 No active session, showing login');
      router.push('/login');
    }
  }, [isLoggedIn, isManagerAuthenticated, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-center">
        <div className="text-4xl font-bold text-primary mb-4">SkillStream</div>
        <div className="text-muted-foreground">Loading...</div>
      </div>
    </div>
  );
}

