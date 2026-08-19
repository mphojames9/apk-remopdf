import React, { useState, useEffect, useRef } from 'react';
import ResumeForm from '../components/Resume/ResumeForm';
import PaginatedPreview from '../components/Resume/PaginatedPreview';
import ResumePreview from '../components/Resume/ResumePreview';
import TemplateSlider from '../components/Resume/TemplateSlider';
import profileImgItem from '../assets/profile2.png';



const profileImg = profileImgItem;



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

const TemplateThumbnail = ({ tmpl, isActive, onSelect }) => {
  
  const containerRef = useRef(null);
  const [thumbScale, setThumbScale] = useState(0.25);

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
      className={`group relative flex flex-col bg-white border ${
        isActive ? 'border-orange-500 shadow-md ring-2 ring-orange-500/5' : 'border-slate-200/60 hover:border-slate-400'
      } rounded-xl p-3 max-[340px]:p-2 transition-all duration-300 cursor-pointer active:scale-[0.99] touch-manipulation`}
    >
      <div ref={containerRef} className="w-full aspect-[1/1.4142] rounded-lg overflow-hidden relative bg-slate-50 shadow-inner">
        <div
          className="absolute top-0 left-0 origin-top-left pointer-events-none select-none bg-white"
          style={{ width: '794px', height: '1122px', transform: `scale(${thumbScale})` }}
        >
          <ResumePreview data={demoResumeData} template={tmpl.id} />
        </div>
        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden lg:flex items-center justify-center p-4 z-20">
          <span className="bg-orange-500 hover:bg-orange-600 text-white text-[10px] font-bold uppercase tracking-widest py-2.5 px-4 rounded-lg shadow-xl transition-transform transform translate-y-1 group-hover:translate-y-0 duration-200">
            Activate Layout
          </span>
        </div>
        {isActive && (
          <div className="absolute top-1.5 right-1.5 bg-orange-500 text-white text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded shadow-sm z-20">
            Active
          </div>
        )}
      </div>
      <div className="mt-3 flex flex-col flex-1">
        <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 tracking-tight line-clamp-1">{tmpl.name}</h4>
        <p className="text-[8px] sm:text-[10px] text-orange-500 font-mono mt-0.5 uppercase tracking-wider font-bold truncate">{tmpl.vibe}</p>
        <p className="text-[11px] text-slate-500 mt-1.5 line-clamp-2 leading-relaxed flex-1 max-[340px]:hidden">{tmpl.description}</p>
      </div>
    </div>
  );
};

export default function ResumeBuilder() {
  const [isExporting, setIsExporting] = useState(false);
  const [toast, setToast] = useState({ show: false, type: '', message: '' });
  const [showOverlay, setShowOverlay] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [scale, setScale] = useState(0.6);
  const [overlayScale, setOverlayScale] = useState(1);
  const [triggerSuccessModal, setTriggerSuccessModal] = useState(0);
  const previewContainerRef = useRef(null);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
const [lastScrollY, setLastScrollY] = useState(0);
const [isNavigating, setIsNavigating] = useState(false);

const handleGoBack = () => {
  setIsNavigating(true);
  
  // Simulate a premium loading transition before actually moving
  setTimeout(() => {
    // If you are using React Router, replace this with navigate(-1)
    window.history.back();
  }, 1200); // 1.2 second delay for the spin animation to play
};

const handleGalleryScroll = (e) => {
  const currentScrollY = e.target.scrollTop;
  
  // Hide header when scrolling down past 60px, show when scrolling up
  if (currentScrollY > lastScrollY && currentScrollY > 60) {
    setIsHeaderVisible(false);
  } else if (currentScrollY < lastScrollY) {
    setIsHeaderVisible(true);
  }
  
  setLastScrollY(currentScrollY);
};

  // Responsive Navigation State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Premium Modal UI Controllers
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [renameInput, setRenameInput] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);

  useEffect(() => {
    localStorage.removeItem('remo_template_prompted');
    localStorage.removeItem('remo_first_template_selected');
  }, []);

  // 1. Initialize Array Master List from Local Storage
  const [savedResumes, setSavedResumes] = useState(() => {
    try {
      const saved = localStorage.getItem('remo_saved_resumes');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn("Error reading resume index configuration.", e);
    }

    try {
      const legacyResume = localStorage.getItem('remo_premium_resume');
      const legacyTemplate = localStorage.getItem('remo_premium_template') || 'Professional Dark';
      if (legacyResume) {
        const parsedOld = JSON.parse(legacyResume);
        return [{
          id: 'initial_profile',
          title: parsedOld.personalInfo?.fullName || 'Main Profile',
          template: legacyTemplate,
          data: parsedOld
        }];
      }
    } catch (e) {}

    return [{
      id: 'initial_profile',
      title: 'Main Profile',
      template: 'Professional Dark',
      data: {
        personalInfo: {}, experience: [], education: [], skills: [],
        certificates: [], languages: [], hobbies: [], references: []
      }
    }];
  });

  // 2. Track Active Profile Key ID
  const [activeId, setActiveId] = useState(() => {
    const savedActive = localStorage.getItem('remo_active_resume_id');
    if (savedActive && savedResumes.some(r => r.id === savedActive)) {
      return savedActive;
    }
    return savedResumes[0].id;
  });

  // 3. Workspace States mapped to active target index
  const [resumeData, setResumeData] = useState(() => {
    const active = savedResumes.find(r => r.id === activeId) || savedResumes[0];
    return active.data;
  });

  const [activeTemplate, setActiveTemplate] = useState(() => {
    const active = savedResumes.find(r => r.id === activeId) || savedResumes[0];
    return active.template || 'Professional Dark';
  });

  useEffect(() => {
    localStorage.setItem('remo_saved_resumes', JSON.stringify(savedResumes));
  }, [savedResumes]);

  useEffect(() => {
    localStorage.setItem('remo_active_resume_id', activeId);
  }, [activeId]);

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast({ show: false, type: '', message: '' }), 4000);
  };

  const handleSetResumeData = (updater) => {
    setResumeData((prev) => {
      const nextData = typeof updater === 'function' ? updater(prev) : updater;
      setSavedResumes((prevList) =>
        prevList.map((res) => (res.id === activeId ? { ...res, data: nextData } : res))
      );
      return nextData;
    });
  };

  const handleSetActiveTemplate = (tmplId) => {
    setActiveTemplate(tmplId);
    setSavedResumes((prevList) =>
      prevList.map((res) => (res.id === activeId ? { ...res, template: tmplId } : res))
    );
  };

  const handleCreateNew = () => {
    const newId = 'res_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 4);
    const initialPlaceholderTitle = `Untitled Resume ${savedResumes.length + 1}`;
    
    const newResume = {
      id: newId,
      title: initialPlaceholderTitle,
      template: 'Professional Dark',
      data: {
        personalInfo: {}, experience: [], education: [], skills: [],
        certificates: [], languages: [], hobbies: [], references: []
      }
    };
    
    setSavedResumes((prev) => [...prev, newResume]);
    setActiveId(newId);
    setResumeData(newResume.data);
    setActiveTemplate(newResume.template);

    setRenameInput(initialPlaceholderTitle);
    setShowRenameModal(true);
    setIsMobileMenuOpen(false); // Close menu on mobile if open
    
    showToast('success', 'Created new workspace profile channel!');
  };

  const handleSwitchResume = (id) => {
    const target = savedResumes.find((r) => r.id === id);
    if (target) {
      setActiveId(id);
      setResumeData(target.data);
      setActiveTemplate(target.template || 'Professional Dark');
      showToast('success', `Switched to profile: ${target.title}`);
    }
  };

  const openRenameModal = () => {
    const current = savedResumes.find(r => r.id === activeId);
    setRenameInput(current?.title || '');
    setShowRenameModal(true);
    setIsMobileMenuOpen(false);
  };

  const executeRenameSave = () => {
    if (!renameInput.trim()) {
      showToast('error', 'Profile name cannot be completely blank.');
      return;
    }
    setSavedResumes((prev) =>
      prev.map((res) => (res.id === activeId ? { ...res, title: renameInput.trim() } : res))
    );
    setShowRenameModal(false);
    showToast('success', 'Profile renamed successfully!');
  };

  const openDeleteModal = (id, e) => {
    if (e) e.stopPropagation();
    if (savedResumes.length <= 1) {
      showToast('error', 'You must maintain at least one resume profile.');
      return;
    }
    setIdToDelete(id);
    setShowDeleteModal(true);
    setIsMobileMenuOpen(false);
  };

  const executeDeleteConfirm = () => {
    if (!idToDelete) return;
    const remaining = savedResumes.filter((r) => r.id !== idToDelete);
    setSavedResumes(remaining);
    if (activeId === idToDelete) {
      const nextActive = remaining[0];
      setActiveId(nextActive.id);
      setResumeData(nextActive.data);
      setActiveTemplate(nextActive.template || 'Professional Dark');
    }
    setShowDeleteModal(false);
    setIdToDelete(null);
    showToast('success', 'Resume profile deleted.');
  };

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width } = entry.contentRect;
        const availableWidth = width - 80;
        setScale(Math.min(availableWidth / 794, 1));
      }
    });
    if (previewContainerRef.current) observer.observe(previewContainerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!showOverlay) return;
    const calculateOverlayScale = () => {
      const isMobile = window.innerWidth < 600;
      const availableWidth = window.innerWidth - (isMobile ? 24 : 80);
      setOverlayScale(Math.min(1, availableWidth / 794));
    };
    calculateOverlayScale();
    window.addEventListener('resize', calculateOverlayScale);
    return () => window.removeEventListener('resize', calculateOverlayScale);
  }, [showOverlay]);

const handleExport = async () => {
  setIsExporting(true);
  try {
    const exportContainer = document.getElementById('premium-export-container');
    if (!exportContainer) return;
    
    const rawHtml = exportContainer.innerHTML;
    const fullHtmlPayload = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          @page { margin: 0; size: A4; }
          html, body { margin: 0 !important; padding: 0 !important; background: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .export-page { box-shadow: none !important; border: none !important; outline: none !important; margin: 0 !important; border-radius: 0 !important; page-break-after: always; width: 210mm !important; height: 297mm !important; min-height: 297mm !important; max-height: 297mm !important; box-sizing: border-box !important; }
          .export-page:last-child { page-break-after: auto; }
        </style>
      </head>
      <body>${rawHtml}</body>
      </html>
    `;

    const response = await fetch("https://remopdf-backend.onrender.com/api/resume/download", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ html_content: fullHtmlPayload }), 
    });

    if (!response.ok) {
      const errorReason = await response.text();
      console.error("🔴 CRITICAL BACKEND ERROR DETAILS:", errorReason);
      throw new Error(`Server responded with status ${response.status}`);
    }

    // 1. Read the blob ONLY ONCE here
    const blob = await response.blob();
    
    const currentProfile = savedResumes.find(r => r.id === activeId);
    const userProvidedName = resumeData.personalInfo?.fullName;
    const computedName = userProvidedName 
      ? `${userProvidedName.trim().replace(/\s+/g, '_')}_Resume.pdf`
      : `${currentProfile?.title.trim().replace(/\s+/g, '_') || 'Resume'}.pdf`;

    const file = new File([blob], computedName, { type: 'application/pdf' });

    // 2. Try Native Share Sheet (Best experience for Mobile browsers)
    try {
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: computedName,
        });
        showToast('success', 'Resume generated successfully!');
        return; // Execution stops here if share modal opens successfully
      }
    } catch (shareError) {
      console.log('Native share cancelled or failed, falling back...', shareError);
    }

    // 3. Android WebView Detection
    const isAndroidWebView = /wv/.test(navigator.userAgent) || /Android.*Version\/[0-9].[0-9]/.test(navigator.userAgent);

    if (isAndroidWebView) {
      // Android WebViews block blob: URLs, so convert to a Data URL (Base64)
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        const base64Data = reader.result;
        const link = document.createElement("a");
        link.href = base64Data;
        link.download = computedName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast('success', 'Resume generated successfully!');
      };
    } else {
      // 4. Standard Browser Fallback (Windows, Mac, Standard Mobile Browsers)
      // Safely create the Object URL from the original blob
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      
      link.href = url;
      link.download = computedName;
      document.body.appendChild(link);
      link.click();
      
      // Clean up the URL to prevent memory leaks
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
      showToast('success', 'Resume generated successfully!');
    }

  } catch (error) {
    console.error("Frontend export error execution trace:", error);
    showToast('error', 'Failed to generate PDF. Check browser console for details.');
  } finally {
    setIsExporting(false); 
    setIsMobileMenuOpen(false);
  }
};

  const templates = [

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

  { 
    id: 'Professional Dark', 
    name: 'Professional Dark', 
    vibe: 'Classic & Professional', 
    description: 'A striking two-column layout perfect for highlighting key skills alongside your experience.' 
  },
  { 
    id: 'Modern Executive', 
    name: 'Modern Executive', 
    vibe: 'Modern & Clean', 
    description: 'A sleek, top-header design that cleanly organizes your career history and stands out to recruiters.' 
  },
  { 
    id: 'Architect Resume', 
    name: 'Architect Resume', 
    vibe: 'Elegant & Minimalist', 
    description: 'An editorial-style layout with refined typography and clean, spacious borders for a high-end look.' 
  },
  { 
    id: 'Premium Minimal', 
    name: 'Premium Minimal', 
    vibe: 'Crisp & Elegant', 
    description: 'A high-contrast, premium light aesthetic using deep slates and clean whites, perfectly structured for flawless pagination.' 
  },

  {
    id: 'Visionary 2030',
    name: 'Visionary 2030',
    vibe: 'Next-Gen & Tech Forward',
    description: 'A cutting-edge aesthetic blending deep midnight indigo with neon cyan accents, designed for modern innovators.'
  },

  {
    id: 'Bordeaux Elite',
    name: 'Bordeaux Elite',
    vibe: 'Sophisticated & Prestigious',
    description: 'A distinguished layout featuring deep burgundy tones, warm cream backgrounds, and refined serif typography for a C-suite presence.'
  },

  {
    id: 'Prestige Ivory',
    name: 'Prestige Ivory',
    vibe: 'Pure & Minimalist',
    description: 'An ultra-clean, premium white aesthetic utilizing sharp typography, deep charcoal text, and crisp whitespace for a heavy-stock paper feel.'
  },

  {
    id: 'Apex Executive',
    name: 'Apex Executive',
    vibe: 'Top-Tier & Premium',
    description: 'An incredibly sophisticated layout featuring an obsidian slate sidebar, metallic gold accents, and sharp geometric spacing designed for the C-suite.'
  },

  {
    id: 'Pinnacle Premium',
    name: 'Pinnacle Premium',
    vibe: 'Editorial & Ultra-Premium',
    description: 'A striking, high-contrast flat layout designed specifically for flawless pagination, featuring elegant typography and pristine row-by-row structure.'
  },

  {
    id: 'Corporate Legacy',
    name: 'Corporate Legacy',
    vibe: 'Executive & Recruiter-Approved',
    description: 'A polished, high-impact double-column executive design featuring clear visual timelines, explicit skill tracks, and strict compliance pagination metrics.'
  },

  {
    id: 'Legacy Elite',
    name: 'Legacy Elite',
    vibe: 'Modern Executive & High-Contrast',
    description: 'A striking high-contrast layout utilizing elegant custom font configurations, clear visual metrics, and structured sidebars designed for technical leadership.'
  },

  { 
    id: 'Nova Standard', 
    name: 'Nova Standard', 
    vibe: 'Tech-Forward & Crisp', 
    description: 'A precise, tech-oriented layout featuring sharp blue accents, clean typography grids, and high-visibility data mapping.' 
  }
];

  return (
    <div className="h-screen w-full flex flex-col bg-slate-50 font-sans overflow-hidden antialiased">
      <style>{`
        .custom-dark-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-dark-scrollbar::-webkit-scrollbar-track { background: #020617; }
        .custom-dark-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 9999px; }
        .custom-dark-scrollbar { scrollbar-width: thin; scrollbar-color: #1e293b #020617; }
      `}</style>

      {/* REFINED PREMIUM RESPONSIVE HEADER */}
      <header className="relative h-16 lg:h-20 bg-white/80 backdrop-blur-2xl border-b border-slate-200/50 flex items-center justify-between px-4 sm:px-6 z-50 sticky top-0 transition-all duration-300">
        
        {/* 1. Logo Section */}
        <a href="/" onClick={handleGoBack} className="text-slate-950 font-black text-lg lg:text-xl tracking-tighter flex items-center gap-2 lg:gap-2.5 group shrink-0">
          <div className="bg-gradient-to-tr from-orange-600 to-orange-400 text-white p-1.5 rounded-lg shadow-sm shadow-orange-500/20 group-hover:shadow-orange-500/40 group-hover:scale-105 transition-all duration-300">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
          </div>
          <span className="font-black text-[1.25rem] text-slate-800 tracking-tight">
                Remo<span className="text-red-600">PDF</span>
              </span>
        </a>

{/* 2. Desktop Center Dock (Hidden on Mobile) */}
        <div className="hidden md:flex flex-1 items-center justify-center gap-4">
          
          {/* Upgraded Premium Workspace Selector */}
          <div className="flex items-center p-1 bg-white rounded-full border border-slate-200/70 shadow-[0_4px_15px_-3px_rgba(0,0,0,0.05)] ring-1 ring-slate-900/5 transition-all hover:shadow-[0_4px_20px_-3px_rgba(0,0,0,0.08)]">
            
            <div className="relative flex items-center">
              {/* Added Premium Folder Icon */}
              <svg className="w-3.5 h-3.5 text-orange-500 absolute left-3 pointer-events-none z-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
              
              <select
                value={activeId}
                onChange={(e) => handleSwitchResume(e.target.value)}
                className="appearance-none bg-transparent hover:bg-slate-50 text-slate-800 text-xs font-extrabold rounded-full pl-8 pr-8 py-1.5 outline-none border-none cursor-pointer w-auto min-w-[140px] max-w-[220px] truncate transition-colors z-10"
              >
                {savedResumes.map((res) => (
                  <option key={res.id} value={res.id}>{res.title}</option>
                ))}
              </select>
              
              {/* Down Chevron */}
              <svg className="w-3.5 h-3.5 text-slate-400 absolute right-3 pointer-events-none z-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            <div className="w-px h-5 bg-slate-200 mx-1"></div>

            {/* Quick Actions */}
            <button onClick={openRenameModal} className="p-1.5 hover:bg-slate-50 text-slate-500 cursor-pointer hover:text-slate-800 rounded-full transition-all outline-none" title="Rename Workspace">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
              </svg>
            </button>
            <button onClick={handleCreateNew} className="p-1.5 hover:bg-orange-50 hover:text-orange-600 cursor-pointer text-slate-500 rounded-full transition-all outline-none" title="New Profile">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </button>
            {savedResumes.length > 1 && (
              <button onClick={(e) => openDeleteModal(activeId, e)} className="p-1.5 hover:bg-red-50 cursor-pointer hover:text-red-600 cursor-pointer text-slate-400 rounded-full transition-all outline-none" title="Delete Profile">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              </button>
            )}
          </div>

          <div className="w-px h-6 bg-slate-200/60"></div>

          {/* Template Indicator */}
          <button onClick={() => setShowTemplateModal(true)} className="group flex items-center cursor-pointer gap-2 bg-slate-50 hover:bg-slate-100 ring-1 ring-slate-200/50 text-slate-800 text-xs font-bold rounded-full px-4 py-1.5 transition-all duration-300 outline-none max-w-[150px]">
            <span className="text-orange-500 font-extrabold tracking-wide truncate">{activeTemplate}</span>
            <svg className="w-3.5 h-3.5 text-slate-400 shrink-0 transform group-hover:translate-y-px transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
        </div>

        {/* 3. Right Action Area */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Upgraded Premium Download Button */}
          <button onClick={handleExport} className="hidden sm:flex items-center cursor-pointer gap-2 bg-gradient-to-b from-slate-800 via-slate-900 to-black hover:from-slate-700 hover:via-slate-800 hover:to-slate-950 text-white px-5 py-2.5 rounded-full text-xs font-bold tracking-wide shadow-[0_4px_15px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.25)] ring-1 ring-white/10 transition-all duration-300 transform active:scale-95">
            <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Download
          </button>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-slate-700 cursor-pointer hover:bg-slate-100 rounded-lg transition-colors border border-transparent hover:border-slate-200"
          >
            <svg className="w-5 h-5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16m-7 6h7" />
              )}
            </svg>
          </button>
        </div>

        {/* MOBILE DROPDOWN MENU */}
        <div className={`absolute top-full left-0 w-full bg-white/95 backdrop-blur-3xl border-b border-slate-200 shadow-2xl transition-all duration-300 origin-top md:hidden ${isMobileMenuOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'}`}>
          <div className="p-4 flex flex-col gap-5 max-h-[85vh] overflow-y-auto">
            
            {/* Mobile Workspace Selector */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Active Workspace</label>
              <div className="relative">
                <select
                  value={activeId}
                  onChange={(e) => { handleSwitchResume(e.target.value); setIsMobileMenuOpen(false); }}
                  className="appearance-none w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm font-bold rounded-xl pl-4 pr-10 py-3.5 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all shadow-sm"
                >
                  {savedResumes.map((res) => (
                    <option key={res.id} value={res.id}>{res.title}</option>
                  ))}
                </select>
                <svg className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Mobile Action Buttons */}
            <div className="grid grid-cols-3 gap-3">
              <button onClick={openRenameModal} className="flex flex-col items-center cursor-pointer justify-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100 text-slate-600 hover:bg-slate-100 active:scale-95 transition-all">
                <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                </svg>
                <span className="text-[10px] font-bold">Rename</span>
              </button>
              
              <button onClick={handleCreateNew} className="flex flex-col items-center cursor-pointer justify-center gap-2 p-3 bg-orange-50 rounded-xl border border-orange-100 text-orange-600 hover:bg-orange-100 active:scale-95 transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                <span className="text-[10px] font-bold">New</span>
              </button>

              <button 
                onClick={(e) => openDeleteModal(activeId, e)} 
                disabled={savedResumes.length <= 1}
                className={`flex flex-col items-center justify-center gap-2 p-3 cursor-pointer rounded-xl border transition-all ${savedResumes.length > 1 ? 'bg-red-50 border-red-100 text-red-600 hover:bg-red-100 active:scale-95' : 'bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span className="text-[10px] font-bold">Delete</span>
              </button>
            </div>

            {/* Mobile Template Selector */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Design Architecture</label>
              <button 
                onClick={() => { setShowTemplateModal(true); setIsMobileMenuOpen(false); }} 
                className="w-full flex items-center justify-between bg-slate-50 border border-slate-200 p-3.5 rounded-xl active:bg-slate-100 transition-colors"
              >
                <span className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                  {activeTemplate}
                </span>
                <span className="text-[10px] text-orange-500 font-bold bg-orange-100 px-2 py-1 rounded-md">Change</span>
              </button>
            </div>

            {/* Mobile Export */}
            <button 
              onClick={handleExport} 
              className="mt-2 w-full bg-gradient-to-b cursor-pointer from-slate-800 via-slate-900 to-black hover:from-slate-700 hover:via-slate-800 hover:to-slate-950 text-white font-bold py-3.5 rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.15)] ring-1 ring-white/10 flex items-center justify-center gap-2.5 active:scale-95 transition-all duration-300"
            >
              <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              <span className="tracking-wide">Download PDF</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden relative">
        <div className="w-full lg:w-[55%] xl:w-[60%] bg-white border-r border-slate-200/50 overflow-y-auto z-10 custom-scrollbar flex flex-col justify-between">
          <div className="flex-1">
            <ResumeForm 
              data={resumeData} 
              setData={handleSetResumeData} 
              onExport={handleExport} 
              onPreview={() => setShowOverlay(true)} 
              onOpenTemplateModal={() => setShowTemplateModal(true)}
              externalSuccessTrigger={triggerSuccessModal}
            />
          </div>
          
          <div className="p-3 max-[340px]:p-2.5 bg-slate-50/50 border-t border-slate-100 pb-16 lg:pb-6">
            <TemplateSlider 
              activeTemplateId={activeTemplate} 
              onSelect={handleSetActiveTemplate} 
            />
          </div>
        </div>

{/* PREVIEW CANVAS */}
        <div 
          ref={previewContainerRef} 
          className="hidden lg:flex flex-1 flex-col items-center p-8 overflow-y-auto custom-dark-scrollbar relative bg-gradient-to-b from-slate-950 via-slate-900 to-black shadow-2xl select-none"
        >
          {/* Ambient 2030 Cyber Grid Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_10%,#000_60%,transparent_100%)] opacity-20 pointer-events-none"></div>
          
          {/* Floating Premium HUD Control Hub */}
          <div className="w-full max-w-[794px] flex justify-between items-center mb-10 bg-slate-950/40 backdrop-blur-xl border border-white/5 px-4 py-2.5 rounded-2xl shadow-[0_16px_40px_-10px_rgba(0,0,0,0.5)] ring-1 ring-white/5 shrink-0">
            <div className="flex items-center gap-3 pl-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_10px_#10b981]"></span>
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-slate-200 tracking-[0.15em] uppercase">Live Preview</span>
                <span className="text-[9px] font-mono font-bold bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded-md border border-slate-700/50">A4 Canvas</span>
              </div>
            </div>
            
            <button 
              onClick={() => setShowOverlay(true)} 
              className="group flex items-center cursor-pointer gap-2 bg-slate-800 hover:bg-slate-700/80 ring-1 ring-white/10 text-slate-200 hover:text-white px-4 py-1.5 rounded-xl text-xs font-bold transition-all duration-300 shadow-md active:scale-95"
            >
              <svg className="w-3.5 h-3.5 text-slate-400 group-hover:text-orange-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.644m19.928 0a1.012 1.012 0 010 .644M12 18.75a6.75 6.75 0 110-13.5 6.75 6.75 0 010 13.5z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Full Screen Preview</span>
            </button>
          </div>

          {/* Elevated High-Fidelity Paper Matrix Wrapper */}
          <div 
            className="shadow-[0_50px_100px_-20px_rgba(0,0,0,0.85)] border border-slate-800/60 rounded-sm relative group"
            style={{ 
              width: '794px', 
              transform: `scale(${scale}) translateZ(0)`, 
              transformOrigin: 'top center', 
              paddingBottom: '100px', 
              backfaceVisibility: 'hidden' 
            }}
          >
            {/* Soft Ambient Depth Glow behind the paper */}
            <div className="absolute -inset-1 bg-gradient-to-b from-orange-500/5 to-transparent rounded-sm blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
            
            {/* CHANGED FROM bg-white TO bg-transparent */}
            <div className="relative z-10 bg-transparent">
              <PaginatedPreview data={resumeData} template={activeTemplate} />
            </div>
          </div>
        </div>
      </main>

{/* RENAME PROFILE - PREMIUM 2030 MODAL */}
      {showRenameModal && (
        <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xl animate-fade-in" onClick={() => setShowRenameModal(false)}></div>
          <div className="bg-gradient-to-b from-white to-slate-50/90 w-full max-w-md rounded-3xl border border-white/60 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.2)] ring-1 ring-slate-900/5 relative z-10 p-6 sm:p-8 transform transition-transform duration-300 scale-100 animate-scale-up">
            
            <div className="flex items-center gap-3.5 mb-6">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-slate-700 border border-slate-200/70 shadow-sm shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <div className="flex flex-col gap-0.5">
                <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">Rename Workspace</h3>
                <p className="text-[11px] sm:text-xs text-slate-500 font-medium leading-normal">Update the identifier for your targeted configuration.</p>
              </div>
            </div>
            
            <div className="mb-8">
              <input 
                type="text"
                placeholder="e.g. Senior Software Engineer"
                value={renameInput}
                onChange={(e) => setRenameInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') executeRenameSave(); }}
                autoFocus
                className="w-full bg-white border-2 border-slate-200/80 text-slate-900 font-bold rounded-2xl px-5 py-3.5 text-sm focus:border-orange-500 focus:ring-4 focus:ring-orange-500/15 outline-none shadow-sm transition-all placeholder:text-slate-400 placeholder:font-semibold" 
              />
            </div>

            <div className="flex items-center justify-end gap-3 shrink-0">
              <button 
                onClick={() => setShowRenameModal(false)}
                className="px-5 py-2.5 bg-white border border-slate-200 cursor-pointer hover:border-slate-300 hover:bg-slate-50 text-slate-600 text-xs font-bold rounded-full transition-all outline-none shadow-sm active:scale-95"
              >
                Cancel
              </button>
              <button 
                onClick={executeRenameSave}
                className="px-6 py-2.5 bg-gradient-to-b from-slate-800 cursor-pointer via-slate-900 to-black hover:from-slate-700 hover:via-slate-800 hover:to-slate-950 text-white text-xs font-bold rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.25)] ring-1 ring-white/10 transition-all duration-300 outline-none transform active:scale-95"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE - PREMIUM 2030 MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xl animate-fade-in" onClick={() => { setShowDeleteModal(false); setIdToDelete(null); }}></div>
          <div className="bg-gradient-to-b from-white to-red-50/30 w-full max-w-sm rounded-3xl border border-white/60 shadow-[0_24px_60px_-15px_rgba(220,38,38,0.2)] ring-1 ring-red-900/5 relative z-10 p-6 sm:p-8 transform transition-transform duration-300 scale-100 animate-scale-up text-center flex flex-col items-center">
            
            <div className="relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-b from-red-50 to-red-100 text-red-500 mb-5 border border-red-200 shadow-sm shadow-red-500/20">
              <div className="absolute inset-0 rounded-full bg-red-400 opacity-20 animate-ping"></div>
              <svg className="w-6 h-6 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            <div className="flex flex-col gap-2 mb-8">
              <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">Delete Resume Profile?</h3>
              <p className="text-xs text-slate-500 leading-relaxed px-2">
                You are about to permanently delete <span className="font-extrabold text-slate-900">"{savedResumes.find(r => r.id === idToDelete)?.title}"</span>. This slice cannot be restored.
              </p>
            </div>

            <div className="flex items-center gap-3 w-full">
              <button 
                onClick={() => { setShowDeleteModal(false); setIdToDelete(null); }}
                className="flex-1 px-4 py-3 bg-white border border-slate-200 cursor-pointer hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-2xl transition-all outline-none shadow-sm active:scale-95"
              >
                Cancel Action
              </button>
              <button 
                onClick={executeDeleteConfirm}
                className="flex-1 px-4 py-3 bg-gradient-to-b from-red-500 via-red-600 cursor-pointer to-red-700 hover:from-red-400 hover:via-red-500 hover:to-red-600 text-white text-xs font-bold rounded-2xl shadow-[0_4px_15px_rgba(220,38,38,0.3)] hover:shadow-[0_6px_20px_rgba(220,38,38,0.4)] ring-1 ring-white/20 transition-all duration-300 outline-none transform active:scale-95"
              >
                Delete Document
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FULL SCREEN DYNAMIC OVERLAY MODAL */}
      {showOverlay && (
        <div className="fixed inset-0 z-[999999] bg-slate-950/98 backdrop-blur-2xl flex flex-col overflow-hidden select-none">
          <div className="absolute top-3 right-3 max-[340px]:top-2 max-[340px]:right-2 z-[1000005]">
            <button 
              onClick={() => setShowOverlay(false)} 
              className="bg-white/5 hover:bg-white/10 active:scale-90 cursor-pointer text-white/70 hover:text-white p-2.5 max-[340px]:p-2 rounded-full border border-white/10 backdrop-blur-md transition-all outline-none"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="absolute bottom-4 max-[540px]:bottom-2 left-1/2 -translate-x-1/2 z-[1000005] w-auto shrink-0 px-2">
            <button
              onClick={(e) => { e.stopPropagation(); handleExport(); }}
              disabled={isExporting}
              className="group flex items-center cursor-pointer gap-2.5 bg-gradient-to-b from-orange-500 via-orange-600 to-amber-600 hover:from-orange-400 hover:via-orange-500 hover:to-amber-500 text-white font-black tracking-wide text-xs max-[340px]:text-[11px] px-6 py-3.5 max-[540px]:py-3 rounded-full shadow-[0_12px_32px_rgba(234,88,12,0.35)] hover:shadow-[0_16px_40px_rgba(234,88,12,0.55)] border border-white/10 whitespace-nowrap transition-all duration-300 transform active:scale-95 disabled:opacity-60 disabled:pointer-events-none"
            >
              {isExporting ? (
                <>
                  <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span className="font-black tracking-wide">Compiling Artifact...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)] transform group-hover:translate-y-px transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  <span className="font-black tracking-wide">Download PDF</span>
                </>
              )}
            </button>
          </div>

          <div onClick={() => setShowOverlay(false)} className="flex-1 overflow-y-auto custom-dark-scrollbar w-full h-full">
            <div className="flex flex-col items-center py-12 max-[540px]:py-8 px-2">
              <div 
                onClick={(e) => e.stopPropagation()} 
                style={{ width: '794px', transform: `scale(${overlayScale}) translateZ(0)`, transformOrigin: 'top center', backfaceVisibility: 'hidden' }}
              >
                <PaginatedPreview data={resumeData} template={activeTemplate} />
              </div>
            </div>
          </div>
        </div>
      )}

{/* FULL-SCREEN TEMPLATE PICKER */}
{showTemplateModal && (
  <div 
    className="fixed inset-0 z-[90000] w-full h-full bg-slate-50 flex flex-col animate-in fade-in zoom-in-95 duration-400 overflow-hidden"
    style={{ fontFamily: '"Outfit", sans-serif' }}
  >
    {/* Auto-Hiding Centered Premium Header */}
    <div 
      className={`absolute top-0 left-0 w-full z-50 px-6 py-5 sm:px-10 sm:py-6 border-b border-slate-200/60 bg-white/90 backdrop-blur-xl flex justify-center items-center shadow-[0_4px_40px_rgba(0,0,0,0.04)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        isHeaderVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      {/* Perfectly Centered Content */}
      <div className="flex flex-col items-center text-center gap-2 max-w-2xl px-16">
        <span className="bg-amber-100/50 border border-amber-200/50 text-amber-700 text-[10px] sm:text-xs font-medium uppercase tracking-[0.2em] px-3 py-1 rounded-full">
          Gallery
        </span>
      </div>
      
      {/* High-End Tactile Close Button (Absolutely positioned so it doesn't break the text centering) */}
      <button 
        onClick={() => setShowTemplateModal(false)} 
        className="absolute right-6 sm:right-10 cursor-pointer group w-12 h-12 flex items-center justify-center bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-full outline-none shrink-0 border border-slate-200 hover:border-rose-200 shadow-sm hover:shadow-[0_8px_20px_-6px_rgba(225,29,72,0.3)] active:scale-90 transition-all duration-300"
        aria-label="Close gallery"
      >
        <svg className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90 font-light" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    {/* Ambient Background Mesh */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-amber-500/5 to-transparent rounded-full blur-[120px] pointer-events-none z-0"></div>

    {/* Fluid, Upscaled Grid Layout with Scroll Tracker Attached */}
    <div 
      onScroll={handleGalleryScroll}
      className="relative z-10 w-full h-full overflow-y-auto px-6 pt-32 pb-20 sm:px-10 sm:pt-40 lg:px-16 custom-scrollbar"
    >
      <div className="max-w-[1800px] mx-auto w-full">
        {/* Massive Card Sizing (~60% larger minmax targets) */}
        <div className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(380px,1fr))] lg:grid-cols-[repeat(auto-fill,minmax(420px,1fr))] gap-8 sm:gap-10 lg:gap-14">
          {templates.map((tmpl) => (
            <div key={tmpl.id} className="w-full h-full flex transform transition-transform duration-300 hover:-translate-y-2">
              <TemplateThumbnail
                tmpl={tmpl}
                isActive={activeTemplate === tmpl.id}
                onSelect={(id) => {
                  handleSetActiveTemplate(id);
                  setShowTemplateModal(false);
                  
                  const hasSelectedFirst = localStorage.getItem('remo_first_template_selected');
                  if (!hasSelectedFirst) {
                    localStorage.setItem('remo_first_template_selected', 'true');
                    setTimeout(() => { 
                      setTriggerSuccessModal(prev => prev + 1); 
                    }, 1000);
                  }
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
    
  </div>
)}

      {/* FLOATING ACTION HUD (MOBILE) */}
      <button
        onClick={() => setShowOverlay(true)}
        className="group fixed bottom-3 cursor-pointer right-3 z-[45] lg:hidden flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_25px_rgba(16,185,129,0.6)] border border-emerald-200/40 active:scale-95 transition-all duration-300 focus:outline-none"
        aria-label="Toggle dynamic preview"
      >
        <span className="absolute inset-0 rounded-full bg-emerald-400 animate-[ping_2.5s_ease-in-out_infinite] opacity-30"></span>
        <svg className="w-4 h-4 relative z-10 drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      </button>

      {/* DOWNLOADING SCREEN */}
      {isExporting && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-slate-950/50 backdrop-blur-md animate-fade-in">
          
          {/* Hardware-Accelerated (GPU) Animation - No Layout Repaints */}
          <style>{`
            @keyframes smoothSpinScale {
              0% { transform: rotate(0deg) scale(0.85); }
              50% { transform: rotate(180deg) scale(1.15); }
              100% { transform: rotate(360deg) scale(0.85); }
            }
            .loader-smooth {
              animation: smoothSpinScale 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
            }
          `}</style>

          <div className="bg-white p-7 rounded-3xl shadow-[0_24px_60px_-15px_rgba(0,0,0,0.3)] ring-1 ring-slate-900/5 flex flex-col items-center gap-5 max-w-[280px] text-center transform transition-transform duration-300 scale-100 animate-scale-up relative overflow-hidden">
            
            {/* Soft Top Gradient Accent */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-orange-400 to-amber-500"></div>

            <div className="relative flex items-center justify-center w-14 h-14 mt-1">
              {/* Static Track */}
              <div className="absolute inset-0 rounded-full border-[3px] border-slate-100"></div>
              
              {/* Primary Breathing/Scaling Spinner - Optimized for GPU */}
              <div className="absolute inset-0 rounded-full border-[3px] border-orange-500 border-r-transparent border-t-transparent loader-smooth drop-shadow-[0_2px_4px_rgba(249,115,22,0.3)]"></div>
            </div>
            
            <div className="flex flex-col gap-1.5 px-2">
              <h3 className="text-base font-black text-slate-900 tracking-tight">Preparing your PDF</h3>
              <p className="text-xs text-slate-500 font-semibold leading-relaxed">Locking in your layout and generating your final document...</p>
            </div>
          </div>
        </div>
      )}

      {/* NAVIGATING BACKWARDS SCREEN */}
{isNavigating && (
  <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-slate-950/50 backdrop-blur-md animate-fade-in">
    
    {/* Hardware-Accelerated (GPU) Animation */}
    <style>{`
      @keyframes smoothSpinScale {
        0% { transform: rotate(0deg) scale(0.85); }
        50% { transform: rotate(180deg) scale(1.15); }
        100% { transform: rotate(360deg) scale(0.85); }
      }
      .loader-smooth {
        animation: smoothSpinScale 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
      }
    `}</style>

    <div className="bg-white p-7 rounded-3xl shadow-[0_24px_60px_-15px_rgba(0,0,0,0.3)] ring-1 ring-slate-900/5 flex flex-col items-center gap-5 max-w-[280px] text-center transform transition-transform duration-300 scale-100 animate-scale-up relative overflow-hidden">
      
      {/* Soft Top Gradient Accent */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-slate-700 to-slate-900"></div>

      <div className="relative flex items-center justify-center w-14 h-14 mt-1">
        {/* Static Track */}
        <div className="absolute inset-0 rounded-full border-[3px] border-slate-100"></div>
        
        {/* Primary Breathing/Scaling Spinner - Optimized for GPU */}
        <div className="absolute inset-0 rounded-full border-[3px] border-slate-800 border-r-transparent border-t-transparent loader-smooth drop-shadow-[0_2px_4px_rgba(15,23,42,0.3)]"></div>
      </div>
      
      <div className="flex flex-col gap-1.5 px-2">
        <h3 className="text-base font-black text-slate-900 tracking-tight">Returning...</h3>
        <p className="text-xs text-slate-500 font-semibold leading-relaxed">Safely storing your workspace state and moving back.</p>
      </div>
    </div>
  </div>
)}

      {/* TOAST NOTIFICATIONS */}
      <div className={`fixed bottom-4 right-4 z-[1000001] transition-all duration-300 max-w-[280px] max-[340px]:max-w-[240px] transform ${toast.show ? "translate-y-0 opacity-100 scale-100" : "translate-y-4 opacity-0 scale-95 pointer-events-none"}`}>
        {toast.type === 'success' && (
          <div className="flex items-center gap-2.5 bg-slate-900 text-white p-3 rounded-xl border border-white/10 shadow-lg">
            <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            </div>
            <p className="text-[11px] font-medium text-slate-200 leading-tight">{toast.message}</p>
          </div>
        )}
        {toast.type === 'error' && (
          <div className="flex items-center gap-2.5 bg-red-950 text-red-200 p-3 rounded-xl border border-red-900/40 shadow-lg">
            <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 shrink-0">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </div>
            <p className="text-[11px] font-medium text-red-300 leading-tight">{toast.message}</p>
          </div>
        )}
      </div>
    </div>
  );
}