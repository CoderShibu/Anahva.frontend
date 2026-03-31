import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import AnahvaLogo from '@/components/AnahraLogo';
import { Heart, Shield, Lock, Mail, Sparkles, Users, Globe, Github, Twitter, Linkedin, ExternalLink } from 'lucide-react';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const About = () => {
  const { hash } = useLocation();

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
    <div className="min-h-screen bg-[#0e0b09] pb-24 md:pb-12 md:pl-[240px] text-[#ede4d8] font-body">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-6 pt-24 md:pt-32">
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

          {/* ABOUT DEVELOPER */}
          <motion.section 
            id="developer"
            {...fadeInUp}
            className="relative p-1 bg-gradient-to-br from-[#d4882a]/20 to-transparent rounded-[32px] overflow-hidden"
          >
            <div className="bg-[#161210] rounded-[31px] p-8 md:p-12">
              <div className="flex flex-col md:flex-row gap-10 items-center">
                <div className="w-48 h-48 rounded-full bg-gradient-to-br from-[#d4882a] to-[#8a7d6e] p-1 flex-shrink-0">
                  <div className="w-full h-full rounded-full bg-[#0e0b09] flex items-center justify-center overflow-hidden">
                    {/* Placeholder for Dev Image or Initials */}
                    <span className="text-6xl font-display text-[#d4882a]">S</span>
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-[#d4882a]/10 rounded-2xl">
                      <Users className="w-6 h-6 text-[#d4882a]" />
                    </div>
                    <h2 className="text-3xl font-display text-[#ede4d8]">Meet the Builder</h2>
                  </div>
                  
                  <h3 className="text-xl font-medium text-[#ede4d8] mb-4">Shibasish <span className="text-[#8a7d6e] text-sm font-normal ml-2">Creator & Lead Architect</span></h3>
                  
                  <p className="text-[#8a7d6e] text-lg leading-relaxed mb-6">
                    I built Anahva with a single mission: to prove that technology can be empathetic. 
                    As a student and developer, I believe mental wellness tools shouldn't feel like clinical checklists—they should feel like a warm cup of tea on a rainy evening.
                  </p>
                  
                  <div className="flex flex-wrap gap-4">
                    <a href="mailto:shibasish2005@gmail.com" className="flex items-center gap-2 px-6 py-2.5 bg-[#d4882a] text-[#0e0b09] rounded-full text-sm font-bold hover:scale-105 transition-all">
                      <Mail className="w-4 h-4" /> Message Me
                    </a>
                    <div className="flex items-center gap-3 ml-2">
                       <a href="https://github.com/CoderShibu" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-white/[0.05] text-[#8a7d6e] hover:text-[#ede4d8] transition-colors" title="GitHub">
                         <Github className="w-5 h-5" />
                       </a>
                       <a href="#" className="p-2.5 rounded-full bg-white/[0.05] text-[#8a7d6e] hover:text-[#ede4d8] transition-colors"><Twitter className="w-5 h-5" /></a>
                       <a href="#" className="p-2.5 rounded-full bg-white/[0.05] text-[#8a7d6e] hover:text-[#ede4d8] transition-colors"><Linkedin className="w-5 h-5" /></a>
                    </div>
                  </div>
                </div>
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
