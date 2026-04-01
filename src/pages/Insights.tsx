import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Navigation from '@/components/Navigation';
import { TrendingUp, Activity, Sparkles, Calendar, MessageSquare, AlertCircle, X, ExternalLink, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '@/contexts/SubscriptionContext';
import LockedFeature from '@/components/LockedFeature';
import { journalAPI } from '@/lib/api';
import { getJournalHistory } from '@/api/journal';

const Insights = () => {
  const { t } = useLanguage();
  const [journals, setJournals] = useState<any[]>([]);
  const [stats, setStats] = useState({ streak: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const { plan } = useSubscription();
  const [showPill, setShowPill] = useState(() => {
    const hidden = localStorage.getItem('anahva_insights_pill_hidden');
    return !hidden;
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const history = await getJournalHistory();
      setJournals(history);
      
      // Calculate Stats
      if (history.length > 0) {
        const dates = history.map(h => h.createdAt.split('T')[0]);
        const uniqueDates = Array.from(new Set(dates)).sort().reverse();
        let streak = 0;
        let checkDate = new Date();
        if (uniqueDates[0] !== checkDate.toISOString().split('T')[0]) {
            checkDate.setDate(checkDate.getDate() - 1);
        }
        for (const date of uniqueDates) {
            if (date === checkDate.toISOString().split('T')[0]) {
                streak++;
                checkDate.setDate(checkDate.getDate() - 1);
            } else break;
        }
        setStats({ streak, total: history.length });
      }
    } catch (error) {
      console.error("Failed to load insights", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0e0b09] md:pl-[240px] pt-20 pb-10">
      <Navigation />
      
      <main className="max-w-5xl mx-auto px-6 md:px-10 py-10 relative">
        {/* FLOATING NUDGE */}
        <AnimatePresence>
          {showPill && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute top-0 left-1/2 -translate-x-1/2 z-30"
            >
              <div className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-[#d4882a]/10 border border-[#d4882a]/30 backdrop-blur-md shadow-xl">
                 <span className="text-[11px] text-[#ede4d8] font-sans font-medium whitespace-nowrap">
                   <span className="text-[#d4882a]">✦</span> Pro unlocks voice journaling, Hindi support, and deep analysis
                 </span>
                 <button 
                  onClick={() => navigate('/pricing')}
                  className="text-[11px] text-[#d4882a] font-bold underline hover:text-[#f0a84a]"
                 >
                   See plans
                 </button>
                 <button 
                    onClick={() => {
                       setShowPill(false);
                       localStorage.setItem('anahva_insights_pill_hidden', 'true');
                    }}
                    className="p-1 rounded-full hover:bg-white/5 text-[#8a7d6e]"
                 >
                   <X className="w-3 h-3" />
                 </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <header className="mb-12">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl md:text-5xl font-display text-[#ede4d8] mb-2"
          >
            Insights
          </motion.h1>
          <p className="text-[#8a7d6e] font-body">Deep analysis of your emotional journey.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* WEEKLY MOOD CALENDAR */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 p-8 rounded-[20px] bg-[#231e19] border border-white/[0.06]"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-[#d4882a]" />
                <h3 className="text-xl font-display text-[#ede4d8]">Weekly Mood</h3>
              </div>
              <div className="text-xs text-[#8a7d6e] uppercase tracking-wider font-body">
                {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
              </div>
            </div>

            <div className="grid grid-cols-7 gap-4">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                <div key={day} className="text-[10px] text-center uppercase tracking-widest text-[#8a7d6e] mb-2 font-body">{day}</div>
              ))}
              {Array.from({ length: 28 }).map((_, i) => {
                const moods = ["#5DCAA5", "#8BDEB1", "#EF9F27", "#E67E22", "#C0392B", "transparent"];
                const randomMood = moods[Math.floor(Math.random() * moods.length)];
                return (
                  <div key={i} className="aspect-square flex items-center justify-center">
                    <div 
                      className={`w-3 h-3 rounded-full ${randomMood === 'transparent' ? 'border border-white/[0.06]' : ''}`}
                      style={{ backgroundColor: randomMood }}
                    />
                  </div>
                );
              })}
            </div>

            <div className="mt-8 flex items-center gap-6 pt-6 border-t border-white/[0.04]">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#5DCAA5]" />
                <span className="text-[10px] text-[#8a7d6e] uppercase tracking-wider">Calm</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#EF9F27]" />
                <span className="text-[10px] text-[#8a7d6e] uppercase tracking-wider">Neutral</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#C0392B]" />
                <span className="text-[10px] text-[#8a7d6e] uppercase tracking-wider">Restless</span>
              </div>
            </div>
          </motion.div>

          {/* MOOD DISTRIBUTION */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-8 rounded-[20px] bg-[#231e19] border border-white/[0.06]"
          >
            <div className="flex items-center gap-3 mb-8">
              <Activity className="w-5 h-5 text-[#d4882a]" />
              <h3 className="text-xl font-display text-[#ede4d8]">Distribution</h3>
            </div>

            {journals.length > 0 ? (
              <div className="space-y-6">
                {[
                  { label: "Peaceful", percent: 65, color: "#5DCAA5" },
                  { label: "Anxious", percent: 15, color: "#C0392B" },
                  { label: "Neutral", percent: 20, color: "#EF9F27" }
                ].map((m, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-[#b8a898]">{m.label}</span>
                      <span className="text-xs text-[#8a7d6e]">{m.percent}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/[0.04] rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${m.percent}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: m.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 opacity-60">
                 <div className="text-3xl mb-4 text-[#d4882a]">✦</div>
                 <p className="text-sm font-display italic text-[#ede4d8] mb-2 font-body">The Softness of Beginning</p>
                 <p className="text-[11px] text-[#8a7d6e] uppercase tracking-widest font-body">Write your first reflections to see your emotional map</p>
              </div>
            )}
          </motion.div>

          {/* COMMON THEMES */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-8 rounded-[20px] bg-[#231e19] border border-white/[0.06]"
          >
            <div className="flex items-center gap-3 mb-8">
              <MessageSquare className="w-5 h-5 text-[#d4882a]" />
              <h3 className="text-xl font-display text-[#ede4d8]">Mood Themes</h3>
            </div>

            <div className="flex flex-col gap-3">
              {[
                { 
                  title: "The Quiet Library", 
                  desc: "A landscape of deep focus and intellectual stillness." 
                },
                { 
                  title: "Midnight Ocean", 
                  desc: "A vast space for heavy thoughts and deep-sea processing." 
                },
                { 
                  title: "Sun-drenched Meadow", 
                  desc: "An open field of clear light and emotional renewal." 
                }
              ].map((card, i) => (
                <div 
                  key={i} 
                  className="w-full p-[20px_24px] bg-[#231e19] border-l-[3px] border-[#d4882a] rounded-[0_12px_12px_0] transition-all"
                >
                  <h4 className="text-[18px] font-display font-normal text-[#ede4d8] mb-2 block whitespace-nowrap">{card.title}</h4>
                  <p className="text-[13px] font-sans font-light text-[#8a7d6e] italic leading-[1.6]">"{card.desc}"</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* SIGNIFICANT CHANGES */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xl font-display text-[#ede4d8] mb-6">Significant Changes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { 
                  title: "Increased Morning Focus", 
                  desc: "Your entries between 6AM-8AM have become more positive over the last 14 days.",
                  icon: <TrendingUp className="w-4 h-4" />,
                  color: "text-[#5DCAA5]"
                },
                { 
                  title: "Sleep Pattern Shift", 
                  desc: "Mention of 'tiredness' has increased in your late night entries recently.",
                  icon: <AlertCircle className="w-4 h-4" />,
                  color: "text-[#C0392B]"
                }
              ].map((change, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="p-6 rounded-[20px] bg-[#161210] border border-white/[0.04]"
                >
                  <div className={`p-2 w-fit rounded-lg bg-white/[0.03] mb-4 ${change.color}`}>
                    {change.icon}
                  </div>
                  <h4 className="text-[#ede4d8] font-medium mb-2">{change.title}</h4>
                  <p className="text-sm text-[#8a7d6e] leading-relaxed font-body">{change.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12 p-[24px_28px] rounded-[24px] bg-[#1a1410] border border-transparent flex flex-col md:flex-row items-center justify-between gap-5 relative group"
          style={{ 
            backgroundClip: 'padding-box',
            boxShadow: '0 0 0 1px rgba(212,136,42,0.4), 0 0 24px rgba(212,136,42,0.08)'
          }}
        >
          <div className="flex items-center gap-5">
            <div className="w-[44px] h-[44px] rounded-full bg-[#d4882a]/[0.12] border-[0.5px] border-[#d4882a]/25 flex items-center justify-center text-[#d4882a]">
              <Sparkles className="w-[28px] h-[28px]" />
            </div>
            <div>
              <div className="text-[20px] font-display font-normal text-[#ede4d8] leading-tight">Deep AI Analysis Available</div>
              <div className="text-[13px] font-sans text-[#8a7d6e] mt-1">Your latest 30 days are ready for a full psychological profile.</div>
              <div className="inline-block mt-2 px-[10px] py-[3px] rounded-[20px] bg-[#d4882a]/10 border-[0.5px] border-[#d4882a]/30 text-[11px] text-[#d4882a] font-medium font-sans">
                ✦ PREMIUM FEATURE
              </div>
            </div>
          </div>
          <LockedFeature featureName="Deep Analysis" requiredPlan="pro" overlayClassName="bg-transparent">
            <button 
              onClick={() => navigate('/report')}
              className="px-[22px] py-[10px] rounded-[40px] bg-[#d4882a] text-[#0e0b09] text-[13px] font-medium whitespace-nowrap hover:bg-[#f0a84a] transform hover:-translate-y-[1px] transition-all hover:shadow-[0_8px_20px_rgba(212,136,42,0.3)]"
            >
              Generate Report
            </button>
          </LockedFeature>
        </motion.div>

        {/* ANNUAL REPORT CARD (BOTTOM) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-8 p-10 rounded-[32px] bg-[#161210] border border-white/[0.04] text-center overflow-hidden relative"
        >
          <div className="absolute top-0 left-0 right-0 h-[100px] bg-gradient-to-b from-[#d4882a]/5 to-transparent" />
          <div className="relative z-10">
            <div className="w-16 h-16 rounded-3xl bg-[#d4882a]/10 border border-[#d4882a]/20 flex items-center justify-center text-[#d4882a] mx-auto mb-6">
              <Shield className="w-8 h-8" />
            </div>
            <h3 className="text-3xl font-display text-[#ede4d8] mb-3">Your 2025 Year in Review is ready</h3>
            <p className="text-[#8a7d6e] text-sm mb-8 max-w-sm mx-auto">Witness your growth across the past year. Revisit your moments of strength and change.</p>
            
            <LockedFeature featureName="Annual report" requiredPlan="pro" className="inline-block">
               <button className="px-8 py-3 rounded-full border border-[#d4882a] text-[#d4882a] hover:bg-[#d4882a] hover:text-[#0e0b09] transition-all font-medium flex items-center gap-2">
                 <ExternalLink className="w-4 h-4" />
                 View 2025 Report
               </button>
            </LockedFeature>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Insights;
