import React, { useState, useEffect, useRef } from 'react';
import './Sections.css';

const LanguageItem = ({ lang, index, onUpdate, onRemove }) => {
  const [localName, setLocalName] = useState(lang.name || '');
  const [isFocused, setIsFocused] = useState(false);
  const onUpdateRef = useRef(onUpdate);

  useEffect(() => { onUpdateRef.current = onUpdate; }, [onUpdate]);
  
  useEffect(() => { 
    if (!isFocused) setLocalName(lang.name || ''); 
  }, [lang.name, isFocused]);

  const handleNameChange = (e) => setLocalName(e.target.value);
  const handleFocus = () => setIsFocused(true);
  
  const handleNameBlur = () => {
    setIsFocused(false);
    onUpdateRef.current(index, 'name', localName);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isFocused) onUpdateRef.current(index, 'name', localName);
    }, 400);
    return () => clearTimeout(timeout);
  }, [localName, isFocused, index]);

  return (
    <div className="p-3.5 sm:p-5 bg-white border border-slate-100 shadow-[0_4px_20px_-4px_rgba(148,163,184,0.12)] rounded-2xl relative group/card hover:border-slate-200 hover:shadow-[0_4px_24px_-2px_rgba(148,163,184,0.16)] transition-all duration-300 flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
      
      <div className="flex-1 w-full relative">
        <label className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-0.5 block transition-colors">
          Language Name
        </label>
        <input
          type="text"
          placeholder="e.g. English, French..."
          value={localName}
          onChange={handleNameChange}
          onFocus={handleFocus}
          onBlur={handleNameBlur}
          className="w-full bg-slate-50/60 border border-slate-200 text-slate-800 rounded-xl px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none shadow-sm transition-all placeholder:text-slate-400 font-medium"
        />
      </div>
      
      <div className="w-full sm:w-56 relative shrink-0">
         <label className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-0.5 block transition-colors">
          Proficiency Level
         </label>
         <select
            value={lang.proficiency || 'Native / Bilingual'}
            onChange={(e) => onUpdateRef.current(index, 'proficiency', e.target.value)}
            className="w-full bg-slate-50/60 border border-slate-200 text-slate-800 rounded-xl px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none shadow-sm transition-all appearance-none cursor-pointer font-medium"
         >
            <option value="Native / Bilingual">Native / Bilingual</option>
            <option value="Fluent">Fluent</option>
            <option value="Proficient">Proficient</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Basic">Basic</option>
         </select>
         <div className="absolute right-4 bottom-2.5 sm:bottom-3.5 pointer-events-none text-slate-400">
           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
         </div>
      </div>

      <button
        onClick={() => onRemove(index)}
        className="w-full sm:w-auto sm:self-end sm:mb-1 cursor-pointer px-3 py-2.5 sm:p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 border border-transparent hover:border-red-100 rounded-xl transition-colors flex items-center justify-center shrink-0"
        title="Remove Language"
      >
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
      </button>
    </div>
  );
};

export default function LanguagesField({ data, setData, onNext, onPrev, nextLabel }) {
  const languages = data.languages || [];

  const handleUpdate = (index, field, value) => {
    const updated = [...languages];
    updated[index][field] = value;
    setData(prev => ({ ...prev, languages: updated }));
  };

  const handleAdd = () => {
    setData(prev => ({ ...prev, languages: [...languages, { id: Date.now(), name: '', proficiency: 'Native / Bilingual' }] }));
  };

  const handleRemove = (indexToRemove) => {
    setData(prev => ({ ...prev, languages: languages.filter((_, i) => i !== indexToRemove) }));
  };

  const isAddDisabled = languages.length > 0 && !languages[languages.length - 1].name.trim();

  return (
    <div className="w-full max-w-3xl mx-auto font-['Outfit',_sans-serif] animate-fade-in px-3 sm:px-6 h-[80vh] min-w-[320px] flex flex-col overflow-hidden bg-white selection:bg-orange-100 selection:text-orange-800">
      
      <div className="flex-1 overflow-y-auto pr-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pb-4 pt-3">
        <div className="mb-4 sm:mb-6">
          <span className="radius inline-block text-orange-600 text-[9px] font-bold uppercase tracking-widest bg-orange-50 border border-orange-100 px-2.5 py-0.5 rounded-full mb-1.5">
            Section 7
          </span>
          <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">Languages</h2>
          <p className="text-[11px] sm:text-sm text-slate-400 font-medium mt-0.5">Add the languages you speak and your proficiency level.</p>
        </div>

        <div className="space-y-4 sm:space-y-5">
          {languages.map((lang, index) => (
            <LanguageItem 
              key={lang.id || index} 
              lang={lang} 
              index={index} 
              onUpdate={handleUpdate} 
              onRemove={handleRemove} 
            />
          ))}
        </div>

        <button 
          onClick={handleAdd} 
          disabled={isAddDisabled} 
          className={`mt-4 w-full py-2.5 sm:py-3.5 cursor-pointer border-2 border-dashed rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.995] ${isAddDisabled ? 'border-slate-200 text-slate-400 bg-slate-50 cursor-not-allowed opacity-70' : 'border-slate-200 text-slate-400 hover:text-orange-600 hover:border-orange-300 hover:bg-orange-50/30'}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg> 
          {isAddDisabled ? 'Enter language to add another' : 'Add Language'}
        </button>
      </div>
      <div className="border-t border-slate-100 pt-3 pb-4 flex justify-between items-center gap-3 bg-white shrink-0">
        <button 
          onClick={onPrev} 
          className="px-3.5 sm:px-5 py-2.5 cursor-pointer border border-slate-200 text-slate-500 font-bold rounded-xl hover:border-slate-300 hover:text-slate-700 hover:bg-slate-50/80 transition-all flex items-center gap-1.5 text-xs sm:text-sm"
        >
          <svg className="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <button 
          onClick={onNext} 
          className="px-4 sm:px-7 py-2.5 cursor-pointer bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold rounded-xl shadow-[0_4px_14px_rgba(249,115,22,0.3)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.4)] transition-all flex items-center gap-1.5 text-xs sm:text-sm tracking-wide active:scale-[0.98]"
        >
          {nextLabel || "Next: Hobbies"}
        </button>
      </div>
    </div>
  );
}