import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import Navigation from '@/components/Navigation';
import { BookOpen, MessageCircle, Trash2, Calendar, Clock } from 'lucide-react';
import { getJournalHistory } from '@/api/journal';
import { JournalEntry } from '@/types/journal';
import { useToast } from '@/components/ui/use-toast';

const History = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'journals' | 'chats'>('journals');
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const entries = await getJournalHistory();
      setJournals(entries);
    } catch (err) {
      console.error('Failed to load journal history:', err);
      toast({
        title: 'Error',
        description: 'Failed to load journal history',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJournal = (index: number) => {
    const newJournals = journals.filter((_, i) => i !== index);
    setJournals(newJournals);
    localStorage.setItem("journal", JSON.stringify(newJournals));
    toast({
      title: 'Deleted',
      description: 'Journal entry removed',
  const handleClearAll = () => {
    if (confirm('Are you sure you want to delete ALL journals?')) {
      setJournals([]);
      localStorage.setItem("journal", "[]");
      toast({
        title: 'Cleared',
        description: 'All journal entries deleted',
      });
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8 md:pl-64">
      <Navigation />

      <main className="max-w-4xl mx-auto px-6 py-8 md:py-12">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-display text-foreground mb-2">
            Journal History
          </h1>
          <p className="text-muted-foreground">
            Your saved journal entries
          </p>
        </motion.div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {journals.length === 0 ? (
              <div className="card-3d p-12 text-center">
                <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No journal entries yet</p>
              </div>
            ) : (
              <>
                <div className="flex justify-end mb-4">
                  <motion.button
                    onClick={handleClearAll}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Clear All</span>
                  </motion.button>
                </div>
                {journals.map((journal, index) => (
                  <motion.div
                    key={index}
                    className="card-3d p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(journal.createdAt).toLocaleDateString()}</span>
                        <Clock className="w-4 h-4 ml-2" />
                        <span>{new Date(journal.createdAt).toLocaleTimeString()}</span>
                      </div>
                      <motion.button
                        onClick={() => handleDeleteJournal(index)}
                        className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                    <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                      {journal.text}
                    </p>
                  </motion.div>
                ))}
              </>
            )}
          </motion.div>
        )}
      </main>
    </div>
  );
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <motion.button
            onClick={() => setActiveTab('journals')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${activeTab === 'journals'
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-muted-foreground hover:text-foreground'
              }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <BookOpen className="w-4 h-4" />
            <span>{t('journals')}</span>
            <span className="text-xs opacity-75">({journals.length})</span>
          </motion.button>
          <motion.button
            onClick={() => setActiveTab('chats')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${activeTab === 'chats'
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-muted-foreground hover:text-foreground'
              }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <MessageCircle className="w-4 h-4" />
            <span>{t('chats')}</span>
            <span className="text-xs opacity-75">({chats.length})</span>
          </motion.button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{t('loading')}</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {activeTab === 'journals' ? (
              <motion.div
                key="journals"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                {journals.length === 0 ? (
                  <div className="card-3d p-12 text-center">
                    <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">{t('noJournals')}</p>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-end mb-4">
                      <motion.button
                        onClick={async () => {
                          if (confirm('Are you sure you want to delete ALL journals?')) {
                            setLoading(true);
                            try {
                              await journalAPI.clear();
                              setJournals([]);
                              toast({ title: 'Cleared', description: 'All journals deleted' });
                            } catch (e) {
                              toast({ title: 'Error', description: 'Failed to clear journals', variant: 'destructive' });
                            } finally {
                              setLoading(false);
                            }
                          }
                        }}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Clear Journals</span>
                      </motion.button>
                    </div>
                    {journals.map((journal, index) => (
                      <motion.div
                        key={index}
                        className="card-3d p-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(journal.createdAt).toLocaleDateString()}</span>
                            <Clock className="w-4 h-4 ml-2" />
                            <span>{new Date(journal.createdAt).toLocaleTimeString()}</span>
                          </div>
                          <motion.button
                            onClick={() => handleDeleteJournal(index)}
                            className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </div>
                        <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                          {journal.text}
                        </p>
                      </motion.div>
                    ))}
                  </>
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
                {chats.length === 0 ? (
                  <div className="card-3d p-12 text-center">
                    <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">{t('noChats')}</p>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-end mb-4">
                      <motion.button
                        onClick={handleClearChats}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>{t('clearChats')}</span>
                      </motion.button>
                    </div>
                    {chats.map((chat, index) => (
                      <motion.div
                        key={index}
                        className={`flex ${chat.isAI ? 'justify-start' : 'justify-end'}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <div
                          className={`max-w-[85%] card-3d p-4 ${chat.isAI ? 'chat-bubble-ai' : 'bg-primary/20'
                            }`}
                        >
                          <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span>{formatDate(chat.timestamp)}</span>
                          </div>
                          <p className="text-foreground leading-relaxed">{chat.text}</p>
                        </div>
                      </motion.div>
                    ))}
                  </>
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

