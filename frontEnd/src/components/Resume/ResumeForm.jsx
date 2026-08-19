import React, { useState, useEffect } from 'react';
import PersonalInfo from './Sections/PersonalInfo';
import ExperienceField from './Sections/ExperienceField';
import EducationField from './Sections/EducationField';
import SkillsField from './Sections/SkillsField';
import CertificatesField from './Sections/CertificatesField';
import ProjectsField from './Sections/ProjectsField';
import LanguagesField from './Sections/LanguagesField';
import HobbiesField from './Sections/HobbiesField';
import ReferencesField from './Sections/ReferencesField';
import { createPortal } from 'react-dom';
import '../../pages/Home.css'

const SECTIONS_LIST = [
  { id: 1, title: 'Personal Information' },
  { id: 2, title: 'Experience' },
  { id: 3, title: 'Education' },
  { id: 4, title: 'Skills' },
  { id: 5, title: 'Certifications' },
  { id: 6, title: 'Projects' },
  { id: 7, title: 'Languages' },
  { id: 8, title: 'Hobbies' },
  { id: 9, title: 'References' },
];

export default function ResumeForm({ data, setData, onExport, onPreview, onOpenTemplateModal, externalSuccessTrigger }) {
  // 1. Initialize from local storage, defaulting to step 1
  const [currentStep, setCurrentStep] = useState(() => {
    const savedStep = localStorage.getItem('remo_premium_current_step');
    return savedStep ? parseInt(savedStep, 10) : 1;
  });

  const [hasCompleted, setHasCompleted] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // 2. Save step progress to local storage whenever currentStep changes
  useEffect(() => {
    localStorage.setItem('remo_premium_current_step', currentStep.toString());
  }, [currentStep]);

  // 3. AUTO-SAVE: Save the entire resume data state to local storage whenever it changes
  // CRITICAL FIX: Debounced by 800ms to prevent input lag during typing
  useEffect(() => {
    if (data) {
      const autoSaveTimer = setTimeout(() => {
        localStorage.setItem('remo_premium_resume_data', JSON.stringify(data));
      }, 800); 
      
      return () => clearTimeout(autoSaveTimer);
    }
  }, [data]);

  // Listen for external trigger to open the success modal with a 1-second delay
  useEffect(() => {
    if (externalSuccessTrigger > 0) {
      setShowModal(true);
    }
  }, [externalSuccessTrigger]);

  const handleNext = () => {
    if (currentStep === 9 || hasCompleted) {
      setHasCompleted(true);
      
      // Check local storage for the trace
      const hasPromptedTemplate = 'true' //localStorage.getItem('remo_template_prompted');
   
      
      if (!hasPromptedTemplate) {
        // First time finishing: set the trace and trigger the Template Modal
        localStorage.setItem('remo_template_prompted', 'true');
        if (onOpenTemplateModal) onOpenTemplateModal();
      } else {
        // Subsequent times: safely open your standard success modal
        setShowModal(true);
      }
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const jumpToSection = (stepId) => {
    setCurrentStep(stepId);
    setShowModal(false); 
  };

  const nextBtnLabel = hasCompleted ? "Finish Editing" : "Next";

  return (
    <div className="p-4 sm:p-8 lg:p-12 h-full flex flex-col relative">
      
      {/* PROGRESS INDICATOR */}
      <div className="flex items-center gap-2 mb-2 sm:mb-1 sticky top-0 bg-white z-10 py-6">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((step) => (
          <div 
            key={step} 
            className={`radius h-1.5 flex-1 rounded-full transition-colors duration-300 ${currentStep >= step ? 'bg-orange-500' : 'bg-slate-200'}`}
          ></div>
        ))}
      </div>

      {/* DYNAMIC CONTENT ROUTER */}
      <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar pb-0">
        {currentStep === 1 && <PersonalInfo data={data} setData={setData} onNext={handleNext} nextLabel={nextBtnLabel} />}
        {currentStep === 2 && <ExperienceField data={data} setData={setData} onNext={handleNext} onPrev={() => setCurrentStep(1)} nextLabel={nextBtnLabel} />}
        {currentStep === 3 && <EducationField data={data} setData={setData} onNext={handleNext} onPrev={() => setCurrentStep(2)} nextLabel={nextBtnLabel} />}
        {currentStep === 4 && <SkillsField data={data} setData={setData} onNext={handleNext} onPrev={() => setCurrentStep(3)} nextLabel={nextBtnLabel} />}
        {currentStep === 5 && <CertificatesField data={data} setData={setData} onNext={handleNext} onPrev={() => setCurrentStep(4)} nextLabel={nextBtnLabel} />}
        {currentStep === 6 && <ProjectsField data={data} setData={setData} onNext={handleNext} onPrev={() => setCurrentStep(5)} nextLabel={nextBtnLabel} />}
        {currentStep === 7 && <LanguagesField data={data} setData={setData} onNext={handleNext} onPrev={() => setCurrentStep(6)} nextLabel={nextBtnLabel} />}
        {currentStep === 8 && <HobbiesField data={data} setData={setData} onNext={handleNext} onPrev={() => setCurrentStep(7)} nextLabel={nextBtnLabel} />}
        {currentStep === 9 && <ReferencesField data={data} setData={setData} onNext={handleNext} onPrev={() => setCurrentStep(8)} nextLabel={hasCompleted ? "Finish Editing" : "Finish Resume"} />}
      </div>

      {/* PREMIUM SUCCESS MODAL (With Parent Overlay click dismiss) */}
      {showModal && createPortal(
        <div 
          onClick={() => setShowModal(false)}
          className="fixed inset-0 z-[99999] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center sm:p-6 animate-fade-in"
        >
          {/* MODAL CONTAINER */}
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-2xl sm:rounded-3xl flex flex-col sm:shadow-2xl overflow-hidden relative border-0 sm:border sm:border-slate-100"
          >
            {/* Subtle Top Accent Line */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-orange-400 to-orange-500" />

            {/* Close Button */}
            <button 
              onClick={() => setShowModal(false)} 
              className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-full bg-slate-50 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all z-10"
              aria-label="Close modal"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            {/* Header Section */}
            <div className="pt-14 sm:pt-16 pb-6 px-6 sm:px-10 text-center relative shrink-0">
              {/* Compact Success Icon */}
              <div className="ss w-14 h-14 mx-auto mb-5 relative flex items-center justify-center rounded-full bg-orange-50 text-orange-500 ring-4 ring-white shadow-sm">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
              </div>

              <h2 className="ss text-2xl sm:text-3xl font-extrabold text-slate-800 mb-2 tracking-tight">
                Download or Continue Editing...
              </h2>
              <p className="text-slate-500 text-sm font-medium max-w-sm mx-auto">
                Preview the final result, download it, or fine-tune specific sections below.
              </p>
            </div>

            {/* Primary Actions */}
            <div className="px-6 sm:px-10 pb-6 flex flex-col sm:flex-row gap-3 shrink-0 relative z-0 border-b border-slate-100">
              <button 
                onClick={onPreview} 
                className="flex-1 group px-5 py-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:border-slate-300 text-slate-700 font-semibold flex items-center justify-center gap-2.5 transition-all"
              >
                <svg className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                Preview Full A4
              </button>
              
              <button 
                onClick={onExport} 
                className="flex-1 group px-5 py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold flex items-center justify-center gap-2.5 transition-all shadow-[0_4px_14px_0_rgba(249,115,22,0.3)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.4)] hover:-translate-y-0.5"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                Download PDF
              </button>
            </div>

            {/* Quick Section Jump List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/50 p-6 sm:p-10">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Fine-Tune Sections</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pb-8 sm:pb-0">
                {SECTIONS_LIST.map(sec => (
                  <button 
                    key={sec.id}
                    onClick={() => jumpToSection(sec.id)}
                    className="group flex items-center justify-between p-3.5 bg-white rounded-xl border border-slate-200 hover:border-orange-300 hover:shadow-sm text-left transition-all duration-200"
                  >
                    <span className="text-sm font-semibold text-slate-600 group-hover:text-orange-600 transition-colors">{sec.title}</span>
                    <svg className="w-4 h-4 text-slate-300 group-hover:text-orange-500 group-hover:translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}