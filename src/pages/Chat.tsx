import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from '@/components/Navigation';
import { Send, Sparkles, Mic, ChevronLeft, Lock, Shield, EyeOff } from 'lucide-react';
import { chatAPI, chatHistoryAPI } from '@/lib/api';
import { useLanguage } from '@/contexts/LanguageContext';
import { useConfidentialMode } from '@/contexts/ConfidentialModeContext';
import { useNightWatch } from '@/contexts/NightWatchContext';
import { useNavigate } from 'react-router-dom';

interface Message {
  id: number;
  text: string;
  isAI: boolean;
  timestamp: Date;
}

const Chat = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { isConfidential } = useConfidentialMode();
  const { isNightMode } = useNightWatch();
  
  const [activeMode, setActiveMode] = useState<'LISTEN' | 'REFLECT' | 'CALM'>('LISTEN');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: isNightMode ? "The world is quiet now. I'm here if you have late-night thoughts to share." : "Hello, I'm your Anahva companion. I'm here to listen and reflect with you.",
      isAI: true,
      timestamp: new Date(),
    },
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: input,
      isAI: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    chatHistoryAPI.saveMessage(userMessage);

    const userInput = input;
    setInput('');
    setIsTyping(true);

    try {
      const response = await chatAPI.sendMessage(userInput, activeMode);
      const replyText = typeof response === 'string' ? response : (response.response || response.message || "I'm listening.");
      
      const aiMessage: Message = {
        id: Date.now() + 1,
        text: replyText,
        isAI: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      chatHistoryAPI.saveMessage(aiMessage);
    } catch (error) {
      const errorMessage: Message = {
        id: Date.now() + 2,
        text: "I'm here with you, but I encountered a momentary silence. Could you share that once more?",
        isAI: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0e0b09] md:pl-[240px] pt-16 flex flex-col items-center">
      <Navigation />

      {/* HEADER */}
      <header className="w-full max-w-4xl px-6 py-4 flex items-center justify-between sticky top-16 bg-[#0e0b09]/80 backdrop-blur-md z-20 border-b border-white/[0.04]">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-white/[0.06] text-[#8a7d6e]">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#d4882a] shadow-[0_0_10px_#d4882a] animate-pulse" />
            <h1 className="text-xl font-display text-[#ede4d8]">AI Companion</h1>
          </div>
        </div>
        
        <div className="flex bg-[#161210] p-1 rounded-full border border-white/[0.06]">
            {(['LISTEN', 'REFLECT', 'CALM'] as const).map(mode => (
                <button 
                    key={mode}
                    onClick={() => setActiveMode(mode)}
                    className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase transition-all ${activeMode === mode ? 'bg-[#d4882a] text-[#0e0b09]' : 'text-[#8a7d6e] hover:text-[#ede4d8]'}`}
                >
                    {mode}
                </button>
            ))}
        </div>
      </header>

      {/* MESSAGES AREA */}
      <div className="flex-1 w-full max-w-3xl overflow-y-auto px-6 py-10 space-y-10 custom-scrollbar">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${message.isAI ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`max-w-[85%] p-6 rounded-[20px] transition-all duration-500 ${
                isConfidential ? 'blur-md hover:blur-none select-none' : ''
              } ${
                message.isAI
                  ? 'bg-[#161210] border border-white/[0.04] text-[#ede4d8] font-display italic text-lg leading-relaxed shadow-xl'
                  : 'bg-transparent border border-[#d4882a]/30 text-[#ede4d8] font-body text-sm'
              }`}
            >
              {message.text}
            </div>
          </motion.div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-[#161210] border border-white/[0.04] p-6 rounded-[20px] flex items-center gap-2">
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-[#d4882a]"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT AREA */}
      <div className="w-full max-w-4xl px-6 py-10 sticky bottom-0 bg-gradient-to-t from-[#0e0b09] via-[#0e0b09] to-transparent">
        <div className="relative max-w-3xl mx-auto group">
          <div className="absolute inset-0 bg-[#d4882a]/[0.02] blur-xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity" />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Share your thoughts..."
            className="w-full px-8 py-5 rounded-full bg-[#161210] border border-white/[0.08] text-[#ede4d8] placeholder:text-[#8a7d6e]/50 focus:outline-none focus:border-[#d4882a]/40 transition-all shadow-2xl relative z-10"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 z-10">
            <button className="p-2.5 rounded-full hover:bg-white/[0.06] text-[#8a7d6e] transition-colors">
              <Mic className="w-5 h-5" />
            </button>
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className={`p-2.5 rounded-full transition-all ${
                input.trim() ? 'bg-[#d4882a] text-[#0e0b09] shadow-[0_0_20px_rgba(212,136,42,0.3)]' : 'text-[#8a7d6e] opacity-30'
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
        <p className="text-[10px] text-center mt-4 text-[#8a7d6e] uppercase tracking-[0.2em] opacity-50">
          Your conversation is anonymous & encrypted
        </p>
      </div>
    </div>
  );
};

export default Chat;
