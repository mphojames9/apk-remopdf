import React from 'react';

export default function AuroraMinimal({
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
  validReferences
}) {
  return (
    <div id="resume-raw-content" className="w-full h-full flex bg-[#FCFBFA] text-[#332D2F] relative font-sans">
      
      {/* =========================================
        LEFT MAIN SIDE (Content)
        Moved to the left, timeline on the left. Flat siblings structure.
        Premium elegant background, deep plum text, rose gold/blush accents.
        =========================================
      */}
      <main className="w-[65%] pt-12 pb-25 px-12 flex flex-col shrink-0 bg-[#FCFBFA] relative">
        {/* EXPERIENCE SECTION */}
        {validExperience.length > 0 && (
          <h2 className="text-[12px] font-bold text-[#3D2C35] uppercase tracking-[0.3em] mb-4 flex items-center gap-3">
            <div className="w-6 h-6 rounded-sm border border-[#DDA7A5]/60 bg-[#DDA7A5]/10 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-[#A86F76]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </div>
            Experience
          </h2>
        )}

        {validExperience.map((exp, index) => (
          <React.Fragment key={`exp-${index}`}>
            {/* 1. Header Row (Date & Title) */}
            <div className="flex w-full relative border-l border-[#EAD5D7] ml-3 pl-6 pt-2 pb-1">
              <div className="absolute -left-[5px] top-[14px] w-2.5 h-2.5 bg-[#DDA7A5] rounded-full shadow-[0_0_6px_rgba(221,167,165,0.5)]"></div>
              <div className="w-[120px] shrink-0">
                <span className="text-[12px] font-medium text-[#A86F76] tracking-wider">
                  {formatDates(exp.startDate, exp.endDate, exp.isCurrent)}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="text-[15px] font-bold text-[#3D2C35] tracking-wide">{exp.role}</h3>
              </div>
            </div>

            {/* 2. Company Row */}
            <div className="flex w-full relative border-l border-[#EAD5D7] ml-3 pl-6 pb-2">
              <div className="w-[120px] shrink-0"></div>
              <div className="flex-1">
                <p className="text-[13px] font-medium text-[#8C5A60]">
                  {exp.company} {exp.location && <span className="text-[#BFA8B1] font-light ml-1">• {exp.location}</span>}
                </p>
              </div>
            </div>

            {/* 3. Description Row */}
            {exp.description && (
              <div className="flex w-full relative border-l border-[#EAD5D7] ml-3 pl-6 pb-2">
                <div className="w-[120px] shrink-0"></div>
                <div className="flex-1">
                  <p className="text-[13px] text-[#5C5255] leading-[1.8] whitespace-pre-wrap font-light">{exp.description}</p>
                </div>
              </div>
            )}

            {/* 4. Individual Bullet Point Rows */}
            {exp.achievements && exp.achievements.map((ach, i) => (
              <div key={`ach-${index}-${i}`} className="flex w-full relative border-l border-[#EAD5D7] ml-3 pl-6 pb-2">
                <div className="w-[120px] shrink-0"></div>
                <div className="flex-1 flex items-start gap-3">
                  <span className="text-[#DDA7A5] mt-1.5 text-[8px] shrink-0">◆</span>
                  <span className="text-[13px] text-[#5C5255] leading-[1.8] font-light">{ach}</span>
                </div>
              </div>
            ))}

            <div className="flex w-full relative border-l border-[#EAD5D7] ml-3 pl-6 pb-4"></div>
          </React.Fragment>
        ))}

        {/* EDUCATION SECTION */}
        {validEducation.length > 0 && (
          <h2 className="text-[12px] font-bold text-[#3D2C35] uppercase tracking-[0.3em] mt-4 mb-4 flex items-center gap-3">
            <div className="w-6 h-6 rounded-sm border border-[#DDA7A5]/60 bg-[#DDA7A5]/10 flex items-center justify-center">
              <svg className="w-3 h-3 text-[#A86F76]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" /></svg>
            </div>
            Education
          </h2>
        )}

        {validEducation.map((edu, index) => (
          <React.Fragment key={`edu-${index}`}>
            <div className="flex w-full relative border-l border-[#EAD5D7] ml-3 pl-6 pt-2 pb-1">
               <div className="absolute -left-[5px] top-[14px] w-2.5 h-2.5 bg-[#FCFBFA] rounded-full border-2 border-[#DDA7A5]"></div>
              <div className="w-[120px] shrink-0">
                <span className="text-[12px] font-medium text-[#A86F76] tracking-wider">
                  {formatDates(edu.startDate, edu.endDate, edu.isCurrent)}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="text-[15px] font-bold text-[#3D2C35] tracking-wide">{edu.degree}</h3>
              </div>
            </div>

            <div className="flex w-full relative border-l border-[#EAD5D7] ml-3 pl-6 pb-2">
              <div className="w-[120px] shrink-0"></div>
              <div className="flex-1">
                <p className="text-[13px] font-medium text-[#8C5A60]">{edu.school}</p>
              </div>
            </div>

            {edu.description && (
              <div className="flex w-full relative border-l border-[#EAD5D7] ml-3 pl-6 pb-2">
                <div className="w-[120px] shrink-0"></div>
                <div className="flex-1">
                  <p className="text-[13px] text-[#5C5255] leading-[1.8] whitespace-pre-wrap font-light">{edu.description}</p>
                </div>
              </div>
            )}
            
            <div className="flex w-full relative border-l border-[#EAD5D7] ml-3 pl-6 pb-4"></div>
          </React.Fragment>
        ))}


        {/* PROJECTS SECTION */}
        {data.projects && data.projects.length > 0 && (
           <h2 className="text-[12px] font-bold text-[#3D2C35] uppercase tracking-[0.3em] mt-4 mb-4 flex items-center gap-3">
             <div className="w-6 h-6 rounded-sm border border-[#DDA7A5]/60 bg-[#DDA7A5]/10 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-[#A86F76]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
            </div>
            Projects
          </h2>
        )}

        {data.projects && data.projects.map((proj, index) => (
          <React.Fragment key={`proj-${index}`}>
             <div className="flex w-full relative border-l border-[#EAD5D7] ml-3 pl-6 pt-2 pb-1">
               <div className="absolute -left-[5px] top-[14px] w-2.5 h-2.5 bg-[#FCFBFA] rounded-full border-2 border-[#DDA7A5]"></div>
               <div className="w-[120px] shrink-0">
                 <span className="text-[12px] font-medium text-[#A86F76] tracking-wider">{proj.date || 'Project'}</span>
               </div>
               <div className="flex-1">
                 <h3 className="text-[15px] font-bold text-[#3D2C35] tracking-wide">{proj.title}</h3>
               </div>
             </div>
             {proj.description && (
               <div className="flex w-full relative border-l border-[#EAD5D7] ml-3 pl-6 pb-2">
                 <div className="w-[120px] shrink-0"></div>
                 <div className="flex-1">
                   <p className="text-[13px] text-[#5C5255] leading-[1.8] font-light">{proj.description}</p>
                 </div>
               </div>
             )}
             <div className="flex w-full relative border-l border-[#EAD5D7] ml-3 pl-6 pb-4"></div>
          </React.Fragment>
        ))}

        {/* CERTIFICATIONS SECTION */}
        {validCertificates && validCertificates.length > 0 && (
           <h2 className="text-[12px] font-bold text-[#3D2C35] uppercase tracking-[0.3em] mt-4 mb-4 flex items-center gap-3">
             <div className="w-6 h-6 rounded-sm border border-[#DDA7A5]/60 bg-[#DDA7A5]/10 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-[#A86F76]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
            </div>
            Certifications
          </h2>
        )}

        {validCertificates && validCertificates.map((cert, index) => (
          <React.Fragment key={`cert-${index}`}>
             <div className="flex w-full relative border-l border-[#EAD5D7] ml-3 pl-6 pt-2 pb-1">
               <div className="absolute -left-[5px] top-[14px] w-2.5 h-2.5 bg-[#FCFBFA] rounded-full border-2 border-[#DDA7A5]"></div>
               <div className="w-[120px] shrink-0">
                 <span className="text-[12px] font-medium text-[#A86F76] tracking-wider">{cert.date || 'Certification'}</span>
               </div>
               <div className="flex-1">
                 <h3 className="text-[15px] font-bold text-[#3D2C35] tracking-wide">{cert.title}</h3>
               </div>
             </div>
             {cert.issuer && (
               <div className="flex w-full relative border-l border-[#EAD5D7] ml-3 pl-6 pb-1">
                 <div className="w-[120px] shrink-0"></div>
                 <div className="flex-1">
                   <p className="text-[13px] font-medium text-[#8C5A60]">{cert.issuer}</p>
                 </div>
               </div>
             )}
             {cert.description && (
               <div className="flex w-full relative border-l border-[#EAD5D7] ml-3 pl-6 pb-2">
                 <div className="w-[120px] shrink-0"></div>
                 <div className="flex-1">
                   <p className="text-[13px] text-[#5C5255] leading-[1.8] font-light">{cert.description}</p>
                 </div>
               </div>
             )}
             <div className="flex w-full relative border-l border-[#EAD5D7] ml-3 pl-6 pb-4"></div>
          </React.Fragment>
        ))}

        {/* REFERENCES SECTION */}
        {validReferences && validReferences.length > 0 && (
          <h2 className="text-[12px] font-bold text-[#3D2C35] uppercase tracking-[0.3em] mt-4 mb-4 flex items-center gap-3">
             <div className="w-6 h-6 rounded-sm border border-[#DDA7A5]/60 bg-[#DDA7A5]/10 flex items-center justify-center">
               <svg className="w-3 h-3 text-[#A86F76]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            </div>
            References
          </h2>
        )}

        {validReferences && validReferences.map((ref, index) => (
          <React.Fragment key={`ref-${index}`}>
             <div className="flex w-full relative border-l border-[#EAD5D7] ml-3 pl-6 pt-2 pb-1">
               <div className="absolute -left-[5px] top-[14px] w-2.5 h-2.5 bg-[#FCFBFA] rounded-full border-2 border-[#DDA7A5]"></div>
               <div className="w-[120px] shrink-0">
                 <span className="text-[12px] font-medium text-[#A86F76] tracking-wider">Reference</span>
               </div>
               <div className="flex-1">
                 <h3 className="text-[15px] font-bold text-[#3D2C35] tracking-wide">{ref.name}</h3>
               </div>
             </div>
             {(ref.role || ref.company) && (
               <div className="flex w-full relative border-l border-[#EAD5D7] ml-3 pl-6 pb-1">
                 <div className="w-[120px] shrink-0"></div>
                 <div className="flex-1">
                   <p className="text-[13px] font-medium text-[#8C5A60]">
                     {ref.role}{ref.role && ref.company ? ` • ${ref.company}` : ref.company}
                   </p>
                 </div>
               </div>
             )}
             {ref.contact && (
               <div className="flex w-full relative border-l border-[#EAD5D7] ml-3 pl-6 pb-2">
                 <div className="w-[120px] shrink-0"></div>
                 <div className="flex-1">
                   <p className="text-[13px] text-[#5C5255] font-light">{ref.contact}</p>
                 </div>
               </div>
             )}
             <div className="flex w-full relative border-l border-[#EAD5D7] ml-3 pl-6 pb-4"></div>
          </React.Fragment>
        ))}
      </main>

      {/* =========================================
        RIGHT SIDEBAR (Moved to the right)
        Deep plum/aubergine background, elegant modern ladies theme
        =========================================
      */}
      <aside className="w-[35%] bg-[#3D2C35] pt-12 pb-8 px-10 flex flex-col shrink-0 gap-5 border-l border-[#DDA7A5]/20 relative z-10">
        
        {/* Profile Image */}
        {info.photo && (
          <div className="shrink-0 flex justify-center mb-2 relative">
            <div className="absolute -inset-4 bg-gradient-to-br from-[#DDA7A5]/20 to-transparent rounded-full blur-xl opacity-60"></div>
            <div className="relative w-48 h-48 rounded-full overflow-hidden border-2 border-[#DDA7A5]/40 p-1">
              <div className="w-full h-full rounded-full overflow-hidden bg-[#3D2C35]">
                <img src={info.photo} alt="Profile" className="w-full h-full object-cover grayscale-[10%] sepia-[15%]" />
              </div>
            </div>
          </div>
        )}

        {/* Name & Title */}
        {info.fullName && (
          <h1 className="text-[28px] font-serif tracking-widest text-[#F7F2F3] uppercase leading-tight font-light mt-2 text-center">
            {info.fullName.split(' ').map((name, i, arr) => (
              <span key={i} className={i === arr.length - 1 ? "text-[#DDA7A5] font-medium" : ""}>
                {name}{' '}
              </span>
            ))}
          </h1>
        )}
        {info.jobTitle && (
          <p className="text-[11px] font-medium tracking-[0.4em] text-[#BFA8B1] uppercase text-center border-b border-[#DDA7A5]/20 pb-6 mb-2">
            {info.jobTitle}
          </p>
        )}

        {/* About Me */}
        {validSummary && (
          <h2 className="text-[11px] font-bold tracking-[0.3em] text-[#F7F2F3] uppercase mt-2 flex items-center gap-3">
            <span className="w-1.5 h-1.5 bg-[#DDA7A5] rounded-full"></span>
            About Me
          </h2>
        )}

        {validSummary && (
          <div className="text-[13px] leading-[1.9] text-[#E8DCE0] font-light text-justify whitespace-pre-wrap mb-2">
            {validSummary}
          </div>
        )}

        {/* Contact */}
        {hasContact && (
          <h2 className="text-[11px] font-bold tracking-[0.3em] text-[#F7F2F3] uppercase mt-2 flex items-center gap-3">
            <span className="w-1.5 h-1.5 bg-[#DDA7A5] rounded-full"></span>
            Contact
          </h2>
        )}

        {info.email && (
          <div className="flex items-center gap-4 text-[12px]">
            <div className="w-7 h-7 rounded-full border border-[#DDA7A5]/40 flex items-center justify-center bg-[#DDA7A5]/10 shrink-0">
              <svg className="w-3.5 h-3.5 text-[#DDA7A5]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
            </div>
            <span className="font-light tracking-wide text-[#E8DCE0] break-all">{info.email}</span>
          </div>
        )}

        {info.phone && (
          <div className="flex items-center gap-4 text-[12px]">
            <div className="w-7 h-7 rounded-full border border-[#DDA7A5]/40 flex items-center justify-center bg-[#DDA7A5]/10 shrink-0">
               <svg className="w-3.5 h-3.5 text-[#DDA7A5]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" /></svg>
            </div>
            <span className="font-light tracking-wide text-[#E8DCE0]">{info.phone}</span>
          </div>
        )}

        {info.location && (
          <div className="flex items-center gap-4 text-[12px]">
            <div className="w-7 h-7 rounded-full border border-[#DDA7A5]/40 flex items-center justify-center bg-[#DDA7A5]/10 shrink-0">
               <svg className="w-3.5 h-3.5 text-[#DDA7A5]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
            </div>
            <span className="font-light tracking-wide text-[#E8DCE0]">{info.location}</span>
          </div>
        )}

        {info.website && (
          <div className="flex items-center gap-4 text-[12px]">
             <div className="w-7 h-7 rounded-full border border-[#DDA7A5]/40 flex items-center justify-center bg-[#DDA7A5]/10 shrink-0">
                <svg className="w-3.5 h-3.5 text-[#DDA7A5]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-3.6-9m3.6 9a9 9 0 003.6-9m-3.6-9a9 9 0 00-3.6 9m3.6-9a9 9 0 013.6 9" /></svg>
             </div>
            <span className="font-light tracking-wide text-[#E8DCE0] break-all">{info.website.replace(/(^\w+:|^)\/\//, '')}</span>
          </div>
        )}

        {info.linkedin && (
          <div className="flex items-center gap-4 text-[12px]">
            <div className="w-7 h-7 rounded-full border border-[#DDA7A5]/40 flex items-center justify-center bg-[#DDA7A5]/10 shrink-0">
               <svg className="w-3.5 h-3.5 text-[#DDA7A5]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" /></svg>
            </div>
            <span className="font-light tracking-wide text-[#E8DCE0] break-all">{info.linkedin.replace(/(^\w+:|^)\/\//, '')}</span>
          </div>
        )}

{info.secondarySocial && (
  <div className="flex items-center gap-4 text-[12px]">
    <div className="w-7 h-7 rounded-full border border-[#DDA7A5]/40 flex items-center justify-center bg-[#DDA7A5]/10 shrink-0">
      {/* Globe / Website SVG */}
      <svg className="w-3.5 h-3.5 text-[#DDA7A5]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18zM12 3c2.5 0 4.5 4.03 4.5 9s-2 9-4.5 9m0-18c-2.5 0-4.5 4.03-4.5 9s2 9 4.5 9m-9-9h18" />
      </svg>
    </div>
    <span className="font-light tracking-wide text-[#E8DCE0] break-all">
      {info.secondarySocial.replace(/(^\w+:|^)\/\//, '')}
    </span>
  </div>
)}

{info.github && (
  <div className="flex items-center gap-4 text-[12px]">
    <div className="w-7 h-7 rounded-full border border-[#DDA7A5]/40 flex items-center justify-center bg-[#DDA7A5]/10 shrink-0">
      {/* GitHub Brand SVG */}
      <svg className="w-3.5 h-3.5 text-[#DDA7A5]" fill="currentColor" viewBox="0 0 24 24">
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    </div>
    <span className="font-light tracking-wide text-[#E8DCE0] break-all">
      {info.github.replace(/(^\w+:|^)\/\//, '')}
    </span>
  </div>
)}

        {/* PERSONAL DETAILS SECTION */}
        {(info.dob || info.nationality || info.gender || info.drivingLicense) && (
          <>
            <h2 className="text-[11px] font-bold tracking-[0.3em] text-[#F7F2F3] uppercase mt-2 flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-[#DDA7A5] rounded-full"></span>
              Details
            </h2>
            <div className="flex flex-col gap-3 mt-1">
              {info.dob && (
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold tracking-widest uppercase text-[#DDA7A5]">Date of Birth</span>
                  <span className="text-[11px] font-light text-[#E8DCE0] mt-0.5">{info.dob}</span>
                </div>
              )}
              {info.nationality && (
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold tracking-widest uppercase text-[#DDA7A5]">Nationality</span>
                  <span className="text-[11px] font-light text-[#E8DCE0] mt-0.5">{info.nationality}</span>
                </div>
              )}
              {info.gender && (
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold tracking-widest uppercase text-[#DDA7A5]">Gender</span>
                  <span className="text-[11px] font-light text-[#E8DCE0] mt-0.5">{info.gender}</span>
                </div>
              )}
              {info.drivingLicense && (
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold tracking-widest uppercase text-[#DDA7A5]">License</span>
                  <span className="text-[11px] font-light text-[#E8DCE0] mt-0.5">{info.drivingLicense}</span>
                </div>
              )}
            </div>
          </>
        )}

        
        {/* SKILLS SECTION */}
        {validSkills.length > 0 && (
                      <h2 className="text-[11px] font-bold tracking-[0.3em] text-[#F7F2F3] uppercase mt-2 flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-[#DDA7A5] rounded-full"></span>
              Skills
            </h2>
        )}

        {validSkills.map((skill, index) => {
          const name = typeof skill === 'string' ? skill : (skill.name || skill.skill);
          const level = typeof skill === 'string' ? 3 : (skill.level || 3);
          let barWidth = 100;
          if (typeof level === 'number' || !isNaN(Number(level))) {
            barWidth = (Number(level) / 5) * 100;
          } else {
            barWidth = level === 'Beginner' ? 30 : level === 'Intermediate' ? 60 : level === 'Advanced' ? 85 : 100;
          }

          return (
            <div key={`skill-${index}`} className="items-center relative  ml-0 pb-4 w-full">
              <div className="absolute -left-[1px] top-1.5 w-[2px] h-2.5 bg-transparent"></div>
              <div className="w-[180px] shrink-0 text-[13px] text-[#e8dce0] font-medium tracking-wide">
                {name}
              </div>
              <div className="flex-1 flex items-center gap-4 pr-10">
                <div className="flex-1 h-[3px] bg-[#F0E6E8] relative rounded overflow-hidden">
                  <div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#DDA7A5]/70 to-[#A86F76]"
                    style={{ width: `${barWidth}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Languages Heading */}
        {validLanguages && validLanguages.length > 0 && (
          <h2 className="text-[11px] font-bold tracking-[0.3em] text-[#F7F2F3] uppercase mt-2 flex items-center gap-3">
            <span className="w-1.5 h-1.5 bg-[#DDA7A5] rounded-full"></span>
            Languages
          </h2>
        )}

        {/* Languages Items */}
        {validLanguages && validLanguages.map((lang, index) => (
          <div key={`lang-${index}`} className="flex justify-between items-baseline">
             <span className="text-[12px] font-medium tracking-wide text-[#F7F2F3]">{lang.name}</span>
             <span className="text-[10px] text-[#BFA8B1] uppercase tracking-widest">{lang.proficiency}</span>
          </div>
        ))}

        {/* Hobbies Heading */}
        {validHobbies && validHobbies.length > 0 && (
          <h2 className="text-[11px] font-bold tracking-[0.3em] text-[#F7F2F3] uppercase mt-2 flex items-center gap-3">
            <span className="w-1.5 h-1.5 bg-[#DDA7A5] rounded-full"></span>
            Interests
          </h2>
        )}

        {/* Hobbies Items */}
        {validHobbies && validHobbies.map((hobby, index) => {
          const name = typeof hobby === 'string' ? hobby : hobby.name;
          return (
            <div key={`hobby-${index}`} className="flex items-center gap-4 text-[12px] font-light text-[#E8DCE0] tracking-wide">
              <span className="w-1 h-1 bg-[#DDA7A5]/70 rounded-full shrink-0"></span>
              {name}
            </div>
          );
        })}
        
        {/* Aesthetic filler for the bottom */}
        <div className="flex-grow"></div>
        <div className="w-full h-32 bg-gradient-to-t from-[#3D2C35] to-transparent opacity-50 absolute bottom-0 right-0"></div>

      </aside>
    </div>
  );
}