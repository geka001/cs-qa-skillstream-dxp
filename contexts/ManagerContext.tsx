/**
 * Manager Context
 * Handles manager authentication and team selection
 */

'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Team } from '@/types';

interface ManagerContextType {
  isAuthenticated: boolean;
  selectedTeam: Team | null;
  login: (team: Team) => void;
  logout: () => void;
}

const ManagerContext = createContext<ManagerContextType | undefined>(undefined);

export const useManager = () => {
  const context = useContext(ManagerContext);
  if (!context) {
    // Return a safe default during initial render to prevent errors
    return {
      isAuthenticated: false,
      selectedTeam: null,
      login: () => {},
      logout: () => {},
    } as ManagerContextType;
  }
  return context;
};

export const ManagerProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  // Load manager session from sessionStorage on mount
  useEffect(() => {
    const savedManager = sessionStorage.getItem('manager_session');
    
    if (savedManager) {
      try {
        const { team, timestamp } = JSON.parse(savedManager);
        const now = Date.now();
        const twoHours = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
        
        // Session expires after 2 hours
        if (now - timestamp < twoHours) {
          setIsAuthenticated(true);
          setSelectedTeam(team);
        } else {
          sessionStorage.removeItem('manager_session');
        }
      } catch (error) {
        console.error('Error parsing manager session:', error);
        sessionStorage.removeItem('manager_session');
      }
    }
  }, []);

  const login = (team: Team) => {
    setIsAuthenticated(true);
    setSelectedTeam(team);
    
    // Save to sessionStorage (expires when browser closes)
    const sessionData = {
      team,
      timestamp: Date.now()
    };
    sessionStorage.setItem('manager_session', JSON.stringify(sessionData));
  };

  const logout = () => {
    setIsAuthenticated(false);
    setSelectedTeam(null);
    sessionStorage.removeItem('manager_session');
  };

  return (
    <ManagerContext.Provider
      value={{
        isAuthenticated,
        selectedTeam,
        login,
        logout
      }}
    >
      {children}
    </ManagerContext.Provider>
  );
};

