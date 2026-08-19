import React from 'react';

export default function CyberMatrix({
  info,
  data,
  formatDates,
  hasContact,
  validSummary,
  validExperience,
  validSkills,
  validEducation,
  validCertificates,
  validLanguages,
  validHobbies,
  validReferences,
  firstName,
  lastName
}) {
  return (
    <div id="resume-raw-content" className="w-full h-full flex flex-col bg-[#FCF9F9] text-slate-800 relative" style={{ fontFamily: "'Inter', sans-serif" }}>
      
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Montserrat:wght@400;500;600;700&display=swap');
        .font-montserrat { font-family: 'Montserrat', sans-serif; }
      `}} />

      {/* TOP HEADER */}
      <header className="shrink-0 w-full flex flex-col px-12 pt-12 pb-6">
        
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-8 flex-1">
            {/* PHOTO WITH PREMIUM BORDER */}
            {info.photo && (
              <div className="w-[120px] h-[120px] shrink-0 rounded-lg border-2 border-[#BD707E] p-1 bg-white shadow-sm transform rotate-3">
                <div className="w-full h-full rounded-md overflow-hidden bg-slate-100 transform -rotate-3">
                  <img src={info.photo} alt="Profile" className="w-full h-full object-cover" />
                </div>
              </div>
            )}
            
            {/* NAME & TITLE WITH PREMIUM LINE */}
            <div className="flex flex-col justify-center">
              {firstName && (
                <h1 className="text-[52px] font-montserrat font-bold uppercase leading-[1.1] tracking-wider text-[#341931]">
                  {firstName} <span className="text-[#BD707E] font-light">{lastName}</span>
                </h1>
              )}
              {info.jobTitle && (
                <div className="mt-1 flex flex-col gap-2">
                  <h2 className="text-[14px] font-bold uppercase tracking-[0.25em] text-[#341931]">
                    {info.jobTitle}
                  </h2>
                  <div className="w-16 h-[2px] bg-[#BD707E]"></div>
                </div>
              )}
            </div>
          </div>

          {/* CONTACT INFO */}
          {hasContact && (
            <div className="flex flex-col gap-2.5 shrink-0 border-l-2 border-[#BD707E]/30 pl-6 min-w-[220px]">
              {info.phone && (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded bg-[#341931] flex items-center justify-center shrink-0 text-white shadow-sm">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M20 15.5c-1.2 0-2.4-.2-3.6-.6-.3-.1-.7 0-1 .2l-2.2 2.2c-2.8-1.4-5.1-3.8-6.6-6.6l2.2-2.2c.3-.3.4-.7.2-1-.4-1.2-.6-2.4-.6-3.6 0-.6-.4-1-1-1H4c-.6 0-1 .4-1 1 0 9.4 7.6 17 17 17 .6 0 1-.4 1-1v-3.5c0-.6-.4-1-1-1zM19 12h2a9 9 0 00-9-9v2c3.9 0 7.1 3.2 7.1 7.1z"/><path d="M15 12h2c0-2.8-2.2-5-5-5v2c1.7 0 3 1.3 3 3z"/></svg>
                  </div>
                  <span className="text-[11px] text-[#341931] font-medium">{info.phone}</span>
                </div>
              )}
              {info.email && (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded bg-[#341931] flex items-center justify-center shrink-0 text-white shadow-sm">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                  </div>
                  <span className="text-[11px] text-[#341931] font-medium">{info.email}</span>
                </div>
              )}
              {info.location && (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded bg-[#341931] flex items-center justify-center shrink-0 text-white shadow-sm">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5c-1.4 0-2.5-1.1-2.5-2.5s1.1-2.5 2.5-2.5 2.5 1.1 2.5 2.5-1.1 2.5-2.5 2.5z"/></svg>
                  </div>
                  <span className="text-[11px] text-[#341931] font-medium">{info.location}</span>
                </div>
              )}
              {info.website && (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded bg-[#341931] flex items-center justify-center shrink-0 text-white shadow-sm">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
                  </div>
                  <span className="text-[11px] text-[#341931] font-medium">{info.website}</span>
                </div>
              )}
              {info.linkedin && (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded bg-[#341931] flex items-center justify-center shrink-0 text-white shadow-sm">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14m-.5 15.5v-5.3a3.26 3.26 0 00-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 011.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 001.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 00-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>
                  </div>
                  <span className="text-[11px] text-[#341931] font-medium">{info.linkedin}</span>
                </div>
              )}
              {info.secondarySocial && (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded bg-[#341931] flex items-center justify-center shrink-0 text-white shadow-sm">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M10.586 13.414a1 1 0 01-1.414 0 4 4 0 010-5.656l2.828-2.829a4 4 0 015.656 5.656l-1.414 1.414a1 1 0 11-1.414-1.414l1.414-1.414a2 2 0 10-2.828-2.828l-2.828 2.828a2 2 0 000 2.828 1 1 0 010 1.414zm2.828-2.828a1 1 0 011.414 0 4 4 0 010 5.656l-2.828 2.829a4 4 0 01-5.656-5.656l1.414-1.414a1 1 0 111.414 1.414l-1.414 1.414a2 2 0 102.828 2.828l2.828-2.828a2 2 0 000-2.828 1 1 0 010-1.414z"/>
                    </svg>
                  </div>
                  <span className="text-[11px] text-[#341931] font-medium">{info.secondarySocial}</span>
                </div>
              )}
              {info.github && (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded bg-[#341931] flex items-center justify-center shrink-0 text-white shadow-sm">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M10.586 13.414a1 1 0 01-1.414 0 4 4 0 010-5.656l2.828-2.829a4 4 0 015.656 5.656l-1.414 1.414a1 1 0 11-1.414-1.414l1.414-1.414a2 2 0 10-2.828-2.828l-2.828 2.828a2 2 0 000 2.828 1 1 0 010 1.414zm2.828-2.828a1 1 0 011.414 0 4 4 0 010 5.656l-2.828 2.829a4 4 0 01-5.656-5.656l1.414-1.414a1 1 0 111.414 1.414l-1.414 1.414a2 2 0 102.828 2.828l2.828-2.828a2 2 0 000-2.828 1 1 0 010-1.414z"/>
                    </svg>
                  </div>
                  <span className="text-[11px] text-[#341931] font-medium">{info.github}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* PERSONAL DETAILS */}
        {(info.dob || info.nationality || info.gender || info.drivingLicense) && (
          <div className="w-full mt-6">
            <div className="shrink-0 flex items-center gap-3 mb-4 mt-2">
              <div className="w-7 h-7 rounded bg-[#341931] flex items-center justify-center text-white shrink-0 shadow-sm">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
              </div>
              <h2 className="text-[14px] font-montserrat font-bold tracking-widest text-[#341931] uppercase">Personal Details</h2>
              <div className="flex-1 border-b border-[#BD707E]/40"></div>
            </div>
            
            <div className="flex flex-row flex-wrap items-center gap-6 w-full pl-10">
              {info.dob && (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded bg-[#341931] flex items-center justify-center shrink-0 text-white shadow-sm">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM7 12h5v5H7v-5z"/></svg>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#BD707E]">DOB:</span>
                    <span className="text-[11px] text-[#341931] font-medium">{info.dob}</span>
                  </div>
                </div>
              )}
              
              {info.nationality && (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded bg-[#341931] flex items-center justify-center shrink-0 text-white shadow-sm">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.91 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.9-4.33-3.56zm2.95-8H5.08c1.96-1.66 3.49-2.93 5.33-3.56C9.81 5.55 9.35 6.75 9.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z"/></svg>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#BD707E]">Nationality:</span>
                    <span className="text-[11px] text-[#341931] font-medium">{info.nationality}</span>
                  </div>
                </div>
              )}
              
              {info.gender && (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded bg-[#341931] flex items-center justify-center shrink-0 text-white shadow-sm">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#BD707E]">Gender:</span>
                    <span className="text-[11px] text-[#341931] font-medium">{info.gender}</span>
                  </div>
                </div>
              )}
              
              {info.drivingLicense && (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded bg-[#341931] flex items-center justify-center shrink-0 text-white shadow-sm">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zm-9-9c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm0-4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm6 10H6v-1.5c0-1.99 4-3.5 6-3.5s6 1.51 6 3.5V16zm-9.97-2c.62-1.11 2.5-1.8 3.97-1.8s3.35.69 3.97 1.8H8.03z"/></svg>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#BD707E]">License:</span>
                    <span className="text-[11px] text-[#341931] font-medium">{info.drivingLicense}</span>
                  </div>
                </div>
              )}
              
            </div>
          </div>
        )}
      </header>

      {/* PROFESSIONAL SUMMARY */}
      {validSummary && (
        <section id="summary-section" className="w-full px-12 mb-4 shrink-0">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-7 h-7 rounded bg-[#341931] flex items-center justify-center text-white shrink-0 shadow-sm">
               <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
            </div>
            <h2 className="text-[14px] font-montserrat font-bold tracking-widest text-[#341931] uppercase">Professional Summary</h2>
            <div className="flex-1 border-b border-[#BD707E]/40"></div>
          </div>
          <p className="text-[11.5px] text-[#475569] leading-[1.8] pl-10 pr-2">
            {validSummary}
          </p>
        </section>
      )}

      {/* TWO COLUMNS */}
      <div className="flex flex-1 w-full px-12 pb-8">
        
        {/* LEFT COLUMN: MAIN CONTENT */}
        <main className="w-[58%] pr-8 flex flex-col border-r border-[#BD707E]/20">
          
          {/* EXPERIENCE */}
          {validExperience.length > 0 && (
            <div className="shrink-0 flex items-center gap-3 mb-4 mt-2">
              <div className="w-7 h-7 rounded bg-[#341931] flex items-center justify-center text-white shrink-0 shadow-sm">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/></svg>
              </div>
              <h2 className="text-[14px] font-montserrat font-bold tracking-widest text-[#341931] uppercase">Experience</h2>
              <div className="flex-1 border-b border-[#BD707E]/40"></div>
            </div>
          )}
          
          {validExperience.flatMap((exp, index) => {
            const elements = [];
            const isLast = index === validExperience.length - 1;

            elements.push(
              <div key={`exp-h-${index}`} className="shrink-0 relative pl-6 mb-2 mt-2">
                <div className="absolute left-[7px] top-1.5 w-[6px] h-[6px] rounded-sm bg-[#BD707E]"></div>
                <div className="absolute left-[9px] top-3 bottom-[-10px] w-px bg-[#BD707E]/30"></div>
                
                <div className="flex justify-between items-start">
                  <h3 className="text-[13px] font-bold text-[#341931] leading-snug">{exp.role}</h3>
                  <span className="text-[10.5px] text-[#64748B] font-semibold shrink-0 ml-2">{formatDates(exp.startDate, exp.endDate, exp.isCurrent)}</span>
                </div>
                <h4 className="text-[11.5px] text-[#BD707E] font-semibold mt-0.5">{exp.company}</h4>
              </div>
            );

            if (exp.achievements) {
              exp.achievements.forEach((ach, aIdx) => {
                if (ach.trim()) {
                  elements.push(
                    <div key={`exp-b-${index}-${aIdx}`} className="shrink-0 relative pl-6 pr-2 mb-1.5 text-[11px] text-[#475569] leading-[1.6]">
                      <div className={`absolute left-[9px] ${isLast && aIdx === exp.achievements.length - 1 ? 'h-0' : 'h-full'} w-px bg-[#BD707E]/30 top-0`}></div>
                      <span className="absolute left-[20px] top-[0px] text-[#BD707E] font-bold text-[14px] leading-none">›</span>
                      <div className="pl-[24px]">{ach}</div>
                    </div>
                  );
                }
              });
            }
            elements.push(<div key={`exp-s-${index}`} className="shrink-0 h-4 w-full relative"><div className={`absolute left-[9px] ${isLast ? 'h-0' : 'h-full'} w-px bg-[#BD707E]/30 top-0`}></div></div>);
            return elements;
          })}

          {/* PROJECTS */}
          {data.projects && data.projects.length > 0 && (
            <div className="shrink-0 flex items-center gap-3 mb-4 mt-2">
              <div className="w-7 h-7 rounded bg-[#341931] flex items-center justify-center text-white shrink-0 shadow-sm">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
              </div>
              <h2 className="text-[14px] font-montserrat font-bold tracking-widest text-[#341931] uppercase">Projects</h2>
              <div className="flex-1 border-b border-[#BD707E]/40"></div>
            </div>
          )}

          {data.projects && data.projects.flatMap((proj, index) => {
            const nodes = [];
            nodes.push(
              <div key={`proj-h-${index}`} className="shrink-0 pl-10 pr-2 flex justify-between items-start mb-1 mt-1">
                <h3 className="text-[12px] font-bold text-[#341931]">{proj.title}</h3>
                {proj.date && <span className="text-[10px] text-[#64748B] font-semibold">{proj.date}</span>}
              </div>
            );
            if (proj.description) {
              nodes.push(
                <p key={`proj-d-${index}`} className="shrink-0 pl-10 pr-2 text-[11px] text-[#475569] leading-[1.6] mb-4 whitespace-pre-wrap">
                  {proj.description}
                </p>
              );
            }
            return nodes;
          })}

          {/* REFERENCES */}
          {validReferences && validReferences.length > 0 && (
            <div className="mt-4">
              <div className="shrink-0 flex items-center gap-3 mb-4 mt-2">
                <div className="w-7 h-7 rounded bg-[#341931] flex items-center justify-center text-white shrink-0 shadow-sm">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16.5 12c1.38 0 2.49-1.12 2.49-2.5S17.88 7 16.5 7C15.12 7 14 8.12 14 9.5s1.12 2.5 2.5 2.5zM9 11c1.66 0 2.99-1.34 2.99-3S10.66 5 9 5C7.34 5 6 6.34 6 8s1.34 3 3 3zm7.5 3c-1.83 0-5.5.92-5.5 2.75V19h11v-2.25c0-1.83-3.67-2.75-5.5-2.75zM9 13c-2.33 0-7 1.17-7 3.5V19h7v-2.25c0-.85.33-2.34 2.37-3.47C10.5 13.1 9.7 13 9 13z"/>
                  </svg>
                </div>
                <h2 className="text-[14px] font-montserrat font-bold tracking-widest text-[#341931] uppercase">References</h2>
                <div className="flex-1 border-b border-[#BD707E]/40"></div>
              </div>
              <div className="pl-10 grid grid-cols-2 gap-4">
                {validReferences.map((ref, idx) => (
                  <div key={`ref-${idx}`} className="text-[11px] text-[#475569]">
                    <h3 className="font-bold text-[#341931]">{ref.name}</h3>
                    {(ref.role || ref.company) && (
                      <p className="text-[#BD707E] font-semibold mt-0.5">
                        {ref.role}{ref.role && ref.company ? `, ${ref.company}` : ref.company}
                      </p>
                    )}
                    {ref.contact && <p className="text-[10.5px] mt-1 italic leading-snug">{ref.contact}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>

        {/* RIGHT COLUMN: ASIDE CONTENT */}
        <aside className="w-[42%] pl-8 flex flex-col">

          {/* SKILLS */}
          {validSkills.length > 0 && (
            <div className="shrink-0 flex items-center gap-3 mb-4 mt-2">
              <div className="w-7 h-7 rounded bg-[#341931] flex items-center justify-center text-white shrink-0 shadow-sm">
                 <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/></svg>
              </div>
              <h2 className="text-[14px] font-montserrat font-bold tracking-widest text-[#341931] uppercase">Skills</h2>
              <div className="flex-1 border-b border-[#BD707E]/40"></div>
            </div>
          )}

          {validSkills.map((skill, idx) => {
            const name = typeof skill === 'string' ? skill : (skill.name || skill.skill);
            const level = typeof skill === 'string' ? 3 : (skill.level || 3);
            const barWidth = (level / 5) * 100; 

            return (
              <div key={`skill-${idx}`} className="shrink-0 mb-3.5 w-full pl-2">
                <h4 className="text-[11px] font-semibold text-[#341931] mb-1.5">{name}</h4>
                <div className="w-full bg-[#BD707E]/20 h-[4px] rounded-full overflow-hidden">
                  <div className="bg-[#BD707E] h-full rounded-full" style={{ width: `${barWidth}%` }}></div>
                </div>
              </div>
            );
          })}

          {/* EDUCATION */}
          {validEducation.length > 0 && (
            <div className="shrink-0 flex items-center gap-3 mb-4 mt-4">
              <div className="w-7 h-7 rounded bg-[#341931] flex items-center justify-center text-white shrink-0 shadow-sm">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zm6.83 6L12 12.8 5.17 9 12 5.28 18.83 9z"/></svg>
              </div>
              <h2 className="text-[14px] font-montserrat font-bold tracking-widest text-[#341931] uppercase">Education</h2>
              <div className="flex-1 border-b border-[#BD707E]/40"></div>
            </div>
          )}
          
          {validEducation.flatMap((edu, idx) => {
            const elements = [];
            elements.push(
              <h3 key={`edu-d-${idx}`} className="shrink-0 text-[12px] font-bold text-[#341931] mb-0.5 pl-2">{edu.degree}</h3>
            );
            
            elements.push(
              <div key={`edu-s-${idx}`} className="shrink-0 flex justify-between items-start mb-1 pl-2">
                <p className="text-[10.5px] text-[#BD707E] font-semibold">{edu.school}</p>
                <p className="text-[10px] text-[#64748B] font-semibold ml-2 text-right shrink-0">{formatDates(edu.startDate, edu.endDate, edu.isCurrent)}</p>
              </div>
            );

            if (edu.description) {
              elements.push(
                <p key={`edu-desc-${idx}`} className="shrink-0 text-[10.5px] text-[#475569] leading-[1.6] mb-3 whitespace-pre-wrap pl-2">
                  {edu.description}
                </p>
              );
            } else {
              elements.push(<div key={`edu-sp-${idx}`} className="h-2"></div>);
            }

            return elements;
          })}

          {/* CERTIFICATIONS */}
          {validCertificates.length > 0 && (
            <div className="shrink-0 flex items-center gap-3 mb-4 mt-2">
              <div className="w-7 h-7 rounded bg-[#341931] flex items-center justify-center text-white shrink-0 shadow-sm">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/></svg>
              </div>
              <h2 className="text-[14px] font-montserrat font-bold tracking-widest text-[#341931] uppercase">Certifications</h2>
              <div className="flex-1 border-b border-[#BD707E]/40"></div>
            </div>
          )}

          {validCertificates.map((cert, index) => (
            <div key={`cert-${index}`} className="shrink-0 relative pl-4 mb-3">
              <span className="absolute left-0 top-1.5 text-[#BD707E] text-[10px]">›</span>
              <h3 className="text-[11px] font-semibold text-[#341931] leading-tight">{cert.title}</h3>
              
              <div className="flex justify-between items-start mt-0.5">
                {cert.issuer && <p className="text-[10px] text-[#BD707E] font-medium">{cert.issuer}</p>}
                {cert.date && <p className="text-[9px] text-[#64748B] font-semibold ml-2 shrink-0">{cert.date}</p>}
              </div>
              
              {cert.description && (
                <p className="text-[10.5px] text-[#475569] mt-1 leading-[1.6] whitespace-pre-wrap">
                  {cert.description}
                </p>
              )}
            </div>
          ))}

          {/* LANGUAGES */}
          {validLanguages.length > 0 && (
             <div className="shrink-0 flex items-center gap-3 mb-4 mt-3">
               <div className="w-7 h-7 rounded bg-[#341931] flex items-center justify-center text-white shrink-0 shadow-sm">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.91 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.9-4.33-3.56zm2.95-8H5.08c1.96-1.66 3.49-2.93 5.33-3.56C9.81 5.55 9.35 6.75 9.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z"/></svg>
               </div>
               <h2 className="text-[14px] font-montserrat font-bold tracking-widest text-[#341931] uppercase">Languages</h2>
               <div className="flex-1 border-b border-[#BD707E]/40"></div>
             </div>
          )}
          {validLanguages.map((lang, idx) => (
            <div key={`lang-${idx}`} className="shrink-0 mb-2 flex justify-between items-center pl-2">
               <span className="text-[11px] font-bold text-[#341931]">{lang.name}</span>
               {lang.proficiency && <span className="text-[10px] text-[#64748B] font-semibold">{lang.proficiency}</span>}
            </div>
          ))}

          {/* HOBBIES */}
          {validHobbies && validHobbies.length > 0 && (
            <div className="mt-4">
              <div className="shrink-0 flex items-center gap-3 mb-4 mt-2">
                <div className="w-7 h-7 rounded bg-[#341931] flex items-center justify-center text-white shrink-0 shadow-sm">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </div>
                <h2 className="text-[14px] font-montserrat font-bold tracking-widest text-[#341931] uppercase">Hobbies</h2>
                <div className="flex-1 border-b border-[#BD707E]/40"></div>
              </div>
              {validHobbies.map((hobby, idx) => (
                <div key={`hobby-${idx}`} className="shrink-0 mb-2 pl-4 relative">
                  <span className="absolute left-0 top-1 text-[#BD707E] text-[10px]">›</span>
                  <span className="text-[11px] text-[#475569] font-medium">{hobby}</span>
                </div>
              ))}
            </div>
          )}

        </aside>
      </div>
    </div>
  );
}