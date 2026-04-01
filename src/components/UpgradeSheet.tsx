import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Check } from 'lucide-react';
import { useSubscription, Plan } from '@/contexts/SubscriptionContext';
import { useNavigate } from 'react-router-dom';

const FEATURE_COPY: Record<string, string> = {
  'Deep Analysis': "Understand the deeper patterns in 30 days of your thoughts.",
  'Voice journaling': "Speak freely. Your voice, transcribed and reflected on.",
  'Hindi journaling': "Journal in the language you actually think in.",
  'Multiple journals': "Keep your work, personal, and inner life separate.",
  'Extra sounds': "The right ambient sound makes writing feel effortless.",
  'Entry search': "Find any memory instantly with smart keyword search.",
  'Annual report': "Celebrate your year of growth with a beautiful data-driven letter."
};

const UNLOCK_PLAN: Record<string, Plan> = {
  'Deep Analysis': 'pro',
  'Voice journaling': 'pro',
  'Hindi journaling': 'pro',
  'Multiple journals': 'pro',
  'Extra sounds': 'plus',
  'Entry search': 'plus',
  'Annual report': 'pro'
};

const UpgradeSheet = () => {
  const { isUpgradeSheetOpen, upgradeFeature, closeUpgradeSheet, setPlan } = useSubscription();
  const navigate = useNavigate();

  const handleUpgrade = (plan: Plan) => {
    setPlan(plan);
    closeUpgradeSheet();
    // In a real app we would go to checkout here
  };

  const featureName = upgradeFeature;
  const description = FEATURE_COPY[featureName] || "Unlock this premium feature to deepen your sanctuary experience.";
  const requiredPlan = UNLOCK_PLAN[featureName] || 'plus';

  return (
    <AnimatePresence>
      {isUpgradeSheetOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeUpgradeSheet}
            className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-sm"
          />

          {/* Bottom Sheet */}
          <motion.div 
            initial={{ translateY: '100%' }}
            animate={{ translateY: '0%' }}
            exit={{ translateY: '100%' }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-0 left-0 right-0 z-[1001] bg-[#161210] rounded-t-[24px] overflow-hidden flex flex-col h-[65vh] max-h-[600px]"
          >
            {/* Top Amber Gradient Line */}
            <div className="h-[3px] w-full bg-gradient-to-r from-transparent via-[#d4882a] to-transparent opacity-60" />

            {/* Handle Bar */}
            <div className="flex justify-center py-3">
              <div className="w-8 h-1 bg-white/10 rounded-full" />
            </div>

            {/* Close Button */}
            <button 
              onClick={closeUpgradeSheet}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 text-[#8a7d6e] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="px-8 pb-10 flex flex-col items-center text-center flex-1 overflow-y-auto">
              <div className="mt-4 mb-6 p-4 rounded-2xl bg-[#d4882a]/[0.08] border border-[#d4882a]/15">
                <Sparkles className="w-8 h-8 text-[#d4882a]" />
              </div>

              <h2 className="text-3xl font-display text-[#ede4d8] mb-2">Unlock {featureName}</h2>
              <p className="text-[14px] text-[#8a7d6e] mb-10 max-w-[320px]">{description}</p>

              {/* Plan Comparison Pills */}
              <div className="grid grid-cols-2 gap-4 w-full mb-10">
                <div 
                  className={`p-6 rounded-2xl border transition-all text-left relative ${requiredPlan === 'plus' ? 'border-[#d4882a] bg-[#d4882a]/[0.05]' : 'border-white/[0.06] bg-white/[0.02]'}`}
                >
                  <div className="text-xl font-display text-[#ede4d8] mb-1">Plus</div>
                  <div className="text-[14px] text-[#8a7d6e]">₹99/mo</div>
                  {requiredPlan === 'plus' && (
                    <div className="mt-4 flex items-center gap-1.5 text-[11px] text-[#d4882a] font-bold uppercase tracking-wider">
                      <Check className="w-3.5 h-3.5" />
                      Included
                    </div>
                  )}
                </div>

                <div 
                  className={`p-6 rounded-2xl border transition-all text-left relative ${requiredPlan === 'pro' ? 'border-[#d4882a] bg-[#d4882a]' : 'border-white/[0.06] bg-white/[0.02]'}`}
                >
                  <div className={`text-xl font-display mb-1 ${requiredPlan === 'pro' ? 'text-[#0e0b09]' : 'text-[#ede4d8]'}`}>Pro</div>
                  <div className={`text-[14px] ${requiredPlan === 'pro' ? 'text-[#0e0b09]/60' : 'text-[#8a7d6e]'}`}>₹249/mo</div>
                  {requiredPlan === 'pro' && (
                    <div className="mt-4 flex items-center gap-1.5 text-[11px] text-[#0e0b09] font-bold uppercase tracking-wider">
                      <Check className="w-3.5 h-3.5" />
                      Included
                    </div>
                  )}
                </div>
              </div>

              {/* CTA Button */}
              <button 
                onClick={() => {
                  handleUpgrade(requiredPlan);
                  navigate('/pricing');
                }}
                className="w-full py-4 rounded-full bg-[#d4882a] text-[#0e0b09] font-bold shadow-lg shadow-[#d4882a]/20 hover:bg-[#f0a84a] transition-all mb-4"
              >
                Upgrade to {requiredPlan.charAt(0).toUpperCase() + requiredPlan.slice(1)} — ₹{requiredPlan === 'pro' ? '249' : '99'}/month →
              </button>
              
              <p className="text-[12px] text-[#8a7d6e]">Cancel anytime. No questions asked.</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default UpgradeSheet;
