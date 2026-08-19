import React, { useState, useEffect, useMemo, memo } from 'react';
import { createPortal } from 'react-dom';
import useResumeSuggestions from '../../../hooks/useResumeSuggestions';
import './Sections.css';

// Fixed Skill Input Component
const SkillInput = memo(({ value, onChange }) => {
  const [localVal, setLocalVal] = useState(value || '');
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!isFocused) {
      setLocalVal(value || '');
    }
  }, [value, isFocused]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localVal !== (value || '')) {
        onChange({ target: { value: localVal } });
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [localVal]);

  const handleBlur = () => {
    setIsFocused(false);
    if (localVal !== (value || '')) {
      onChange({ target: { value: localVal } });
    }
  };

  return (
    <input
      type="text"
      placeholder="e.g., React.js, Project Management"
      value={localVal}
      onChange={(e) => setLocalVal(e.target.value)}
      onFocus={() => setIsFocused(true)}
      onBlur={handleBlur}
      className="w-full bg-slate-50/50 border border-transparent hover:bg-slate-50 hover:border-slate-200 text-slate-800 rounded-lg px-3 py-2 text-xs sm:text-sm focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all placeholder:text-slate-400 font-medium"
    />
  );
});

export default function SkillsField({ data, setData, onNext, onPrev, nextLabel }) {
  const { suggestions, isSuggesting } = useResumeSuggestions(data);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isDrawerOpen]);

  const skills = useMemo(() => {
    if (!data.skills || data.skills.length === 0) {
      return [{ id: Date.now(), name: '', level: 3 }];
    }
    return data.skills.map((skill, index) => {
      if (typeof skill === 'string') return { id: Date.now() + index, name: skill, level: 3 };
      return skill;
    });
  }, [data.skills]);

  const handleUpdate = (index, field, value) => {
    const updated = skills.map((skill, i) => 
      i === index ? { ...skill, [field]: value } : skill
    );
    setData(prev => ({ ...prev, skills: updated }));
  };

  const handleAdd = () => {
    setData(prev => ({ ...prev, skills: [...skills, { id: Date.now(), name: '', level: 3 }] }));
  };

  const handleRemove = (indexToRemove) => {
    setData(prev => {
      const filtered = skills.filter((_, i) => i !== indexToRemove);
      return { 
        ...prev, 
        skills: filtered.length > 0 ? filtered : [{ id: Date.now(), name: '', level: 3 }] 
      };
    });
  };

  const handleAddSuggestedSkill = (skillText) => {
    setData(prev => {
      const currentSkills = prev.skills || [];
      
      const normalized = currentSkills.map((skill, index) => {
        if (typeof skill === 'string') return { id: Date.now() + index, name: skill, level: 3 };
        return skill;
      });

      if (normalized.some(s => s.name.trim().toLowerCase() === skillText.toLowerCase())) {
        return prev;
      }

      const emptyIndex = normalized.findIndex(s => !s.name.trim());

      if (emptyIndex !== -1) {
        const updated = normalized.map((s, i) => 
          i === emptyIndex ? { ...s, name: skillText } : s
        );
        return { ...prev, skills: updated };
      } else {
        return { 
          ...prev, 
          skills: [...normalized, { id: Date.now(), name: skillText, level: 3 }] 
        };
      }
    });
  };

  const isAddDisabled = skills.length > 0 && !skills[skills.length - 1].name.trim();

  const availableSuggestions = suggestions?.skills
    ? suggestions.skills.filter(sug => !skills.some(skill => skill.name.toLowerCase() === sug.toLowerCase()))
    : [];

  return (
    <>
      <div className="w-full max-w-3xl mx-auto font-['Outfit',_sans-serif] animate-fade-in px-3 sm:px-6 h-[80vh] min-w-[320px] flex flex-col overflow-hidden bg-white selection:bg-orange-100 selection:text-orange-800 relative">
        
        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto pr-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pb-4 pt-3">
          
          {/* Header Row Container */}
          <div className="flex items-start justify-between gap-4 mb-5 sm:mb-6 min-h-[32px]">
            <div>
              <span className="radius inline-block text-orange-600 text-[9px] font-bold uppercase tracking-widest bg-orange-50 border border-orange-100 px-2.5 py-0.5 rounded-full mb-1.5">
                Section 4
              </span>
              <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">Core Skills</h2>
              <p className="text-[11px] sm:text-sm text-slate-400 font-medium mt-0.5">Highlight your technical and soft skills.</p>
            </div>

            {(isSuggesting || availableSuggestions.length > 0) && (
               <button 
                  onClick={() => setIsDrawerOpen(true)}
                  className="text-[9px] sm:text-[10px] cursor-pointer font-extrabold flex items-center gap-1 py-1.5 px-3 rounded-full border border-indigo-200/80 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600 hover:from-indigo-100 hover:to-purple-100 shadow-[0_2px_8px_rgba(99,102,241,0.08)] transition-all shrink-0 animate-[pulse_2.5s_infinite_ease-in-out] group/sparkle active:scale-[0.96] mt-2 sm:mt-1"
               >
                  <svg className="w-3 h-3 text-indigo-500 group-hover/sparkle:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  <span className="">Suggestions</span>
               </button>
            )}
          </div>

          {/* Compact Modern Skills List */}
          <div className="space-y-2.5 sm:space-y-3">
            {skills.map((skill, index) => (
              <div key={skill.id} className="p-2 sm:p-2.5 bg-white border border-slate-200 shadow-sm rounded-xl relative group/card hover:border-orange-300 hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row items-center gap-3">
                
                {/* Input Field Area */}
                <div className="flex-1 w-full relative">
                  <SkillInput
                    value={skill.name}
                    onChange={(e) => handleUpdate(index, 'name', e.target.value)}
                  />
                </div>

                {/* Slider and Controls Area */}
                <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-4 shrink-0 px-1 sm:px-0">
                  <div className="flex items-center gap-2.5">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider hidden sm:block">Level</span>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={skill.level}
                      onChange={(e) => handleUpdate(index, 'level', parseInt(e.target.value))}
                      className="w-full sm:w-28 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                    />
                  </div>
                  
                  <button 
                    type="button"
                    onClick={() => handleRemove(index)} 
                    className="text-slate-400 cursor-pointer hover:text-red-500 hover:bg-red-50 p-1.5 sm:p-2 rounded-lg transition-all duration-200"
                    title="Remove Skill"
                  >
                    <svg className="w-4 h-4 sm:w-4.5 sm:h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button 
            type="button"
            onClick={handleAdd} 
            disabled={isAddDisabled} 
            className={`mt-4 w-full py-2.5 sm:py-3.5 cursor-pointer border-2 border-dashed rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.995] ${isAddDisabled ? 'border-slate-200 text-slate-400 bg-slate-50 cursor-not-allowed opacity-70' : 'border-slate-200 text-slate-400 hover:text-orange-600 hover:border-orange-300 hover:bg-orange-50/30'}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg> 
            {isAddDisabled ? 'Enter a skill to add another' : 'Add Another Skill'}
          </button>
        </div>     {/* Fixed Bottom Action Navigation Bar */}
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
            {nextLabel || "Next: Certificates"}
          </button>
        </div>

{/* --- SMART ASSISTANT DRAWER --- */}
        {createPortal(
          <>
            {/* Backdrop */}
            <div 
              className={`fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[998] transition-opacity duration-300 ${
                isDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
              onClick={() => setIsDrawerOpen(false)}
            />

            {/* Drawer Panel */}
            <div 
              className={`fixed top-0 left-0 h-full w-[88vw] max-w-[340px] bg-white/95 backdrop-blur-2xl shadow-[24px_0_40px_rgba(0,0,0,0.08)] border-r border-slate-100 z-[999] transform transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) flex flex-col ${
                isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
              }`}
            >
              <div className="p-4 sm:p-5 border-b border-slate-100/60 bg-gradient-to-br from-indigo-50/40 to-white/50 flex justify-between items-start shrink-0">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                    </span>
                    <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">
                      Smart Assistant
                    </span>
                  </div>
                  <h3 className="font-black text-slate-800 text-base sm:text-lg tracking-tight leading-tight">
                    Recommended Skills
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5">
                    Tap to add to your resume
                  </p>
                </div>
                
                <button 
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-1.5 text-slate-400 cursor-pointer hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full">
                {availableSuggestions.length === 0 ? (
                   <div className="text-center py-10 px-4">
                      <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                         <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      </div>
                      <p className="text-slate-500 text-xs font-medium">All suggested skills have been added.</p>
                   </div>
                ) : (
                  availableSuggestions.map((skill, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleAddSuggestedSkill(skill)}
                      className="w-full text-left p-3 cursor-pointer bg-white hover:bg-indigo-50/30 text-slate-600 hover:text-indigo-800 text-[11px] sm:text-xs font-medium rounded-xl border border-slate-200/80 hover:border-indigo-200 shadow-sm transition-all duration-200 flex items-center gap-2.5 active:scale-[0.98] group/btn"
                    >
                      <span className="flex-shrink-0 w-5 h-5 rounded-md bg-indigo-50 text-indigo-500 flex items-center justify-center font-bold group-hover/btn:bg-indigo-500 group-hover/btn:text-white transition-colors">
                        +
                      </span>
                      <span className="leading-relaxed">{skill}</span>
                    </button>
                  ))
                )}
              </div>
              
              <div className="p-4 border-t border-slate-100 bg-slate-50/50 shrink-0">
                 <button 
                    onClick={() => setIsDrawerOpen(false)}
                    className="w-full py-2.5 bg-white cursor-pointer border border-slate-200 text-slate-600 font-bold text-xs rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm active:scale-[0.98]"
                 >
                    Done
                 </button>
              </div>
            </div>
          </>,
          document.body // Appending directly to the body
        )}

      </div>
    </>
  );
}