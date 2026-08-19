import React, { useState, useEffect, useRef } from 'react';
import './Sections.css';

// Sub-component isolates local state and locks during typing
const HobbyItem = ({ hobby, index, onUpdate, onRemove }) => {
  const [localValue, setLocalValue] = useState(hobby || '');
  const [isFocused, setIsFocused] = useState(false);
  const onUpdateRef = useRef(onUpdate);

  useEffect(() => { onUpdateRef.current = onUpdate; }, [onUpdate]);
  
  useEffect(() => { 
    if (!isFocused) setLocalValue(hobby || ''); 
  }, [hobby, isFocused]);

  const handleChange = (e) => setLocalValue(e.target.value);
  const handleFocus = () => setIsFocused(true);
  
  const handleBlur = () => {
    setIsFocused(false);
    onUpdateRef.current(index, localValue);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isFocused) onUpdateRef.current(index, localValue);
    }, 400);
    return () => clearTimeout(timeout);
  }, [localValue, isFocused, index]);

  return (
    <div className="p-1.5 sm:p-2 bg-slate-50/40 border border-slate-200/70 rounded-xl hover:border-orange-300 hover:bg-white transition-all duration-200 flex items-center gap-2 group/item shadow-sm">
      <div className="flex-shrink-0 ml-2 flex items-center justify-center">
        <div className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover/item:bg-orange-500 transition-colors duration-200"></div>
      </div>
      <input 
        type="text"
        placeholder="e.g. Open Source, Chess, Photography..." 
        value={localValue} 
        onChange={handleChange} 
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="flex-1 bg-transparent text-slate-800 text-xs sm:text-sm outline-none font-medium placeholder:text-slate-400/70 px-1 py-1.5 focus:ring-0"
      />
      <button 
        type="button"
        onClick={() => onRemove(index)} 
        className="text-slate-400 cursor-pointer hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-all shrink-0 sm:opacity-0 sm:group-hover/item:opacity-100 sm:focus:opacity-100"
        title="Remove Hobby"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
};

export default function HobbiesField({ data, setData, onNext, onPrev, nextLabel }) {
  const hobbies = data.hobbies || [];

  const handleUpdate = (index, value) => {
    const updated = [...hobbies];
    updated[index] = value;
    setData(prev => ({ ...prev, hobbies: updated }));
  };

  const handleAdd = () => {
    setData(prev => ({ ...prev, hobbies: [...hobbies, ''] }));
  };

  const handleRemove = (indexToRemove) => {
    setData(prev => ({ ...prev, hobbies: hobbies.filter((_, i) => i !== indexToRemove) }));
  };

  const isAddDisabled = hobbies.length > 0 && !hobbies[hobbies.length - 1].trim();

  return (
    <div className="w-full max-w-3xl mx-auto font-['Outfit',_sans-serif] animate-fade-in px-3 sm:px-6 h-[80vh] min-w-[320px] flex flex-col overflow-hidden bg-white selection:bg-orange-100 selection:text-orange-800">
      
      <div className="flex-1 overflow-y-auto pr-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pb-4 pt-3">
        
        <div className="mb-4 sm:mb-6">
          <span className="radius inline-block text-orange-600 text-[9px] font-bold uppercase tracking-widest bg-orange-50 border border-orange-100 px-2.5 py-0.5 rounded-full mb-1.5">
            Section 8
          </span>
          <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
            Hobbies & Interests
          </h2>
          <p className="text-[11px] sm:text-sm text-slate-400 font-medium mt-0.5">
            Add personal interests or activities that showcase your personality outside of work.
          </p>
        </div>

        <div className="space-y-2">
          {hobbies.map((hobby, index) => (
            <HobbyItem 
              key={index} 
              hobby={hobby} 
              index={index} 
              onUpdate={handleUpdate} 
              onRemove={handleRemove} 
            />
          ))}
        </div>

        {hobbies.length === 0 && (
          <div className="text-center py-10 bg-slate-50/30 rounded-xl border-2 border-dashed border-slate-200/60 mt-2">
            <p className="text-slate-400 font-medium text-xs sm:text-sm">No hobbies listed yet.</p>
          </div>
        )}

        <button 
          type="button"
          onClick={handleAdd} 
          disabled={isAddDisabled}
          className={`mt-4 w-full cursor-pointer py-2.5 border-2 border-dashed rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200 ${
            isAddDisabled 
              ? 'border-slate-100 text-slate-300 bg-slate-50/20 cursor-not-allowed opacity-60' 
              : 'border-slate-200 text-slate-400 hover:text-orange-600 hover:border-orange-300 hover:bg-orange-50/30 active:scale-[0.995]'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          {isAddDisabled ? 'Enter hobby to add another' : 'Add Hobby'}
        </button>
      </div>
      <div className="border-t border-slate-100 pt-3 pb-4 flex justify-between items-center gap-3 bg-white shrink-0">
        <button 
          type="button"
          onClick={onPrev} 
          className="px-3.5 sm:px-5 py-2.5 cursor-pointer border border-slate-200 text-slate-500 font-bold rounded-xl hover:border-slate-300 hover:text-slate-700 hover:bg-slate-50/80 transition-all flex items-center gap-1.5 text-xs sm:text-sm"
        >
          <svg className="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg> 
          Back
        </button>
        <button 
          type="button"
          onClick={onNext} 
          className="px-4 sm:px-7 py-2.5 cursor-pointer bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold rounded-xl shadow-[0_4px_14px_rgba(249,115,22,0.3)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.4)] transition-all flex items-center gap-1.5 text-xs sm:text-sm tracking-wide active:scale-[0.98]"
        >
          {nextLabel || "Next: References"}
        </button>
      </div>
    </div>
  );
}