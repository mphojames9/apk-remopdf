import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ResumePreview from '../Resume/ResumePreview';
import profileImgItem from '../../assets/profile2.png';

const profileImg = profileImgItem;

// Keeping your demo data exactly intact for the preview engine
const demoResumeData = {
  personalInfo: {
    fullName: "Violet Vanessa Sinclair",
    jobTitle: "Senior Cloud & DevOps Architect",
    email: "alexander.reed@example.com",
    phone: "+1 (555) 019-8273",
    location: "Seattle, WA",
    linkedin: "linkedin.com/in/alexreed",
    website: "alexreed.dev",
    profileImage: profileImg,
    image: profileImg, 
    avatar: profileImg,
    photo: profileImg,
    profilePic: profileImg,
    picture: profileImg,
    summary: "Visionary Cloud Architect with 10+ years of enterprise engineering experience. Architecting resilient, next-gen multi-cloud ecosystems and driving digital transformation. Expert in cloud-native scaling, advanced DevOps, and zero-trust security."
  },
  experience: [
    {
      role: "Principal Infrastructure Engineer",
      company: "Nexus Digital Systems",
      startDate: "Jan 2021",
      endDate: "Present",
      isCurrent: true,
      achievements: [
  "Orchestrated a cross-provider FinOps governance framework, slashing redundant enterprise infrastructure spend by 35% annually without degrading performance.",
  "Engineered a zero-trust cloud security architecture integrating automated IAM governance, reducing perimeter vulnerability vectors across hybrid environments by 45%.",
  "Formulated an automated cross-cloud disaster recovery playbook, shrinking Recovery Time Objective (RTO) to under 5 minutes for tier-1 core banking systems."
]
    },
    {
      role: "Senior Systems Specialist",
      company: "DataStream Analytics",
      startDate: "Mar 2016",
      endDate: "Dec 2020",
      isCurrent: false,
      achievements: [
  "Engineered an automated FinOps orchestration matrix across multi-cloud clusters, slashing redundant enterprise compute overhead by 38%.",
  "Architected a global service mesh topology across edge nodes, stabilizing cross-region microservice latency to sub-10ms under peak transactional loads.",
  "Formulated automated chaos engineering and self-healing resilience protocols, shrinking platform Mean Time to Detect (MTTD) to under 90 seconds."
]
    }
  ],
  education: [
    {
      degree: "M.S. in Distributed Computer Science",
      school: "University of Washington",
      startDate: "2014",
      endDate: "2016",
      isCurrent: false
    }
  ],
  skills: [
    "AWS & Azure Architecture",
    "Kubernetes & Docker Systems",
    "Terraform & CloudFormation",
    "CI/CD Orchestration Pipelines",
    "Python, GoLang, Node.js",
    "Zero-Trust Cloud Compliance"
  ],
  certificates: [
    { title: "AWS Certified Solutions Architect – Professional", issuer: "Amazon Web Services", date: "2024" },
    { title: "Certified Kubernetes Administrator (CKA)", issuer: "CNCF", date: "2023" }
  ],
  languages: [
    { name: "English", proficiency: "Native" },
    { name: "Spanish", proficiency: "Professional Working" }
  ]
};

const RE_TEMPLATES = [

  {
    id: 'Cyber Matrix',
    name: 'Cyber Matrix',
    vibe: 'Tech & Terminal',
    description: 'A futuristic, monospace aesthetic with sharp high-contrast terminal styling.'
  },
  {
    id: 'Velvet Standard',
    name: 'Velvet Standard',
    vibe: 'Classic & Elegant',
    description: 'Refined serif typography with rich maroon accents for a highly traditional presence.'
  },
  {
    id: 'Aurora Minimal',
    name: 'Aurora Minimal',
    vibe: 'Modern & Spacious',
    description: 'Ultra-clean sans-serif design utilizing subtle gradients and expansive whitespace.'
  },
  {
    id: 'Graphite Pro',
    name: 'Graphite Pro',
    vibe: 'Bold & Industrial',
    description: 'Heavy charcoal sectioning and stark structural alignments for engineering profiles.'
  },
  {
    id: 'Monolith Brutalist',
    name: 'Monolith Brutalist',
    vibe: 'Stark & Architectural',
    description: 'Thick borders, heavy uppercase headers, and high-impact structural contrast.'
  },

  { 
    id: 'Aether Minimal', 
    name: 'Aether Minimal', 
    vibe: 'Modern Executive & Fine-line Grid', 
    description: 'An editorial workspace configuration emphasizing whitespace, high-end asymmetric content streams, and subtle typography accents.' 
  },
  { 
    id: 'Helios Zenith', 
    name: 'Helios Zenith', 
    vibe: 'Premium Architectural Canvas', 
    description: 'A striking structural canvas built with flipped geometric layout streams, luxury amber indicators, and encapsulated work modules.' 
  },

  { 
    id: 'Quantum Obsidian', 
    name: 'Quantum Obsidian', 
    vibe: 'Premium 2030 & Technical Architecture', 
    description: 'An elite technical configuration featuring high-contrast subgrids, razor-sharp asymmetry, and clean monospaced layout hooks built for innovators.' 
  },
  { id: 'Professional Dark', name: 'Professional Dark', vibe: 'Classic & Professional', description: 'A striking two-column layout perfect for highlighting key skills alongside your experience.' },
  { id: 'Modern Executive', name: 'Modern Executive', vibe: 'Modern & Clean', description: 'A sleek, top-header design that cleanly organizes your career history and stands out to recruiters.' },
  { id: 'Architect Resume', name: 'Architect Resume', vibe: 'Elegant & Minimalist', description: 'An editorial-style layout with refined typography and clean, spacious borders for a high-end look.' },
  { id: 'Premium Minimal', name: 'Premium Minimal', vibe: 'Crisp & Elegant', description: 'A high-contrast, premium light aesthetic using deep slates and clean whites, perfectly structured for flawless pagination.' },
  { id: 'Visionary 2030', name: 'Visionary 2030', vibe: 'Next-Gen & Tech Forward', description: 'A cutting-edge aesthetic blending deep midnight indigo with neon cyan accents, designed for modern innovators.' },
  { id: 'Bordeaux Elite', name: 'Bordeaux Elite', vibe: 'Sophisticated & Prestigious', description: 'A distinguished layout featuring deep burgundy tones, warm cream backgrounds, and refined serif typography for a C-suite presence.' },
  { id: 'Prestige Ivory', name: 'Prestige Ivory', vibe: 'Pure & Minimalist', description: 'An ultra-clean, premium white aesthetic utilizing sharp typography, deep charcoal text, and crisp whitespace for a heavy-stock paper feel.' },
  { id: 'Apex Executive', name: 'Apex Executive', vibe: 'Top-Tier & Premium', description: 'An incredibly sophisticated layout featuring an obsidian slate sidebar, metallic gold accents, and sharp geometric spacing designed for the C-suite.' },
  { id: 'Pinnacle Premium', name: 'Pinnacle Premium', vibe: 'Editorial & Ultra-Premium', description: 'A striking, high-contrast flat layout designed specifically for flawless pagination, featuring elegant typography and pristine row-by-row structure.' },
  {  id: 'Corporate Legacy', name: 'Corporate Legacy', vibe: 'Executive & Recruiter-Approved', description: 'A polished, high-impact double-column executive design featuring clear visual timelines, explicit skill tracks, and strict compliance pagination metrics.' },
  { id: 'Legacy Elite', name: 'Legacy Elite', vibe: 'Modern Executive & High-Contrast', description: 'A striking high-contrast layout utilizing elegant custom font configurations, clear visual metrics, and structured sidebars designed for technical leadership.' },
  { id: 'Nova Standard', name: 'Nova Standard', vibe: 'Tech-Forward & Crisp', description: 'A precise, tech-oriented layout featuring sharp blue accents, clean typography grids, and high-visibility data mapping.' }
];

const SliderCard = ({ tmpl, isActive, onSelect }) => {
  const containerRef = useRef(null);
  const [thumbScale, setThumbScale] = useState(0.22);

  // Robust observer to perfectly scale the A4 canvas inside the responsive card
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setThumbScale(entry.contentRect.width / 794);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      onClick={() => onSelect(tmpl.id)}
      className={`relative flex-shrink-0 w-[240px] max-[340px]:w-[210px] sm:w-[340px] snap-start rounded-[2rem] p-4 sm:p-5 transition-all duration-500 group cursor-pointer flex flex-col justify-between select-none overflow-hidden ${
        isActive 
          ? 'bg-white shadow-[0_20px_50px_-10px_rgba(245,158,11,0.25)] ring-2 ring-amber-500 scale-[1.02]' 
          : 'bg-slate-50/50 border border-slate-200/60 hover:bg-white hover:border-amber-200 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-1'
      }`}
    >
      {/* Dynamic Background Glow for Active State */}
      {isActive && (
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-orange-50/20 opacity-50 pointer-events-none"></div>
      )}

      <div className="relative z-10">
        {/* THUMBNAIL CANVAS WRAPPER */}
        <div ref={containerRef} className="w-full aspect-[1/1.4142] bg-white rounded-xl overflow-hidden relative shadow-[0_4px_20px_rgba(15,23,42,0.08)] mb-6 border border-slate-100 group-hover:shadow-[0_8px_30px_rgba(15,23,42,0.12)] transition-shadow duration-500">
          
          <div
            className="absolute top-0 left-0 origin-top-left pointer-events-none select-none bg-white"
            style={{ width: '794px', height: '1122px', transform: `scale(${thumbScale})` }}
          >
            <ResumePreview data={demoResumeData} template={tmpl.id} />
          </div>
          
          {/* PREMIUM HOVER GLASS OVERLAY */}
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-400 flex items-center justify-center z-20">
            <div className="bg-white text-slate-900 text-[11px] sm:text-xs font-bold tracking-wide px-5 py-2.5 rounded-full shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-400 ease-out flex items-center gap-2">
              <i className="fa-regular fa-eye"></i> Preview Layout
            </div>
          </div>

          {/* ACTIVE STATUS BADGE */}
          {isActive && (
            <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg z-20 flex items-center gap-1.5 animate-in fade-in zoom-in duration-300">
              <i className="fa-solid fa-check text-[10px]"></i>
              Selected
            </div>
          )}
        </div>

        {/* TYPOGRAPHY SECTION */}
        <div className="space-y-2 px-1">
          <p className="text-[9px] sm:text-[10px] text-amber-500 font-bold tracking-[0.2em] uppercase truncate">
            {tmpl.vibe}
          </p>
          <h3 className={`text-base sm:text-lg font-bold tracking-tight transition-colors truncate ${isActive ? 'text-slate-900' : 'text-slate-800'}`}>
            {tmpl.name}
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed font-medium line-clamp-2 max-[340px]:hidden">
            {tmpl.description}
          </p>
        </div>
      </div>

      {/* ACTION BUTTON */}
      <div className="relative z-10 mt-6 pt-4 border-t border-slate-100/80 shrink-0">
        <div className={`w-full text-[11px] sm:text-xs font-bold tracking-wide py-3 sm:py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all duration-400 ${
          isActive 
            ? 'bg-slate-900 text-white shadow-[0_8px_20px_-6px_rgba(15,23,42,0.4)]' 
            : 'bg-white border border-slate-200 text-slate-600 group-hover:bg-amber-50 group-hover:text-amber-700 group-hover:border-amber-200'
        }`}>
          {isActive ? 'Currently Using' : 'Select Template'}
          {!isActive && (
            <i className="fa-solid fa-arrow-right text-[10px] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"></i>
          )}
        </div>
      </div>
    </div>
  );
};

export default function TemplateSlider({ onSelect, activeTemplateId }) {
  const scrollContainerRef = useRef(null);
  const navigate = useNavigate();

  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const scrollAmount = clientWidth * 0.8;
      scrollContainerRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const selectTemplate = (templateId) => {
    if (onSelect) {
      onSelect(templateId);
    } else {
      localStorage.setItem('remo_premium_template', templateId);
      navigate('/ResumeBuilder');
    }
  };

  return (
    <div className="w-full py-5 sm:py-5 md:py-5 relative font-sans selection:bg-amber-100 selection:text-amber-900">
      <style>{`
        .scrollbar-hidden::-webkit-scrollbar { display: none; }
        .scrollbar-hidden { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* PREMIUM RESPONSIVE HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-14">
          <div className="max-w-2xl space-y-4">
            
            {/* Live Indicator Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50/80 border border-amber-200/50 rounded-full text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase text-amber-600 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              Templates
            </div>
  
            <p className="text-sm sm:text-base text-slate-500 font-medium leading-relaxed">
              Explore our curated collection of industry-approved layouts. Select a design below to instantly structure your career history with absolute precision.
            </p>
          </div>

          {/* HIGH-END NAVIGATION HARDWARE BUTTONS */}
          <div className="flex items-center gap-3 shrink-0 self-start md:self-end">
            <button
              onClick={() => handleScroll('left')}
              className="w-12 h-12 rounded-full border border-slate-200 bg-white text-slate-600 hover:text-amber-600 hover:border-amber-300 hover:bg-amber-50 hover:shadow-[0_8px_20px_-6px_rgba(245,158,11,0.3)] active:scale-95 flex items-center justify-center transition-all duration-300"
              aria-label="Slide left"
            >
              <i className="fa-solid fa-chevron-left text-sm"></i>
            </button>
            <button
              onClick={() => handleScroll('right')}
              className="w-12 h-12 rounded-full border border-slate-200 bg-white text-slate-600 hover:text-amber-600 hover:border-amber-300 hover:bg-amber-50 hover:shadow-[0_8px_20px_-6px_rgba(245,158,11,0.3)] active:scale-95 flex items-center justify-center transition-all duration-300"
              aria-label="Slide right"
            >
              <i className="fa-solid fa-chevron-right text-sm"></i>
            </button>
          </div>
        </div>

        {/* TEMPLATE SLIDER TRACK */}
        <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          <div
            ref={scrollContainerRef}
            className="flex gap-5 sm:gap-8 overflow-x-auto snap-x snap-mandatory scrollbar-hidden pb-10 pt-4"
          >
            {RE_TEMPLATES.map((tmpl) => (
              <SliderCard
                key={tmpl.id}
                tmpl={tmpl}
                isActive={activeTemplateId === tmpl.id}
                onSelect={selectTemplate}
              />
            ))}
            
            {/* End Spacer so the last card doesn't hug the screen edge */}
            <div className="w-4 sm:w-8 shrink-0"></div>
          </div>
        </div>

      </div>
    </div>
  );
}