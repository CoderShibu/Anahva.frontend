import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Orb from '@/components/Orb';
import { Search, Shield, Clock, Heart, Users, Laptop, Star, CheckCircle2, EyeOff, MinusCircle } from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('shibasish2005@gmail.com');
  const [password, setPassword] = useState('shibasish');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [country, setCountry] = useState('');
  const [error, setError] = useState('');
  const { login, signup } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = await login(name, password);
    if (success) {
      navigate('/home');
    } else {
      setError('Invalid credentials');
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const result = signup(name, password, confirmPassword, country);
    if (result.success) {
      navigate('/home');
    } else {
      setError(result.error || 'Signup failed');
    }
  };

  return (
    <div className="relative z-10 w-full min-h-screen">
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-10 py-6 bg-gradient-to-bottom from-[#0e0b09]/95 to-transparent">
        <div className="flex items-center gap-3 text-2xl font-light tracking-widest font-display text-foreground">
          <div className="w-2 h-2 rounded-full bg-[#d4882a] shadow-[0_0_12px_#d4882a] animate-pulse" />
          Anahva
        </div>
        <div className="flex items-center gap-6">
          <a href="#features" className="text-sm font-light text-[#b8a898] hover:text-foreground transition-colors">Features</a>
          <a href="#about" className="text-sm font-light text-[#b8a898] hover:text-foreground transition-colors">About</a>
          <a href="#login" className="px-6 py-2 rounded-full bg-[#d4882a] text-[#0e0b09] text-sm font-medium hover:bg-[#f0a84a] transition-all transform hover:-translate-y-0.5">
            Start journaling
          </a>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="grid items-center min-h-screen grid-cols-1 gap-16 px-10 md:grid-cols-2 md:px-20 pt-28">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-[11px] uppercase tracking-[0.14em] font-medium text-[#d4882a] border-[0.5px] border-[#d4882a]/18 rounded-full bg-[#d4882a]/[0.06]">
            <span>🇮🇳</span> Built for India · Privacy first
          </div>
          <h1 className="text-5xl md:text-7xl mb-6 font-display leading-[1.1]">
            Your mind deserves a<br/><em className="italic text-[#f0a84a]">safe space</em> to breathe
          </h1>
          <p className="max-w-md mb-10 text-lg font-light leading-7 text-[#b8a898]">
            Anahva is India's most private AI-powered mental health journal. Reflect, grow, and understand yourself — fully encrypted, always yours.
          </p>
          <div className="flex items-center gap-4 mb-12">
            <button 
              onClick={() => document.getElementById('login')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-3.5 rounded-full bg-[#d4882a] text-[#0e0b09] font-medium hover:bg-[#f0a84a] transition-all shadow-lg hover:shadow-[#d4882a]/30 transform hover:-translate-y-1"
            >
              Begin your journey
            </button>
            <button className="px-8 py-3.5 rounded-full border-[0.5px] border-[#d4882a]/18 text-[#b8a898] hover:text-foreground hover:bg-[#d4882a]/[0.06] transition-all">
              See how it works
            </button>
          </div>
          
          <div className="flex flex-wrap gap-5">
            <div className="flex items-center gap-2 text-xs text-[#8a7d6e]">
              <div className="flex items-center justify-center w-4 h-4 rounded-full bg-[#d4882a]/15">
                <Shield className="w-2.5 h-2.5 text-[#d4882a]" />
              </div>
              End-to-end encrypted
            </div>
            <div className="flex items-center gap-2 text-xs text-[#8a7d6e]">
              <div className="flex items-center justify-center w-4 h-4 rounded-full bg-[#d4882a]/15">
                <Clock className="w-2.5 h-2.5 text-[#d4882a]" />
              </div>
              No data sold, ever
            </div>
            <div className="flex items-center gap-2 text-xs text-[#8a7d6e]">
              <div className="flex items-center justify-center w-4 h-4 rounded-full bg-[#d4882a]/15">
                <Heart className="w-2.5 h-2.5 text-[#d4882a]" />
              </div>
              Zero ads
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.5 }}
          className="relative flex items-center justify-center"
        >
          <div className="relative w-[420px] h-[420px]">
            {/* Spinning Rings */}
            <div className="absolute inset-[-20px] rounded-full border-[0.5px] border-[#d4882a]/18 animate-[spin_20s_linear_infinite]" />
            <div className="absolute inset-[-40px] rounded-full border-[0.5px] border-[#d4882a]/8 animate-[spin_35s_linear_infinite_reverse]" />
            <div className="absolute inset-[-65px] rounded-full border-[0.5px] border-[#d4882a]/4 animate-[spin_55s_linear_infinite]" />
            
            <Orb />

            {/* Floating Cards */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-5 right-[-10px] bg-[#1e1814]/92 border-[0.5px] border-[#d4882a]/18 rounded-xl p-3 backdrop-blur-xl shadow-2xl"
            >
              <div className="text-[10px] uppercase tracking-wider text-[#8a7d6e] mb-1">Today's mood</div>
              <div className="flex gap-1 mb-1">
                <div className="w-2 h-2 rounded-full bg-[#5DCAA5]" />
                <div className="w-2 h-2 rounded-full bg-[#5DCAA5]" />
                <div className="w-2 h-2 rounded-full bg-[#5DCAA5]" />
                <div className="w-2 h-2 rounded-full bg-[#EF9F27]" />
                <div className="w-2 h-2 rounded-full border-[0.5px] border-[#444]" />
              </div>
              <div className="text-xs font-medium text-[#5DCAA5]">Feeling calm ✦</div>
            </motion.div>

            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              className="absolute bottom-16 left-[-30px] bg-[#1e1814]/92 border-[0.5px] border-[#d4882a]/18 rounded-xl p-3 backdrop-blur-xl shadow-2xl max-w-[160px]"
            >
              <div className="text-[10px] uppercase tracking-wider text-[#8a7d6e] mb-1">AI reflection</div>
              <div className="text-xs font-medium italic text-[#b8a898] leading-relaxed">
                "You've grown more patient with yourself this week…"
              </div>
            </motion.div>

            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-2 right-2 bg-[#1e1814]/92 border-[0.5px] border-[#d4882a]/18 rounded-xl p-3 backdrop-blur-xl shadow-2xl"
            >
              <div className="text-[10px] uppercase tracking-wider text-[#8a7d6e] mb-1">Streak</div>
              <div className="text-sm font-medium text-[#ede4d8]">🔥 14 days</div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      <div className="h-[1px] mx-20 bg-gradient-to-r from-transparent via-[#d4882a]/18 to-transparent" />

      {/* STATS STRIP */}
      <div className="flex flex-wrap justify-center gap-20 py-16 px-10 border-y border-white/[0.06] bg-[#0e0b09]">
        {[
          { num: "12k+", label: "entries written privately" },
          { num: "4.9", label: "average user rating" },
          { num: "100%", label: "end-to-end encrypted" },
          { num: "0", label: "ads. ever." }
        ].map((stat, i) => (
          <div key={i} className="text-center">
            <div className="text-4xl font-display text-foreground mb-1">
              {stat.num.split(/(\d+)/).map((p, j) => 
                isNaN(parseInt(p)) ? <span key={j} className="text-[#d4882a]">{p}</span> : p
              )}
            </div>
            <div className="text-[11px] uppercase tracking-wider text-[#8a7d6e] font-light">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* FEATURES SECTION */}
      <section className="px-10 py-24 md:px-20" id="features">
        <div className="text-center mb-16">
          <div className="text-[11px] uppercase tracking-[0.14em] font-medium text-[#d4882a] mb-4">What Anahva offers</div>
          <h2 className="text-4xl md:text-5xl font-display text-foreground">Everything you need to<br/>understand yourself better</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { icon: <Clock />, title: "AI Companion", desc: "Your personal AI reflects on your entries, notices patterns, and asks thoughtful questions to help you understand yourself deeper." },
            { icon: <Shield />, title: "Private by design", desc: "End-to-end encrypted. We can't read your entries — even if we wanted to. Your thoughts belong only to you." },
            { icon: <MinusCircle />, title: "Mood insights", desc: "Visual patterns of how your mood shifts across weeks and months. Spot what helps, what hurts, and what to nurture." },
            { icon: <Heart />, title: "Daily prompts", desc: "Personalised journaling prompts that meet you where you are — whether you're anxious, grateful, or just quiet." },
            { icon: <Users />, title: "India-first", desc: "Built for how Indians experience mental health — with Hindi support coming, and sensitivity to family dynamics and social context." },
            { icon: <Laptop />, title: "Therapist export", desc: "Share a curated PDF of your journal with your therapist. Bridge the gap between sessions with deeper context." }
          ].map((feat, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -4 }}
              className="relative p-8 overflow-hidden rounded-[20px] bg-[#231e19] border border-white/[0.06] group transition-all hover:border-[#d4882a]/18 hover:bg-[#271f18]"
            >
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#d4882a] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-11 h-11 rounded-xl bg-[#d4882a]/15 border border-[#d4882a]/18 flex items-center justify-center mb-6 text-[#d4882a]">
                {feat.icon}
              </div>
              <h3 className="text-xl font-display text-foreground mb-3">{feat.title}</h3>
              <p className="text-sm font-light text-[#8a7d6e] leading-relaxed">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="px-10 py-24 md:px-20 text-center bg-[#0e0b09]">
        <div className="text-[11px] uppercase tracking-[0.14em] font-medium text-[#d4882a] mb-4">What people say</div>
        <h2 className="text-4xl font-display italic text-foreground mb-16">"Finally, a journal that feels safe."</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-left">
          {[
            { 
              text: "I was afraid my family would see my entries. Anahva made me feel genuinely safe for the first time.",
              author: "Priya S.",
              loc: "Mumbai · using Anahva for 3 months"
            },
            { 
              text: "The AI actually asks questions that make me think. It's like having a journal that listens back.",
              author: "Arjun K.",
              loc: "Bengaluru · daily user"
            },
            { 
              text: "I share my Anahva PDF with my therapist before every session. It saves so much time and goes so much deeper.",
              author: "Rhea M.",
              loc: "Delhi · therapist-recommended"
            }
          ].map((test, i) => (
            <div key={i} className="p-7 rounded-[20px] bg-[#231e19] border border-white/[0.06]">
              <div className="flex gap-0.5 mb-4 text-[#d4882a]">
                {[...Array(5)].map((_, j) => <Star key={j} className="w-3 h-3 fill-current" />)}
              </div>
              <p className="font-display italic text-lg text-foreground mb-6 leading-relaxed">"{test.text}"</p>
              <div>
                <div className="text-sm font-medium text-[#b8a898] mb-0.5">{test.author}</div>
                <div className="text-xs text-[#8a7d6e]">{test.loc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* LOGIN SECTION */}
      <section className="px-10 py-32 flex justify-center" id="login">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="w-full max-w-[440px]"
        >
          <div className="text-center mb-9">
            <div className="text-3xl font-display font-light tracking-wide text-foreground mb-2">✦ Anahva</div>
            <div className="text-sm font-light text-[#8a7d6e]">Your private space is waiting</div>
          </div>

          <div className="flex p-1 mb-8 rounded-full bg-[#1e1814] border border-white/[0.06]">
            <button 
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2.5 rounded-full text-xs font-medium transition-all ${isLogin ? 'bg-[#d4882a] text-[#0e0b09]' : 'text-[#8a7d6e] hover:text-[#b8a898]'}`}
            >
              Sign in
            </button>
            <button 
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2.5 rounded-full text-xs font-medium transition-all ${!isLogin ? 'bg-[#d4882a] text-[#0e0b09]' : 'text-[#8a7d6e] hover:text-[#b8a898]'}`}
            >
              Create account
            </button>
          </div>

          <form onSubmit={isLogin ? handleLogin : handleSignup} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-xs font-medium text-[#b8a898] mb-2 uppercase tracking-wider">Your name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="What should we call you?"
                  className="w-full px-5 py-3.5 rounded-xl bg-[#1e1814] border border-white/[0.06] text-foreground text-sm focus:outline-none focus:border-[#d4882a] transition-colors focus:ring-4 focus:ring-[#d4882a]/10"
                  required
                />
              </div>
            )}
            <div>
              <label className="block text-xs font-medium text-[#b8a898] mb-2 uppercase tracking-wider">Email sanctuary</label>
              <input 
                type="email" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="shibasish2005@gmail.com"
                className="w-full px-5 py-3.5 rounded-xl bg-[#1e1814] border border-white/[0.06] text-foreground text-sm focus:outline-none focus:border-[#d4882a] transition-colors focus:ring-4 focus:ring-[#d4882a]/10"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#b8a898] mb-2 uppercase tracking-wider">Secret Key</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••"
                className="w-full px-5 py-3.5 rounded-xl bg-[#1e1814] border border-white/[0.06] text-foreground text-sm focus:outline-none focus:border-[#d4882a] transition-colors focus:ring-4 focus:ring-[#d4882a]/10"
                required
              />
            </div>
            
            {isLogin && (
              <div className="flex justify-end pt-1">
                <a href="#" className="text-xs text-[#8a7d6e] hover:text-[#d4882a] transition-colors">Forgot password?</a>
              </div>
            )}

            {error && <div className="text-xs text-red-400 text-center">{error}</div>}

            <button 
              type="submit"
              className="w-full py-4 mt-2 rounded-xl bg-[#d4882a] text-[#0e0b09] font-medium hover:bg-[#f0a84a] transition-all transform active:scale-[0.98] shadow-lg shadow-[#d4882a]/20"
            >
              {isLogin ? "Continue →" : "Create my journal →"}
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-[0.5px] bg-white/[0.06]" />
            <span className="text-[11px] text-[#8a7d6e]">or</span>
            <div className="flex-1 h-[0.5px] bg-white/[0.06]" />
          </div>

          <button className="w-full py-3.5 rounded-xl border border-white/[0.06] flex items-center justify-center gap-2.5 text-sm text-[#b8a898] hover:bg-[#231e19] transition-all mb-8">
            <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </button>

          <div className="flex justify-center gap-6">
            <div className="flex items-center gap-1.5 text-[11px] text-[#8a7d6e]">
              <Shield className="w-3 h-3 stroke-[#d4882a]" /> E2E encrypted
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-[#8a7d6e]">
              <CheckCircle2 className="w-3 h-3 stroke-[#d4882a]" /> Safe space
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-[#8a7d6e]">
              <EyeOff className="w-3 h-3 stroke-[#d4882a]" /> Private
            </div>
          </div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="flex flex-col md:flex-row items-center justify-between px-10 md:px-20 py-10 border-t border-white/[0.06] gap-6">
        <div className="text-xl font-display font-light tracking-wide text-[#b8a898]">✦ Anahva</div>
        <div className="flex gap-8">
          <a href="#" className="text-xs text-[#8a7d6e] hover:text-[#b8a898] transition-colors">Privacy Policy</a>
          <a href="#" className="text-xs text-[#8a7d6e] hover:text-[#b8a898] transition-colors">Terms</a>
          <a href="#" className="text-xs text-[#8a7d6e] hover:text-[#b8a898] transition-colors">Contact</a>
          <a href="#" className="text-xs text-[#8a7d6e] hover:text-[#b8a898] transition-colors">Blog</a>
        </div>
        <div className="text-xs text-[#8a7d6e]">© 2026 Anahva · Made in India 🇮🇳</div>
      </footer>
    </div>
  );
};

export default Auth;

