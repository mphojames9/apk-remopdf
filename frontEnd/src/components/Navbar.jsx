import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  // Desktop Dropdown State ('tools', 'company', 'legal', or null)
  const [activeDesktopDropdown, setActiveDesktopDropdown] = useState(null);
  
  // Mobile Menu & Accordion States
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMobileAccordion, setActiveMobileAccordion] = useState(null);
  
  const navRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Full Suite of Premium Tools mapped to your Home.jsx handlers
  const documentTools = [
    { name: "Merge PDFs", id: "merge", icon: "fa-layer-group", desc: "Combine multiple files into one" },
    { name: "Split PDF", id: "split", icon: "fa-scissors", desc: "Extract pages or separate files" },
    { name: "Compress PDF", id: "compress", icon: "fa-file-zipper", desc: "Reduce file footprint instantly" },
    { name: "PDF to Word", id: "pdfToWord", icon: "fa-file-word", desc: "Convert to editable DOCX format" },
    { name: "Protect PDF", id: "protect", icon: "fa-shield-halved", desc: "Add robust password protection" },
    { name: "Unlock PDF", id: "unlock", icon: "fa-lock-open", desc: "Remove encryption restrictions" },
    { name: "Change Password", id: "changePwd", icon: "fa-key", desc: "Update access authorizations" },
    { name: "PDF to Excel", id: "pdfToExcel", icon: "fa-file-excel", desc: "Export sheets to clear tables" },
    { name: "PDF to Image", id: "pdfToImg", icon: "fa-file-image", desc: "Turn pages into sharp JPEG/PNG" },
    { name: "Image to PDF", id: "imageToPdf", icon: "fa-image", desc: "Compile screenshots to document" },
    { name: "PDF to PowerPoint", id: "pdfToPpt", icon: "fa-file-powerpoint", desc: "Convert pages into presentation slides" }
  ];

  const companyLinks = [
    { name: "About Us", path: "/about", icon: "fa-building" },
    { name: "Contact Support", path: "/contact", icon: "fa-headset" }
  ];

  const legalLinks = [
    { name: "Privacy Policy", path: "/PrivacyPolicy", icon: "fa-user-shield" },
    { name: "Terms & Conditions", path: "/terms-of-use", icon: "fa-scale-balanced" }
  ];

  // Auto-hide navbar on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 60) {
        setIsVisible(false);
        setActiveDesktopDropdown(null);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Click outside to close desktop menus
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setActiveDesktopDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Lock scroll & contain overscroll when mobile menu is active
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

  // Dispatches actions straight to Home.jsx custom triggers
  const handleOpenTool = (toolId) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('openToolModal', { detail: toolId }));
      }, 300);
    } else {
      window.dispatchEvent(new CustomEvent('openToolModal', { detail: toolId }));
    }
    setActiveDesktopDropdown(null);
    setIsMobileMenuOpen(false);
    setActiveMobileAccordion(null);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setActiveMobileAccordion(null);
  };

  const toggleMobileAccordion = (section) => {
    setActiveMobileAccordion(activeMobileAccordion === section ? null : section);
  };

  return (
    <>
      {/* --- DESKTOP HEADER BAR --- */}
      <nav 
        ref={navRef}
        className={`fixed top-0 inset-x-0 py-3.5 px-4 lg:px-8 xl:px-12 bg-white/90 backdrop-blur-2xl border-b border-slate-200/70 shadow-[0_4px_30px_rgba(0,0,0,0.04)] z-40 transition-all duration-500 ease-out ${
          isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="max-w-[1440px] mx-auto flex justify-between items-center relative">
          
          {/* Logo Brand Title */}
          <div className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2 z-[70]">
            <Link to="/" onClick={closeMobileMenu} className="flex items-center gap-2 outline-none rounded-lg group">
              <span className="font-black text-[1.25rem] text-slate-800 tracking-tight">
                Remo<span className="text-red-600">PDF</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-8 xl:gap-10 font-semibold text-slate-600 text-sm">
            
            {/* Tools Grid Dynamic Flyout */}
            <div 
              className="relative py-2" 
              onMouseEnter={() => setActiveDesktopDropdown('tools')}
              onMouseLeave={() => setActiveDesktopDropdown(null)}
            >
              <button className={`flex items-center gap-1.5 transition-colors duration-200 outline-none ${activeDesktopDropdown === 'tools' ? 'text-red-600' : 'hover:text-slate-900'}`}>
                Tools
                <i className={`fa-solid fa-chevron-down text-[10px] transition-transform duration-300 ${activeDesktopDropdown === 'tools' ? '-rotate-180 text-red-600' : 'text-slate-400'}`}></i>
              </button>
              
              <div className={`absolute top-full left-1/2 -translate-x-1/2 pt-2 w-[580px] transition-all duration-300 transform origin-top-center ${activeDesktopDropdown === 'tools' ? 'opacity-100 visible scale-y-100 translate-y-0' : 'opacity-0 invisible scale-y-95 translate-y-2'}`}>
                <div className="bg-white border border-slate-200 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.08)] p-5 relative overflow-hidden">
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-red-500 to-orange-500"></div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 mb-3">Document Core Suite</p>
                  <div className="grid grid-cols-2 gap-2">
                    {documentTools.map((tool) => (
                      <button
                        key={tool.name}
                        onClick={() => handleOpenTool(tool.id)}
                        className="group flex items-start gap-3.5 w-full text-left px-3 py-2.5 rounded-2xl hover:bg-slate-50 transition-all duration-200"
                      >
                        <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-red-600 group-hover:bg-red-50 group-hover:border-red-100 transition-colors shrink-0 shadow-sm">
                          <i className={`fa-solid ${tool.icon} text-xs`}></i>
                        </div>
                        <div>
                          <span className="block text-slate-800 text-sm font-bold group-hover:text-red-600 transition-colors">{tool.name}</span>
                          <span className="block text-xs font-medium text-slate-500 line-clamp-1 mt-0.5">{tool.desc}</span>
                        </div>
                      </button>
                    ))}
                    
                  </div>
                </div>
              </div>
            </div>

            <Link to="/ResumeBuilder" className="transition-colors duration-200 hover:text-slate-900 relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-px after:bg-red-600 after:transition-all hover:after:w-full">
              Resume Builder
            </Link>


            {/* Company Link Dropdown */}
            <div 
              className="relative py-2" 
              onMouseEnter={() => setActiveDesktopDropdown('company')}
              onMouseLeave={() => setActiveDesktopDropdown(null)}
            >
              <button className={`flex items-center gap-1.5 transition-colors duration-200 outline-none ${activeDesktopDropdown === 'company' ? 'text-amber-600' : 'hover:text-slate-900'}`}>
                Company
                <i className={`fa-solid fa-chevron-down text-[10px] transition-transform duration-300 ${activeDesktopDropdown === 'company' ? '-rotate-180 text-amber-600' : 'text-slate-400'}`}></i>
              </button>
              
              <div className={`absolute top-full left-0 pt-2 w-[220px] transition-all duration-300 transform origin-top-center ${activeDesktopDropdown === 'company' ? 'opacity-100 visible scale-y-100 translate-y-0' : 'opacity-0 invisible scale-y-95 translate-y-2'}`}>
                <div className="bg-white border border-slate-200 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.08)] p-2 relative overflow-hidden">
                  <div className="absolute top-0 inset-x-0 h-1 bg-amber-400"></div>
                  {companyLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.path}
                      onClick={() => setActiveDesktopDropdown(null)}
                      className="group flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-all duration-200"
                    >
                      <i className={`fa-solid ${link.icon} text-slate-400 group-hover:text-amber-600 text-sm`}></i>
                      <span className="text-sm font-semibold text-slate-700 group-hover:text-amber-600 transition-colors">{link.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Legal Dropdown (Privacy & Terms) */}
            <div 
              className="relative py-2" 
              onMouseEnter={() => setActiveDesktopDropdown('legal')}
              onMouseLeave={() => setActiveDesktopDropdown(null)}
            >
              <button className={`flex items-center gap-1.5 transition-colors duration-200 outline-none ${activeDesktopDropdown === 'legal' ? 'text-blue-600' : 'hover:text-slate-900'}`}>
                Legal
                <i className={`fa-solid fa-chevron-down text-[10px] transition-transform duration-300 ${activeDesktopDropdown === 'legal' ? '-rotate-180 text-blue-600' : 'text-slate-400'}`}></i>
              </button>
              
              <div className={`absolute top-full right-0 pt-2 w-[240px] transition-all duration-300 transform origin-top-center ${activeDesktopDropdown === 'legal' ? 'opacity-100 visible scale-y-100 translate-y-0' : 'opacity-0 invisible scale-y-95 translate-y-2'}`}>
                <div className="bg-white border border-slate-200 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.08)] p-2 relative overflow-hidden">
                  <div className="absolute top-0 inset-x-0 h-1 bg-blue-500"></div>
                  {legalLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.path}
                      onClick={() => setActiveDesktopDropdown(null)}
                      className="group flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-all duration-200"
                    >
                      <i className={`fa-solid ${link.icon} text-slate-400 group-hover:text-blue-600 text-sm`}></i>
                      <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-600 transition-colors">{link.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-4 shrink-0 relative z-[70]">
            

            {/* Hamburger Handle Icon Toggle Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all active:scale-95 shadow-sm focus:outline-none"
              aria-label="Toggle Menu"
            >
              <div className="w-4 h-3.5 flex flex-col justify-between relative">
                <span className={`block h-[2px] w-full bg-current transform transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'rotate-45 translate-y-[6px] text-red-600' : ''}`} />
                <span className={`block h-[2px] w-full bg-current transition-all duration-200 ease-in-out ${isMobileMenuOpen ? 'opacity-0 translate-x-2' : 'opacity-100'}`} />
                <span className={`block h-[2px] w-full bg-current transform transition-all duration-300 ease-in-out ${isMobileMenuOpen ? '-rotate-45 -translate-y-[6px] text-red-600' : ''}`} />
              </div>
            </button>
          </div>

        </div>
      </nav>

      {/* --- PREMIUM MOBILE FULL-SCREEN DRAWER OVERLAY --- */}
      <div 
        className={`lg:hidden fixed inset-0 bg-white/98 backdrop-blur-3xl pt-20 sm:pt-24 px-4 overflow-y-auto overscroll-contain transition-all duration-500 ease-in-out z-[39] ${
          isMobileMenuOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-4 invisible'
        }`}
      >
        <div className="flex flex-col space-y-4 pb-28 max-w-md mx-auto mt-2">
          
          {/* Resume Link */}
          <Link 
            to="/ResumeBuilder" 
            onClick={closeMobileMenu} 
            className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-slate-200 text-slate-800 font-bold hover:border-red-200 hover:shadow-md transition-all shadow-sm"
          >
            <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center border border-red-100">
              <i className="fa-solid fa-file-invoice text-sm"></i>
            </div>
            Resume Builder
          </Link>


          {/* Accordion Block 1: Tools */}
          <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden transition-all shadow-sm">
            <button 
              onClick={() => toggleMobileAccordion('tools')}
              className="flex items-center justify-between w-full p-4 text-left font-bold text-slate-800 outline-none hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 border border-slate-200">
                  <i className="fa-solid fa-screwdriver-wrench text-xs"></i>
                </div>
                PDF Processing Tools
              </div>
              <i className={`fa-solid fa-chevron-down text-xs text-slate-400 transition-transform duration-300 ${activeMobileAccordion === 'tools' ? '-rotate-180 text-red-600' : ''}`}></i>
            </button>
            <div 
              className={`transition-all duration-300 ease-in-out overflow-hidden ${activeMobileAccordion === 'tools' ? 'max-h-[1200px] opacity-100 border-t border-slate-100' : 'max-h-0 opacity-0 pointer-events-none'}`}
            >
              <div className="p-3 grid grid-cols-1 gap-2 bg-slate-50/50">
                {documentTools.map((tool) => (
                  <button
                    key={tool.name}
                    onClick={() => handleOpenTool(tool.id)}
                    className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm font-semibold text-slate-600 hover:text-red-600 hover:bg-white hover:shadow-sm rounded-xl border border-transparent hover:border-slate-200 transition-all"
                  >
                    <i className={`fa-solid ${tool.icon} w-5 text-center text-slate-400`}></i>
                    {tool.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Accordion Block 2: Company */}
          <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden transition-all shadow-sm">
            <button 
              onClick={() => toggleMobileAccordion('company')}
              className="flex items-center justify-between w-full p-4 text-left font-bold text-slate-800 outline-none hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 border border-slate-200">
                  <i className="fa-solid fa-building text-xs"></i>
                </div>
                RemoPDF Hub
              </div>
              <i className={`fa-solid fa-chevron-down text-xs text-slate-400 transition-transform duration-300 ${activeMobileAccordion === 'company' ? '-rotate-180 text-amber-600' : ''}`}></i>
            </button>
            <div 
              className={`transition-all duration-300 ease-in-out overflow-hidden ${activeMobileAccordion === 'company' ? 'max-h-[250px] opacity-100 border-t border-slate-100' : 'max-h-0 opacity-0 pointer-events-none'}`}
            >
              <div className="p-3 flex flex-col gap-2 bg-slate-50/50">
                {companyLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm font-semibold text-slate-600 hover:text-amber-600 hover:bg-white hover:shadow-sm rounded-xl border border-transparent hover:border-slate-200 transition-all"
                  >
                    <i className={`fa-solid ${link.icon} w-5 text-center text-slate-400`}></i>
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Accordion Block 3: Legal */}
          <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden transition-all shadow-sm">
            <button 
              onClick={() => toggleMobileAccordion('legal')}
              className="flex items-center justify-between w-full p-4 text-left font-bold text-slate-800 outline-none hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 border border-slate-200">
                  <i className="fa-solid fa-scale-balanced text-xs"></i>
                </div>
                Legal Compliance
              </div>
              <i className={`fa-solid fa-chevron-down text-xs text-slate-400 transition-transform duration-300 ${activeMobileAccordion === 'legal' ? '-rotate-180 text-blue-600' : ''}`}></i>
            </button>
            <div 
              className={`transition-all duration-300 ease-in-out overflow-hidden ${activeMobileAccordion === 'legal' ? 'max-h-[250px] opacity-100 border-t border-slate-100' : 'max-h-0 opacity-0 pointer-events-none'}`}
            >
              <div className="p-3 flex flex-col gap-2 bg-slate-50/50">
                {legalLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm font-semibold text-slate-600 hover:text-blue-600 hover:bg-white hover:shadow-sm rounded-xl border border-transparent hover:border-slate-200 transition-all"
                  >
                    <i className={`fa-solid ${link.icon} w-5 text-center text-slate-400`}></i>
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>


        </div>
      </div>
    </>
  );
}