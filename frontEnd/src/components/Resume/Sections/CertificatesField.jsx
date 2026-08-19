import React, { useState, useEffect, memo } from 'react';
import './Sections.css';

// Fixed Input Component - avoids dropping keystrokes while typing
const InputField = memo(({ label, placeholder, value, onChange, type = "text" }) => {
  const [localVal, setLocalVal] = useState(value || '');
  const [isFocused, setIsFocused] = useState(false);

  // Sync from parent ONLY when not actively typing
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
    <div className="flex flex-col group w-full">
      <label className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 ml-0.5 transition-colors group-focus-within:text-orange-500">
        {label}
      </label>
      <div className="relative w-full">
        <input 
          type={type}
          placeholder={placeholder} 
          value={localVal} 
          onChange={(e) => setLocalVal(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          className="w-full bg-slate-50/60 border border-slate-200 text-slate-800 rounded-xl px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none shadow-sm transition-all placeholder:text-slate-400 font-medium" 
        />
      </div>
    </div>
  );
});

// Fixed Textarea Component
const TextAreaField = memo(({ label, placeholder, value, onChange, rows = 2 }) => {
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
    <div className="flex flex-col group space-y-2.5">
      {label && (
        <label className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-0.5 block">
          {label}
        </label>
      )}
      <textarea
        rows={rows}
        placeholder={placeholder}
        value={localVal}
        onChange={(e) => setLocalVal(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={handleBlur}
        className="w-full bg-slate-50/60 border border-slate-200 text-slate-700 rounded-xl px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none shadow-sm transition-all resize-none leading-relaxed font-medium placeholder:text-slate-400"
      />
    </div>
  );
});

export default function CertificatesField({ data, setData, onPrev, onNext, nextLabel }) {
  const certificates = data.certificates?.length > 0 
    ? data.certificates 
    : [{ id: Date.now(), title: '', issuer: '', date: '', description: '' }];

  const handleUpdate = (index, field, value) => {
    const updated = certificates.map((cert, i) => 
      i === index ? { ...cert, [field]: value } : cert
    );
    setData(prev => ({ ...prev, certificates: updated }));
  };

  const handleAdd = () => {
    setData(prev => ({ 
      ...prev, 
      certificates: [...certificates, { id: Date.now(), title: '', issuer: '', date: '', description: '' }] 
    }));
  };

  const handleRemove = (indexToRemove) => {
    setData(prev => ({ 
      ...prev, 
      certificates: certificates.filter((_, i) => i !== indexToRemove) 
    }));
  };

  const isAddDisabled = certificates.length > 0 && (!certificates[certificates.length - 1].title.trim());

  return (
    <div className="w-full max-w-3xl mx-auto font-['Outfit',_sans-serif] animate-fade-in px-3 sm:px-6 h-[80vh] min-w-[320px] flex flex-col overflow-hidden bg-white selection:bg-orange-100 selection:text-orange-800">
      
      {/* Scrollable Form Content */}
      <div className="flex-1 overflow-y-auto pr-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pb-4 pt-3">
        <div className="mb-4 sm:mb-6">
          <span className="radius inline-block text-orange-600 text-[9px] font-bold uppercase tracking-widest bg-orange-50 border border-orange-100 px-2.5 py-0.5 rounded-full mb-1.5">
            Section 5
          </span>
          <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">Certifications</h2>
          <p className="text-[11px] sm:text-sm text-slate-400 font-medium mt-0.5">Add relevant professional certifications or licenses.</p>
        </div>

        <div className="space-y-5 sm:space-y-6">
          {certificates.map((cert, index) => (
            <div key={cert.id || index} className="p-3.5 sm:p-5 bg-white border border-slate-100 shadow-[0_4px_20px_-4px_rgba(148,163,184,0.12)] rounded-2xl relative group/card hover:border-slate-200 hover:shadow-[0_4px_24px_-2px_rgba(148,163,184,0.16)] transition-all duration-300">
              
              <div className="flex justify-between items-center mb-3 sm:mb-0 sm:absolute sm:top-3.5 sm:right-3.5 w-full sm:w-auto">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider sm:hidden">
                  Certificate #{index + 1}
                </span>
                <button 
                  onClick={() => handleRemove(index)} 
                  className="text-slate-400 cursor-pointer hover:text-red-500 hover:bg-red-50 p-1.5 rounded-xl border border-transparent hover:border-red-10  transition-all duration-200 flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider"
                  title="Remove Certificate"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4 mb-4 mt-1">
                <InputField label="Certificate Title" placeholder="e.g. AWS Certified Architect" value={cert.title} onChange={(e) => handleUpdate(index, 'title', e.target.value)} />
                <InputField label="Issuing Organization" placeholder="e.g. Amazon Web Services" value={cert.issuer} onChange={(e) => handleUpdate(index, 'issuer', e.target.value)} />
                <div className="md:col-span-2">
                  <InputField label="Date Issued" placeholder="Select Date" type="month" value={cert.date} onChange={(e) => handleUpdate(index, 'date', e.target.value)} />
                </div>
              </div>
              
              <TextAreaField
                label="Description / Skills Gained (Optional)"
                placeholder="Briefly describe what this certification covered..."
                value={cert.description || ''}
                onChange={(e) => handleUpdate(index, 'description', e.target.value)}
                rows={2}
              />
            </div>
          ))}
        </div>

        <button 
          onClick={handleAdd} 
          disabled={isAddDisabled} 
          className={`mt-4 w-full py-2.5 sm:py-3.5 border-2 cursor-pointer border-dashed rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.995] ${isAddDisabled ? 'border-slate-200 text-slate-400 bg-slate-50 cursor-not-allowed opacity-70' : 'border-slate-200 text-slate-400 hover:text-orange-600 hover:border-orange-300 hover:bg-orange-50/30'}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg> 
          {isAddDisabled ? 'Fill details to add another' : 'Add Certificate'}
        </button>
      </div>
      {/* Fixed Bottom Action Navigation Bar */}
      <div className="border-t border-slate-100 pt-3 pb-4 flex justify-between items-center gap-3 bg-white shrink-0">
        <button 
          onClick={onPrev} 
          className="px-3.5 sm:px-5 py-2.5 border border-slate-200 cursor-pointer text-slate-500 font-bold rounded-xl hover:border-slate-300 hover:text-slate-700 hover:bg-slate-50/80 transition-all flex items-center gap-1.5 text-xs sm:text-sm"
        >
          <svg className="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        
        <button 
          onClick={onNext} 
          className="px-4 sm:px-7 py-2.5 bg-gradient-to-r from-red-500 to-orange-500 cursor-pointer hover:from-red-600 hover:to-orange-600 text-white font-bold rounded-xl shadow-[0_4px_14px_rgba(249,115,22,0.3)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.4)] transition-all flex items-center gap-1.5 text-xs sm:text-sm tracking-wide active:scale-[0.98]"
        >
          {nextLabel || "Next: Projects"}
        </button>
      </div>
    </div>
  );
}