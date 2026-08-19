import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

// --- Configuration & Data ---
const LEGAL_SECTIONS = [
  { id: 'zero-knowledge', title: 'Zero-Knowledge', icon: 'fa-eye-slash' },
  { id: 'document-handling', title: 'Ephemerality', icon: 'fa-file-shield' },
  { id: 'transit-security', title: 'Security', icon: 'fa-lock' },
  { id: 'infrastructure', title: 'Infrastructure', icon: 'fa-server' },
  { id: 'third-party', title: 'Analytics', icon: 'fa-cookie-bite' },
  { id: 'user-rights', title: 'User Rights', icon: 'fa-scale-balanced' },
];

export default function TrustCenter() {
  const [activeSection, setActiveSection] = useState(LEGAL_SECTIONS[0].id);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileNavRef = useRef(null);

  // --- Scroll Logic & ScrollSpy ---
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (!isMobileMenuOpen) {
        setIsNavVisible(currentScrollY < lastScrollY || currentScrollY <= 50);
      }
      setLastScrollY(currentScrollY);

      const sectionElements = LEGAL_SECTIONS.map(sec => document.getElementById(sec.id));
      const currentSection = sectionElements.find(el => {
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        return rect.top >= -100 && rect.top <= window.innerHeight * 0.4;
      });

      if (currentSection && currentSection.id !== activeSection) {
        setActiveSection(currentSection.id);
        
        if (mobileNavRef.current) {
          const activeBtn = mobileNavRef.current.querySelector(`[data-id="${currentSection.id}"]`);
          if (activeBtn) {
            activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, activeSection, isMobileMenuOpen]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

// Bulletproof mobile scroll lock
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.overscrollBehavior = 'contain';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.overscrollBehavior = 'unset';
    }
    return () => { 
      document.body.style.overflow = 'unset'; 
      document.body.style.overscrollBehavior = 'unset';
    };
  }, [isMobileMenuOpen]);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      // Offset accounts for fixed top nav on desktop and general breathing room
      const offset = window.innerWidth < 1024 ? 80 : 120;
      const y = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setIsMobileMenuOpen(false); // Close menu after clicking an on-page link
    }
  };

  return (
    <div 
      className="min-h-screen w-full flex flex-col bg-[#FAFAFA] overflow-hidden antialiased relative selection:bg-orange-500/30"
      style={{ fontFamily: "'Outfit', 'Metropolis', sans-serif" }}
    >
      
      {/* --- Ambient Background Glows --- */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[120vw] lg:max-w-4xl h-[400px] lg:h-[500px] bg-orange-400/20 rounded-full mix-blend-multiply filter blur-[100px] lg:blur-[140px] pointer-events-none animate-[pulse_6s_ease-in-out_infinite]"></div>
      <div className="absolute top-[20%] right-[-10%] w-64 lg:w-96 h-64 lg:h-96 bg-blue-400/15 rounded-full mix-blend-multiply filter blur-[90px] lg:blur-[120px] pointer-events-none animate-[pulse_8s_ease-in-out_infinite_alternate]"></div>

      {/* --- Global Navigation --- */}
      <nav 
        className={`w-full flex justify-between items-center py-3 lg:py-4 px-4 lg:px-12 z-[70] fixed top-0 transition-all duration-500 ease-out border-b border-slate-200/50 ${
          isMobileMenuOpen ? 'bg-white/95 backdrop-blur-3xl shadow-none' : 'bg-white/70 backdrop-blur-2xl shadow-[0_4px_30px_rgba(0,0,0,0.03)]'
        } ${
          isNavVisible || isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="nav-logo shrink-0 relative z-[70]">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-lg">
            <span className="font-black text-[1.25rem] text-slate-800 tracking-tight">
                Remo<span className="text-red-600">PDF</span>
              </span>
          </Link>
        </div>
  
        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-10">
  {[
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'T&C', path: '/terms-of-use' }
  ].map((item) => (
    <Link 
      key={item.name}
      to={item.path}
      className="text-[0.95rem] font-medium text-slate-500 hover:text-slate-900 tracking-wide transition-colors duration-200"
    >
      {item.name}
    </Link>
  ))}
</div>

                <div className="flex items-center gap-3 shrink-0 relative z-[70]">
          {/* Premium Contact Us Button (Hidden on Mobile) */}
            <Link 
            to="/ResumeBuilder"
            className="hidden lg:flex group relative items-center justify-center gap-2.5 px-6 py-2.5 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white text-[14px] font-bold tracking-wide shadow-[0_8px_20px_-6px_rgba(249,115,22,0.6)] hover:shadow-[0_12px_25px_-6px_rgba(249,115,22,0.8)] hover:-translate-y-0.5 transition-all duration-300 overflow-hidden isolate"
          >
            <div className="absolute inset-0 z-[-1] bg-gradient-to-r from-red-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute top-0 left-0 w-full h-full -translate-x-full group-hover:translate-x-[150%] bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 transition-transform duration-1000 ease-in-out z-[-1]" />
            <div className="absolute inset-0 rounded-full border border-white/20 mix-blend-overlay"></div>
            <span className="relative z-10 drop-shadow-sm">Build Resume</span>
            <i className="fa-solid fa-wand-magic-sparkles text-[12px] relative z-10 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110 drop-shadow-sm"></i>
          </Link>

          {/* Premium Hamburger Toggle (Bold & Equal Lines) */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden relative w-11 h-11 flex items-center justify-center bg-slate-50/80 border border-slate-200/80 backdrop-blur-md rounded-full shadow-sm hover:bg-slate-100 transition-colors"
            aria-label="Toggle Navigation"
          >
            <div className="flex flex-col gap-[5px] items-center justify-center w-5">
              <span className={`h-[2.5px] bg-slate-900 rounded-full transition-all duration-300 origin-center ${isMobileMenuOpen ? 'w-5 translate-y-[7.5px] rotate-45' : 'w-5'}`} />
              <span className={`h-[2.5px] bg-slate-900 rounded-full transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0 scale-x-0' : 'w-5 opacity-100 scale-x-100'}`} />
              <span className={`h-[2.5px] bg-slate-900 rounded-full transition-all duration-300 origin-center ${isMobileMenuOpen ? 'w-5 -translate-y-[7.5px] -rotate-45' : 'w-5'}`} />
            </div>
          </button>
        </div>
      </nav>

{/* --- Mobile Menu Backdrop --- */}
<div 
  className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] lg:hidden transition-opacity duration-500 touch-none ${
    isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
  }`}
  onClick={() => setIsMobileMenuOpen(false)}
/>

{/* --- Premium Top Dropdown Mobile Menu --- */}
<div 
  className={`fixed top-0 left-0 w-full bg-white/95 backdrop-blur-3xl border-b border-slate-200/80 shadow-[0_20px_40px_rgba(0,0,0,0.08)] z-[65] lg:hidden flex flex-col transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] rounded-b-[2rem] overflow-hidden ${
    isMobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
  }`}
>
  {/* Update this inner div */}
  <div className="flex flex-col pt-24 px-6 pb-8 max-h-[85vh] overflow-y-auto overscroll-contain">
          
          {/* Primary Nav Links */}
          {/* Primary Nav Links */}
<div className="flex flex-col gap-5 border-b border-slate-100 pb-6 mb-6">
  {[
    { name: 'About Us', path: '/about' },
    { name: 'Trust Center', path: '/PrivacyPolicy' },
    { name: 'Contact', path: '/contact' }
  ].map((item, idx) => (
    <Link 
      key={idx}
      to={item.path} 
      onClick={() => setIsMobileMenuOpen(false)}
      className={`text-[1.35rem] font-medium tracking-wide transition-colors ${item.name === 'Trust Center' ? 'text-orange-500' : 'text-slate-800 hover:text-orange-500'}`}
    >
      {item.name}
    </Link>
  ))}
</div>
          
          {/* On-Page Document Sections */}
          <h3 className="text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-4 px-2">On This Page</h3>
          <div className="flex flex-col gap-2 mb-8">
            {LEGAL_SECTIONS.map((section, idx) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className="flex items-center gap-4 px-3 py-3 rounded-2xl hover:bg-slate-50 transition-colors text-left w-full group"
                style={{ transitionDelay: `${idx * 50}ms` }}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-colors ${
                  activeSection === section.id ? 'bg-orange-50 border-orange-100 text-orange-500' : 'bg-white border-slate-200 text-slate-400 group-hover:border-orange-200 group-hover:text-orange-400'
                }`}>
                  <i className={`fa-solid ${section.icon} text-[13px]`}></i>
                </div>
                <span className={`text-[15px] font-medium ${activeSection === section.id ? 'text-slate-900' : 'text-slate-600 group-hover:text-slate-900'}`}>
                  {section.title}
                </span>
              </button>
            ))}
          </div>

          <Link 
            to="/ResumeBuilder" onClick={() => setIsMobileMenuOpen(false)}
            className="hidden lg:flex group relative items-center justify-center gap-2.5 px-6 py-2.5 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white text-[14px] font-bold tracking-wide shadow-[0_8px_20px_-6px_rgba(249,115,22,0.6)] hover:shadow-[0_12px_25px_-6px_rgba(249,115,22,0.8)] hover:-translate-y-0.5 transition-all duration-300 overflow-hidden isolate"
          >
            <div className="absolute inset-0 z-[-1] bg-gradient-to-r from-red-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute top-0 left-0 w-full h-full -translate-x-full group-hover:translate-x-[150%] bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 transition-transform duration-1000 ease-in-out z-[-1]" />
            <div className="absolute inset-0 rounded-full border border-white/20 mix-blend-overlay"></div>
            <span className="relative z-10 drop-shadow-sm">Build Resume</span>
            <i className="fa-solid fa-wand-magic-sparkles text-[12px] relative z-10 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110 drop-shadow-sm"></i>
          </Link>
        </div>
      </div>

      {/* --- Main Content Grid --- */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 lg:px-8 pt-24 lg:pt-32 pb-32 lg:pb-24 relative z-10 flex flex-col lg:flex-row gap-8 lg:gap-16">
        
        {/* --- Desktop Left Sidebar --- */}
        <aside className="hidden lg:block w-72 shrink-0">
          <div className="sticky top-32 bg-white/60 backdrop-blur-2xl border border-slate-200/60 rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <h3 className="text-xs font-medium tracking-widest uppercase text-slate-400 mb-6 px-4">Legal Framework</h3>
            <nav className="flex flex-col gap-1.5">
              {LEGAL_SECTIONS.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 text-left w-full ${
                    activeSection === section.id 
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20 translate-x-1' 
                      : 'text-slate-600 hover:bg-white hover:shadow-sm hover:text-slate-900'
                  }`}
                >
                  <i className={`fa-solid ${section.icon} w-5 text-center ${activeSection === section.id ? 'text-white/90' : 'text-slate-400'}`}></i>
                  {section.title}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* --- Right Content Area --- */}
        <div className="flex-1 min-w-[280px]"> 
          
          {/* Header */}
          <header className="mb-12 lg:mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="inline-flex items-center gap-2 px-3 lg:px-4 py-1.5 mb-5 lg:mb-6 text-[10px] lg:text-xs font-medium tracking-[0.2em] uppercase text-orange-600 bg-orange-50/80 backdrop-blur-md border border-orange-200/60 rounded-full shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
              </span>
              Trust & Transparency
            </div>
            
            <h1 className="text-[2.2rem] leading-[1.1] sm:text-5xl lg:text-6xl font-light text-slate-900 tracking-tight mb-4 lg:mb-6">
              Privacy by <br className="hidden sm:block"/> <span className="font-normal text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-red-500 to-amber-500">Design.</span>
            </h1>
            <p className="text-[15px] sm:text-lg text-slate-500 font-normal max-w-2xl leading-relaxed">
              We engineer document utilities, not tracking networks. Read exactly how our architecture ensures your PDFs and personal data remain entirely your own.
            </p>
          </header>

          {/* Legal Documents Wrapper */}
          <div className="space-y-10 lg:space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
            
            {/* Section 1: Zero Knowledge */}
            <section id="zero-knowledge" className="scroll-mt-24 lg:scroll-mt-32">
              <h2 className="text-xl lg:text-3xl font-medium text-slate-900 mb-4 flex items-center gap-3">
                <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl bg-orange-50 flex items-center justify-center border border-orange-100 shrink-0">
                  <i className="fa-solid fa-eye-slash text-[14px] lg:text-[18px] text-orange-500"></i>
                </div>
                The "Zero-Knowledge" Promise
              </h2>
              <div className="text-[15px] lg:text-lg text-slate-600 font-normal leading-relaxed">
                <p>
                  At the core of our platform is a zero-knowledge processing model. We do not require you to create an account, register your email, or provide personal identification to use our core document utilities. We have absolutely no visibility into the contents of the files you manipulate.
                </p>
              </div>
            </section>

            <hr className="border-slate-200/80" />

            {/* Section 2: Document Processing */}
            <section id="document-handling" className="scroll-mt-24 lg:scroll-mt-32">
              <h2 className="text-xl lg:text-3xl font-medium text-slate-900 mb-4 flex items-center gap-3">
                <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-100 shrink-0">
                  <i className="fa-solid fa-file-shield text-[14px] lg:text-[18px] text-emerald-500"></i>
                </div>
                Ephemeral Processing
              </h2>
              <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-[1.5rem] lg:rounded-2xl p-5 lg:p-8 shadow-sm">
                <p className="text-[14px] lg:text-base text-slate-600 font-normal mb-5 lg:mb-6">
                  When you upload a document for merging, compression, or transformation, it enters a highly restricted, temporary processing environment.
                </p>
                <ul className="space-y-4">
                  {[
                    "Files are stored in volatile memory (RAM) or isolated temp directories.",
                    "The exact moment your modified file is downloaded, the original and processed copies are permanently purged.",
                    "We maintain absolutely no backup servers, shadow copies, or archives of user-uploaded files."
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 lg:gap-4 text-[13px] lg:text-base font-medium text-slate-700">
                      <div className="mt-0.5 flex-shrink-0 w-5 h-5 lg:w-6 lg:h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[9px] lg:text-[10px]">
                        <i className="fa-solid fa-check"></i>
                      </div>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <hr className="border-slate-200/80" />

            {/* Section 3: API & Security */}
            <section id="transit-security" className="scroll-mt-24 lg:scroll-mt-32">
              <h2 className="text-xl lg:text-3xl font-medium text-slate-900 mb-4 flex items-center gap-3">
                 <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl bg-slate-100 flex items-center justify-center border border-slate-200 shrink-0">
                  <i className="fa-solid fa-lock text-[14px] lg:text-[18px] text-slate-800"></i>
                </div>
                API Transit Security
              </h2>
              <div className="text-[15px] lg:text-lg text-slate-600 font-normal leading-relaxed">
                <p>
                  Data traveling between your client interface and our processing servers is protected by mandatory, end-to-end HTTPS. Our API endpoints enforce strict TLS 1.3 encryption protocols, neutralizing packet-sniffing and man-in-the-middle (MITM) attack vectors before they reach our infrastructure.
                </p>
              </div>
            </section>

            <hr className="border-slate-200/80" />

            {/* Section 4: Telemetry */}
            <section id="infrastructure" className="scroll-mt-24 lg:scroll-mt-32">
              <h2 className="text-xl lg:text-3xl font-medium text-slate-900 mb-4 flex items-center gap-3">
                <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100 shrink-0">
                  <i className="fa-solid fa-server text-[14px] lg:text-[18px] text-indigo-500"></i>
                </div>
                Telemetry & Logs
              </h2>
              <div className="text-[15px] lg:text-lg text-slate-600 font-normal leading-relaxed">
                <p>
                  To ensure maximum uptime and identify API routing errors, our backend automatically generates standard operational logs. These logs capture metadata such as request timestamps, HTTP status codes, payload sizes, and generalized geographic locations. <strong>These logs never contain file contents, metadata from your PDFs, or user-inputted text.</strong>
                </p>
              </div>
            </section>

             <hr className="border-slate-200/80" />

            {/* Section 5: Third-Party */}
            <section id="third-party" className="scroll-mt-24 lg:scroll-mt-32">
              <h2 className="text-xl lg:text-3xl font-medium text-slate-900 mb-4 flex items-center gap-3">
                <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl bg-amber-50 flex items-center justify-center border border-amber-100 shrink-0">
                  <i className="fa-solid fa-cookie-bite text-[14px] lg:text-[18px] text-amber-600"></i>
                </div>
                Ad Networks
              </h2>
              <div className="bg-amber-50/50 border border-amber-200/50 rounded-[1.5rem] lg:rounded-2xl p-5 lg:p-8">
                <p className="text-[14px] lg:text-base text-slate-700 font-medium mb-3">
                  To offset massive server computational costs, we utilize Google AdSense. 
                </p>
                <p className="text-[13px] lg:text-sm text-slate-600 font-normal leading-relaxed">
                  Google and partner vendors use tracking cookies to serve targeted advertisements based on your prior web activity. You hold the right to disable this cross-site tracking directly via your Google Ads Preferences, or by deploying browser-level ad mitigation extensions.
                </p>
              </div>
            </section>

<hr className="border-slate-200/80" />

{/* Section 6: User Rights */}
<section id="user-rights" className="scroll-mt-24 lg:scroll-mt-32">
  <h2 className="text-xl lg:text-3xl font-medium text-slate-900 mb-4 flex items-center gap-3">
    <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl bg-sky-50 flex items-center justify-center border border-sky-100 shrink-0">
      <i className="fa-solid fa-scale-balanced text-[14px] lg:text-[18px] text-sky-500"></i>
    </div>
    Your Rights & Data Control
  </h2>
  <div className="text-[15px] lg:text-lg text-slate-600 font-normal leading-relaxed space-y-4">
    <p>
      Even within a data-minimalist architecture, you retain complete authority over your digital footprint. Because our platform operates on a strict zero-knowledge framework, we do not store, profile, or sell your document information.
    </p>
    <p>
      Since we do not support or maintain user accounts, there are no structural data logs or personal profiles to modify, export, or delete. Your right to be forgotten is executed automatically the moment your session processing concludes. You maintain the absolute right to manage or entirely restrict third-party advertising cookies through your individual browser preferences.
    </p>
  </div>
</section>

          </div>
        </div>
      </main>

      {/* --- Mobile Floating Glass Navigation (< 1024px) --- */}
      <div 
        className={`lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-sm z-40 transition-transform duration-500 ${isMobileMenuOpen ? 'translate-y-24' : 'translate-y-0'}`}
      >
        <div 
          className="bg-white/80 backdrop-blur-2xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-full px-2 py-2 flex items-center overflow-x-auto snap-x hide-scrollbar"
          ref={mobileNavRef}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} 
        >
          <style>{`
            .hide-scrollbar::-webkit-scrollbar { display: none; }
          `}</style>
          
          {LEGAL_SECTIONS.map((section) => (
            <button
              key={section.id}
              data-id={section.id}
              onClick={() => scrollToSection(section.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-[13px] font-medium whitespace-nowrap snap-center transition-all duration-300 shrink-0 cursor-pointer ${
                activeSection === section.id 
                  ? 'bg-slate-900 text-white shadow-md' 
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <i className={`fa-solid ${section.icon} text-[12px] ${activeSection === section.id ? 'text-orange-400' : 'text-slate-400'}`}></i>
              {section.title}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}