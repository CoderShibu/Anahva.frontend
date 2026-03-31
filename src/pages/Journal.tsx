import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Save, Sparkles, Music, Wind, X, ChevronRight, Smile } from 'lucide-react';
import { journalAPI, chatAPI } from '@/lib/api';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const Journal = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [ambientSound, setAmbientSound] = useState<'none' | 'rain' | 'forest'>('none');
  const [aiResponse, setAiResponse] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  
  const stickers = ["✨", "🌙", "🌿", "🧘", "🙏", "🌊", "🕯️", "🌅", "☁️", "🍃", "💫", "🎐"];
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  // Ambient Sound Logic
  useEffect(() => {
    if (ambientSound === 'none') {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      return;
    }

    const soundUrls = {
      rain: 'https://actions.google.com/sounds/v1/water/rain_on_roof.ogg',
      forest: 'https://actions.google.com/sounds/v1/ambiance/morning_forest.ogg'
    };

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(soundUrls[ambientSound as keyof typeof soundUrls]);
    audio.loop = true;
    audio.play().catch(e => console.log("Audio play blocked by browser. Interaction required."));
    audioRef.current = audio;

    return () => {
      audio.pause();
    };
  }, [ambientSound]);

  const handleSave = async (silent: any = false) => {
    if (silent && typeof silent !== 'boolean') silent = false;
    if (!content.trim()) return;
    if (!silent) setIsSaving(true);
    try {
      await journalAPI.create(content);
      if (!silent) toast.success("Your thoughts are safe.");
    } catch (error) {
      if (!silent) toast.error("Failed to save.");
    } finally {
      if (!silent) setIsSaving(false);
    }
  };

  // Auto-save logic
  useEffect(() => {
    if (content.length > 10) {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current as any);
      saveTimeoutRef.current = setTimeout(() => {
        handleSave(true);
      }, 3000) as any;
    }
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current as any);
    };
  }, [content]);

  const handleAskAI = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!content.trim()) return;
    setIsThinking(true);
    try {
      const res = await chatAPI.sendMessage(`Based on my journal entry, can you provide a short empathetic reflection? Entry: ${content}`, 'REFLECT');
      setAiResponse(typeof res === 'string' ? res : (res.response || res.message));
    } catch (error) {
      setAiResponse("I'm here with you, supporting your journey.");
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0e0b09] text-[#ede4d8] flex flex-col items-center">
      {/* TOP BAR */}
      <header className="w-full max-w-5xl px-6 py-8 flex items-center justify-between sticky top-0 bg-[#0e0b09]/80 backdrop-blur-md z-20">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate('/home')}
            className="p-2 rounded-full hover:bg-white/[0.06] transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[#8a7d6e]" />
          </button>
          <div className="font-display text-xl text-[#ede4d8]">
            {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            {[
              { color: "#5DCAA5", val: 1, label: "Calm" },
              { color: "#8BDEB1", val: 2, label: "Good" },
              { color: "#EF9F27", val: 3, label: "Neutral" },
              { color: "#E67E22", val: 4, label: "Restless" },
              { color: "#C0392B", val: 5, label: "Anxious" }
            ].map((m) => (
              <button
                key={m.val}
                onClick={() => setMood(m.val)}
                title={m.label}
                className={`w-3.5 h-3.5 rounded-full transition-all transform hover:scale-125 ${mood === m.val ? 'ring-2 ring-offset-2 ring-offset-[#0e0b09] ring-[#d4882a]' : ''}`}
                style={{ backgroundColor: m.color }}
              />
            ))}
          </div>
          <button 
            onClick={() => handleSave()}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2 rounded-full bg-[#d4882a] text-[#0e0b09] text-sm font-medium hover:bg-[#f0a84a] transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </header>

      {/* TEXT AREA */}
      <main className="w-full max-w-[800px] flex-1 px-6 pt-10 mx-auto">
        <textarea
          autoFocus
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?..."
          className="w-full h-full min-h-[70vh] bg-transparent border-none outline-none font-display text-[22px] leading-[1.8] text-[#ede4d8] placeholder:text-[#8a7d6e]/40 placeholder:italic resize-none"
        />
      </main>

      {/* BOTTOM TOOLBAR */}
      <footer className="w-full max-w-5xl px-6 py-10 flex items-center justify-between">
        <div className="text-xs text-[#8a7d6e] tracking-wider font-body">
          {wordCount} WORDS
        </div>

        <div className="flex items-center gap-6">
            <div className="relative">
              <button 
                onClick={() => setShowEmojis(!showEmojis)}
                className={`p-2 rounded-xl border transition-all ${showEmojis ? 'bg-[#d4882a]/10 border-[#d4882a]/30 text-[#d4882a]' : 'bg-white/[0.03] border-white/[0.04] text-[#8a7d6e] hover:text-[#ede4d8]'}`}
                title="Add Sticker"
              >
                <Smile className="w-4 h-4" />
              </button>
              <AnimatePresence>
                {showEmojis && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute bottom-full right-0 mb-4 p-4 bg-[#161210] border border-white/[0.08] rounded-2xl shadow-2xl z-50 min-w-[200px]"
                  >
                    <div className="grid grid-cols-4 gap-2">
                       {stickers.map(s => (
                         <button 
                           key={s}
                           onClick={() => {
                             setContent(prev => prev + s);
                             setShowEmojis(false);
                           }}
                           className="text-xl p-2 hover:bg-white/[0.05] rounded-lg transition-colors"
                         >
                           {s}
                         </button>
                       ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-2 p-1 rounded-full bg-white/[0.03] border border-white/[0.04]">
            <button 
              onClick={() => setAmbientSound('none')}
              className={`p-1.5 rounded-full text-[10px] uppercase font-bold transition-all ${ambientSound === 'none' ? 'bg-[#d4882a] text-[#0e0b09]' : 'text-[#8a7d6e]'}`}
            >
              Off
            </button>
            <button 
              onClick={() => setAmbientSound('rain')}
              className={`p-1.5 rounded-full flex items-center gap-1.5 transition-all ${ambientSound === 'rain' ? 'bg-[#d4882a] text-[#0e0b09]' : 'text-[#8a7d6e]'}`}
            >
              <Music className="w-3 h-3" />
              <span className="text-[10px] uppercase font-bold">Rain</span>
            </button>
            <button 
              onClick={() => setAmbientSound('forest')}
              className={`p-1.5 rounded-full flex items-center gap-1.5 transition-all ${ambientSound === 'forest' ? 'bg-[#d4882a] text-[#0e0b09]' : 'text-[#8a7d6e]'}`}
            >
              <Wind className="w-3 h-3" />
              <span className="text-[10px] uppercase font-bold">Forest</span>
            </button>
          </div>

          <button 
            onClick={() => { setShowAI(true); handleAskAI(); }}
            disabled={isThinking}
            className="flex items-center gap-2 px-5 py-2 rounded-full border border-[#d4882a]/18 text-[#d4882a] text-xs font-medium hover:bg-[#d4882a]/[0.05] transition-all disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isThinking ? 'animate-spin' : ''}`} />
            {isThinking ? "Thinking..." : "Ask AI"}
          </button>
        </div>
      </footer>

      {/* AI COMPANION PANEL */}
      <AnimatePresence>
        {showAI && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAI(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]"
            />
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 h-[60vh] bg-[#161210] border-t border-[#d4882a] z-[100] p-10 flex flex-col"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#d4882a] shadow-[0_0_12px_#d4882a] animate-pulse" />
                  <h3 className="text-xl font-display text-foreground">AI Reflection</h3>
                </div>
                <button onClick={() => setShowAI(false)} className="p-2 rounded-full hover:bg-white/[0.06] transition-colors text-[#8a7d6e]">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto mb-6 pr-4 custom-scrollbar">
                <div className="p-8 rounded-[24px] bg-white/[0.02] border border-white/[0.04]">
                  <p className="text-[#ede4d8] leading-relaxed italic text-xl font-display">
                    {isThinking ? "Reflecting on your words..." : (aiResponse || "I'm listening and holding space for your thoughts.")}
                  </p>
                </div>
              </div>

              <form onSubmit={handleAskAI} className="relative">
                <input 
                  type="text"
                  placeholder="Ask your companion..."
                  className="w-full px-8 py-5 rounded-full bg-[#0e0b09] border border-white/[0.06] text-foreground focus:outline-none focus:border-[#d4882a] transition-all shadow-2xl"
                />
                <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-[#d4882a] text-[#0e0b09] hover:bg-[#f0a84a] transition-all">
                  <ChevronRight />
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Journal;
