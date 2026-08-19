import React from 'react';
import officeImage from '../assets/office.png';
import { Link } from 'react-router-dom';

const ExecutiveFeatureSection = ({ onNavigate }) => {
  return (
    <section className="w-full max-w-7xl mx-auto px-6 py-16 sm:py-24 lg:py-28 font-sans selection:bg-amber-100 selection:text-amber-900">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        
        {/* Left Column: Image Container (Mirrors layout in image_cf9742.jpg with Premium Polish) */}
        <div className="w-full flex justify-center order-2 lg:order-1 animate-in fade-in slide-in-from-left-8 duration-1000 ease-out">
          <div className="relative w-full max-w-md lg:max-w-xl aspect-square rounded-[2.5rem] p-3 bg-slate-50 border border-slate-100/80 shadow-[0_4px_30px_rgba(0,0,0,0.01)] group">
            
            {/* Elegant Inner Frame for a Native Desktop App feel */}
            <div className="relative w-full h-full rounded-[1.8rem] overflow-hidden shadow-[0_20px_50px_rgba(15,23,42,0.06)] border border-white">
              {/* Soft Gradient Mask overlaying the image */}
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/20 via-transparent to-white/10 opacity-80 z-10 pointer-events-none"></div>
              
              <img 
                src={officeImage} 
                alt="Refined contemporary workspace" 
                className="w-full h-full object-cover object-center transform group-hover:scale-[1.03] transition-transform duration-[1200ms] ease-out"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Original, High-Conversion Premium Typography */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left order-1 lg:order-2 max-w-2xl mx-auto lg:mx-0 animate-in fade-in slide-in-from-right-8 duration-1000 delay-100 fill-mode-both">
          
          {/* Subtle Micro-Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-5 text-[10px] sm:text-xs font-bold tracking-[0.15em] uppercase text-amber-600 bg-amber-50/50 border border-amber-200/40 rounded-full">
            Uncompromising Standards
          </div>

          {/* Elegant Heading (No chunky font-black) */}
          <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-light text-slate-900 tracking-tight leading-[1.2] lg:leading-[1.15] mb-6">
            Distinguish your professional profile.{' '}
            <span className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 drop-shadow-sm">
              Command attention.
            </span>
          </h2>

          {/* Bespoke Copy description */}
          <p className="text-sm sm:text-base text-slate-500 font-normal leading-relaxed mb-8 sm:mb-10 max-w-[90%] sm:max-w-xl lg:max-w-none">
            In a sea of standardized text, presentation is your ultimate competitive edge. 
            RemoPDF pairs your career milestones with sophisticated, clean presentation layouts 
            optimized for both automated screening architectures and manual human reviews. 
            Effortless customization, absolute layout precision.
          </p>

          {/* Premium Call-to-Action Interactive Element */}
          <div className="flex flex-col items-center lg:items-start gap-3 w-full sm:w-auto">
  <Link 
    to="/ResumeBuilder" 
    onClick={onNavigate} 
    className="relative w-full sm:w-auto h-12 sm:h-14 px-10 rounded-full bg-slate-900 text-white text-sm font-semibold shadow-[0_15px_35px_-10px_rgba(15,23,42,0.3)] hover:shadow-[0_20px_40px_-5px_rgba(15,23,42,0.4)] hover:-translate-y-0.5 transition-all duration-300 overflow-hidden group flex items-center justify-center"
  >
    {/* Shimmering highlight effect */}
    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] skew-x-[-20deg]"></div>
    
    <span className="relative z-10 flex items-center justify-center gap-2.5 whitespace-nowrap">
      Begin Transformation 
      <i className="fa-solid fa-arrow-right-long text-amber-400 group-hover:translate-x-1.5 transition-transform duration-300"></i>
    </span>
  </Link>
  
  <span className="text-[10px] font-medium tracking-wide text-slate-400">
    Polished results in under 5 minutes
  </span>
</div>



        </div>

      </div>
    </section>
  );
};

export default ExecutiveFeatureSection;