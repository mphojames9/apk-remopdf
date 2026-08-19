import React from 'react';

export default function ArchitectResume({
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
    <div id="resume-raw-content" className="w-full h-full flex bg-[#F9FAFB] text-[#1E2229] relative font-sans select-none">
      
      {/* LEFT ARCHITECTURAL SIDEBAR - COMPLETELY FLAT INTERNALS */}
      <aside className="w-[35%] bg-[#0F1113] text-[#E4E6EB] p-8 flex flex-col shrink-0 gap-6 border-r border-[#1F2429]">
        
        {/* Avant-Garde Geometric Profile Picture Frame */}
        {info.photo && (
          <div className="shrink-0 flex justify-center mb-4 relative">
            <div className="relative w-42 h-42 bg-[#17191C] border border-white/10 p-2">
              {/* Technical Corner Accents */}
              <div className="absolute top-0 left-0 w-3 h-[1px] bg-[#FF5A1F]"></div>
              <div className="absolute top-0 left-0 w-[1px] h-3 bg-[#FF5A1F]"></div>
              <div className="absolute bottom-0 right-0 w-3 h-[1px] bg-[#FF5A1F]"></div>
              <div className="absolute bottom-0 right-0 w-[1px] h-3 bg-[#FF5A1F]"></div>
              
              <img 
                src={info.photo} 
                alt="Profile" 
                className="w-full h-full object-cover grayscale contrast-110 brightness-95" 
              />
            </div>
          </div>
        )}

        {/* Technical Section: Contact */}
        {hasContact && (
          <h2 className="text-[10px] font-black tracking-[0.4em] text-[#FF5A1F] uppercase border-b border-white/10 pb-2 mt-2 flex justify-between items-center">
            <span>CONTACT</span>
            <span className="text-[8px] font-mono text-white/20 font-normal tracking-normal">// 01</span>
          </h2>
        )}

        {info.email && (
          <div className="flex items-center gap-3 text-[12.5px] -mt-2 group">
            <div className="w-5 h-5 rounded-none bg-[#1A1D20] flex items-center justify-center border border-white/5 shrink-0">
              <svg className="w-3 h-3 text-[#FF5A1F]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
            </div>
            <span className="break-all font-light text-[#A9AFA6] tracking-wide">{info.email}</span>
          </div>
        )}
        {info.phone && (
          <div className="flex items-center gap-3 text-[12.5px] -mt-2">
            <div className="w-5 h-5 rounded-none bg-[#1A1D20] flex items-center justify-center border border-white/5 shrink-0">
              <svg className="w-3 h-3 text-[#FF5A1F]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" /></svg>
            </div>
            <span className="font-light text-[#A9AFA6] tracking-wide">{info.phone}</span>
          </div>
        )}
        {info.location && (
          <div className="flex items-center gap-3 text-[12.5px] -mt-2">
            <div className="w-5 h-5 rounded-none bg-[#1A1D20] flex items-center justify-center border border-white/5 shrink-0">
              <svg className="w-3 h-3 text-[#FF5A1F]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
            </div>
            <span className="font-light text-[#A9AFA6] tracking-wide">{info.location}</span>
          </div>
        )}
        {info.website && (
          <div className="flex items-center gap-3 text-[12.5px] -mt-2">
            <div className="w-5 h-5 rounded-none bg-[#1A1D20] flex items-center justify-center border border-white/5 shrink-0">
              <svg className="w-3 h-3 text-[#FF5A1F]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-3.6-9m3.6 9a9 9 0 003.6-9m-3.6-9a9 9 0 00-3.6 9m3.6-9a9 9 0 013.6 9" /></svg>
            </div>
            <span className="break-all font-light text-[#A9AFA6] tracking-wide">{info.website.replace(/(^\w+:|^)\/\//, '')}</span>
          </div>
        )}
        {info.linkedin && (
          <div className="flex items-center gap-3 text-[12.5px] -mt-2">
            <div className="w-5 h-5 rounded-none bg-[#1A1D20] flex items-center justify-center border border-white/5 shrink-0">
              <svg className="w-3 h-3 text-[#FF5A1F]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" /></svg>
            </div>
            <span className="break-all font-light text-[#A9AFA6] tracking-wide">{info.linkedin.replace(/(^\w+:|^)\/\//, '')}</span>
          </div>
        )}
        {info.secondarySocial && (
          <div className="flex items-center gap-3 text-[12.5px] -mt-2">
            <div className="w-5 h-5 rounded-none bg-[#1A1D20] flex items-center justify-center border border-white/5 shrink-0">
              <svg className="w-3 h-3 text-[#FF5A1F]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-.738.09-1.454.257-2.137" />
              </svg>
            </div>
            <span className="break-all font-light text-[#A9AFA6] tracking-wide">{info.secondarySocial.replace(/(^\w+:|^)\/\//, '')}</span>
          </div>
        )}
        {info.github && (
          <div className="flex items-center gap-3 text-[12.5px] -mt-2">
            <div className="w-5 h-5 rounded-none bg-[#1A1D20] flex items-center justify-center border border-white/5 shrink-0">
              <svg className="w-3 h-3 text-[#FF5A1F]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-.738.09-1.454.257-2.137" />
              </svg>
            </div>
            <span className="break-all font-light text-[#A9AFA6] tracking-wide">{info.github.replace(/(^\w+:|^)\/\//, '')}</span>
          </div>
        )}

        {/* Technical Section: Personal Parameters */}
        {(info.dob || info.nationality || info.gender || info.drivingLicense) && (
          <h2 className="text-[10px] font-black tracking-[0.4em] text-[#FF5A1F] uppercase border-b border-white/10 pb-2 mt-4 flex justify-between items-center">
            <span>METRICS</span>
            <span className="text-[8px] font-mono text-white/20 font-normal tracking-normal">// 02</span>
          </h2>
        )}
        {info.dob && (
          <div className="flex flex-col gap-0.5 -mt-2">
            <span className="text-[8.5px] font-mono uppercase tracking-widest text-[#72787E]">INITIAL_DATE</span>
            <span className="text-[13px] font-light text-[#E4E6EB]">{info.dob}</span>
          </div>
        )}
        {info.nationality && (
          <div className="flex flex-col gap-0.5 -mt-2">
            <span className="text-[8.5px] font-mono uppercase tracking-widest text-[#72787E]">REGION_ORIGIN</span>
            <span className="text-[13px] font-light text-[#E4E6EB]">{info.nationality}</span>
          </div>
        )}
        {info.gender && (
          <div className="flex flex-col gap-0.5 -mt-2">
            <span className="text-[8.5px] font-mono uppercase tracking-widest text-[#72787E]">GENDER_IDENT</span>
            <span className="text-[13px] font-light text-[#E4E6EB]">{info.gender}</span>
          </div>
        )}
        {info.drivingLicense && (
          <div className="flex flex-col gap-0.5 -mt-2">
            <span className="text-[8.5px] font-mono uppercase tracking-widest text-[#72787E]">MOBILITY_AUTH</span>
            <span className="text-[13px] font-light text-[#E4E6EB]">{info.drivingLicense}</span>
          </div>
        )}

        {/* Technical Section: Core Architecture (Skills) */}
        {validSkills.length > 0 && (
          <h2 className="text-[10px] font-black tracking-[0.4em] text-[#FF5A1F] uppercase border-b border-white/10 pb-2 mt-4 flex justify-between items-center">
            <span>EXPERTISE</span>
            <span className="text-[8px] font-mono text-white/20 font-normal tracking-normal">// 03</span>
          </h2>
        )}
        {/* Unified, single elegant skills mapping block */}
        {validSkills.map((skill, index) => {
          const name = typeof skill === 'string' ? skill : (skill.name || skill.skill);
          const level = typeof skill === 'object' && skill.level ? skill.level : 3;
          
          let barWidth = 100;
          if (typeof level === 'number' || !isNaN(Number(level))) {
            barWidth = (Number(level) / 5) * 100;
          } else {
            barWidth = level === 'Beginner' ? 33 : level === 'Intermediate' ? 66 : level === 'Advanced' ? 88 : 100;
          }

          return (
            <div key={`skill-${index}`} className="flex flex-col gap-1.5 -mt-2">
              <div className="flex justify-between text-[12.5px] font-medium text-[#E4E6EB] tracking-wide">
                <span>{name}</span>
                <span className="text-[9px] font-mono text-[#FF5A1F] opacity-70">{Math.round(barWidth)}%</span>
              </div>
              <div className="w-full bg-[#1F2326] h-[3px] relative">
                <div 
                  className="bg-gradient-to-r from-[#FF5A1F] to-[#FF8154] h-full transition-all" 
                  style={{ width: `${barWidth}%` }}
                />
              </div>
            </div>
          );
        })}

        {/* Technical Section: Languages */}
        {validLanguages.length > 0 && (
          <h2 className="text-[10px] font-black tracking-[0.4em] text-[#FF5A1F] uppercase border-b border-white/10 pb-2 mt-4 flex justify-between items-center">
            <span>Languages</span>
            <span className="text-[8px] font-mono text-white/20 font-normal tracking-normal">// 04</span>
          </h2>
        )}
        {validLanguages.map((lang, index) => (
          <div key={`lang-${index}`} className="flex justify-between items-baseline -mt-2">
             <span className="text-[13px] font-medium tracking-wide text-[#E4E6EB]">{lang.name}</span>
             <span className="text-[10px] text-[#FF5A1F] font-mono uppercase tracking-wider bg-[#1F2326] px-1.5 py-0.5">{lang.proficiency}</span>
          </div>
        ))}

        {/* Technical Section: Hobbies */}
        {validHobbies && validHobbies.length > 0 && (
          <h2 className="text-[10px] font-black tracking-[0.4em] text-[#FF5A1F] uppercase border-b border-white/10 pb-2 mt-4 flex justify-between items-center">
            <span>INTERESTS</span>
            <span className="text-[8px] font-mono text-white/20 font-normal tracking-normal">// 05</span>
          </h2>
        )}
        {validHobbies && validHobbies.map((hobby, index) => {
          const name = typeof hobby === 'string' ? hobby : hobby.name;
          return (
            <div key={`hobby-${index}`} className="flex items-center gap-3 -mt-2 text-[12.5px] font-light text-[#A9AFA6] tracking-wide">
              <span className="w-1.5 h-[1px] bg-[#FF5A1F] shrink-0"></span>
              {name}
            </div>
          );
        })}

      </aside>

      {/* RIGHT EXECUTIVE WORKSPACE - COMPLETELY FLAT INTERNALS */}
      <main className="w-[65%] p-10 flex flex-col shrink-0 bg-white">
        
        {/* High-Impact Architectural Title Header Block */}
        <div className="flex flex-col gap-2 pb-6 border-b border-[#E4E6EB] mb-6 relative">
          <div className="absolute top-0 right-0 font-mono text-[9px] tracking-widest text-[#1E2229]/30"></div>
          {info.fullName && (
            <h1 className="text-5xl font-black tracking-tight text-[#0F1113] uppercase leading-none">
              {info.fullName}
            </h1>
          )}
          {info.jobTitle && (
            <div className="flex items-center gap-3 mt-1">
              <span className="w-2 h-2 bg-[#FF5A1F]"></span>
              <p className="text-[13px] font-bold tracking-[0.35em] text-[#FF5A1F] uppercase">{info.jobTitle}</p>
            </div>
          )}
        </div>

        {/* Executive Summary Statement */}
        {validSummary && (
          <div className="text-[13px] leading-[1.75] text-[#485260] mb-6 font-normal text-justify whitespace-pre-wrap pl-4 border-l-2 border-[#0F1113]">
            {validSummary}
          </div>
        )}

        {/* --- EXPERIENCE COMPONENT SECTION --- */}
        {validExperience.length > 0 && (
          <h2 className="text-xs font-black text-[#0F1113] uppercase tracking-[0.3em] mb-4 flex items-center justify-between bg-[#F3F4F6] p-2">
            <span className="flex items-center gap-2">
              <span className="text-[#FF5A1F]">■</span> Experience
            </span>
            <span className="font-mono text-[10px] font-normal opacity-40"></span>
          </h2>
        )}

        {validExperience.map((exp, index) => (
          <React.Fragment key={`exp-${index}`}>
            <div className="flex justify-between items-baseline relative pl-4">
              <div className="absolute left-0 top-1.5 w-1 h-3 bg-[#FF5A1F]"></div>
              <h3 className="text-[15px] font-black text-[#0F1113] uppercase tracking-wide">{exp.role}</h3>
              <span className="text-[11px] font-mono font-bold text-[#FF5A1F] bg-[#FF5A1F]/5 px-2 py-0.5 tracking-wider shrink-0 ml-2">
                {formatDates(exp.startDate, exp.endDate, exp.isCurrent)}
              </span>
            </div>
            <div className="flex justify-between items-baseline pl-4 mt-1">
              <p className="text-[12.5px] font-bold text-[#485260] uppercase tracking-wider">{exp.company}</p>
              {exp.location && <p className="text-[10px] font-bold text-[#8E97A4] uppercase tracking-wider">{exp.location}</p>}
            </div>
            {exp.description && (
              <p className="text-[12.5px] text-[#485260] leading-relaxed mt-1 whitespace-pre-wrap text-justify pl-4">{exp.description}</p>
            )}
            {exp.achievements && exp.achievements.length > 0 && exp.achievements.map((ach, i) => (
              <div key={i} className="flex items-start gap-2.5 pl-4 mt-1.5">
                <span className="text-[#FF5A1F] font-mono text-[10px] mt-0.5 shrink-0">›</span>
                <span className="text-justify text-[12.5px] text-[#485260] leading-relaxed">{ach}</span>
              </div>
            ))}
            <div className="h-6"></div>
          </React.Fragment>
        ))}

        {/* --- PROJECTS COMPONENT SECTION --- */}
        {data.projects && data.projects.length > 0 && (
          <h2 className="text-xs font-black text-[#0F1113] uppercase tracking-[0.3em] mb-4 flex items-center justify-between bg-[#F3F4F6] p-2">
            <span className="flex items-center gap-2">
              <span className="text-[#FF5A1F]">■</span> PROJECTS
            </span>
            <span className="font-mono text-[10px] font-normal opacity-40"></span>
          </h2>
        )}

        {data.projects && data.projects.map((proj, index) => (
          <React.Fragment key={`proj-${index}`}>
            <div className="flex justify-between items-baseline relative pl-4">
              <div className="absolute left-0 top-1.5 w-1 h-3 bg-[#0F1113]"></div>
              <h3 className="text-[15px] font-black text-[#0F1113] uppercase tracking-wide">{proj.title}</h3>
              {proj.date && <span className="text-[11px] font-mono font-bold text-[#8E97A4] shrink-0 ml-2">{proj.date}</span>}
            </div>
            {proj.description && (
              <p className="text-[12.5px] text-[#485260] leading-relaxed mt-1 whitespace-pre-wrap text-justify pl-4">{proj.description}</p>
            )}
            <div className="h-6"></div>
          </React.Fragment>
        ))}

        {/* --- EDUCATION COMPONENT SECTION --- */}
        {validEducation.length > 0 && (
          <h2 className="text-xs font-black text-[#0F1113] uppercase tracking-[0.3em] mb-4 flex items-center justify-between bg-[#F3F4F6] p-2">
            <span className="flex items-center gap-2">
              <span className="text-[#FF5A1F]">■</span> Education
            </span>
            <span className="font-mono text-[10px] font-normal opacity-40"></span>
          </h2>
        )}

        {validEducation.map((edu, index) => (
          <React.Fragment key={`edu-${index}`}>
             <div className="flex justify-between items-baseline relative pl-4">
               <div className="absolute left-0 top-1.5 w-1 h-3 bg-[#0F1113]"></div>
               <h3 className="text-[14.5px] font-black text-[#0F1113] uppercase tracking-wide">{edu.degree}</h3>
               <span className="text-[11px] font-mono font-bold text-[#8E97A4] shrink-0 ml-2">
                 {formatDates(edu.startDate, edu.endDate, edu.isCurrent)}
               </span>
             </div>
             <div className="flex justify-between items-baseline pl-4 mt-1">
               <p className="text-[12.5px] font-medium text-[#485260]">{edu.school}</p>
               {edu.location && <p className="text-[10px] font-bold text-[#8E97A4] uppercase tracking-wider">{edu.location}</p>}
             </div>
             {edu.description && (
               <p className="text-[12.5px] text-[#485260] leading-relaxed mt-1 whitespace-pre-wrap pl-4">{edu.description}</p>
             )}
             <div className="h-6"></div>
          </React.Fragment>
        ))}

        {/* --- CERTIFICATIONS COMPONENT SECTION --- */}
        {validCertificates && validCertificates.length > 0 && (
          <h2 className="text-xs font-black text-[#0F1113] uppercase tracking-[0.3em] mb-4 flex items-center justify-between bg-[#F3F4F6] p-2">
            <span className="flex items-center gap-2">
              <span className="text-[#FF5A1F]">■</span> Certificates
            </span>
            <span className="font-mono text-[10px] font-normal opacity-40"></span>
          </h2>
        )}

        {validCertificates && validCertificates.map((cert, index) => (
          <React.Fragment key={`cert-${index}`}>
             <div className="flex justify-between items-baseline relative pl-4">
               <div className="absolute left-0 top-1.5 w-1 h-3 bg-[#0F1113]"></div>
               <h3 className="text-[14px] font-black text-[#0F1113] uppercase tracking-wide">{cert.title}</h3>
               {cert.date && <span className="text-[11px] font-mono font-bold text-[#8E97A4] shrink-0 ml-2">{cert.date}</span>}
             </div>
             {cert.issuer && <p className="text-[12px] text-[#FF5A1F] font-bold uppercase tracking-wider mt-1 pl-4">{cert.issuer}</p>}
             {cert.description && (
               <p className="text-[12.5px] text-[#485260] leading-relaxed mt-1 whitespace-pre-wrap pl-4">{cert.description}</p>
             )}
             <div className="h-6"></div>
          </React.Fragment>
        ))}

        {/* --- REFERENCES COMPONENT SECTION --- */}
        {validReferences && validReferences.length > 0 && (
          <h2 className="text-xs font-black text-[#0F1113] uppercase tracking-[0.3em] mb-4 flex items-center justify-between bg-[#F3F4F6] p-2">
            <span className="flex items-center gap-2">
              <span className="text-[#FF5A1F]">■</span> References
            </span>
            <span className="font-mono text-[10px] font-normal opacity-40"></span>
          </h2>
        )}

        {validReferences && validReferences.length > 0 && validReferences.map((ref, index) => (
          <React.Fragment key={`ref-${index}`}>
            <div className="relative pl-4">
              <div className="absolute left-0 top-1.5 w-1 h-3 bg-[#0F1113]"></div>
              <h3 className="text-[14px] font-black text-[#0F1113] uppercase tracking-wide">{ref.name}</h3>
            </div>
            {(ref.role || ref.company) && (
              <p className="text-[11.5px] font-bold text-[#FF5A1F] tracking-wide mt-1 pl-4">
                {ref.role}{ref.role && ref.company ? ` @ ${ref.company}` : ref.company}
              </p>
            )}
            {ref.contact && <p className="text-[11px] font-mono text-[#8E97A4] mt-1 pl-4">{ref.contact}</p>}
            <div className="h-6"></div>
          </React.Fragment>
        ))}

      </main>
    </div>
  );
}