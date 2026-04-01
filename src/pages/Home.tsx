import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useConfidentialMode } from '@/contexts/ConfidentialModeContext';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import Navigation from '@/components/Navigation';
import LockedFeature from '@/components/LockedFeature';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { ArrowRight, Flame, BookText, PieChart, Sparkles, Lock, Star, Search, X } from 'lucide-react';
import { getJournalHistory } from '@/api/journal';
import { JournalEntry } from '@/types/journal';

const Home = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { isConfidential } = useConfidentialMode();
  const { reducedMotion } = useAccessibility();
  const navigate = useNavigate();
  const [recentEntries, setRecentEntries] = useState<JournalEntry[]>([]);
  const [stats, setStats] = useState({ streak: 0, count: 0 });
  const { plan, entriesThisMonth, openUpgradeSheet } = useSubscription();
  const [showSoftNudge, setShowSoftNudge] = useState(() => {
    const hidden = localStorage.getItem('anahva_soft_nudge_hidden');
    return !hidden;
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState({ goal: '', time: '' });
  const [hasCelebrated, setHasCelebrated] = useState(false);
  const [streakAnimation, setStreakAnimation] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    const history = await getJournalHistory();
    setRecentEntries(history.slice(-3).reverse());
    
    // Check for onboarding
    const seenOnboarding = localStorage.getItem('anahva_onboarding_seen');
    if (history.length === 0 && !seenOnboarding) {
      setShowOnboarding(true);
    }

    // Calculate Streak
    if (history.length > 0) {
      const dates = history.map(h => h.createdAt.split('T')[0]);
      const uniqueDates = Array.from(new Set(dates)).sort().reverse();
      
      let streak = 0;
      let checkDate = new Date();
      // If no entry today, check from yesterday
      if (uniqueDates[0] !== checkDate.toISOString().split('T')[0]) {
        checkDate.setDate(checkDate.getDate() - 1);
      }
      
      for (const date of uniqueDates) {
        if (date === checkDate.toISOString().split('T')[0]) {
          streak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
      setStats({ streak, count: history.length });
      
      // Streak celebration trigger
      const lastCelebrated = sessionStorage.getItem('anahva_streak_celebrated');
      if (streak > 0 && !lastCelebrated) {
        const today = new Date().toISOString().split('T')[0];
        const hasTodayEntry = dates.includes(today);
        if (hasTodayEntry) {
          setStreakAnimation(true);
          sessionStorage.setItem('anahva_streak_celebrated', 'true');
          setTimeout(() => setStreakAnimation(false), 2500);
        }
      }
    }
    setIsLoading(false);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    let timeOfDay = '';
    if (hour < 12) timeOfDay = 'morning';
    else if (hour < 17) timeOfDay = 'afternoon';
    else if (hour < 21) timeOfDay = 'evening';
    else timeOfDay = 'night';

    // "Good evening, Shibasish" - capitalize first letter of timeOfDay if needed, but translations might handle it
    const capitalizedTime = timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1);
    return `Good ${timeOfDay}`; // Assuming translations return just morning/afternoon/evening
  };

  const pluralize = (count: number, singular: string, plural: string) => {
    return count === 1 ? singular : plural;
  };

  return (
    <div className="min-h-screen bg-[#0e0b09] md:pl-[240px] pt-20 pb-10">
      <Navigation />
      
      <main className="max-w-5xl mx-auto px-6 md:px-10 py-10 relative">
        <header className="mb-12 flex items-center justify-between">
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl md:text-5xl font-display text-[#ede4d8] mb-2"
            >
              {getGreeting()}, {user?.name || 'Friend'}
            </motion.h1>
            {isLoading ? (
              <div className="space-y-2 mt-2 max-w-[200px]">
                <div className="h-4 bg-[#d4882a]/10 animate-pulse rounded shimmer-amber" />
                <div className="h-4 bg-[#d4882a]/10 animate-pulse rounded shimmer-amber w-3/4" />
              </div>
            ) : (
              <p className="text-[#8a7d6e] font-body">{t('todayPrompt')}</p>
            )}
          </div>

          <div className="flex items-center gap-4">
             <LockedFeature featureName="Entry search" requiredPlan="plus">
                <button className="p-3 rounded-full bg-white/[0.02] border border-white/[0.06] text-[#8a7d6e] hover:text-[#d4882a] transition-all">
                   <Search className="w-5 h-5" />
                </button>
             </LockedFeature>
          </div>
        </header>

        {/* TODAY'S PROMPT */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative p-8 rounded-[20px] bg-[#231e19] border border-white/[0.06] mb-10 group overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#d4882a] to-transparent opacity-30" />
          <div className="text-[11px] uppercase tracking-[0.14em] font-medium text-[#d4882a] mb-3">Today's prompt</div>
          <h2 className="text-2xl md:text-3xl font-display italic text-[#ede4d8] mb-8 leading-relaxed max-w-2xl">
            "What is one small thing that brought you a moment of peace today, and how did it make you feel?"
          </h2>
          <button 
            onClick={() => navigate('/journal')}
            className="flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#d4882a] text-[#0e0b09] font-medium hover:bg-[#f0a84a] transition-all transform hover:-translate-y-0.5 group"
          >
            Start writing
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </motion.div>

        {/* STATS ROW */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            { 
              icon: <Flame className="w-5 h-5" />, 
              label: "STREAK", 
              value: `${stats.streak} ${pluralize(stats.streak, 'day', 'days')}`, 
              color: "text-[#d4882a]" 
            },
            { 
              icon: <BookText className="w-5 h-5" />, 
              label: "HISTORY", 
              value: `${stats.count} ${pluralize(stats.count, 'entry', 'entries')}`, 
              color: "text-[#d4882a]" 
            },
            { 
              icon: <PieChart className="w-5 h-5" />, 
              label: "AVERAGE MOOD", 
              value: "Feeling calm", 
              color: "text-[#d4882a]" 
            }
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="p-6 rounded-[20px] bg-[#231e19] border border-white/[0.06] hover:bg-[#271f18] transition-colors"
            >
              <div className={`p-2 w-fit rounded-lg bg-white/[0.03] mb-4 ${stat.color}`}>
                {stat.icon}
              </div>
              <div className="text-[11px] uppercase tracking-[0.1em] text-[#8a7d6e] mb-1 font-body">{stat.label}</div>
              <div className="text-2xl font-display text-[#ede4d8] tracking-tight">{stat.value}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* RECENT ENTRIES */}
          <div className="lg:col-span-2">
            <h3 className="text-xl font-display text-[#ede4d8] mb-6">Recent entries</h3>
            <div className="space-y-4">
              {recentEntries.length > 0 ? recentEntries.map((entry, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  onClick={() => navigate('/history')}
                  className={`p-5 rounded-[20px] bg-[#161210] border border-white/[0.04] hover:border-[#d4882a]/30 hover:bg-[#1e1814] transition-all cursor-pointer group ${isConfidential ? 'blur-[6px]' : ''}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#5DCAA5]" />
                      <span className="text-xs text-[#8a7d6e]">{new Date(entry.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <p className="text-[#b8a898] font-display italic text-lg leading-relaxed group-hover:text-[#ede4d8] transition-colors line-clamp-2">
                    {entry.text.includes('encorporately forcing me') || entry.text.length === 0 ? 
                      <span className="italic opacity-60">No content yet…</span> : 
                      `"${entry.text.substring(0, 100)}${entry.text.length > 100 ? '...' : ''}"`
                    }
                  </p>
                </motion.div>
              )) : (
                <div className="p-12 rounded-[32px] bg-[#161210] border border-white/[0.04] text-center flex flex-col items-center justify-center min-h-[300px]">
                  <div className="text-[#d4882a] text-5xl font-display mb-6">✦</div>
                  <h4 className="text-[#ede4d8] font-display italic text-2xl mb-2">Your story starts here</h4>
                  <p className="text-[#8a7d6e] text-[13px] font-sans">Write your first entry to see it appear here</p>
                </div>
              )}

              {/* MONETIZATION SOFT NUDGE - FREE USERS (8+ entries) */}
              {plan === 'free' && stats.count >= 8 && showSoftNudge && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-6 rounded-[24px] bg-[#1a1410] border border-[#d4882a]/20 flex items-center justify-between relative mt-10"
                >
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowSoftNudge(false);
                      localStorage.setItem('anahva_soft_nudge_hidden', 'true');
                    }}
                    className="absolute top-4 right-4 text-[#8a7d6e] hover:text-[#ede4d8]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#d4882a]/10 flex items-center justify-center text-[#d4882a]">
                      <BookText className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-[#ede4d8]">You've written {stats.count} entries</div>
                      <div className="text-[12px] text-[#8a7d6e]">Unlock unlimited journaling with Anahva Plus.</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => navigate('/pricing')}
                    className="px-5 py-2 rounded-full bg-[#d4882a] text-[#0e0b09] text-[12px] font-bold hover:bg-[#f0a84a] transition-all"
                  >
                    Upgrade →
                  </button>
                </motion.div>
              )}

              {isConfidential && recentEntries.length > 0 && (
                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                  <div className="bg-[#0e0b09]/80 px-6 py-3 rounded-full border border-[#d4882a]/30 backdrop-blur-md">
                    <span className="text-[#d4882a] text-sm font-medium">Content hidden · Safe Mode active</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* AI INSIGHT */}
          <div className="space-y-6">
            <h3 className="text-xl font-display text-[#ede4d8] mb-6">AI Insight</h3>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="p-8 rounded-[20px] bg-[#231e19] border-l-2 border-[#d4882a] border-y border-r border-white/[0.06] relative group"
            >
              <div className="flex items-center gap-2 mb-4 text-[#d4882a]">
                <Sparkles className="w-4 h-4" />
                <span className="text-[11px] uppercase tracking-wider font-medium">Weekly Reflection</span>
              </div>
              <p className="text-[#b8a898] text-sm leading-relaxed mb-6 font-body">
                "You've shown a consistent pattern of finding peace in quiet nature moments. Your reflections suggest that early mornings are your most centered time."
              </p>
              <button 
                onClick={() => navigate('/chat')}
                className="w-full py-3 rounded-full border border-[#d4882a]/18 text-[#d4882a] text-xs font-medium hover:bg-[#d4882a]/[0.05] transition-all"
              >
                Ask your AI companion
              </button>
            </motion.div>

            {/* DEEP AI ANALYSIS CARD */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="p-8 rounded-[24px] bg-[#161210] border border-white/[0.04] relative overflow-hidden group hover:border-[#d4882a]/20 transition-all"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <PieChart className="w-16 h-16 text-[#d4882a]" />
              </div>
              
              <div className="text-[#d4882a] text-[10px] font-bold tracking-[0.2em] mb-2 flex items-center gap-1.5">
                <Star className="w-3 h-3 fill-current" />
                PREMIUM
              </div>
              
              <h4 className="text-2xl font-display text-[#ede4d8] mb-2 leading-tight">Deep AI Analysis Available</h4>
              
              {stats.count >= 30 ? (
                <>
                  <p className="text-[#8a7d6e] text-[13px] leading-relaxed mb-6">Your latest 30 days are ready for a full psychological profile.</p>
                  <LockedFeature featureName="Deep Analysis" requiredPlan="pro" overlayClassName="bg-transparent">
                     <button className="w-full py-3.5 rounded-full bg-[#d4882a] text-[#0e0b09] text-xs font-bold hover:bg-[#f0a84a] transition-all transform hover:-translate-y-0.5">
                       Generate Report →
                     </button>
                  </LockedFeature>
                </>
              ) : (
                <>
                  <p className="text-[#8a7d6e] text-[13px] leading-relaxed mb-4">
                    {plan === 'plus' && stats.count >= 25 ? "You're 5 entries away from your first Deep Analysis" : "You're on your way to a full psychological profile."}
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-medium pointer-events-auto cursor-pointer" onClick={() => plan !== 'pro' && navigate('/pricing')}>
                      <span className="text-[#d4882a]">{stats.count}/30 entries</span>
                      <span className="text-[#8a7d6e]">{30 - stats.count} more until your first deep analysis</span>
                    </div>
                    <div className="h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#d4882a] transition-all duration-1000"
                        style={{ width: `${(stats.count / 30) * 100}%` }}
                      />
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        </div>

        {/* ONBOARDING MODAL */}
        <AnimatePresence>
          {showOnboarding && (
            <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-[#0e0b09] overflow-y-auto">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="w-full max-w-[480px] bg-[#161210] rounded-[32px] p-8 md:p-12 border border-white/[0.06] relative"
              >
                {/* Progress Dots */}
                <div className="flex justify-center gap-2 mb-10">
                  {[1, 2, 3].map(step => (
                    <div 
                      key={step} 
                      className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${onboardingStep === step ? 'w-6 bg-[#d4882a]' : 'bg-white/[0.1]'}`}
                    />
                  ))}
                </div>

                {onboardingStep === 1 && (
                  <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                    <h3 className="text-3xl font-display text-[#ede4d8] mb-8 text-center">What brings you to Anahva?</h3>
                    <div className="grid grid-cols-1 gap-4 mb-10">
                      {["Manage stress", "Process emotions", "Build self-awareness", "Just explore"].map(option => (
                        <button 
                          key={option}
                          onClick={() => setOnboardingData({ ...onboardingData, goal: option })}
                          className={`p-5 rounded-2xl border text-left transition-all ${onboardingData.goal === option ? 'border-[#d4882a] bg-[#d4882a]/[0.03] text-[#ede4d8]' : 'border-white/[0.04] bg-white/[0.02] text-[#8a7d6e] hover:border-white/[0.1]'}`}
                        >
                          <span className="text-sm font-medium">{option}</span>
                        </button>
                      ))}
                    </div>
                    <button 
                      disabled={!onboardingData.goal}
                      onClick={() => setOnboardingStep(2)}
                      className="w-full py-4 rounded-full bg-[#d4882a] text-[#0e0b09] font-bold hover:bg-[#f0a84a] transition-all disabled:opacity-50"
                    >
                      Continue →
                    </button>
                  </motion.div>
                )}

                {onboardingStep === 2 && (
                  <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                    <h3 className="text-3xl font-display text-[#ede4d8] mb-8 text-center">When would you like to journal?</h3>
                    <div className="grid grid-cols-2 gap-4 mb-10">
                      {["Morning", "Afternoon", "Evening", "Night"].map(time => (
                        <button 
                          key={time}
                          onClick={() => setOnboardingData({ ...onboardingData, time })}
                          className={`p-6 rounded-2xl border flex items-center justify-center transition-all ${onboardingData.time === time ? 'border-[#d4882a] bg-[#d4882a]/[0.03] text-[#ede4d8]' : 'border-white/[0.04] bg-white/[0.02] text-[#8a7d6e]'}`}
                        >
                          <span className="text-sm font-bold uppercase tracking-wider">{time}</span>
                        </button>
                      ))}
                    </div>
                    <button 
                      disabled={!onboardingData.time}
                      onClick={() => setOnboardingStep(3)}
                      className="w-full py-4 rounded-full bg-[#d4882a] text-[#0e0b09] font-bold hover:bg-[#f0a84a] transition-all disabled:opacity-50"
                    >
                      Continue →
                    </button>
                  </motion.div>
                )}

                {onboardingStep === 3 && (
                  <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                    <h3 className="text-3xl font-display text-[#ede4d8] mb-2 text-center">Your first prompt is ready</h3>
                    <p className="text-[#8a7d6e] text-center text-sm mb-10">We've crafted something special for your beginning.</p>
                    <div className="p-8 bg-[#1e1814] border border-white/[0.06] rounded-[24px] mb-10">
                      <p className="text-xl md:text-2xl font-display italic text-[#ede4d8] text-center leading-relaxed">
                        "If your younger self could see you today, what's one thing they would be proud of?"
                      </p>
                    </div>
                    <button 
                      onClick={() => {
                        localStorage.setItem('anahva_onboarding_seen', 'true');
                        setShowOnboarding(false);
                        navigate('/journal');
                      }}
                      className="w-full py-4 rounded-full bg-[#d4882a] text-[#0e0b09] font-bold hover:bg-[#f0a84a] transition-all shadow-lg shadow-[#d4882a]/20"
                    >
                      Begin writing ✦
                    </button>
                    <button 
                      onClick={() => {
                        localStorage.setItem('anahva_onboarding_seen', 'true');
                        setShowOnboarding(false);
                      }}
                      className="w-full mt-4 text-[13px] text-[#8a7d6e] hover:text-[#ede4d8] transition-colors"
                    >
                      Skip for now
                    </button>
                  </motion.div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* STREAK CELEBRATION OVERLAY */}
        <AnimatePresence>
          {streakAnimation && !reducedMotion && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[2000] pointer-events-none flex items-center justify-center bg-[#0e0b09]/40 backdrop-blur-[2px]"
            >
              <div className="relative">
                <motion.div 
                  initial={{ scale: 0.5, y: 50, opacity: 0 }}
                  animate={{ scale: 1, y: 0, opacity: 1 }}
                  exit={{ scale: 1.5, opacity: 0 }}
                  className="text-center"
                >
                  <div className="text-[120px] font-display text-[#d4882a] relative z-10">
                    {stats.streak}
                  </div>
                  <div className="text-2xl font-display text-[#ede4d8] uppercase tracking-[0.2em] -mt-6">
                    {pluralize(stats.streak, 'Day', 'Days')} Strike!
                  </div>
                </motion.div>
                {/* CSS Particles */}
                {[...Array(12)].map((_, i) => (
                  <motion.div 
                    key={i}
                    initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
                    animate={{ 
                      x: Math.cos(i * 30 * Math.PI / 180) * 200, 
                      y: Math.sin(i * 30 * Math.PI / 180) * 200,
                      opacity: 0,
                      scale: 1
                    }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                    className="absolute top-1/2 left-1/2 w-2 h-2 bg-[#d4882a] rounded-full"
                    style={{ marginLeft: -4, marginTop: -4 }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Home;
