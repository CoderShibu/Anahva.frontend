import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import Navigation from '@/components/Navigation';
import { Globe, Eye, Shield, LogOut, Lock, ChevronRight, Bell, Trash2, Download, User, FileText, CreditCard, ArrowUpCircle } from 'lucide-react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import LockedFeature from '@/components/LockedFeature';

import { toast } from 'sonner';

const Settings = () => {
  const { user, logout } = useAuth();
  const { plan, entriesThisMonth } = useSubscription();
  const { reducedMotion, setReducedMotion } = useAccessibility();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const exportData = () => {
    const data = localStorage.getItem('anahva_journals');
    if (!data) {
        toast.error("No data found to export.");
        return;
    }
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `anahva_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Data exported successfully.");
  };

  const deleteData = () => {
    if (confirm("Are you sure? This will delete all your sacred entries permanently. This action cannot be undone.")) {
        localStorage.removeItem('anahva_journals');
        toast.success("All entries have been cleared.");
        setTimeout(() => window.location.reload(), 1500);
    }
  };

  return (
    <div className="min-h-screen bg-[#0e0b09] md:pl-[240px] pt-20 pb-10 text-[#ede4d8]">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-6 md:px-10 py-10">
        <header className="mb-12">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl md:text-5xl font-display text-[#ede4d8] mb-2"
          >
            Settings
          </motion.h1>
          <p className="text-[#8a7d6e] font-body">Manage your sanctuary and preferences.</p>
        </header>

        {/* PROFILE CARD */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 rounded-[20px] bg-[#231e19] border border-white/[0.06] mb-10 flex items-center justify-between"
        >
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-[#d4882a] flex items-center justify-center text-[#0e0b09] text-3xl font-display">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-display text-[#ede4d8]">{user?.name}</h2>
              <p className="text-[#8a7d6e] text-sm">{user?.country || 'Sacred Journeyer'}</p>
            </div>
          </div>
          <button className="px-6 py-2 rounded-full border border-white/[0.06] text-[#ede4d8] text-xs font-medium hover:bg-white/[0.02] transition-colors">
            Edit Profile
          </button>
        </motion.div>

        {/* SUBSCRIPTION SECTION */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="space-y-4 mb-10"
        >
          <h3 className="text-[11px] uppercase tracking-widest text-[#8a7d6e] px-2 font-body font-bold">Your plan</h3>
          <div className="p-8 rounded-[24px] bg-[#231e19] border border-white/[0.06] overflow-hidden relative shadow-lg">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div className="flex items-center gap-5">
                   <div className="w-12 h-12 rounded-2xl bg-[#d4882a]/10 flex items-center justify-center text-[#d4882a] border border-[#d4882a]/20">
                      <CreditCard className="w-6 h-6" />
                   </div>
                   <div>
                      <div className="flex items-center gap-2 mb-1">
                         <h2 className="text-xl font-display text-[#ede4d8] capitalize">{plan} Plan</h2>
                         <span className="px-2 py-0.5 rounded-full bg-[#d4882a]/10 border border-[#d4882a]/40 text-[#d4882a] text-[9px] font-bold uppercase tracking-wider">Active</span>
                      </div>
                      <p className="text-[#8a7d6e] text-xs">
                        {plan === 'free' ? "You're on the standard free plan" : `Next billing: ${new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toLocaleDateString()} · ₹${plan === 'pro' ? '249' : '99'}/mo`}
                      </p>
                   </div>
                </div>
                {plan === 'free' ? (
                   <button 
                     onClick={() => navigate('/pricing')}
                     className="px-6 py-2.5 rounded-full bg-[#d4882a] text-[#0e0b09] text-xs font-bold hover:bg-[#f0a84a] transition-all flex items-center gap-2 w-fit"
                   >
                     <ArrowUpCircle className="w-4 h-4" />
                     Upgrade →
                   </button>
                ) : (
                   <div className="flex items-center gap-3">
                      <button className="text-[12px] text-[#8a7d6e] hover:text-[#ede4d8] transition-colors font-medium">Manage billing</button>
                      <div className="w-1 h-1 rounded-full bg-white/10" />
                      <button className="text-[12px] text-[#8a7d6e] hover:text-[#E24B4A] transition-colors font-medium">Cancel subscription</button>
                   </div>
                )}
             </div>

             {plan === 'free' && (
                <div className="pt-6 border-t border-white/[0.04]">
                   <div className="flex items-center justify-between text-[11px] font-medium mb-2.5">
                      <span className="text-[#8a7d6e] uppercase tracking-wider">Entries this month</span>
                      <span className="text-[#ede4d8]">{entriesThisMonth} of 10 used</span>
                   </div>
                   <div className="h-1.5 w-full bg-white/[0.02] rounded-full overflow-hidden">
                      <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${(entriesThisMonth / 10) * 100}%` }}
                         className="h-full bg-[#d4882a] shadow-[0_0_8px_rgba(212,136,42,0.4)]"
                      />
                   </div>
                </div>
             )}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          {/* ACCESSIBILITY */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <h3 className="text-[11px] uppercase tracking-widest text-[#8a7d6e] px-2 font-body font-bold">Accessibility</h3>
            <div className="rounded-[20px] bg-[#231e19] border border-white/[0.06] overflow-hidden">
              <div className="flex items-center justify-between p-6 hover:bg-white/[0.01] transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 rounded-xl bg-white/[0.03] text-[#d4882a]">
                    <Eye className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Reduced Motion</div>
                    <div className="text-[11px] text-[#8a7d6e]">Minimize animations</div>
                  </div>
                </div>
                <button 
                  onClick={() => setReducedMotion(!reducedMotion)}
                  className={`w-10 h-5 rounded-full transition-colors relative ${reducedMotion ? 'bg-[#d4882a]' : 'bg-white/[0.06]'}`}
                >
                  <div className={`absolute top-1 w-3 h-3 rounded-full bg-[#ede4d8] transition-all ${reducedMotion ? 'right-1' : 'left-1'}`} />
                </button>
              </div>
              <div className="flex items-center justify-between p-6 hover:bg-white/[0.01] transition-colors border-t border-white/[0.04]">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 rounded-xl bg-white/[0.03] text-[#d4882a]">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Language</div>
                    <div className="text-[11px] text-[#8a7d6e]">English (US)</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#8a7d6e]" />
              </div>
            </div>
          </motion.div>

          {/* PRIVACY */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <h3 className="text-[11px] uppercase tracking-widest text-[#8a7d6e] px-2 font-body font-bold">Privacy & Security</h3>
            <div className="rounded-[20px] bg-[#231e19] border border-white/[0.06] overflow-hidden">
              <div className="flex items-center justify-between p-6 hover:bg-white/[0.01] transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 rounded-xl bg-white/[0.03] text-[#d4882a]">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Device Encryption</div>
                    <div className="text-[11px] text-[#5DCAA5]">Active & Protected</div>
                  </div>
                </div>
                <div className="w-2 h-2 rounded-full bg-[#5DCAA5] shadow-[0_0_8px_#5DCAA5]" />
              </div>
              <div className="flex items-center justify-between p-6 hover:bg-white/[0.01] transition-colors border-t border-white/[0.04]">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 rounded-xl bg-white/[0.03] text-[#d4882a]">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Confidential Mode</div>
                    <div className="text-[11px] text-[#8a7d6e]">Not saved to database</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#8a7d6e]" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* DATA MANAGEMENT */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4 mb-10"
        >
          <h3 className="text-[11px] uppercase tracking-widest text-[#8a7d6e] px-2 font-body font-bold">Data Management</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button 
              onClick={exportData}
              className="p-6 rounded-[20px] bg-[#161210] border border-white/[0.04] flex items-center justify-between group hover:border-[#d4882a]/30 transition-all text-left"
            >
              <div className="flex items-center gap-4">
                <Download className="w-5 h-5 text-[#8a7d6e] group-hover:text-[#d4882a] transition-colors" />
                <span className="text-sm">Export Data (JSON)</span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#8a7d6e]" />
            </button>
            <LockedFeature featureName="Therapist PDF export" requiredPlan="plus" overlayClassName="bg-transparent">
              <button 
                className="p-6 rounded-[20px] bg-[#161210] border border-white/[0.04] flex items-center justify-between group hover:border-[#d4882a]/30 transition-all text-left w-full h-full"
              >
                <div className="flex items-center gap-4">
                  <FileText className="w-5 h-5 text-[#8a7d6e] group-hover:text-[#d4882a] transition-colors" />
                  <span className="text-sm">Therapist PDF Export</span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#8a7d6e]" />
              </button>
            </LockedFeature>
            <button 
              onClick={deleteData}
              className="p-6 rounded-[20px] bg-[#161210] border border-white/[0.04] flex items-center justify-between group hover:border-[#ff4b4b]/30 transition-all text-left"
            >
              <div className="flex items-center gap-4">
                <Trash2 className="w-5 h-5 text-[#8a7d6e] group-hover:text-[#ff4b4b] transition-colors" />
                <span className="text-sm">Delete All Entries</span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#8a7d6e]" />
            </button>
          </div>
        </motion.div>

        {/* APP INFO */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="space-y-4 mb-10"
        >
          <h3 className="text-[11px] uppercase tracking-widest text-[#8a7d6e] px-2 font-body font-bold">Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button 
              onClick={() => navigate('/about')}
              className="p-6 rounded-[20px] bg-[#161210] border border-white/[0.04] flex items-center justify-between group hover:border-[#d4882a]/30 transition-all"
            >
              <div className="flex items-center gap-4">
                <Shield className="w-5 h-5 text-[#8a7d6e] group-hover:text-[#d4882a] transition-colors" />
                <span className="text-sm">About Anahva</span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#8a7d6e]" />
            </button>
            <button 
              onClick={() => navigate('/about#developer')}
              className="p-6 rounded-[20px] bg-[#161210] border border-white/[0.04] flex items-center justify-between group hover:border-[#d4882a]/30 transition-all"
            >
              <div className="flex items-center gap-4">
                <Lock className="w-5 h-5 text-[#8a7d6e] group-hover:text-[#d4882a] transition-colors" />
                <span className="text-sm">About Developer</span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#8a7d6e]" />
            </button>
          </div>
        </motion.div>

        {/* LOGOUT */}
        <motion.button 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          onClick={handleLogout}
          className="w-full py-4 rounded-[20px] border border-white/[0.06] text-[#ede4d8] font-medium hover:bg-white/[0.02] flex items-center justify-center gap-2 transition-all mt-10"
        >
          <LogOut className="w-4 h-4 text-[#8a7d6e]" />
          Logout
        </motion.button>

        <div className="mt-20 text-center">
          <div className="text-2xl font-display tracking-widest text-white/[0.05] mb-2">ANAHVA</div>
          <div className="text-[10px] text-[#8a7d6e] uppercase tracking-[0.2em]">Sacred Journaling v1.0.4</div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
