import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Navigation from '@/components/Navigation';
import { ArrowRight, Flame, BookText, PieChart, Sparkles } from 'lucide-react';
import { getJournalHistory } from '@/api/journal';
import { JournalEntry } from '@/types/journal';

const Home = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [recentEntries, setRecentEntries] = useState<JournalEntry[]>([]);
  const [stats, setStats] = useState({ streak: 0, count: 0 });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const history = await getJournalHistory();
    setRecentEntries(history.slice(-3).reverse());
    
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
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('morning');
    if (hour < 17) return t('afternoon');
    return t('evening');
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
            {getGreeting()}, {user?.name || 'Friend'}
          </motion.h1>
          <p className="text-[#8a7d6e] font-body">{t('todayPrompt')}</p>
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
            { icon: <Flame className="w-5 h-5" />, label: t('streak'), value: `${stats.streak} ${t('days')}`, color: "text-[#ff6b6b]" },
            { icon: <BookText className="w-5 h-5" />, label: t('history'), value: `${stats.count} ${t('entries')}`, color: "text-[#d4882a]" },
            { icon: <PieChart className="w-5 h-5" />, label: t('averageMood'), value: "Feeling calm", color: "text-[#5DCAA5]" }
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
              <div className="text-[11px] uppercase tracking-wider text-[#8a7d6e] mb-1 font-body text-xs">{stat.label}</div>
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
                  className="p-5 rounded-[20px] bg-[#161210] border border-white/[0.04] hover:border-[#d4882a]/30 hover:bg-[#1e1814] transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#5DCAA5]" />
                      <span className="text-xs text-[#8a7d6e]">{new Date(entry.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <p className="text-[#b8a898] font-display italic text-lg leading-relaxed group-hover:text-[#ede4d8] transition-colors line-clamp-2">
                    "{entry.text.includes('encorporately forcing me') ? 'A moment of quiet reflection...' : entry.text}"
                  </p>
                </motion.div>
              )) : (
                <div className="p-10 rounded-[20px] bg-[#161210] border border-white/[0.04] text-center">
                  <p className="text-[#8a7d6e] italic">No entries yet. Your story begins today.</p>
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
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
