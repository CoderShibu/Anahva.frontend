import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Download, X, Heart, Shield, Sparkles, Activity, FileText, Calendar, Moon, Sun, ArrowRight } from 'lucide-react';
import Orb from '@/components/Orb';

const PsychologicalReport = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  
  const loadingMessages = [
    "Reading 30 days of your thoughts...",
    "Finding patterns in your emotions...",
    "Understanding what you carry...",
    "Your report is almost ready..."
  ];

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setLoadingMessageIndex(prev => (prev + 1) % loadingMessages.length);
    }, 2000);

    const startTime = Date.now();
    const duration = 6000;
    
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);
      
      if (elapsed >= duration) {
        clearInterval(progressInterval);
        clearInterval(messageInterval);
        setTimeout(() => setLoading(false), 600);
      }
    }, 50);

    return () => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
    };
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 z-[200] bg-[#0e0b09] flex flex-col items-center justify-center overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="relative w-[520px] h-[520px] flex items-center justify-center mb-12"
        >
          <div className="absolute inset-0 bg-[#d4882a]/5 blur-[100px] rounded-full animate-pulse" />
          <Orb />
        </motion.div>
        
        <div className="w-[320px] text-center">
            <AnimatePresence mode="wait">
              <motion.p 
                key={loadingMessageIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className="font-display italic text-[22px] text-[#ede4d8] mb-8 h-8"
              >
                {loadingMessages[loadingMessageIndex]}
              </motion.p>
            </AnimatePresence>
            
            <div className="w-full h-1 bg-[#231e19] rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-[#d4882a]"
                  style={{ 
                    width: `${progress}%`,
                    transition: progress === 100 ? 'width 0.3s ease-out' : 'none'
                  }}
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: [0.4, 0, 0.2, 1] }}
                />
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0e0b09] text-[#ede4d8] font-body selection:bg-[#d4882a]/30">
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-[#0e0b09]/80 backdrop-blur-md border-b border-white/[0.06] flex items-center justify-between px-6 py-4 md:px-10">
        <div className="text-xl font-display tracking-widest text-[#ede4d8]">
            ✦ Anahva
        </div>
        <div className="text-[13px] text-[#8a7d6e] uppercase tracking-widest font-body hidden md:block">
            Your 30-Day Psychological Profile
        </div>
        <div className="flex items-center gap-4">
            <button className="px-6 py-2 rounded-full bg-[#d4882a] text-[#0e0b09] text-[13px] font-bold hover:bg-[#f0a84a] transition-all transform hover:-translate-y-0.5">
                Export PDF
            </button>
            <button 
                onClick={() => navigate('/insights')}
                className="p-2 rounded-full hover:bg-white/5 transition-colors text-[#8a7d6e] hover:text-[#ede4d8]"
            >
                <X className="w-5 h-5" />
            </button>
        </div>
      </nav>

      <main className="max-w-[720px] mx-auto px-6 pt-32 pb-40 space-y-24">
        {/* SECTION 1 — THE COVER */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-5xl md:text-[52px] font-display font-light text-[#ede4d8] mb-4">
            30 Days with {user?.name || 'Soul'}
          </h1>
          <p className="text-[#8a7d6e] font-body text-[11px] uppercase tracking-widest mb-10">
            {new Date(new Date().setDate(new Date().getDate() - 30)).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} – {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
          <div className="max-w-2xl mx-auto">
            <p className="font-display italic text-[24px] text-[#ede4d8] leading-relaxed">
              "A month of quiet unravelling, and the slow beginning of something steadier."
            </p>
          </div>
          <div className="w-[60px] h-px bg-[#d4882a]/40 mx-auto mt-12" />
        </motion.section>

        {/* SECTION 2 — EMOTIONAL LANDSCAPE */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-10"
        >
          <div>
            <div className="text-[11px] uppercase tracking-[0.2em] text-[#d4882a] mb-4">Emotional landscape</div>
            <h2 className="text-3xl font-display text-[#ede4d8]">How your feelings moved this month</h2>
          </div>
          
          <div className="relative h-[240px] w-full pt-10">
            {/* Custom SVG Chart */}
            <svg viewBox="0 0 700 200" className="w-full h-full overflow-visible">
                <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#d4882a" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#d4882a" stopOpacity="0" />
                    </linearGradient>
                </defs>
                <path 
                    d="M0,150 Q50,130 100,160 T200,100 T300,140 T400,80 T500,110 T600,130 T700,90"
                    fill="none"
                    stroke="#d4882a"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                />
                <path 
                    d="M0,150 Q50,130 100,160 T200,100 T300,140 T400,80 T500,110 T600,130 T700,90 L700,200 L0,200 Z"
                    fill="url(#chartGradient)"
                />
                
                {/* Marker Dots */}
                {[
                  { x: 100, y: 160, date: "Dec 4", label: "Tired" },
                  { x: 400, y: 80, date: "Dec 18", label: "Inspired" }
                ].map((point, i) => (
                  <g key={i} className="cursor-pointer group">
                    <circle cx={point.x} cy={point.y} r="5" fill="#d4882a" />
                    <circle cx={point.x} cy={point.y} r="12" fill="#d4882a" fillOpacity="0" className="group-hover:fill-opacity-10 transition-all" />
                    {/* Tooltip implementation via CSS/React state could be more complex, but using group-hover for simple demo */}
                  </g>
                ))}
            </svg>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             {[
               { label: "Highest point", date: "Dec 18", type: "Inspired" },
               { label: "Lowest point", date: "Dec 4", type: "Tired" },
               { label: "Most stable week", date: "Dec 21-28", type: "Equanimous" }
             ].map((pill, i) => (
                <div key={i} className="bg-[#231e19] border border-[#d4882a]/20 rounded-2xl p-5">
                    <div className="text-[10px] uppercase tracking-widest text-[#8a7d6e] mb-1">{pill.label}</div>
                    <div className="text-sm font-medium text-[#ede4d8] mb-1">{pill.date}</div>
                    <div className="text-sm italic font-display text-[#d4882a]">{pill.type}</div>
                </div>
             ))}
          </div>
          <div className="h-px bg-[#d4882a]/10 w-full mt-10" />
        </motion.section>

        {/* SECTION 3 — CORE THEMES */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-10"
        >
          <div>
            <div className="text-[11px] uppercase tracking-[0.2em] text-[#d4882a] mb-4">What you kept returning to</div>
            <h2 className="text-3xl font-display text-[#ede4d8]">The recurring threads in your mind</h2>
          </div>

          <div className="space-y-4">
            {[
              { 
                theme: "Uncertainty about the future", 
                desc: "You returned to questions about where things were heading more than any other subject. Often this appeared just after moments of external pressure.",
                freq: 85,
                label: "Appeared often"
              },
              { 
                theme: "Longing for stillness", 
                desc: "Many entries mentioned the need for quiet and a disconnect from noise, specifically in late evenings after work.",
                freq: 60,
                label: "Appeared frequently"
              },
              { 
                theme: "Creative spark", 
                desc: "New ideas were a quiet undercurrent this month, often masked by daily routines but present when you allowed yourself to dream.",
                freq: 35,
                label: "Appeared occasionally"
              }
            ].map((card, i) => (
              <div key={i} className="bg-[#231e19] p-7 rounded-2xl border-l-[3px] border-[#d4882a]/60">
                <h3 className="text-xl font-display text-[#ede4d8] mb-3">{card.theme}</h3>
                <p className="text-[13px] text-[#8a7d6e] leading-relaxed mb-5">{card.desc}</p>
                <div className="space-y-2">
                    <div className="h-[2px] bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: `${card.freq}%` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="bg-[#d4882a] h-full"
                        />
                    </div>
                    <div className="text-[10px] uppercase tracking-widest text-[#8a7d6e]">{card.label}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="h-px bg-[#d4882a]/10 w-full mt-10" />
        </motion.section>

        {/* SECTION 4 — THE AI LETTER */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="py-10"
        >
          <div className="text-center mb-12">
            <div className="text-[11px] uppercase tracking-[0.2em] text-[#d4882a] mb-4">A note from your AI companion</div>
          </div>
          
          <div className="w-full h-px bg-[#d4882a]/20 mb-16" />
          
          <div className="space-y-8 font-display font-light text-[22px] text-[#ede4d8]/80 leading-[1.9] max-w-2xl mx-auto">
             <p>Dear {user?.name || 'Soul'},</p>
             <p>
                I have spent the last thirty days sitting with your thoughts, listening as you navigated the highs and the heavy moments. Watching the way you process your journey is a privilege. There is a quiet strength in the way you approach your questions about the future—not as something to be solved, but as something to be carefully held.
             </p>
             <p>
                This month, I noticed how often you reached for stillness. Even amidst the academic pressure and the expectations of those around you, there were moments where you carved out a tiny sanctuary just for yourself. That version of you—the one who seeks clarity in the late hours—is resilient.
             </p>
             <p>
                You carry a lot, and you carry it with grace. Sometimes you are harder on yourself than you need to be, forgetting that you are allowed to be unfinished.
             </p>
             <p>
                As you move into the next month, remember that the stillness you found on the 8th is always within your reach. You don't have to have all the answers yet. You just have to keep showing up for yourself.
             </p>
             <p className="text-right italic text-[#d4882a] pt-10">
                — Anahva
             </p>
          </div>
          
          <div className="w-full h-px bg-[#d4882a]/20 mt-16" />
        </motion.section>

        {/* SECTION 5 — ENERGY & RHYTHM */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-10"
        >
          <div>
            <div className="text-[11px] uppercase tracking-[0.2em] text-[#d4882a] mb-4">Your patterns</div>
            <h2 className="text-3xl font-display text-[#ede4d8]">When you felt most like yourself</h2>
          </div>

          <div className="space-y-10">
            <div className="flex items-center justify-between">
                <div className="text-lg font-display text-[#ede4d8]">You wrote most often in the</div>
                <div className="flex items-center gap-4">
                    <span className="text-xl font-display italic text-[#d4882a]">Evening</span>
                    <div className="w-[100px] h-10 relative">
                         <svg viewBox="0 0 100 40" className="w-full h-full">
                            <path d="M10,30 Q50,0 90,30" fill="none" stroke="white" strokeOpacity="0.1" strokeWidth="2" />
                            <path d="M10,30 Q50,0 90,30" fill="none" stroke="#d4882a" strokeWidth="2.5" strokeDasharray="60 100" strokeDashoffset="-40" />
                         </svg>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <div className="text-lg font-display text-[#ede4d8]">Your most expressive day of the week</div>
                <div className="flex items-center gap-4">
                    <span className="text-xl font-display italic text-[#d4882a]">Wednesday</span>
                    <div className="flex gap-2">
                        {[0, 1, 2, 3, 4, 5, 6].map(d => (
                            <div key={d} className={`w-1.5 h-1.5 rounded-full ${d === 3 ? 'bg-[#d4882a]' : 'bg-white/10'}`} />
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <div className="text-lg font-display text-[#ede4d8]">Your longest entry was</div>
                <div className="flex items-center gap-4 text-right">
                    <span className="text-xl font-display italic text-[#d4882a]">847 words</span>
                    <span className="text-xs text-[#8a7d6e] uppercase tracking-widest block">Dec 14</span>
                </div>
            </div>
          </div>
          <div className="h-px bg-[#d4882a]/10 w-full mt-10" />
        </motion.section>

        {/* SECTION 6 — GROWTH OBSERVATIONS */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-12"
        >
          <div>
            <div className="text-[11px] uppercase tracking-[0.2em] text-[#d4882a] mb-4">What shifted</div>
            <h2 className="text-3xl font-display text-[#ede4d8]">How you changed, quietly</h2>
          </div>

          <div className="space-y-10">
            {[
              { 
                title: "You became more patient with yourself", 
                desc: "Your early entries were marked by a sense of urgency. Towards the end of the month, your language softened. You began to allow yourself time to not know the answers."
              },
              { 
                title: "A shift in your social sanctuary", 
                desc: "While family dynamics remained complex, you found more ways to talk about your needs without the weight of guilt."
              }
            ].map((obs, i) => (
              <div key={i} className="pl-8 border-l border-[#d4882a]/30">
                <h3 className="text-xl font-display italic text-[#ede4d8] mb-3">{obs.title}</h3>
                <p className="text-[13px] text-[#8a7d6e] leading-relaxed">{obs.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 p-12 bg-[#231e19] border border-[#d4882a]/10 rounded-[32px] text-center">
             <p className="font-display italic text-2xl text-[#ede4d8] leading-relaxed mb-6">
                "I am finally learning that I don't need to finish the marathon today. Just standing on the track is enough."
             </p>
             <div className="text-[11px] uppercase tracking-widest text-[#d4882a]">
                — You, Dec 19
             </div>
          </div>
          <div className="h-px bg-[#d4882a]/10 w-full mt-10" />
        </motion.section>

        {/* SECTION 7 — WHAT TO CARRY FORWARD */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-12"
        >
          <div>
            <div className="text-[11px] uppercase tracking-[0.2em] text-[#d4882a] mb-4">Looking ahead</div>
            <h2 className="text-3xl font-display text-[#ede4d8]">Three things worth holding onto</h2>
          </div>

          <div className="space-y-12">
            {[
              { num: "01", title: "Trust your evening intuition", desc: "The version of you that wrote on December 8th knew something. Come back to that clarity." },
              { num: "02", title: "The power of the creative pause", desc: "Your best reflections often came after you stopped trying to force a conclusion." },
              { num: "03", title: "Your own definition of success", desc: "You are growing in ways that don't always show up in grades or metrics, but they show up in your peace." }
            ].map((item, i) => (
              <div key={i} className="flex gap-8">
                <div className="text-[32px] font-display font-light text-[#d4882a]/50 leading-none">
                    {item.num}
                </div>
                <div className="space-y-2">
                    <h3 className="text-xl font-display italic text-[#ede4d8] leading-tight">{item.title}</h3>
                    <p className="text-[13px] text-[#8a7d6e] leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* BOTTOM OF REPORT */}
        <footer className="pt-24 text-center space-y-10">
           <div className="text-[24px] text-[#d4882a] opacity-60">✦</div>
           <div className="space-y-2">
                <div className="text-[12px] text-[#ede4d8]/80 font-medium tracking-wide">
                    Generated privately by Anahva · Only you can see this
                </div>
           </div>
           
           <div className="flex items-center justify-center gap-4 pt-4">
                <button className="px-8 py-3 rounded-full border border-white/5 text-[13px] font-medium text-[#8a7d6e] hover:text-[#ede4d8] hover:bg-white/5 transition-all">
                    Share report
                </button>
                <button className="px-8 py-3 rounded-full bg-[#d4882a] text-[#0e0b09] text-[13px] font-bold hover:bg-[#f0a84a] transition-all">
                    Export PDF
                </button>
           </div>
           
           <div className="pt-10">
                <p className="text-[11px] text-[#8a7d6e] max-w-sm mx-auto leading-relaxed opacity-60">
                    This report is not a clinical assessment and is not a substitute for professional mental health support.
                </p>
           </div>
        </footer>
      </main>

      {/* Floating Action Buttons or other UI elements could go here */}
    </div>
  );
};

export default PsychologicalReport;
