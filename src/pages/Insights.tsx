import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Navigation from '@/components/Navigation';
import { TrendingUp, Activity, Sparkles, Calendar, MessageSquare, AlertCircle } from 'lucide-react';
import { journalAPI } from '@/lib/api';
import { getJournalHistory } from '@/api/journal';

const Insights = () => {
  const { t } = useLanguage();
  const [journals, setJournals] = useState<any[]>([]);
  const [stats, setStats] = useState({ streak: 0, total: 0 });
  const [loading, setLoading] = useState(true);

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
      
      <main className="max-w-5xl mx-auto px-6 md:px-10 py-10">
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
              <div className="text-xs text-[#8a7d6e] uppercase tracking-wider font-body">March 2024</div>
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
              <h3 className="text-xl font-display text-[#ede4d8]">Common Themes</h3>
            </div>

            <div className="flex flex-wrap gap-3">
              {["Nature", "Work stress", "Family", "Morning coffee", "Rainy days", "Self-growth", "Future"].map((theme, i) => (
                <span 
                  key={i} 
                  className="px-4 py-2 rounded-full bg-[#161210] border border-white/[0.06] text-xs text-[#ede4d8] hover:border-[#d4882a]/30 transition-colors"
                >
                  {theme}
                </span>
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 p-8 rounded-[20px] bg-[#231e19] border border-white/[0.06] flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#d4882a]/[0.1] flex items-center justify-center text-[#d4882a]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[13px] font-medium text-[#ede4d8]">Deep AI Analysis Available</div>
              <div className="text-[11px] text-[#8a7d6e]">Your latest 30 days are ready for a full psychological profile.</div>
            </div>
          </div>
          <button className="px-6 py-2 rounded-full border border-[#d4882a]/18 text-[#d4882a] text-xs font-medium hover:bg-[#d4882a]/[0.05] transition-all">
            Generate Report
          </button>
        </motion.div>
      </main>
    </div>
  );
};

export default Insights;
