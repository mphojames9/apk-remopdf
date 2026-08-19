import React from 'react';

const features = [
  {
    icon: "fa-shield-halved",
    title: "Zero-Retention Security",
    description: "Your data remains strictly yours. Our architecture ensures all uploaded files are permanently and automatically wiped from our servers the moment your task is complete.",
    delay: "delay-100"
  },
  {
    icon: "fa-wand-magic-sparkles",
    title: "Format Preservation",
    description: "Convert PDFs to Word or Excel without the layout collapsing. Complex tables, custom fonts, and delicate margins stay perfectly intact, exactly as intended.",
    delay: "delay-200"
  },
  {
    icon: "fa-gauge-high",
    title: "Blazing Fast Engine",
    description: "No bloated software installations or lengthy processing queues. Our streamlined cloud architecture processes heavyweight documents and delivers polished results in seconds.",
    delay: "delay-300"
  }
];

const WhyChooseUs = () => {
  return (
    <section className="relative w-full py-20 sm:py-28 lg:py-32 px-4 sm:px-6 bg-white overflow-hidden selection:bg-amber-100 selection:text-amber-900">
      
      {/* Subtle Ambient Background Mesh */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-slate-50 to-transparent rounded-full blur-[100px] pointer-events-none z-0"></div>

      <div className="relative z-10 max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16 sm:mb-20 animate-in fade-in slide-in-from-bottom-6 duration-1000 fill-mode-both">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-5 text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase text-slate-500 bg-slate-50 border border-slate-200/60 rounded-full">
            The RemoPDF Standard
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-slate-900 tracking-tight leading-[1.2] mb-6">
            Engineered for absolute{' '}
            <span className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 drop-shadow-sm">
              precision.
            </span>
          </h2>
          
          <p className="text-sm sm:text-base text-slate-500 font-normal leading-relaxed max-w-2xl">
            We built RemoPDF to eliminate the friction of document management. Experience a suite of tools where bank-grade security, uncompromising speed, and seamless design converge.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
          {features.map((feature, index) => (
            <article 
              key={index} 
              className={`group relative p-8 sm:p-10 rounded-[2.5rem] bg-slate-50/50 hover:bg-white border border-slate-100 hover:border-amber-100 shadow-[0_8px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_50px_-10px_rgba(245,158,11,0.15)] transition-all duration-500 ease-out flex flex-col items-center md:items-start text-center md:text-left animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both ${feature.delay}`}
            >
              
              {/* Premium Icon Container */}
              <div className="relative w-14 h-14 mb-8">
                {/* Ambient Hover Glow behind icon */}
                <div className="absolute inset-0 bg-amber-400 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
                
                {/* Solid Icon Box */}
                <div className="relative w-full h-full bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center justify-center text-2xl text-slate-400 group-hover:text-amber-500 group-hover:border-amber-200 group-hover:scale-110 transition-all duration-500 z-10">
                  <i className={`fa-solid ${feature.icon}`}></i>
                </div>
              </div>

              {/* Card Content */}
              <h3 className="text-xl font-semibold text-slate-900 tracking-tight mb-4 group-hover:text-amber-600 transition-colors duration-300">
                {feature.title}
              </h3>
              
              <p className="text-sm text-slate-500 leading-relaxed font-medium">
                {feature.description}
              </p>

            </article>
          ))}
        </div>

      </div>
    </section>
  );
};

export default WhyChooseUs;