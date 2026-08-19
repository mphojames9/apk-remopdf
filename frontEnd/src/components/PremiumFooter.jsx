import React from 'react';
import { Link } from 'react-router-dom';

export default function PremiumFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer 
      className="w-full bg-slate-900 text-slate-400 tracking-wide border-t border-slate-800/60 selection:bg-amber-500 selection:text-slate-900"
      style={{ fontFamily: '"Outfit", sans-serif' }}
    >
      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8 md:px-12 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Brand & Address Column */}
          <div className="md:col-span-5 space-y-6">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl tracking-tight text-white">
                Remo<span className="text-red-500">PDF</span>
              </span>
            </div>
            
            {/* Premium Address Block with Icon */}
            <div className="flex items-start gap-3">
              <i className="fa-solid fa-location-dot text-slate-500 mt-1"></i>
              <p className="text-xs sm:text-sm text-slate-400 font-light leading-relaxed max-w-sm">
                19 Ameshoff St, Braamfontein, <br />
                Johannesburg, 2000, South Africa
              </p>
            </div>
          </div>

          {/* Links Columns Grid */}
          <div className="md:col-span-4 grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest">Company & Tools</h4>
              <ul className="space-y-2.5">
                <li>
                  <Link 
                    to="/about" 
                    className="text-[0.95rem] font-medium tracking-wide transition-colors duration-200 text-slate-400 hover:text-white block"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/workspace" 
                    className="text-[0.95rem] font-medium tracking-wide transition-colors duration-200 text-slate-400 hover:text-white block"
                  >
                    PDF Editor
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/ResumeBuilder" 
                    className="text-[0.95rem] font-medium tracking-wide transition-colors duration-200 text-slate-400 hover:text-white block"
                  >
                    Resume Builder
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/Contact" 
                    className="text-[0.95rem] font-medium tracking-wide transition-colors duration-200 text-slate-400 hover:text-white flex items-center gap-1.5 group"
                  >
                    Contact Us
                    <i className="fa-solid fa-arrow-right text-[10px] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-amber-400"></i>
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest">Legal</h4>
              <ul className="space-y-2.5">
                <li>
                  <Link 
                    to="/PrivacyPolicy" 
                    className="text-[0.95rem] font-medium tracking-wide transition-colors duration-200 text-slate-400 hover:text-white block"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/terms-of-use" 
                    className="text-[0.95rem] font-medium tracking-wide transition-colors duration-200 text-slate-400 hover:text-white block"
                  >
                    Terms of Use
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Premium Socials Column */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest">Connect With Us</h4>
            <div className="flex items-center gap-3">
              {/* Facebook */}
              <Link 
                to="#" 
                aria-label="Facebook"
                className="w-10 h-10 rounded-xl bg-slate-800/50 hover:bg-blue-600 border border-slate-700/50 hover:border-blue-500 text-slate-300 hover:text-white flex items-center justify-center text-base transition-all duration-300 shadow-inner hover:shadow-[0_4px_20px_rgba(37,99,235,0.4)] hover:-translate-y-1"
              >
                <i className="fa-brands fa-facebook-f"></i>
              </Link>
              {/* Instagram */}
              <Link 
                to="#" 
                aria-label="Instagram"
                className="w-10 h-10 rounded-xl bg-slate-800/50 hover:bg-gradient-to-tr hover:from-amber-500 hover:via-red-500 hover:to-purple-600 border border-slate-700/50 hover:border-transparent text-slate-300 hover:text-white flex items-center justify-center text-base transition-all duration-300 shadow-inner hover:shadow-[0_4px_20px_rgba(239,68,68,0.4)] hover:-translate-y-1"
              >
                <i className="fa-brands fa-instagram"></i>
              </Link>
              {/* TikTok */}
              <Link 
                to="#" 
                aria-label="TikTok"
                className="w-10 h-10 rounded-xl bg-slate-800/50 hover:bg-black border border-slate-700/50 hover:border-slate-800 text-slate-300 hover:text-white flex items-center justify-center text-base transition-all duration-300 shadow-inner hover:shadow-[0_4px_20px_rgba(0,0,0,0.6)] hover:-translate-y-1"
              >
                <i className="fa-brands fa-tiktok"></i>
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom Area */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] sm:text-xs font-medium text-slate-500">
          <p>© {currentYear} Remopdf Limited. All rights reserved.</p>
          <div className="flex items-center gap-1.5 text-slate-500 cursor-default">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            All Systems Operational
          </div>
        </div>
      </div>
    </footer>
  );
}