import React from 'react';
import { Lock } from 'lucide-react';
import { useSubscription, Plan } from '@/contexts/SubscriptionContext';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface LockedFeatureProps {
  children: React.ReactNode;
  featureName: string;
  requiredPlan: Plan;
  className?: string;
  overlayClassName?: string;
}

const LockedFeature: React.FC<LockedFeatureProps> = ({ 
  children, 
  featureName, 
  requiredPlan, 
  className = "",
  overlayClassName = ""
}) => {
  const { plan, openUpgradeSheet } = useSubscription();
  
  const isLocked = (requiredPlan === 'pro' && plan !== 'pro') || 
                   (requiredPlan === 'plus' && plan === 'free');

  if (!isLocked) return <>{children}</>;

  return (
    <div className={`relative group/lock ${className}`}>
      <div className="filter blur-[4px] pointer-events-none transition-all">
        {children}
      </div>
      
      <div className={`absolute inset-0 flex items-center justify-center bg-black/5 rounded-inherit cursor-pointer z-10 ${overlayClassName}`}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div 
              onClick={(e) => {
                e.stopPropagation();
                openUpgradeSheet(featureName);
              }}
              className="p-2.5 rounded-full bg-[#161210]/80 border border-[#d4882a]/30 text-[#d4882a] shadow-xl hover:scale-110 transition-all"
            >
              <Lock className="w-4 h-4" />
            </div>
          </TooltipTrigger>
          <TooltipContent className="bg-[#161210] border-[#d4882a]/30 text-[#ede4d8] text-[12px]">
            Upgrade to {requiredPlan.charAt(0).toUpperCase() + requiredPlan.slice(1)} to unlock
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};

export default LockedFeature;
