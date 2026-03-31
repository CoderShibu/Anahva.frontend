import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useConfidentialMode } from '@/contexts/ConfidentialModeContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Home, BookOpen, BarChart3, Settings, Calendar, Bell, User, Eye, EyeOff, Moon, Sun, Globe } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import LanguageToggle from './LanguageToggle';

const Navigation = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { isConfidential, toggleConfidential } = useConfidentialMode();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [showLang, setShowLang] = useState(false);

  const navItems = [
    { to: '/home', icon: Home, label: 'Today' },
    { to: '/journal', icon: BookOpen, label: 'Journal' },
    { to: '/insights', icon: Calendar, label: 'Mood Tracker' },
    { to: '/history', icon: BarChart3, label: 'Insights' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <>
      {/* TOP NAV (MOBILE & DESKTOP) */}
      <nav className="fixed top-0 left-0 right-0 z-[50] flex items-center justify-between px-6 py-4 md:px-10 bg-[#0e0b09]/80 backdrop-blur-md border-b border-white/[0.06] md:pl-[240px]">
        <div className="md:hidden flex items-center gap-2 text-xl font-display text-foreground">
          <div className="w-1.5 h-1.5 rounded-full bg-[#d4882a] shadow-[0_0_8px_#d4882a]" />
          Anahva
        </div>
        <div />
        <div className="flex items-center gap-4">
          <div className="relative">
            <button 
                onClick={() => setShowLang(!showLang)}
                className="p-2 rounded-full hover:bg-white/[0.06] text-[#8a7d6e] transition-colors"
            >
                <Globe className="w-5 h-5" />
            </button>
            <AnimatePresence>
                {showLang && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 z-[100] min-w-[200px]"
                    >
                        <div className="p-2 bg-[#161210] border border-white/[0.08] rounded-2xl shadow-2xl">
                             <LanguageToggle />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
          </div>
          <button className="p-2 rounded-full hover:bg-white/[0.06] transition-colors relative">
            <Bell className="w-5 h-5 text-[#8a7d6e] hover:text-[#ede4d8] transition-colors" />
            <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#d4882a] rounded-full border border-[#0e0b09]" />
          </button>
          <div className="w-9 h-9 rounded-full bg-[#d4882a] flex items-center justify-center text-[#0e0b09] font-medium text-sm">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
        </div>
      </nav>

      {/* SIDEBAR (DESKTOP) */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-[240px] bg-[#161210] border-r border-white/[0.06] flex-col z-[60]">
        <div className="p-8">
          <div className="flex items-center gap-3 text-2xl font-light tracking-widest font-display text-foreground">
            <div className="w-1.5 h-1.5 rounded-full bg-[#d4882a] shadow-[0_0_8px_#d4882a]" />
            Anahva
          </div>
        </div>

        <div className="px-6 mb-6">
            <button 
                onClick={toggleConfidential}
                className={`w-full p-2 rounded-xl flex items-center justify-center gap-2 border transition-all ${isConfidential ? 'bg-[#d4882a]/10 border-[#d4882a]/30 text-[#d4882a]' : 'bg-white/[0.02] border-white/[0.06] text-[#8a7d6e] hover:text-[#ede4d8]'}`}
                title={isConfidential ? "Disable Confidential Mode" : "Enable Confidential Mode"}
            >
                {isConfidential ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span className="text-[10px] font-bold uppercase">Safe Mode</span>
            </button>
        </div>

        <nav className="flex-1 px-4 mt-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={`flex items-center gap-3 px-5 py-3.5 rounded-xl transition-all relative group ${
                      isActive
                        ? 'text-[#ede4d8] bg-white/[0.03]'
                        : 'text-[#8a7d6e] hover:text-[#ede4d8] hover:bg-white/[0.02]'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="navIndicator"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-[#d4882a] rounded-r-full shadow-[0_0_12px_#d4882a]"
                      />
                    )}
                    <item.icon className={`w-5 h-5 transition-colors ${isActive ? 'text-[#d4882a]' : 'group-hover:text-[#d4882a]/70'}`} />
                    <span className="text-[13px] font-medium tracking-wide font-body">{item.label}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-6 border-t border-white/[0.06]">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-[#231e19] border border-white/[0.06] flex items-center justify-center text-[#d4882a]">
              <User className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <div className="text-[13px] font-medium text-[#ede4d8] truncate">{user?.name}</div>
              <div className="text-[11px] text-[#8a7d6e] truncate">Journaling since Feb 2026</div>
            </div>
          </div>
        </div>
      </aside>

      {/* MOBILE TAB BAR */}
      <nav className="fixed bottom-0 left-0 right-0 z-[100] bg-[#161210]/90 backdrop-blur-xl border-t border-white/[0.06] md:hidden">
        <div className="flex justify-around items-center py-3 px-2">
          {navItems.slice(0, 4).map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={`flex flex-col items-center gap-1 transition-colors ${
                  isActive ? 'text-[#d4882a]' : 'text-[#8a7d6e]'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default Navigation;
