import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from '@/components/Navigation';
import { BookOpen, MessageCircle, Trash2, Calendar, Clock, ChevronRight, Search } from 'lucide-react';
import { getJournalHistory } from '@/api/journal';
import { JournalEntry } from '@/types/journal';
import { toast } from 'sonner';
import { chatHistoryAPI } from '@/lib/api';

interface ChatMessage {
  text: string;
  isAI: boolean;
  timestamp: string;
}

const History = () => {
  const [activeTab, setActiveTab] = useState<'journals' | 'chats'>('journals');
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [chats, setChats] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const entries = await getJournalHistory();
      setJournals(entries);
      const chatHistory = chatHistoryAPI.getHistory();
      setChats(chatHistory);
    } catch (err) {
      console.error('Failed to load history:', err);
      toast.error('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJournal = (index: number) => {
    const newJournals = journals.filter((_, i) => i !== index);
    setJournals(newJournals);
    localStorage.setItem("journal", JSON.stringify(newJournals));
    toast.success('Entry removed from your log');
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-[#0e0b09] md:pl-[240px] pt-20 pb-10 text-[#ede4d8]">
      <Navigation />
      
      <main className="max-w-5xl mx-auto px-6 md:px-10 py-10">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl md:text-5xl font-display text-[#ede4d8] mb-2"
            >
              Past Chapters
            </motion.h1>
            <p className="text-[#8a7d6e] font-body text-sm tracking-wide uppercase">Your accumulated wisdom and reflections.</p>
          </div>
          
          <div className="flex bg-[#231e19] p-1 rounded-full border border-white/[0.06] w-fit">
            <button 
              onClick={() => setActiveTab('journals')}
              className={`px-6 py-2 rounded-full text-xs font-medium transition-all ${activeTab === 'journals' ? 'bg-[#d4882a] text-[#0e0b09]' : 'text-[#8a7d6e] hover:text-[#ede4d8]'}`}
            >
              Journals
            </button>
            <button 
              onClick={() => setActiveTab('chats')}
              className={`px-6 py-2 rounded-full text-xs font-medium transition-all ${activeTab === 'chats' ? 'bg-[#d4882a] text-[#0e0b09]' : 'text-[#8a7d6e] hover:text-[#ede4d8]'}`}
            >
              Conversations
            </button>
          </div>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <div className="w-8 h-8 border-2 border-[#d4882a]/20 border-t-[#d4882a] rounded-full animate-spin" />
            <p className="text-[#8a7d6e] font-display">Recalling your memories...</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {activeTab === 'journals' ? (
              <motion.div 
                key="journals"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {journals.map((journal, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="group relative p-8 rounded-[24px] bg-[#231e19] border border-white/[0.06] hover:border-[#d4882a]/20 transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3 text-[11px] text-[#8a7d6e] uppercase tracking-widest font-bold">
                        <Calendar className="w-3.5 h-3.5 text-[#d4882a]" />
                        {formatDate(journal.createdAt)}
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDeleteJournal(index); }}
                        className="p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-[#ff4b4b]/10 text-[#ff4b4b] transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="font-display italic text-xl text-[#ede4d8] leading-relaxed mb-6 line-clamp-3">
                      "{journal.text}"
                    </div>
                    <div className="flex items-center justify-between pt-6 border-t border-white/[0.04]">
                      <span className="text-[10px] text-[#8a7d6e] uppercase tracking-tighter">Mood: Peaceful</span>
                      <ChevronRight className="w-4 h-4 text-[#8a7d6e] group-hover:translate-x-1 transition-transform" />
                    </div>
                  </motion.div>
                ))}
                
                {journals.length === 0 && (
                  <div className="col-span-full py-40 border-2 border-dashed border-white/[0.04] rounded-[32px] flex flex-col items-center justify-center text-center">
                    <BookOpen className="w-12 h-12 text-[#8a7d6e]/20 mb-6" />
                    <h3 className="text-2xl font-display text-[#ede4d8] mb-2">No Entries Yet</h3>
                    <p className="text-[#8a7d6e] max-w-xs mx-auto">Your journey is waiting for its first page to be written.</p>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div 
                key="chats"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                {chats.map((chat, index) => (
                  <div 
                    key={index} 
                    className={`flex ${chat.isAI ? 'justify-start' : 'justify-end'}`}
                  >
                    <div className={`max-w-[80%] p-6 rounded-[20px] ${chat.isAI ? 'bg-[#161210] border border-white/[0.04] text-[#ede4d8] font-display italic text-lg' : 'bg-[#231e19] border border-[#d4882a]/10 text-[#ede4d8] text-sm font-body'}`}>
                      <div className="mb-2 text-[10px] opacity-40 uppercase tracking-widest font-bold">
                        {new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      {chat.text}
                    </div>
                  </div>
                ))}

                {chats.length === 0 && (
                   <div className="py-40 border-2 border-dashed border-white/[0.04] rounded-[32px] flex flex-col items-center justify-center text-center">
                   <MessageCircle className="w-12 h-12 text-[#8a7d6e]/20 mb-6" />
                   <h3 className="text-2xl font-display text-[#ede4d8] mb-2">No Conversations</h3>
                   <p className="text-[#8a7d6e] max-w-xs mx-auto">Your AI companion is here whenever you're ready to talk.</p>
                 </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </main>
    </div>
  );
};

export default History;
