import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Check, Shield, ArrowRight, Mail } from 'lucide-react';
import { useSubscription, Plan } from '@/contexts/SubscriptionContext';

const Pricing = () => {
  const [isYearly, setIsYearly] = useState(false);
  const navigate = useNavigate();
  const { setPlan } = useSubscription();

  const handleSelectPlan = (plan: Plan) => {
    setPlan(plan);
    navigate('/home');
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen bg-[#0e0b09] text-[#ede4d8] font-body transition-colors">
      {/* STANDALONE NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-10 py-6 bg-gradient-to-b from-[#0e0b09]/95 to-transparent">
        <div 
          onClick={() => navigate('/')}
          className="flex items-center gap-3 text-2xl font-light tracking-widest font-display text-foreground cursor-pointer"
        >
          <div className="w-2 h-2 rounded-full bg-[#d4882a] shadow-[0_0_12px_#d4882a] animate-pulse" />
          Anahva
        </div>
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/#features')} className="text-sm font-light text-[#b8a898] hover:text-foreground transition-colors">Features</button>
          <button onClick={() => navigate('/pricing')} className="text-sm font-light text-[#d4882a] transition-colors">Pricing</button>
          <button onClick={() => navigate('/about')} className="text-sm font-light text-[#b8a898] hover:text-foreground transition-colors">About</button>
          <button onClick={() => navigate('/')} className="px-6 py-2 rounded-full bg-[#d4882a] text-[#0e0b09] text-sm font-medium hover:bg-[#f0a84a] transition-all">
            Start journaling
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-32 pb-24">
        {/* HERO */}
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[11px] uppercase tracking-[0.2em] font-medium text-[#d4882a] mb-4"
          >
            ✦ Simple Pricing
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-[52px] font-display font-light mb-4"
          >
            Find your space
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-[#8a7d6e] text-lg max-w-xl mx-auto"
          >
            Start free. Upgrade when Anahva becomes a part of your life.
          </motion.p>

          {/* TOGGLE */}
          <div className="mt-10 flex items-center justify-center gap-4">
            <span className={`text-sm ${!isYearly ? 'text-[#ede4d8]' : 'text-[#8a7d6e]'}`}>Monthly</span>
            <button 
              onClick={() => setIsYearly(!isYearly)}
              className="w-14 h-7 rounded-full bg-[#1e1814] border border-white/10 p-1 relative transition-colors"
            >
              <motion.div 
                animate={{ x: isYearly ? 28 : 0 }}
                className="w-5 h-5 rounded-full bg-[#d4882a] shadow-[0_0_8px_#d4882a]"
              />
            </button>
            <div className="flex items-center gap-2">
              <span className={`text-sm ${isYearly ? 'text-[#ede4d8]' : 'text-[#8a7d6e]'}`}>Yearly</span>
              <span className="px-2 py-0.5 rounded-full bg-[#5DCAA5]/10 text-[#5DCAA5] text-[10px] font-bold uppercase tracking-wider">Save 20%</span>
            </div>
          </div>
        </div>

        {/* PRICING GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {/* FREE */}
          <motion.div {...fadeInUp} className="p-8 rounded-[24px] bg-[#161210] border border-white/[0.06] flex flex-col h-full">
            <h3 className="text-2xl font-display mb-2">Free</h3>
            <div className="mb-6">
              <div className="text-4xl font-display text-[#ede4d8]">₹0</div>
              <div className="text-sm text-[#8a7d6e]">forever</div>
            </div>
            <div className="h-px bg-white/[0.06] w-full mb-6" />
            <ul className="space-y-4 mb-8 flex-1">
              {[
                "10 entries/month",
                "Basic mood tracking",
                "1 AI reflection/week",
                "Daily prompt",
                "7-day streak tracking"
              ].map((feat, i) => (
                <li key={i} className="flex gap-3 text-sm text-[#b8a898]">
                  <Check className="w-4 h-4 text-[#d4882a]/60 shrink-0" />
                  {feat}
                </li>
              ))}
            </ul>
            <button 
              onClick={() => navigate('/')}
              className="w-full py-3 rounded-full border border-[#d4882a]/30 text-[#b8a898] hover:text-[#d4882a] hover:border-[#d4882a] transition-all"
            >
              Get started
            </button>
          </motion.div>

          {/* PLUS */}
          <motion.div {...fadeInUp} transition={{ delay: 0.1 }} className="p-8 rounded-[24px] bg-[#161210] border-t-2 border-[#d4882a] border-x border-b border-white/[0.06] flex flex-col h-full">
            <h3 className="text-2xl font-display mb-2">Plus</h3>
            <div className="mb-6 h-12">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={isYearly ? 'yearly' : 'monthly'}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-display text-[#ede4d8]">₹{isYearly ? 948 : 99}</span>
                    <span className="text-sm text-[#8a7d6e]">/{isYearly ? 'year' : 'month'}</span>
                  </div>
                  {isYearly && <div className="text-[11px] text-[#5DCAA5] mt-1 font-medium italic">₹79/mo billed yearly</div>}
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="h-px bg-white/[0.06] w-full mb-6" />
            <ul className="space-y-4 mb-8 flex-1">
              {[
                "Unlimited entries",
                "Full AI companion",
                "Full mood tracker",
                "All ambient sounds",
                "Custom prompt packs",
                "Entry search",
                "Streak freeze (1/month)",
                "PIN-locked Safe Mode"
              ].map((feat, i) => (
                <li key={i} className="flex gap-3 text-sm text-[#b8a898]">
                  <Check className="w-4 h-4 text-[#d4882a] shrink-0" />
                  {feat}
                </li>
              ))}
            </ul>
            <button 
              onClick={() => handleSelectPlan('plus')}
              className="w-full py-3 rounded-full bg-[#d4882a] text-[#0e0b09] font-medium hover:bg-[#f0a84a] transition-all"
            >
              Start Plus →
            </button>
          </motion.div>

          {/* PRO */}
          <div className="relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
              <div className="px-4 py-1 rounded-full bg-[#d4882a] text-[#0e0b09] text-[10px] font-bold uppercase tracking-[0.1em]">
                ✦ Most Popular
              </div>
            </div>
            <motion.div 
              {...fadeInUp} 
              transition={{ delay: 0.2 }} 
              className="p-8 rounded-[24px] bg-[#1a1410] border border-transparent shadow-[0_0_0_1px_rgba(212,136,42,0.5),0_0_32px_rgba(212,136,42,0.1)] scale-[1.03] flex flex-col h-full transform-gpu"
            >
              <h3 className="text-2xl font-display mb-2">Pro</h3>
              <div className="mb-6 h-12">
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={isYearly ? 'yearly' : 'monthly'}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-display text-[#ede4d8]">₹{isYearly ? 2388 : 249}</span>
                      <span className="text-sm text-[#8a7d6e]">/{isYearly ? 'year' : 'month'}</span>
                    </div>
                    {isYearly && <div className="text-[11px] text-[#5DCAA5] mt-1 font-medium italic">₹199/mo billed yearly</div>}
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="h-px bg-white/[0.06] w-full mb-6" />
              <ul className="space-y-4 mb-8 flex-1">
                {[
                  "Everything in Plus",
                  "Deep AI Analysis (1/month)",
                  "Therapist PDF export",
                  "Voice journaling",
                  "Emotion pattern alerts",
                  "Multiple journals",
                  "Hindi journaling",
                  "Annual year-in-review report"
                ].map((feat, i) => (
                  <li key={i} className="flex gap-3 text-sm text-[#b8a898]">
                    <Check className="w-4 h-4 text-[#d4882a] shrink-0" />
                    <span className={i === 0 ? 'font-medium text-[#ede4d8]' : ''}>{feat}</span>
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => handleSelectPlan('pro')}
                className="w-full py-4 rounded-full bg-[#d4882a] text-[#0e0b09] font-bold shadow-[0_8px_20px_rgba(212,136,42,0.2)] hover:bg-[#f0a84a] hover:shadow-[0_8px_30px_rgba(212,136,42,0.3)] transition-all"
              >
                Start Pro →
              </button>
            </motion.div>
          </div>

          {/* INSTITUTIONS */}
          <motion.div {...fadeInUp} transition={{ delay: 0.3 }} className="p-8 rounded-[24px] bg-[#161210] border border-white/[0.06] flex flex-col h-full">
            <h3 className="text-2xl font-display mb-2">Institutions</h3>
            <div className="mb-6 h-12">
              <div className="text-4xl font-display text-[#ede4d8]">Custom</div>
              <div className="text-sm text-[#8a7d6e]">contact us for pricing</div>
            </div>
            <div className="h-px bg-white/[0.06] w-full mb-6" />
            <ul className="space-y-4 mb-8 flex-1">
              {[
                "Therapist dashboard",
                "Bulk seat licensing",
                "White-label option",
                "Admin analytics",
                "Crisis flag system",
                "Custom prompt packs"
              ].map((feat, i) => (
                <li key={i} className="flex gap-3 text-sm text-[#b8a898]">
                  <Check className="w-4 h-4 text-[#d4882a]/60 shrink-0" />
                  {feat}
                </li>
              ))}
            </ul>
            <button className="w-full py-3 rounded-full border border-white/10 text-[#8a7d6e] hover:text-[#ede4d8] hover:bg-white/5 transition-all">
              Talk to us →
            </button>
          </motion.div>
        </div>

        <div className="mt-16 flex items-center justify-center gap-2 text-[#8a7d6e] text-[12px]">
          <Shield className="w-3.5 h-3.5 text-[#d4882a]" />
          All plans include end-to-end encryption. No ads. Ever. Cancel anytime.
        </div>

        {/* ONE-TIME ADD-ONS */}
        <section className="mt-32">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display mb-2 text-[#ede4d8]">One-time Add-ons</h2>
            <p className="text-[13px] text-[#8a7d6e]">Buy only what you need, when you need it.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "Extra Analysis Report", price: "₹49", desc: "One additional deep psychological profile" },
              { title: "Prompt Pack", price: "₹29–49", desc: "Themed packs: Grief, Anxiety, Relationships, Burnout" },
              { title: "Printed Journal Book", price: "₹399", desc: "Your year curated and shipped as a physical book" },
              { title: "Streak Restore", price: "₹9", desc: "Restore a broken streak, one time" }
            ].map((item, i) => (
              <div key={i} className="p-6 rounded-[24px] bg-[#231e19] border-t border-[#d4882a]/40 border-x border-b border-transparent transition-all hover:translate-y-[-4px]">
                <div className="text-2xl font-display text-[#d4882a] mb-2">{item.price}</div>
                <h4 className="text-[#ede4d8] font-medium mb-1">{item.title}</h4>
                <p className="text-[13px] text-[#8a7d6e] mb-6 min-h-[40px]">{item.desc}</p>
                <button className="flex items-center gap-2 text-[12px] font-bold text-[#b8a898] hover:text-[#d4882a] transition-colors">
                  Add →
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* FOOTER SAME AS LANDING */}
      <footer className="flex flex-col md:flex-row items-center justify-between px-10 md:px-20 py-10 border-t border-white/[0.06] gap-6">
        <div className="text-xl font-display font-light tracking-wide text-[#b8a898]">✦ Anahva</div>
        <div className="flex gap-8">
          <a href="#" className="text-xs text-[#8a7d6e] hover:text-[#b8a898] transition-colors">Privacy Policy</a>
          <a href="#" className="text-xs text-[#8a7d6e] hover:text-[#b8a898] transition-colors">Terms</a>
          <a href="#" className="text-xs text-[#8a7d6e] hover:text-[#b8a898] transition-colors">Contact</a>
        </div>
        <div className="text-xs text-[#8a7d6e]">© 2026 Anahva · Made in India 🇮🇳</div>
      </footer>
    </div>
  );
};

export default Pricing;
