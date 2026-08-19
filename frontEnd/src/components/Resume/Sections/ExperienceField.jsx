import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom'; // Add this line
import useResumeSuggestions from '../../../hooks/useResumeSuggestions';
import { dataset } from '../../../utils/escoService'; 
import './Sections.css';

// 1. Bulletproof Debounced InputField
const InputField = ({ label, placeholder, value, onChange, onBlur, type = "text", disabled }) => {
  const inputRef = useRef(null);
  const timeoutRef = useRef(null);
  const lastSentValue = useRef(value); // Tracks what we actually sent to the parent
  const [currentType, setCurrentType] = useState(type === 'date' && !value ? 'text' : type);

  // Sync external state changes ONLY if they are forced overrides (like a dropdown click)
  useEffect(() => {
    if (value !== lastSentValue.current) {
      if (inputRef.current) inputRef.current.value = value || '';
      lastSentValue.current = value; // Sync it up
      if (type === 'date') setCurrentType(value ? 'date' : 'text');
    }
  }, [value, type]);

  const handleInput = (e) => {
    const newValue = e.target.value;
    
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      lastSentValue.current = newValue; // Remember what we are sending
      onChange({ target: { value: newValue } });
    }, 300);
  };

  return (
    <div className="flex flex-col group w-full">
      <label className={`text-[10px] sm:text-[11px] font-bold uppercase tracking-wider mb-1.5 ml-0.5 transition-colors ${disabled ? 'text-slate-300' : 'text-slate-400 group-focus-within:text-orange-500'}`}>
        {label}
      </label>
      <div className="relative w-full">
        <input 
          ref={inputRef}
          type={currentType}
          placeholder={placeholder} 
          defaultValue={value || ''} 
          onInput={handleInput}
          disabled={disabled}
          onFocus={(e) => {
            if (type === 'date' && !disabled) {
              setCurrentType('date');
              setTimeout(() => {
                if (e.target && e.target.showPicker) e.target.showPicker();
              }, 10);
            }
          }}
          onBlur={(e) => {
            if (type === 'date' && !e.target.value) setCurrentType('text'); 
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            lastSentValue.current = e.target.value; // Sync on blur just in case
            onChange({ target: { value: e.target.value } });
            if (onBlur) onBlur(e);
          }}
          className={`w-full bg-slate-50/60 border border-slate-200 text-slate-800 rounded-xl px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none shadow-sm transition-all placeholder:text-slate-400 font-medium accent-orange-500 ${disabled ? 'opacity-50 cursor-not-allowed bg-slate-100/50' : ''}`} 
        />
      </div>
    </div>
  );
};

// 2. Bulletproof Debounced TextArea
const DebouncedTextArea = ({ value, onChange, placeholder, className }) => {
  const textareaRef = useRef(null);
  const timeoutRef = useRef(null);
  const lastSentValue = useRef(value);

  // Sync external overrides (like clicking an AI suggestion)
  useEffect(() => {
    if (value !== lastSentValue.current) {
      if (textareaRef.current) {
        textareaRef.current.value = value || '';
        textareaRef.current.style.height = '42px';
        textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
      }
      lastSentValue.current = value;
    }
  }, [value]);

  const handleInput = (e) => {
    const newValue = e.target.value;
    
    // Efficient auto-resize logic
    e.target.style.height = '42px';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      lastSentValue.current = newValue;
      onChange({ target: { value: newValue } });
    }, 300);
  };

  return (
    <textarea
      ref={textareaRef}
      rows="1"
      placeholder={placeholder}
      defaultValue={value || ''}
      onInput={handleInput}
      onBlur={(e) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        lastSentValue.current = e.target.value;
        onChange({ target: { value: e.target.value } });
      }}
      className={className}
    />
  );
};

export default function ExperienceField({ data, setData, onNext, onPrev, nextLabel }) {
  // Auto Suggestions Hooks & State
  const { suggestions, isSuggesting } = useResumeSuggestions(data);
  const [clickedSuggestions, setClickedSuggestions] = useState([]);
  const [titleSuggestionsMap, setTitleSuggestionsMap] = useState({});
  const titleTimeoutRefs = useRef({});
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(null);

  // Lock background scroll when the AI suggestion drawer is open
  useEffect(() => {
    if (activeSuggestionIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [activeSuggestionIndex]);

  const experiences = data.experience === undefined || data.experience.length === 0
    ? [{ id: Date.now(), company: '', role: '', startDate: '', endDate: '', isCurrent: false, achievements: [''] }]
    : data.experience;

// Helper to normalize strings for comparison (removes spaces, symbols, and casing)
  const normalizeString = (str) => (str ? str.toLowerCase().replace(/[^a-z0-9]/g, '') : '');

  // Pre-compute normalized keys ONCE
  const achievementsMapKeys = useMemo(() => {
    if (!suggestions?.achievementsMap) return [];
    return Object.keys(suggestions.achievementsMap).map((k) => ({
      original: k,
      normalized: normalizeString(k)
    }));
  }, [suggestions?.achievementsMap]);

  // Search function using normalized string matching
  const getRoleAchievements = useCallback((role) => {
    if (!role || !suggestions?.achievementsMap || achievementsMapKeys.length === 0) return [];
    
    const cleanRole = normalizeString(role);
    if (cleanRole.length < 2) return [];

    const map = suggestions.achievementsMap;
    
    // 1. Exact normalized match (e.g. "riskcomplianceofficer" === "riskcomplianceofficer")
    const exactMatch = achievementsMapKeys.find((k) => k.normalized === cleanRole);
    if (exactMatch) return map[exactMatch.original] || [];

    // 2. Partial normalized match
    const partialMatch = achievementsMapKeys.find(
      (k) => k.normalized.includes(cleanRole) || cleanRole.includes(k.normalized)
    );
    if (partialMatch) return map[partialMatch.original] || [];

    return [];
  }, [suggestions?.achievementsMap, achievementsMapKeys]);
  
  const updateExperience = (index, field, value) => {
    const newExp = experiences.map((exp, i) => {
      if (i === index) {
        const updatedExp = { ...exp, [field]: value };
        if (field === 'isCurrent' && value === true) updatedExp.endDate = '';
        return updatedExp;
      }
      return exp;
    });
    setData((prev) => ({ ...prev, experience: newExp }));
  };

const handleRoleChange = (index, value) => {
    updateExperience(index, 'role', value);

    // Clear previous timeout
    if (titleTimeoutRefs.current[index]) clearTimeout(titleTimeoutRefs.current[index]);

    const query = value.trim().toLowerCase();
    if (query.length < 2) {
      setTitleSuggestionsMap((prev) => ({ ...prev, [index]: [] }));
      return;
    }

    titleTimeoutRefs.current[index] = setTimeout(() => {
      try {
        // 1. Get all job titles (keys) from your FULL dataset
        const availableTitles = Object.keys(dataset);
        
        // 2. Filter titles that include whatever the user typed
        const uniqueTitles = availableTitles
          .filter(title => title.toLowerCase().includes(query))
          .slice(0, 5); // Keep max 5 suggestions
          
        setTitleSuggestionsMap((prev) => ({ ...prev, [index]: uniqueTitles }));
      } catch (e) {
        console.error("Failed to fetch job titles from dataset", e);
      }
    }, 250);
  };

  const handleAchievementChange = (expIndex, achIndex, value) => {
    const newExp = experiences.map((exp, i) => {
      if (i === expIndex) {
        const newAchievements = [...(exp.achievements || [''])];
        newAchievements[achIndex] = value;
        return { ...exp, achievements: newAchievements };
      }
      return exp;
    });
    setData((prev) => ({ ...prev, experience: newExp }));
  };

  const handleAddSuggestedAchievement = (expIndex, text) => {
    const newExp = experiences.map((exp, i) => {
      if (i === expIndex) {
        const currentAchievements = [...(exp.achievements || [])];
        if (currentAchievements.length > 0 && currentAchievements[currentAchievements.length - 1].trim() === '') {
          currentAchievements[currentAchievements.length - 1] = text;
        } else {
          currentAchievements.push(text);
        }
        return { ...exp, achievements: currentAchievements };
      }
      return exp;
    });
    setData((prev) => ({ ...prev, experience: newExp }));
    setClickedSuggestions((prev) => [...prev, text]);
  };

  const addAchievement = (index) => {
    const newExp = experiences.map((exp, i) => {
      if (i === index) return { ...exp, achievements: [...(exp.achievements || []), ''] };
      return exp;
    });
    setData((prev) => ({ ...prev, experience: newExp }));
  };

  const removeAchievement = (expIndex, achIndex) => {
    const newExp = experiences.map((exp, i) => {
      if (i === expIndex) {
        const newAchievements = exp.achievements.filter((_, j) => j !== achIndex);
        return { ...exp, achievements: newAchievements.length > 0 ? newAchievements : [''] };
      }
      return exp;
    });
    setData((prev) => ({ ...prev, experience: newExp }));
  };

  const addExperience = () => {
    setData((prev) => ({ ...prev, experience: [...experiences, { id: Date.now(), company: '', role: '', startDate: '', endDate: '', isCurrent: false, achievements: [''] }] }));
  };

  const removeExperience = (index) => {
    const newExp = experiences.filter((_, i) => i !== index);
    setData((prev) => ({ ...prev, experience: newExp.length > 0 ? newExp : [{ id: Date.now(), company: '', role: '', startDate: '', endDate: '', isCurrent: false, achievements: [''] }] }));
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // If the click did not happen inside a job title container, clear the dropdowns
      if (!event.target.closest('.job-title-container')) {
        setTitleSuggestionsMap({});
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Active Drawer Data
  const activeExp = activeSuggestionIndex !== null ? experiences[activeSuggestionIndex] : null;
  const activeRoleAchievements = activeExp ? getRoleAchievements(activeExp.role) : [];
  const activeVisibleSuggestions = activeRoleAchievements.filter(ach => !clickedSuggestions.includes(ach));

  return (
    <>
      <div className="w-full max-w-3xl mx-auto font-['Outfit',_sans-serif] animate-fade-in px-3 sm:px-6 h-[80vh] min-w-[320px] flex flex-col overflow-hidden bg-white selection:bg-orange-100 selection:text-orange-800 relative">
        
        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto pr-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pb-4 pt-3">
          <div className="mb-4 sm:mb-6">
            <span className="radius inline-block text-orange-600 text-[9px] font-bold uppercase tracking-widest bg-orange-50 border border-orange-100 px-2.5 py-0.5 rounded-full mb-1.5">
              Section 2
            </span>
            <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
              Work Experience
            </h2>
            <p className="text-[11px] sm:text-sm text-slate-400 font-medium mt-0.5">
              List your professional experience starting with the most recent.
            </p>
          </div>

          <div className="space-y-5 sm:space-y-6">
            {experiences.map((exp, index) => {
              const roleAchievements = getRoleAchievements(exp.role);
              const hasSuggestions = roleAchievements.length > 0;
              const isAddAchievementDisabled = !exp.achievements || exp.achievements.length === 0 || exp.achievements[exp.achievements.length - 1].trim() === '';

              return (
                <div key={exp.id || index} className="p-3.5 sm:p-5 bg-white border border-slate-100 shadow-[0_4px_20px_-4px_rgba(148,163,184,0.12)] rounded-2xl relative group/card hover:border-slate-200 hover:shadow-[0_4px_24px_-2px_rgba(148,163,184,0.16)] transition-all duration-300">
                  
                  {/* Top Header Controls */}
                  <div className="flex justify-between items-center mb-3 sm:mb-0 sm:absolute sm:top-3.5 sm:right-3.5 w-full sm:w-auto">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider sm:hidden">
                      Position #{index + 1}
                    </span>
                    {experiences.length > 1 && (
                      <button 
                        onClick={() => removeExperience(index)} 
                        className="text-slate-400 hover:text-red-500 cursor-pointer hover:bg-red-50 p-1.5 rounded-xl border border-transparent hover:border-red-100 shadow-none transition-all duration-200 flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider"
                        title="Remove Experience"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 mb-5">
                    <div className="relative flex flex-col w-full job-title-container">
                      <InputField 
                        label="Job Title" 
                        placeholder="e.g. Software Engineer" 
                        value={exp.role} 
                        onChange={(e) => handleRoleChange(index, e.target.value)} 
                        onBlur={() => {
                          setTimeout(() => setTitleSuggestionsMap(prev => ({...prev, [index]: []})), 150);
                        }}
                      />

{/* Dropdown for ESCO Job Titles */}
{titleSuggestionsMap[index] && titleSuggestionsMap[index].length > 0 && (
  <div className="absolute top-[calc(100%+4px)] left-0 right-0 z-40 bg-white border border-slate-200 shadow-xl rounded-xl max-h-40 overflow-y-auto overscroll-contain backdrop-blur-xl bg-white/95 py-1 animate-in fade-in slide-in-from-top-2 duration-150">
    {titleSuggestionsMap[index].map((t, i) => {
      
      // NEW FORMATTING: Add spaces before capital letters, then ensure title case
      const formattedTitle = t
        .replace(/([a-z])([A-Z])/g, '$1 $2') // Turns "RiskComplianceOfficer" into "Risk Compliance Officer"
        .replace(/\b\w/g, char => char.toUpperCase()) // Ensures capitalization
        .trim();
      
      return (
        <div 
          key={i} 
          onMouseDown={(e) => {
            e.preventDefault(); 
            updateExperience(index, 'role', formattedTitle);
            setTitleSuggestionsMap((prev) => ({ ...prev, [index]: [] }));
          }}
          className="px-3.5 py-2 text-xs text-slate-700 hover:bg-orange-50 hover:text-orange-700 cursor-pointer transition-colors font-medium"
        >
          {formattedTitle}
        </div>
      );
    })}
  </div>
)}
                    </div>

                    <InputField 
                      label="Company" 
                      placeholder="e.g. Google" 
                      value={exp.company} 
                      onChange={(e) => updateExperience(index, 'company', e.target.value)} 
                    />
                    
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:col-span-2">
                      <InputField 
                        label="Start Date" 
                        type="date"
                        placeholder="MM/YYYY"
                        value={exp.startDate} 
                        onChange={(e) => updateExperience(index, 'startDate', e.target.value)} 
                      />
                      
                      <div className="flex flex-col">
                        <InputField 
                          label="End Date" 
                          type={exp.isCurrent ? 'text' : 'date'}
                          placeholder={exp.isCurrent ? 'Present' : 'MM/YYYY'}
                          value={exp.isCurrent ? 'Present' : exp.endDate} 
                          onChange={(e) => !exp.isCurrent && updateExperience(index, 'endDate', e.target.value)} 
                          disabled={exp.isCurrent}
                        />
                        <label className="flex items-center gap-2 mt-2 ml-0.5 cursor-pointer group/check w-max select-none">
                          <div className="relative flex items-center justify-center w-3.5 h-3.5">
                            <input 
                              type="checkbox" 
                              checked={exp.isCurrent} 
                              onChange={(e) => updateExperience(index, 'isCurrent', e.target.checked)} 
                              className="peer appearance-none w-3.5 h-3.5 border border-slate-300 rounded checked:bg-orange-500 checked:border-orange-500 transition-all cursor-pointer shadow-sm group-hover/check:border-orange-400" 
                            />
                            <svg className="absolute w-2.5 h-2.5 text-white pointer-events-none opacity-0 peer-checked:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3.5} d="M5 13l4 4L19 7" /></svg>
                          </div>
                          <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 group-hover/check:text-slate-600 transition-colors uppercase tracking-wider">Present</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Key Responsibilities & Achievements Textarea Container */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap ml-0.5 min-h-[26px]">
                      <label className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        Key Responsibilities / Achievements
                      </label>
                      
                      {/* AI Suggestions Trigger Button */}
                      {hasSuggestions && (
                         <button 
                            onClick={() => setActiveSuggestionIndex(index)}
                            className="text-[9px] sm:text-[10px] cursor-pointer font-extrabold flex items-center gap-1 py-0.5 px-2.5 rounded-full border border-indigo-200/80 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600 hover:from-indigo-100 hover:to-purple-100 shadow-[0_2px_8px_rgba(99,102,241,0.08)] transition-all shrink-0 animate-[pulse_2.5s_infinite_ease-in-out] group/sparkle active:scale-[0.96]"
                         >
                            <svg className="w-2.5 h-2.5 text-indigo-500 group-hover/sparkle:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                            </svg>
                            AI Suggestions
                         </button>
                      )}
                    </div>

                    {exp.achievements?.map((ach, aIndex) => (
                      <div key={aIndex} className="flex gap-2 items-start">
                        <div className="flex-1 relative">
                          <div className="absolute left-3 top-[15px] w-1.5 h-1.5 rounded-full bg-orange-400/80 shadow-[0_0_8px_rgba(251,146,60,0.6)]"></div>
                          <DebouncedTextArea
                            placeholder="Describe your structural metrics, impact, or key projects..."
                            value={ach}
                            onChange={(e) => handleAchievementChange(index, aIndex, e.target.value)}
                            className="w-full bg-slate-50/60 border border-slate-200 text-slate-700 rounded-xl pl-7 pr-3 py-2.5 h-[42px] min-h-[42px] text-xs sm:text-sm focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none shadow-sm transition-all resize-none leading-tight font-medium placeholder:text-slate-400 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                          />
                        </div>
                        
                        <button 
                          onClick={() => removeAchievement(index, aIndex)} 
                          className="text-slate-400 hover:text-red-500 hover:bg-red-50 cursor-pointer self-start p-2.5 rounded-xl border border-slate-100 hover:border-red-100 transition-all shadow-sm shrink-0" 
                          title="Remove bullet point"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    ))}
                    
                    <div className="flex flex-wrap items-center gap-2.5 pt-1">
                      <button 
                        onClick={() => addAchievement(index)} 
                        disabled={isAddAchievementDisabled}
                        className={`text-[10px] sm:text-xs font-bold cursor-pointer flex items-center gap-1.5 ml-0.5 py-1.5 px-3 rounded-lg border transition-all shadow-sm ${
                          isAddAchievementDisabled 
                            ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-60' 
                            : 'text-orange-600 hover:text-orange-700 bg-orange-50/50 hover:bg-orange-50 border-orange-200/60 active:scale-[0.98]'
                        }`}
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Bullet Point
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <button 
            onClick={addExperience} 
            className="mt-4 w-full py-2.5 cursor-pointer sm:py-3.5 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 hover:text-orange-600 hover:border-orange-300 hover:bg-orange-50/30 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.995]"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Add Another Role
          </button>
        </div>

{/* AI Suggestion Drawer Overlay */}
        {activeSuggestionIndex !== null && createPortal(
          <div className="fixed inset-0 z-[99999] flex justify-start font-['Outfit',_sans-serif]">
             <div 
               className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
               onClick={() => setActiveSuggestionIndex(null)}
             />
             
             <div className="relative w-[90%] sm:w-[480px] h-full bg-slate-50 border-r border-slate-200 shadow-2xl flex flex-col animate-in slide-in-from-left duration-300 ease-out z-[9999]">
               {/* Header */}
               <div className="flex items-center justify-between px-5 sm:px-6 py-4 bg-white border-b border-slate-200 shrink-0 shadow-[0_4px_12px_-4px_rgba(0,0,0,0.05)] relative z-10">
                  <div>
                    <h3 className="font-black text-slate-800 text-lg flex items-center gap-2">
                       <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                       </svg>
                       Tailored Suggestions
                    </h3>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                       For <span className="text-slate-600">{activeExp?.role || 'this role'}</span>
                    </p>
                  </div>
                  <button 
                    onClick={() => setActiveSuggestionIndex(null)}
                    className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors active:scale-95"
                  >
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                     </svg>
                  </button>
               </div>

               {/* Suggestions List Content */}
               <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                 {activeVisibleSuggestions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center px-4 mt-12 opacity-80">
                      <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="text-sm font-bold text-slate-600 mb-1">You've added all suggestions!</p>
                      <p className="text-xs text-slate-400">Great job building out your experience.</p>
                    </div>
                 ) : (
                    activeVisibleSuggestions.map((ach, idx) => (
                      <div 
                        key={idx} 
                        className="group flex items-start gap-3 p-4 bg-white border border-slate-200 hover:border-indigo-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
                        onClick={() => handleAddSuggestedAchievement(activeSuggestionIndex, ach)}
                      >
                         <button className="shrink-0 mt-0.5 p-1 text-slate-300 group-hover:text-white group-hover:bg-indigo-500 rounded-lg border border-slate-200 group-hover:border-indigo-500 transition-colors shadow-sm active:scale-95">
                           <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                           </svg>
                         </button>
                         <p className="text-xs sm:text-sm text-slate-600 group-hover:text-slate-800 leading-relaxed font-medium">
                           {ach}
                         </p>
                      </div>
                    ))
                 )}
               </div>

               {/* --- DONE BUTTON FOOTER --- */}
               <div className="p-4 sm:p-5 border-t border-slate-200/80 bg-slate-50 shrink-0 z-20 relative">
                  <button 
                     onClick={() => setActiveSuggestionIndex(null)}
                     className="w-full py-2.5 bg-white cursor-pointer border border-slate-200 text-slate-600 font-bold text-xs rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm active:scale-[0.98]"
                  >
                     Done
                  </button>
               </div>
             </div>
          </div>,
          document.body
        )}
        {/* Fixed Bottom Action Navigation Bar */}
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
            {nextLabel || "Next: Education"}
          </button>
        </div>
      </div>
    </>
  );
}