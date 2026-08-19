import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import profile from '../assets/profile.png'

// Structural Core Constants
const NAV_LINKS = [
  { label: 'Privacy', path: '/PrivacyPolicy' },
  { label: 'T&C', path: '/terms-of-use' },
  { label: 'Contact Support', path: '/contact' }
];

const PLATFORM_METRICS = [
  { value: '100%', label: 'Data Destruction Rate', subtext: 'Files are scrubbed instantly after execution.' },
  { value: 'Zero', label: 'Persistent Logs', subtext: 'We never read, analyze, or cache content.' },
  { value: '256-Bit', label: 'SSL Architecture', subtext: 'Bank-grade transit layer encryption protocols.' },
  { value: 'ATS', label: 'Compliant Outputs', subtext: 'Engineered for parsing engine algorithms.' }
];

const CORE_UTILITIES = [
  {
    category: 'Advanced PDF Processing',
    icon: 'fa-layer-group',
    color: 'text-orange-500',
    bg: 'bg-orange-50',
    description: 'Professional grade utility workflows optimized for speed, precision, and high-fidelity structural data preservation.',
    items: [
      { name: 'Multi-Document Merging', detail: 'Combine disparate layouts into a single optimized file path without text vector distortion.' },
      { name: 'Precision Content Splitting', detail: 'Isolate pages or ranges dynamically based on data density thresholds.' },
      { name: 'Intelligent Compression Engines', detail: 'Reduce total byte weight up to 90% while preserving raster imagery resolution patterns.' },
      { name: 'Visual Page Reordering', detail: 'Manipulate structural indices directly using interactive browser layout state viewports.' }
    ]
  },
  {
    category: 'Universal Format Engines',
    icon: 'fa-arrow-rotate-left',
    color: 'text-blue-500',
    bg: 'bg-blue-50',
    description: 'Bidirectional document serialization systems designed to maintain complete paragraph alignments, typography systems, and data matrices.',
    items: [
      { name: 'PDF To Highly Structured Word', detail: 'Convert rigid text lines into native dynamic layout flow editable paragraphs.' },
      { name: 'Data Matrix Extract to Excel', detail: 'Locate tabular cells visually and convert grid data directly into flawless formulas.' },
      { name: 'Interactive PowerPoint Matrix', detail: 'Deconstruct vectorized canvas coordinates into separate editable native slide items.' },
      { name: 'Raster Image Pipeline Exports', detail: 'Generate isolated high-resolution sub-pixel PNG or JPEG document page blocks.' }
    ]
  },
  {
    category: 'Cryptographic Security Core',
    icon: 'fa-shield-halved',
    color: 'text-emerald-500',
    bg: 'bg-emerald-50',
    description: 'Enterprise access security mechanics deployed at runtime to safeguard highly confidential system documentation pipelines.',
    items: [
      { name: 'RC4/AES Password Locking', detail: 'Apply deep byte-level security keys to restrict global operational reading permissions.' },
      { name: 'Credential Authorization Removal', detail: 'Unlock authenticated document trees seamlessly given valid local credentials.' },
      { name: 'Dynamic Encryption Changing', detail: 'Cycle structural keys quickly without modifying underlying data structures.' },
      { name: 'Compliance Integrity Auditing', detail: 'Evaluate incoming file structural layouts instantly to flag permission problems.' }
    ]
  }
];

const RESUME_ENGINE_PARADIGMS = [
  { title: 'Interactive Multi-Step Progress Builders', description: 'Fluid, state-tracked interface wizards that guide candidate data collection cleanly across custom visual sections.' },
  { title: 'ATS Parsing Parameter Optimizations', description: 'Semantic DOM configurations generated explicitly to rank beautifully across corporate scanning algorithms.' },
  { title: 'A4 Proportionate Workspace Canvases', description: 'Strict layout ratio containers rendered dynamically via modern browser viewports for paper accurate prints.' },
  { title: 'Asynchronous Playwright Render Engines', description: 'Server managed background headless routines ensuring perfect layouts on standard downloads.' }
];

const ENCRYPTED_WORKFLOW_STEPS = [
  { step: '01', title: 'Local File Initialization', description: 'Documents are loaded via secure sandboxed memory channels.' },
  { step: '02', title: 'Transit Layer Shielding', description: 'Files stream using isolated bank-grade 256-bit transport layer protocols.' },
  { step: '03', title: 'Volatile RAM Execution', description: 'Calculations occur completely in high-speed, volatile temporary system buffers.' },
  { step: '04', title: 'Instant Destruction Routine', description: 'Memory caches purge instantly upon operational delivery to your client browser.' }
];

const FAQ_ACCORDIONS = [
  { q: 'How does RemoPDF guarantee files are completely safe?', a: 'Every single transaction utilizes isolated volatile processing pipelines. We do not provision persistent database records for structural data assets. Files exist only for the brief milliseconds required to transform context, followed by automated kernel memory scrubs.' },
  { q: 'What makes the premium Resume Builder unique compared to alternative platforms?', a: 'Traditional builders produce messy layouts that break applicant tracking systems. RemoPDF enforces strict, native serialization rules and structural metadata formatting. This satisfies parsing checks while delivering stunning visual layouts.' },
  { q: 'Why was the application named RemoPDF?', a: 'The platform is named directly after Remoratile Vanessa, the daughter of our founder Mpho James Matli. It serves as a reminder to engineering excellence, absolute trust, and creating reliable, high-performance web systems.' },
  { q: 'Are there hidden subscription costs or file size paywalls?', a: 'No. RemoPDF is designed as an accessible, high-efficiency utility ecosystem. We prioritize extreme performance, clean interface interactions, and uncompromised productivity layout paths.' }
];

export default function About() {
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (!isMobileMenuOpen) {
        setIsNavVisible(currentScrollY < lastScrollY || currentScrollY <= 50);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, isMobileMenuOpen]);

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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div 
      className="min-h-screen w-full flex flex-col bg-[#FAFAFA] overflow-x-hidden antialiased relative selection:bg-orange-500/30 min-w-[330px]"
      style={{ fontFamily: "'Outfit', 'Metropolis', sans-serif" }}
    >
      {/* Dynamic Background Design Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[140vw] lg:max-w-7xl h-[600px] bg-gradient-to-b from-orange-400/10 via-red-400/5 to-transparent rounded-full filter blur-[120px] lg:blur-[160px] pointer-events-none animate-[pulse_8s_ease-in-out_infinite]"></div>
      <div className="absolute top-[25%] right-[-20%] w-72 lg:w-[500px] h-72 lg:h-[500px] bg-blue-400/5 rounded-full filter blur-[100px] lg:blur-[140px] pointer-events-none animate-[pulse_10s_ease-in-out_infinite_alternate]"></div>
      <div className="absolute bottom-[20%] left-[-15%] w-64 lg:w-[450px] h-64 lg:h-[450px] bg-amber-400/5 rounded-full filter blur-[90px] lg:blur-[130px] pointer-events-none"></div>

      {/* Modern Navigation Header */}
      <nav 
        className={`w-full flex justify-between items-center py-3 lg:py-4 px-4 lg:px-12 z-50 fixed top-0 transition-all duration-500 ease-out border-b border-slate-200/50 bg-white/70 backdrop-blur-2xl shadow-[0_4px_30px_rgba(0,0,0,0.02)] ${
          isNavVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="nav-logo shrink-0 relative z-50">
          <Link to="/" className="flex items-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-lg">
            <span className="font-black text-[1.25rem] text-slate-800 tracking-tight">
                Remo<span className="text-red-600">PDF</span>
              </span>
          </Link>
        </div>
  
        <div className="hidden lg:flex items-center gap-10">
          {NAV_LINKS.map((link, idx) => (
            <Link 
              key={idx}
              to={link.path} 
              className="text-[0.95rem] font-medium tracking-wide transition-colors duration-200 text-slate-500 hover:text-slate-900"
            >
              {link.label}
            </Link>
          ))}
        </div>
  
        <div className="flex items-center gap-4 shrink-0 relative z-50">
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

          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden relative w-10 h-10 flex items-center justify-center bg-slate-50 border border-slate-200/60 backdrop-blur-md rounded-full shadow-sm hover:bg-slate-100/80 transition-colors"
          >
            <div className="flex flex-col gap-[4.5px] items-center justify-center w-5">
              <span className={`h-[2px] bg-slate-800 rounded-full transition-all duration-300 origin-center ${isMobileMenuOpen ? 'w-5 translate-y-[6.5px] rotate-45 bg-slate-900' : 'w-5'}`} />
              <span className={`h-[2px] bg-slate-800 rounded-full transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0 scale-x-0' : 'w-5 opacity-100 scale-x-100'}`} />
              <span className={`h-[2px] bg-slate-800 rounded-full transition-all duration-300 origin-center ${isMobileMenuOpen ? 'w-5 -translate-y-[6.5px] -rotate-45 bg-slate-900' : 'w-5'}`} />
            </div>
          </button>
        </div>
      </nav>

      {/* Drawer Overlay for Mobile Interfaces */}
      <div 
        className={`fixed inset-0 z-50 lg:hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="absolute inset-0 bg-slate-900/15 backdrop-blur-sm transition-opacity duration-500" onClick={() => setIsMobileMenuOpen(false)} />
        <div className={`absolute top-0 right-0 w-full max-w-[260px] h-full bg-white/95 backdrop-blur-3xl shadow-[-25px_0_50px_-15px_rgba(15,23,42,0.06)] border-l border-slate-200/60 p-6 flex flex-col justify-between transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex flex-col pt-16">
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-400 mb-6 px-1">Navigation</p>
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link, idx) => (
                <Link key={idx} to={link.path} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between text-[1.15rem] font-medium tracking-wide py-3.5 px-2 rounded-xl text-slate-800 hover:text-orange-500 hover:bg-slate-50/60 transition-all duration-200">
                  <span>{link.label}</span>
                  <i className="fa-solid fa-chevron-right text-[10px] text-slate-300 mr-1"></i>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Core Operational Layout Container */}
      <main className="max-w-6xl mx-auto w-full px-4 lg:px-8 relative z-10 pt-28 lg:pt-40 pb-24 flex-1">
        
        {/* Visual Badge and Page Title */}
        <div className="text-center mb-16 lg:mb-24">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-6 text-[10px] lg:text-xs font-semibold tracking-[0.2em] uppercase text-orange-600 bg-orange-50/90 backdrop-blur-md border border-orange-200/50 rounded-full shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
            </span>
            Enterprise Utility Suite
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extralight text-slate-900 tracking-tight mb-6 leading-[1.1]">
            Next-Gen Architecture.<br />
            <span className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-red-500 to-amber-500">Uncompromised Privacy.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-base lg:text-lg text-slate-500 font-light leading-relaxed px-2">
            Engineered from the ground up to solve complex enterprise file translations, system layouts, and premium document compilation in fractions of a second.
          </p>
        </div>

        {/* Executive Core Metrics Display Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-16 lg:mb-28">
          {PLATFORM_METRICS.map((metric, index) => (
            <div 
              key={index} 
              className="bg-white/60 backdrop-blur-3xl border border-slate-200/50 shadow-[0_15px_40px_-20px_rgba(0,0,0,0.04)] rounded-2xl p-5 lg:p-6 text-center group hover:border-orange-300/60 transition-all duration-300"
            >
              <div className="text-2xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-slate-900 to-slate-700 tracking-tight mb-1 group-hover:scale-105 transition-transform duration-300">
                {metric.value}
              </div>
              <div className="text-xs font-semibold text-slate-800 tracking-wide mb-2">
                {metric.label}
              </div>
              <div className="text-[11px] lg:text-xs text-slate-400 font-light leading-normal">
                {metric.subtext}
              </div>
            </div>
          ))}
        </div>

        {/* Founding Executive Profile Section */}
        <section className="bg-white/60 backdrop-blur-3xl border border-slate-200/60 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.04)] rounded-[2rem] p-6 sm:p-8 lg:p-14 relative overflow-hidden mb-16 lg:mb-28">
          <div className="absolute top-0 left-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12 relative z-10">
            <div className="w-36 h-36 lg:w-44 lg:h-44 shrink-0 relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-orange-500 to-red-500 rounded-[2.5rem] rotate-6 opacity-15 animate-pulse"></div>
              <img 
               src={profile}
                alt="Mpho James Matli" 
                className="w-full h-full object-cover rounded-[2.5rem] border-4 border-white shadow-xl relative z-10"
              />
            </div>
            
            <div className="text-center lg:text-left flex-1">
              <div className="text-xs font-bold text-orange-500 tracking-[0.15em] uppercase mb-1">Founding Visionary</div>
              <h2 className="text-3xl font-semibold text-slate-900 tracking-tight mb-2">Mpho James Matli</h2>
              <div className="h-[2px] w-12 bg-gradient-to-r from-orange-500 to-transparent mx-auto lg:mx-0 mb-6" />
              
              <div className="space-y-4 text-slate-600 text-[14px] lg:text-[15px] font-light leading-relaxed text-justify sm:text-left">
                <p>
                  Established on 9 December 2025, RemoPDF was ideated to resolve a critical tech industry missing link: the bridge between advanced automated PDF operations and client side data protection infrastructure models. 
                </p>
                <p>
                  The platform carries a deeply important foundational history. It was named intentionally after Remoratile Vanessa, the daughter of our founder. This core lineage drives our product standard. We approach system scaling, micro-service architecture engineering, and customer workflows with long-term care and extreme reliability.
                </p>
                <p>
                  Our primary mission remains simple: ensuring you never need to purchase expensive desktop licenses or surrender private information tracking maps to untrusted legacy cloud infrastructure providers again.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Feature Deep Dive Area */}
        <section className="mb-16 lg:mb-28">
          <div className="text-center mb-10 lg:mb-14">
            <h2 className="text-2xl lg:text-4xl font-bold text-slate-900 tracking-tight mb-3">Granular Tool Suite Specifications</h2>
            <p className="text-xs lg:text-sm text-slate-400 font-light max-w-xl mx-auto">
              Click through our active product pillars to examine core structural file management system layouts.
            </p>
          </div>

          {/* Interactive Navigation Tabs */}
          <div className="flex border-b border-slate-200/60 max-w-md mx-auto mb-10 justify-between gap-2 px-1">
            {CORE_UTILITIES.map((tab, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTab(idx)}
                className={`pb-3 text-xs font-semibold tracking-wider transition-all relative px-2 ${
                  activeTab === idx ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {idx === 0 ? 'Utilities' : idx === 1 ? 'Formats' : 'Security'}
                {activeTab === idx && (
                  <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-orange-500 to-red-500 rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Active Tab Viewport */}
          <div className="bg-white/60 backdrop-blur-3xl border border-slate-200/60 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.04)] rounded-3xl p-6 lg:p-10 transition-all duration-300">
            <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-10">
              <div className="lg:w-1/3">
                <div className={`w-12 h-12 rounded-2xl ${CORE_UTILITIES[activeTab].bg} border border-slate-100 shadow-sm flex items-center justify-center mb-4 ${CORE_UTILITIES[activeTab].color}`}>
                  <i className={`fa-solid ${CORE_UTILITIES[activeTab].icon} text-lg`}></i>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{CORE_UTILITIES[activeTab].category}</h3>
                <p className="text-xs lg:text-sm text-slate-500 font-light leading-relaxed">{CORE_UTILITIES[activeTab].description}</p>
              </div>
              
              <div className="w-full lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {CORE_UTILITIES[activeTab].items.map((item, idx) => (
                  <div key={idx} className="bg-slate-50/50 border border-slate-100 p-4 rounded-xl hover:bg-white transition-colors duration-200">
                    <h4 className="text-xs font-bold text-slate-800 mb-1 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                      {item.name}
                    </h4>
                    <p className="text-[11px] lg:text-xs text-slate-400 font-light leading-normal">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Premium Resume Builder Technical Showcase */}
        <section className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-[2rem] p-6 sm:p-8 lg:p-12 relative overflow-hidden group mb-16 lg:mb-28 shadow-xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/5 rounded-full blur-[80px] group-hover:bg-orange-500/10 transition-all duration-700 pointer-events-none"></div>
          
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border-b border-slate-800 pb-8 mb-8">
              <div>
                <div className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400 tracking-wider uppercase mb-1">Advanced Automation Integration</div>
                <h2 className="text-2xl lg:text-4xl font-bold text-white tracking-tight">The Interactive Resume Builder</h2>
              </div>
              <Link 
                to="/ResumeBuilder" 
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-slate-950 text-xs font-bold hover:bg-slate-100 transition-colors shadow-md shrink-0"
              >
                Launch Resume Workspace
                <i className="fa-solid fa-arrow-right text-[11px]"></i>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
              {RESUME_ENGINE_PARADIGMS.map((paradigm, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="text-orange-500 text-sm font-mono font-bold mt-0.5">[{idx + 1}]</div>
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-1.5 tracking-wide">{paradigm.title}</h3>
                    <p className="text-[11px] lg:text-xs text-slate-400 font-light leading-relaxed">{paradigm.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Security and Privacy Framework Visualization */}
        <section className="mb-16 lg:mb-28">
          <div className="text-center mb-12">
            <div className="text-xs font-bold text-emerald-500 tracking-[0.15em] uppercase mb-1">Zero Trust Architecture</div>
            <h2 className="text-2xl lg:text-4xl font-bold text-slate-900 tracking-tight">Our Absolute Priority: Data Privacy</h2>
            <p className="text-xs lg:text-sm text-slate-400 font-light max-w-xl mx-auto mt-2">
              We process records securely through volatile RAM modules without allocating long-term storage footprints.
            </p>
          </div>

          {/* Workflow Architecture Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ENCRYPTED_WORKFLOW_STEPS.map((step, idx) => (
              <div key={idx} className="bg-white/60 backdrop-blur-3xl border border-slate-200/50 p-6 rounded-2xl shadow-sm relative group hover:shadow-md transition-shadow">
                <div className="text-3xl font-black text-slate-100 absolute top-4 right-4 group-hover:text-orange-100 transition-colors duration-300">{step.step}</div>
                <h3 className="text-xs font-bold text-slate-800 tracking-wide mb-2 mt-4 relative z-10">{step.title}</h3>
                <p className="text-[11px] lg:text-xs text-slate-400 font-light leading-relaxed relative z-10">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Accordion Section */}
        <section className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-xl lg:text-3xl font-bold text-slate-900 tracking-tight">Frequently Answered Protocols</h2>
          </div>

          <div className="flex flex-col gap-3">
            {FAQ_ACCORDIONS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div 
                  key={idx} 
                  className="bg-white/60 backdrop-blur-3xl border border-slate-200/50 rounded-2xl overflow-hidden shadow-sm transition-all duration-300"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex justify-between items-center py-4 px-5 text-left text-xs lg:text-sm font-semibold text-slate-800 hover:text-slate-900 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <i className={`fa-solid fa-chevron-down text-[10px] text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-orange-500' : ''}`}></i>
                  </button>
                  
                  <div 
                    className={`transition-all duration-300 ease-in-out px-5 overflow-hidden text-[11px] lg:text-xs text-slate-400 font-light leading-relaxed ${
                      isOpen ? 'pb-5 max-h-40 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="border-t border-slate-100 pt-3">
                      {faq.Fa}
                      {faq.a}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

      </main>
    </div>
  );
}