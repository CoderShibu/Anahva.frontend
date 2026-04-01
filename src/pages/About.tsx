import { motion, AnimatePresence } from 'framer-motion';
import AnahvaLogo from '@/components/AnahvaLogo';
import { Heart, Shield, Lock, Mail, Sparkles, Users, Globe, Github, Twitter, Linkedin, ExternalLink } from 'lucide-react';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const About = () => {
  const { hash } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [hash]);

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen bg-[#0e0b09] pb-24 md:pb-12 text-[#ede4d8] font-body relative overflow-y-auto">
      {/* Standalone Header */}
      <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-10 py-6 bg-[#0e0b09]/95 backdrop-blur-md border-b border-white/[0.06]">
        <div className="flex items-center gap-3 text-2xl font-light tracking-widest font-display text-foreground cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-2 h-2 rounded-full bg-[#d4882a] shadow-[0_0_12px_#d4882a] animate-pulse" />
          Anahva
        </div>
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/')} className="text-sm font-light text-[#b8a898] hover:text-[#d4882a] transition-colors">Home</button>
          <button onClick={() => navigate('/#features')} className="text-sm font-light text-[#b8a898] hover:text-[#d4882a] transition-colors">Features</button>
          <button onClick={() => navigate('/')} className="px-6 py-2 rounded-full bg-[#d4882a] text-[#0e0b09] text-sm font-medium hover:bg-[#f0a84a] transition-all">
            Join Anahva
          </button>
        </div>
      </nav>
      
      <main className="max-w-6xl mx-auto px-6 pt-[100px] md:pt-[120px]">
        {/* HERO SECTION */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-block mb-6 relative">
            <div className="absolute inset-0 bg-[#d4882a]/20 blur-[40px] rounded-full" />
            <AnahvaLogo size={80} className="relative z-10 mx-auto" />
          </div>
          <h1 className="text-5xl md:text-7xl font-display text-[#ede4d8] mb-4 tracking-tight">
            Anahva
          </h1>
          <p className="text-[#8a7d6e] text-lg md:text-xl max-w-xl mx-auto font-light leading-relaxed">
            Your sacred space for emotional clarity, privacy, and inner peace.
          </p>
        </motion.div>

        <div className="space-y-16">
          {/* ABOUT APP */}
          <motion.section 
            {...fadeInUp}
            className="relative p-1 bg-gradient-to-br from-white/[0.08] to-transparent rounded-[32px] overflow-hidden"
          >
            <div className="bg-[#161210] rounded-[31px] p-8 md:p-12">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-[#d4882a]/10 rounded-2xl">
                  <Heart className="w-6 h-6 text-[#d4882a]" />
                </div>
                <h2 className="text-3xl font-display text-[#ede4d8]">The Anahva Vision</h2>
              </div>
              
              <div className="space-y-6 text-[#8a7d6e] text-lg leading-relaxed">
                <p>
                  Anahva is India's first <span className="text-[#ede4d8] font-medium">privacy-absolute</span>, emotionally aware sanctuary. 
                  Named after the <span className="italic text-[#d4882a]">Anahata</span> (heart center), it's designed to be a mirror for your soul.
                </p>
                <p>
                  We live in a world of constant noise—academic pressure, social expectations, and digital burnout. 
                  Anahva provides the silence you need to hear your own voice again. No judgment, no labels, just you and your reflections.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                  {[
                    { icon: Shield, title: "Privacy First", desc: "Your data never leaves your control." },
                    { icon: Sparkles, title: "Cultural Care", desc: "Built specifically for the Indian context." },
                    { icon: Lock, title: "Safe Circle", desc: "A place for your most vulnerable thoughts." },
                    { icon: Globe, title: "Multilingual", desc: "Express yourself in the voice you feel." }
                  ].map((feat, i) => (
                    <div key={i} className="p-5 bg-white/[0.02] border border-white/[0.05] rounded-2xl">
                      <feat.icon className="w-5 h-5 text-[#d4882a] mb-3" />
                      <h3 className="text-[#ede4d8] font-medium mb-1">{feat.title}</h3>
                      <p className="text-sm opacity-60">{feat.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>

          {/* TEAM SECTION */}
          <motion.section 
            id="team"
            {...fadeInUp}
            className="space-y-10"
          >
            <div className="text-center">
              <div className="text-[11px] uppercase tracking-[0.14em] font-medium text-[#d4882a] mb-4">The People Behind Anahva</div>
              <h2 className="text-4xl md:text-5xl font-display text-[#ede4d8]">Meet the Founders</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Founder 1 */}
              <div className="bg-[#231e19] border-t-2 border-[#d4882a] rounded-[24px] p-8 transition-all hover:bg-[#271f18] group">
                <div className="w-20 h-20 rounded-full bg-[#d4882a] flex items-center justify-center text-[#0e0b09] text-3xl font-display mb-6 shadow-lg shadow-[#d4882a]/20">S</div>
                <h3 className="text-2xl font-display text-[#ede4d8] mb-1">Shibasish</h3>
                <div className="text-[#d4882a] text-xs font-bold uppercase tracking-widest mb-4">Founder & Architect</div>
                <p className="text-[#8a7d6e] text-sm leading-relaxed font-body">
                  "I built Anahva to prove technology can be empathetic. Mental wellness shouldn't feel like a clinical checklist—it should feel like a warm sanctuary."
                </p>
              </div>

              {/* Founder 2 */}
              <div className="bg-[#231e19] border-t-2 border-[#d4882a] rounded-[24px] p-8 transition-all hover:bg-[#271f18] group">
                <div className="w-20 h-20 rounded-full bg-[#d4882a] flex items-center justify-center text-[#0e0b09] text-3xl font-display mb-6 shadow-lg shadow-[#d4882a]/20">KV</div>
                <h3 className="text-2xl font-display text-[#ede4d8] mb-1">Kalyan V</h3>
                <div className="text-[#d4882a] text-xs font-bold uppercase tracking-widest mb-4">Co-Founder</div>
                <p className="text-[#8a7d6e] text-sm leading-relaxed font-body">
                  "Passionate about building technology that creates genuine human connection. Kalyan brings depth in product thinking and user empathy to everything Anahva is becoming."
                </p>
              </div>

              {/* Founder 3 */}
              <div className="bg-[#231e19] border-t-2 border-[#d4882a] rounded-[24px] p-8 transition-all hover:bg-[#271f18] group">
                <div className="w-20 h-20 rounded-full bg-[#d4882a] flex items-center justify-center text-[#0e0b09] text-3xl font-display mb-6 shadow-lg shadow-[#d4882a]/20">KG</div>
                <h3 className="text-2xl font-display text-[#ede4d8] mb-1">Kirti Ganiger</h3>
                <div className="text-[#d4882a] text-xs font-bold uppercase tracking-widest mb-4">Co-Founder</div>
                <p className="text-[#8a7d6e] text-sm leading-relaxed font-body">
                  "Driven by the belief that mental wellness should be accessible, private, and beautifully designed. Kirti shapes the heart of Anahva's user experience and vision."
                </p>
              </div>
            </div>
          </motion.section>

          {/* MISSION STATS / TRUST */}
          <motion.div 
            {...fadeInUp}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              { label: "India Focused", value: "Built Local" },
              { label: "Launch Date", value: "Feb 2026" },
              { label: "Current Status", value: "Active v1.0.4" }
            ].map((stat, i) => (
              <div key={i} className="p-8 bg-[#161210] border border-white/[0.04] rounded-[24px] text-center group hover:border-[#d4882a]/30 transition-all">
                <div className="text-[10px] uppercase tracking-[0.2em] text-[#8a7d6e] mb-2">{stat.label}</div>
                <div className="text-xl font-display text-[#ede4d8]">{stat.value}</div>
              </div>
            ))}
          </motion.div>

          {/* FOOTER NOTE */}
          <motion.div 
            {...fadeInUp}
            className="text-center pt-10 border-t border-white/[0.06]"
          >
            <p className="text-[#8a7d6e] italic max-w-lg mx-auto leading-relaxed">
              "Anahva is not about fixing people. It's about giving people a safe place to understand themselves."
            </p>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default About;
