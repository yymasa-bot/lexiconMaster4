import React from 'react';
import { NotebookEntry } from '../types';
import { X, Book, Clock } from 'lucide-react';

interface NotebookProps {
  isOpen: boolean;
  onClose: () => void;
  entries: NotebookEntry[];
  onSelectWord: (word: string) => void;
}

export const Notebook: React.FC<NotebookProps> = ({ isOpen, onClose, entries, onSelectWord }) => {
  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-2 text-slate-800">
            <Book className="text-amber-600" size={20} />
            <h2 className="font-bold text-lg">Vocabulary Notebook</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scroll p-4">
          {entries.length === 0 ? (
            <div className="text-center text-slate-400 mt-10">
              <p className="text-sm">No words saved yet.</p>
              <p className="text-xs mt-1">Use /add or click save on a card.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {entries.map((entry) => (
                <button
                  key={entry.timestamp}
                  onClick={() => {
                    onSelectWord(entry.word);
                    onClose();
                  }}
                  className="w-full text-left p-3 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all group"
                >
                  <span className="font-bold text-slate-800 capitalize group-hover:text-indigo-600 transition-colors">
                    {entry.word}
                  </span>
                  <div className="flex items-center gap-1 mt-1 text-xs text-slate-400">
                    <Clock size={10} />
                    <span>{new Date(entry.timestamp).toLocaleTimeString()}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-slate-100 bg-slate-50 text-xs text-slate-400 text-center">
          {entries.length} words collected
        </div>
      </div>
    </>
  );
};
