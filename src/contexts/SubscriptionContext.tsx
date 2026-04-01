import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

export type Plan = 'free' | 'plus' | 'pro';

interface SubscriptionContextType {
  plan: Plan;
  setPlan: (plan: Plan) => void;
  entriesThisMonth: number;
  incrementEntries: () => void;
  isUpgradeSheetOpen: boolean;
  upgradeFeature: string;
  openUpgradeSheet: (feature: string) => void;
  closeUpgradeSheet: () => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  const [planState, setPlanState] = useState<Plan>(() => {
    const saved = localStorage.getItem('anahva_plan') as Plan;
    return saved || 'free';
  });

  // ADMIN OVERRIDE - shibasish2005@gmail.com is always Pro
  const plan = user?.name === 'shibasish2005@gmail.com' ? 'pro' : planState;
  
  const [entriesThisMonth, setEntriesThisMonth] = useState(() => {
    const saved = localStorage.getItem('anahva_entries_count');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [isUpgradeSheetOpen, setIsUpgradeSheetOpen] = useState(false);
  const [upgradeFeature, setUpgradeFeature] = useState('');

  const setPlan = (newPlan: Plan) => {
    setPlanState(newPlan);
    localStorage.setItem('anahva_plan', newPlan);
  };

  const incrementEntries = () => {
    const newCount = entriesThisMonth + 1;
    setEntriesThisMonth(newCount);
    localStorage.setItem('anahva_entries_count', newCount.toString());
  };

  const openUpgradeSheet = (feature: string) => {
    setUpgradeFeature(feature);
    setIsUpgradeSheetOpen(true);
  };

  const closeUpgradeSheet = () => {
    setIsUpgradeSheetOpen(false);
  };

  return (
    <SubscriptionContext.Provider value={{ 
      plan, 
      setPlan, 
      entriesThisMonth, 
      incrementEntries,
      isUpgradeSheetOpen,
      upgradeFeature,
      openUpgradeSheet,
      closeUpgradeSheet
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = (): SubscriptionContextType => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};
