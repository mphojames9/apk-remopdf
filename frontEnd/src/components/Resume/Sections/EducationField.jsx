import React, { useState, useEffect, useRef } from 'react';
import './Sections.css';

// Premium Standardized InputField (Debounced & Locked)
const InputField = ({ label, placeholder, value, onChange, onBlur, type = "text", disabled = false }) => {
  const [localValue, setLocalValue] = useState(value || '');
  const [isFocused, setIsFocused] = useState(false);
  const onChangeRef = useRef(onChange);

  useEffect(() => { onChangeRef.current = onChange; }, [onChange]);
  
  useEffect(() => { 
    if (!isFocused) setLocalValue(value || ''); 
  }, [value, isFocused]);

  const handleChange = (e) => setLocalValue(e.target.value);
  const handleFocus = () => setIsFocused(true);
  
  const handleBlur = (e) => {
    setIsFocused(false);
    onChangeRef.current({ target: { value: localValue } });
    if (onBlur) onBlur(e);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isFocused) onChangeRef.current({ target: { value: localValue } });
    }, 400);
    return () => clearTimeout(timeout);
  }, [localValue, isFocused]);

  return (
    <div className="flex flex-col group w-full">
      <label className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-0.5 transition-colors group-focus-within:text-orange-500">
        {label}
      </label>
      <div className="relative w-full">
        <input 
          type={type}
          placeholder={placeholder} 
          value={localValue} 
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          className={`w-full border rounded-xl px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm outline-none shadow-sm transition-all font-medium placeholder:text-slate-400 ${
            disabled 
              ? 'bg-slate-100/50 border-slate-200/60 text-slate-400 cursor-not-allowed' 
              : 'bg-slate-50/60 border-slate-200 text-slate-800 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10'
          }`} 
        />
      </div>
    </div>
  );
};

// Premium Standardized TextAreaField (Debounced & Locked)
const TextAreaField = ({ label, placeholder, value, onChange, rows = 2 }) => {
  const [localValue, setLocalValue] = useState(value || '');
  const [isFocused, setIsFocused] = useState(false);
  const onChangeRef = useRef(onChange);

  useEffect(() => { onChangeRef.current = onChange; }, [onChange]);
  
  useEffect(() => { 
    if (!isFocused) setLocalValue(value || ''); 
  }, [value, isFocused]);

  const handleChange = (e) => setLocalValue(e.target.value);
  const handleFocus = () => setIsFocused(true);
  
  const handleBlur = () => {
    setIsFocused(false);
    onChangeRef.current({ target: { value: localValue } });
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isFocused) onChangeRef.current({ target: { value: localValue } });
    }, 400);
    return () => clearTimeout(timeout);
  }, [localValue, isFocused]);

  return (
    <div className="flex flex-col group w-full mt-1">
      <label className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-0.5 transition-colors group-focus-within:text-orange-500">
        {label}
      </label>
      <div className="relative w-full">
        <textarea
          rows={rows}
          placeholder={placeholder}
          value={localValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="w-full bg-slate-50/60 border border-slate-200 text-slate-700 rounded-xl px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none shadow-sm transition-all resize-none leading-relaxed font-medium placeholder:text-slate-400"
        />
      </div>
    </div>
  );
};

export default function EducationField({ data, setData, onNext, onPrev, nextLabel }) {
  const education = data.education?.length > 0 
    ? data.education 
    : [{ id: 'default-edu', degree: '', school: '', startDate: '', endDate: '', isCurrent: false, description: '' }];

  const handleUpdate = (index, field, value) => {
    const updated = education.map((edu, i) => {
      if (i === index) {
        const newEdu = { ...edu, [field]: value };
        if (field === 'isCurrent' && value === true) {
          newEdu.endDate = '';
        }
        return newEdu;
      }
      return edu;
    });
    setData(prev => ({ ...prev, education: updated }));
  };

  const handleAdd = () => {
    setData(prev => ({ 
      ...prev, 
      education: [
        ...(prev.education || []), 
        { id: Date.now(), degree: '', school: '', startDate: '', endDate: '', isCurrent: false, description: '' }
      ] 
    }));
  };

  const handleRemove = (indexToRemove) => {
    const updated = education.filter((_, i) => i !== indexToRemove);
    setData(prev => ({ ...prev, education: updated }));
  };

  const lastEdu = education[education.length - 1];
  const isAddDisabled = education.length > 0 && (!lastEdu?.degree?.trim() || !lastEdu?.school?.trim());

  return (
    <div className="w-full max-w-3xl mx-auto font-['Outfit',_sans-serif] animate-fade-in px-3 sm:px-6 h-[80vh] min-w-[320px] flex flex-col overflow-hidden bg-white selection:bg-orange-100 selection:text-orange-800">
      
      <div className="flex-1 overflow-y-auto pr-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pb-4 pt-3">
        <div className="mb-4 sm:mb-6">
          <span className="radius inline-block text-orange-600 text-[9px] font-bold uppercase tracking-widest bg-orange-50 border border-orange-100 px-2.5 py-0.5 rounded-full mb-1.5">
            Section 3
          </span>
          <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
            Education Details
          </h2>
          <p className="text-[11px] sm:text-sm text-slate-400 font-medium mt-0.5">
            Include your academic background, relevant coursework, and honors.
          </p>
        </div>

        <div className="space-y-5 sm:space-y-6">
          {education.map((edu, index) => (
            <div key={edu.id || index} className="p-3.5 sm:p-5 bg-white border border-slate-100 shadow-[0_4px_20px_-4px_rgba(148,163,184,0.12)] rounded-2xl relative group/card hover:border-slate-200 hover:shadow-[0_4px_24px_-2px_rgba(148,163,184,0.16)] transition-all duration-300">
              
              <div className="flex justify-between items-center mb-3 sm:mb-0 sm:absolute sm:top-3.5 sm:right-3.5 w-full sm:w-auto">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider sm:hidden">
                  Education #{index + 1}
                </span>
                {education.length > 1 && (
                  <button 
                    onClick={() => handleRemove(index)} 
                    className="text-slate-400 cursor-pointer hover:text-red-500 hover:bg-red-50 p-1.5 rounded-xl  hover:border-red-100  transition-all duration-200 flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider"
                    title="Remove Education"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 mb-4 mt-1">
                <InputField 
                  label="Degree / Certificate" 
                  placeholder="e.g. B.S. Computer Science" 
                  value={edu.degree} 
                  onChange={(e) => handleUpdate(index, 'degree', e.target.value)} 
                />
                <InputField 
                  label="Institution" 
                  placeholder="e.g. Stanford University" 
                  value={edu.school} 
                  onChange={(e) => handleUpdate(index, 'school', e.target.value)} 
                />
                
                <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:col-span-2">
                  <InputField 
                    label="Start Date" 
                    type="month"
                    placeholder="MM/YYYY" 
                    value={edu.startDate} 
                    onChange={(e) => handleUpdate(index, 'startDate', e.target.value)} 
                  />
                  <div className="flex flex-col">
                    <InputField 
                      label="End Date" 
                      type="month"
                      placeholder="MM/YYYY" 
                      value={edu.isCurrent ? '' : edu.endDate} 
                      disabled={edu.isCurrent}
                      onChange={(e) => !edu.isCurrent && handleUpdate(index, 'endDate', e.target.value)} 
                    />
                    <label className="flex items-center gap-2 mt-2 ml-0.5 cursor-pointer group/check w-max select-none">
                      <div className="relative flex items-center justify-center w-3.5 h-3.5">
                        <input 
                          type="checkbox" 
                          checked={edu.isCurrent || false} 
                          onChange={(e) => handleUpdate(index, 'isCurrent', e.target.checked)} 
                          className="peer appearance-none w-3.5 h-3.5 border border-slate-300 rounded checked:bg-orange-500 checked:border-orange-500 transition-all cursor-pointer shadow-sm group-hover/check:border-orange-400" 
                        />
                        <svg className="absolute w-2.5 h-2.5 text-white pointer-events-none opacity-0 peer-checked:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3.5} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 group-hover/check:text-slate-600 transition-colors uppercase tracking-wider">
                        Current
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <TextAreaField 
                label="Description / Honors (Optional)" 
                placeholder="List relevant coursework, honors, GPA, or extracurricular activities..." 
                value={edu.description || ''} 
                onChange={(e) => handleUpdate(index, 'description', e.target.value)} 
              />
            </div>
          ))}
        </div>

        <button 
          onClick={handleAdd} 
          disabled={isAddDisabled}
          className={`mt-4 w-full cursor-pointer py-2.5 sm:py-3.5 border-2 border-dashed rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200 ${
            isAddDisabled 
              ? 'border-slate-200 text-slate-300 bg-slate-50/50 cursor-not-allowed' 
              : 'border-slate-200 text-slate-400 hover:text-orange-600 hover:border-orange-300 hover:bg-orange-50/30 active:scale-[0.995]'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          {isAddDisabled ? 'Fill current details to add another' : 'Add Education'}
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
          {nextLabel || "Next: Skills"}
        </button>
      </div>
    </div>
  );
}