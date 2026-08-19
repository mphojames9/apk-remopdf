import React, { useState, useEffect, useRef } from 'react';
import './Sections.css';

// Premium Standardized Debounced InputField (Fixed Dropped Keystrokes)
const InputField = ({ label, placeholder, value, onChange, onBlur, type = "text", disabled = false }) => {
  const [localValue, setLocalValue] = useState(value || '');
  const [isFocused, setIsFocused] = useState(false);
  const onChangeRef = useRef(onChange);

  // Keep ref updated
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // ONLY sync from parent if the user is NOT actively typing in this field
  useEffect(() => {
    if (!isFocused) {
      setLocalValue(value || '');
    }
  }, [value, isFocused]);

  const handleChange = (e) => setLocalValue(e.target.value);
  const handleFocus = () => setIsFocused(true);
  
  const handleBlur = (e) => {
    setIsFocused(false);
    onChangeRef.current({ target: { value: localValue } });
    if (onBlur) onBlur(e);
  };

  // Debounce the parent update
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isFocused) {
        onChangeRef.current({ target: { value: localValue } });
      }
    }, 400); // Slightly relaxed to 400ms for smoother fast-typing
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

export default function ReferencesField({ data, setData, onNext, onPrev, nextLabel }) {
  const references = data.references === undefined || data.references.length === 0
    ? [{ id: 'default-ref', name: '', role: '', company: '', contact: '' }]
    : data.references;

  const handleUpdate = (index, field, value) => {
    const updated = [...references];
    updated[index][field] = value;
    setData(prev => ({ ...prev, references: updated }));
  };

  const handleAdd = () => {
    setData(prev => ({
      ...prev,
      references: [...references, { id: Date.now(), name: '', role: '', company: '', contact: '' }]
    }));
  };

  const handleRemove = (indexToRemove) => {
    const newRef = references.filter((_, i) => i !== indexToRemove);
    setData(prev => ({ 
      ...prev, 
      references: newRef.length > 0 ? newRef : [{ id: 'default-ref', name: '', role: '', company: '', contact: '' }] 
    }));
  };

  return (
    <div className="w-full max-w-3xl mx-auto font-['Outfit',_sans-serif] animate-fade-in px-3 sm:px-6 h-[80vh] min-w-[320px] flex flex-col overflow-hidden bg-white selection:bg-orange-100 selection:text-orange-800">
      
      {/* Scrollable Form Content */}
      <div className="flex-1 overflow-y-auto pr-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pb-4 pt-3">
        <div className="mb-4 sm:mb-6">
          <span className="radius inline-block text-orange-600 text-[9px] font-bold uppercase tracking-widest bg-orange-50 border border-orange-100 px-2.5 py-0.5 rounded-full mb-1.5">
            Section 9
          </span>
          <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
            Professional References
          </h2>
          <p className="text-[11px] sm:text-sm text-slate-400 font-medium mt-0.5">
            Add professional contacts who can vouch for your work performance and character.
          </p>
        </div>

        <div className="space-y-5 sm:space-y-6">
          {references.map((ref, index) => (
            <div key={ref.id || index} className="p-3.5 sm:p-5 bg-white border border-slate-100 shadow-[0_4px_20px_-4px_rgba(148,163,184,0.12)] rounded-2xl relative group/card hover:border-slate-200 hover:shadow-[0_4px_24px_-2px_rgba(148,163,184,0.16)] transition-all duration-300">
              
              <div className="flex justify-between items-center mb-3 sm:mb-0 sm:absolute sm:top-3.5 sm:right-3.5 w-full sm:w-auto">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider sm:hidden">
                  Reference #{index + 1}
                </span>
                {references.length > 1 && (
                  <button 
                    onClick={() => handleRemove(index)} 
                    className="text-slate-400 hover:text-red-500 cursor-pointer hover:bg-red-50 p-1.5 transition-all duration-200 flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider"
                    title="Remove Reference"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                <InputField 
                  label="Reference Name" 
                  placeholder="e.g. John Doe" 
                  value={ref.name} 
                  onChange={(e) => handleUpdate(index, 'name', e.target.value)} 
                />
                <InputField 
                  label="Job Title / Role" 
                  placeholder="e.g. Engineering Manager" 
                  value={ref.role} 
                  onChange={(e) => handleUpdate(index, 'role', e.target.value)} 
                />
                <InputField 
                  label="Company" 
                  placeholder="e.g. Acme Corp" 
                  value={ref.company} 
                  onChange={(e) => handleUpdate(index, 'company', e.target.value)} 
                />
                <InputField 
                  label="Contact Information" 
                  placeholder="e.g. email@example.com / +2772 123 4567" 
                  value={ref.contact} 
                  onChange={(e) => handleUpdate(index, 'contact', e.target.value)} 
                />
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={handleAdd} 
          className="mt-4 w-full py-2.5 sm:py-3.5 cursor-pointer border-2 border-dashed border-slate-200 rounded-xl text-slate-400 hover:text-orange-600 hover:border-orange-300 hover:bg-orange-50/30 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.995]"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          Add Another Reference
        </button>
      </div>
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
          {nextLabel || "Done"}
        </button>
      </div>
    </div>
  );
}