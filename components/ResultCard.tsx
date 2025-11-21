import React from 'react';
import { LexiconData } from '../types';
import { Volume2, BookOpen, GitBranch, Scale, PlusCircle, CheckCircle } from 'lucide-react';

interface ResultCardProps {
  data: LexiconData;
  onAddToNotebook: (word: string) => void;
  isSaved: boolean;
}

export const ResultCard: React.FC<ResultCardProps> = ({ data, onAddToNotebook, isSaved }) => {
  const handleSpeak = () => {
    const utterance = new SpeechSynthesisUtterance(data.word);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden border border-slate-200 animate-fade-in">
      {/* Header Section */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
           <BookOpen size={120} />
        </div>
        
        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold serif tracking-tight mb-2 capitalize">
                {data.word}
              </h1>
              <div className="flex items-center gap-4 text-slate-300">
                <span className="font-mono text-lg text-amber-400">{data.phonetics.ipa}</span>
                <span className="w-1 h-1 rounded-full bg-slate-500"></span>
                <span className="text-sm uppercase tracking-wide">{data.phonetics.syllables}</span>
              </div>
            </div>
            <button
              onClick={() => onAddToNotebook(data.word)}
              disabled={isSaved}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                isSaved 
                  ? 'bg-green-500/20 text-green-300 cursor-default' 
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              {isSaved ? <CheckCircle size={16} /> : <PlusCircle size={16} />}
              {isSaved ? 'Saved' : 'Save to Notebook'}
            </button>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button 
              onClick={handleSpeak}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-900 px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              <Volume2 size={18} />
              Play Audio
            </button>
            <p className="text-sm text-slate-400 italic border-l-2 border-slate-600 pl-3">
              💡 Tip: {data.phonetics.tip}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-8">
        {/* Origin Story */}
        <section>
          <div className="flex items-center gap-2 mb-4 text-amber-700 font-bold uppercase tracking-wider text-sm">
            <BookOpen size={18} />
            <h2>The Origin Story (Etymology)</h2>
          </div>
          <div className="bg-amber-50 p-5 rounded-lg border border-amber-100">
             <div className="font-mono text-amber-900 mb-3 font-semibold bg-white inline-block px-2 py-1 rounded border border-amber-200 shadow-sm">
               {data.etymology.rootAnalysis}
             </div>
             <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
               {data.etymology.backstory}
             </p>
          </div>
        </section>

        {/* Cognate Network */}
        <section>
          <div className="flex items-center gap-2 mb-4 text-indigo-700 font-bold uppercase tracking-wider text-sm">
            <GitBranch size={18} />
            <h2>Cognate Network</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.cognates.map((cog, idx) => (
              <div key={idx} className="bg-slate-50 p-4 rounded-lg border border-slate-100 hover:border-indigo-200 transition-colors">
                <h3 className="font-bold text-slate-900 mb-1 capitalize">{cog.word}</h3>
                <p className="text-xs text-slate-600">{cog.connection}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Nuance & Usage */}
        <section>
          <div className="flex items-center gap-2 mb-4 text-emerald-700 font-bold uppercase tracking-wider text-sm">
            <Scale size={18} />
            <h2>Nuance & Usage</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-xs font-semibold text-slate-500 uppercase mb-2">Synonyms</h3>
              <div className="space-y-2">
                {data.nuance.synonyms.map((syn, idx) => (
                  <div key={idx} className="flex items-baseline gap-2">
                    <span className="font-bold text-slate-800 capitalize">{syn.word}</span>
                    <span className="text-sm text-slate-500">- {syn.context}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-slate-500 uppercase mb-2">Antonym</h3>
              <div className="flex items-baseline gap-2">
                 <span className="font-bold text-red-600 capitalize">{data.nuance.antonym}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Contextual Examples</h3>
            <ul className="space-y-4">
              {data.nuance.examples.map((ex, idx) => (
                <li key={idx} className="relative pl-6">
                  <span className="absolute left-0 top-2 w-1.5 h-1.5 bg-slate-400 rounded-full"></span>
                  <p className="text-slate-700 italic serif">"{ex}"</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
};
