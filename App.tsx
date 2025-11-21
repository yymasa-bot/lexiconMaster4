import React, { useState, useCallback } from 'react';
import { fetchWordAnalysis } from './services/geminiService';
import { LexiconData, NotebookEntry } from './types';
import { ResultCard } from './components/ResultCard';
import { Notebook } from './components/Notebook';
import { Search, Loader2, Sparkles, BookMarked } from 'lucide-react';

const App: React.FC = () => {
  const [inputWord, setInputWord] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<LexiconData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notebook, setNotebook] = useState<NotebookEntry[]>([]);
  const [isNotebookOpen, setIsNotebookOpen] = useState(false);

  const handleSearch = async (word: string) => {
    if (!word.trim()) return;
    
    // Command Handling
    if (word.trim().startsWith('/')) {
      const parts = word.trim().split(' ');
      const command = parts[0].toLowerCase();
      const arg = parts.slice(1).join(' ');

      if (command === '/list') {
        setIsNotebookOpen(true);
        setInputWord('');
        return;
      }
      
      if (command === '/add' && arg && data && data.word.toLowerCase() === arg.toLowerCase()) {
        addToNotebook(arg);
        setInputWord('');
        return;
      }
      
      // If command unknown or just searching for a word starting with / (unlikely but possible)
      // We'll assume it's a regular search if not matched above, or strip slash? 
      // For this app, let's treat non-commands as invalid or strip the slash.
      // Let's simply alert for commands to guide user.
      if (command === '/add' && !arg) {
        setError("Usage: /add [word] (Must match current result)");
        return;
      }
    }

    setLoading(true);
    setError(null);
    setData(null); // Clear previous result for better UX

    try {
      const result = await fetchWordAnalysis(word);
      setData(result);
    } catch (err) {
      setError("Could not analyze the word. Please try again or check your spelling.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addToNotebook = useCallback((word: string) => {
    setNotebook(prev => {
      if (prev.some(entry => entry.word.toLowerCase() === word.toLowerCase())) {
        return prev;
      }
      return [{ word, timestamp: Date.now() }, ...prev];
    });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(inputWord);
  };

  const isCurrentWordSaved = data 
    ? notebook.some(n => n.word.toLowerCase() === data.word.toLowerCase())
    : false;

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Navigation / Header */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-900">
            <div className="bg-amber-500 p-1.5 rounded text-white">
              <Sparkles size={20} />
            </div>
            <span className="font-bold text-xl serif tracking-tight">LexiconMaster</span>
          </div>
          
          <button 
            onClick={() => setIsNotebookOpen(true)}
            className="flex items-center gap-2 text-slate-600 hover:text-amber-600 transition-colors"
          >
            <BookMarked size={20} />
            <span className="hidden sm:inline font-medium">Notebook ({notebook.length})</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-8 md:py-12">
        
        {/* Search Hero */}
        <div className={`transition-all duration-500 ease-in-out ${data ? 'mb-8' : 'mt-20 mb-12 text-center'}`}>
          {!data && !loading && (
             <div className="mb-8 animate-fade-in">
               <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 serif">
                 Unlock the Story Behind Every Word
               </h1>
               <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                 Your personal etymology tutor. Discover origins, nuance, and context.
               </p>
             </div>
          )}

          <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                {loading ? (
                  <Loader2 className="animate-spin text-amber-500" size={24} />
                ) : (
                  <Search className="text-slate-400 group-focus-within:text-amber-500 transition-colors" size={24} />
                )}
              </div>
              <input
                type="text"
                value={inputWord}
                onChange={(e) => setInputWord(e.target.value)}
                placeholder="Enter an English word (e.g., Ambiguous)..."
                className="w-full pl-12 pr-4 py-4 text-lg rounded-full border-2 border-slate-200 shadow-sm focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all placeholder:text-slate-400"
                disabled={loading}
              />
              <div className="absolute inset-y-0 right-2 flex items-center">
                <button 
                  type="submit"
                  disabled={loading || !inputWord}
                  className="bg-slate-900 text-white px-6 py-2 rounded-full font-medium text-sm hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Analyze
                </button>
              </div>
            </div>
            {/* Helper hints */}
            {!data && !loading && (
              <div className="mt-4 flex justify-center gap-4 text-xs text-slate-400">
                <span>Try: <button onClick={() => handleSearch('Serendipity')} className="text-amber-600 hover:underline">Serendipity</button></span>
                <span>•</span>
                <span><button onClick={() => handleSearch('Nostalgia')} className="text-amber-600 hover:underline">Nostalgia</button></span>
                <span>•</span>
                <span>Type <code className="bg-slate-100 px-1 rounded">/list</code> to see notebook</span>
              </div>
            )}
          </form>
        </div>

        {/* Error State */}
        {error && (
          <div className="max-w-2xl mx-auto bg-red-50 text-red-600 p-4 rounded-lg border border-red-100 text-center mb-8 animate-fade-in">
            {error}
          </div>
        )}

        {/* Results */}
        {data && (
          <ResultCard 
            data={data} 
            onAddToNotebook={addToNotebook} 
            isSaved={isCurrentWordSaved} 
          />
        )}
      </main>

      <Notebook 
        isOpen={isNotebookOpen} 
        onClose={() => setIsNotebookOpen(false)} 
        entries={notebook}
        onSelectWord={(word) => {
          setInputWord(word);
          handleSearch(word);
        }}
      />
    </div>
  );
};

export default App;
