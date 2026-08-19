import React from 'react';

export default function ProfessionalDark({
  info,
  data,
  formatDates,
  hasContact,
  hasHeader,
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
    <div id="resume-raw-content" className="w-full h-full flex font-sans bg-white text-slate-800 relative">
      
      {/* LEFT SIDEBAR */}
      <aside className="w-[35%] bg-[#161e2c] text-white p-8 flex flex-col shrink-0">
        
        {/* PROFILE IMAGE */}
        <div className="shrink-0 flex justify-center mb-6">
          <div className="w-36 h-36 rounded-full border-2 border-[#c99c60] p-1">
            <div className="w-full h-full rounded-full bg-slate-800 overflow-hidden flex items-center justify-center">
               {info.photo ? (
                 <img src={info.photo} alt="Profile" className="w-full h-full object-cover" />
               ) : (
                 <svg className="w-16 h-16 text-slate-500" fill="currentColor" viewBox="0 0 24 24">
                   <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                 </svg>
               )}
            </div>
          </div>
        </div>
          
        {/* CONTACT INFO */}
        {hasContact && (
          <div className="shrink-0 flex items-center gap-3 mb-3 mt-4">
            <div className="w-7 h-7 rounded-full border border-[#c99c60] flex items-center justify-center text-[#c99c60] shrink-0">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </div>
            <h2 className="text-[11px] font-bold tracking-widest text-white uppercase">Contact</h2>
            <div className="flex-1 h-px bg-[#c99c60]/40"></div>
          </div>
        )}
        {info.phone && (
          <div className="shrink-0 flex items-center gap-2 mb-1.5 pl-1">
            <svg className="w-3 h-3 text-[#c99c60] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
            <span className="text-[10px] text-slate-300 font-medium truncate">{info.phone}</span>
          </div>
        )}
        {info.email && (
          <div className="shrink-0 flex items-center gap-2 mb-1.5 pl-1">
            <svg className="w-3 h-3 text-[#c99c60] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            <span className="text-[10px] text-slate-300 font-medium truncate">{info.email}</span>
          </div>
        )}
        {info.location && (
          <div className="shrink-0 flex items-center gap-2 mb-1.5 pl-1">
            <svg className="w-3 h-3 text-[#c99c60] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            <span className="text-[10px] text-slate-300 font-medium truncate">{info.location}</span>
          </div>
        )}
        {info.website && (
          <div className="shrink-0 flex items-center gap-2 mb-1.5 pl-1">
            <svg className="w-3 h-3 text-[#c99c60] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-3.6-9m3.6 9a9 9 0 003.6-9m-3.6-9a9 9 0 00-3.6 9m3.6-9a9 9 0 013.6 9" /></svg>
            <span className="text-[10px] text-slate-300 font-medium truncate">{info.website}</span>
          </div>
        )}
        {info.linkedin && (
          <div className="shrink-0 flex items-center gap-2 mb-3 pl-1">
            <svg className="w-3 h-3 text-[#c99c60] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" /><circle cx="4" cy="4" r="2" fill="currentColor" /></svg>
            <span className="text-[10px] text-slate-300 font-medium truncate">{info.linkedin}</span>
          </div>
        )}
{info.secondarySocial && (
  <div className="shrink-0 flex items-center gap-2 mb-3 pl-1">
    {/* Universal Link Icon */}
    <svg className="w-3 h-3 text-[#c99c60] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
    </svg>
    <span className="text-[10px] text-slate-300 font-medium truncate">{info.secondarySocial}</span>
  </div>
)}

{info.github && (
  <div className="shrink-0 flex items-center gap-2 mb-3 pl-1">
    {/* Universal Link Icon */}
    <svg className="w-3 h-3 text-[#c99c60] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
    </svg>
    <span className="text-[10px] text-slate-300 font-medium truncate">{info.github}</span>
  </div>
)}

        {/* PERSONAL DETAILS / DEMOGRAPHICS */}
        {(info.dob || info.nationality || info.gender || info.drivingLicense) && (
          <div className="shrink-0 flex items-center gap-3 mb-3 mt-4">
            <div className="w-7 h-7 rounded-full border border-[#c99c60] flex items-center justify-center text-[#c99c60] shrink-0">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
              </svg>
            </div>
            <h2 className="text-[11px] font-bold tracking-widest text-white uppercase">Personal Details</h2>
            <div className="flex-1 h-px bg-[#c99c60]/40"></div>
          </div>
        )}
        {info.dob && (
          <div className="shrink-0 pl-1 mb-2">
            <span className="text-[9px] text-[#c99c60] font-medium uppercase tracking-widest block mb-0.5">Date of Birth</span>
            <span className="text-[10px] text-slate-300 font-medium block">{info.dob}</span>
          </div>
        )}
        {info.nationality && (
          <div className="shrink-0 pl-1 mb-2">
            <span className="text-[9px] text-[#c99c60] font-medium uppercase tracking-widest block mb-0.5">Nationality</span>
            <span className="text-[10px] text-slate-300 font-medium block">{info.nationality}</span>
          </div>
        )}
        {info.gender && (
          <div className="shrink-0 pl-1 mb-2">
            <span className="text-[9px] text-[#c99c60] font-medium uppercase tracking-widest block mb-0.5">Gender</span>
            <span className="text-[10px] text-slate-300 font-medium block">{info.gender}</span>
          </div>
        )}
        {info.drivingLicense && (
          <div className="shrink-0 pl-1 mb-4">
            <span className="text-[9px] text-[#c99c60] font-medium uppercase tracking-widest block mb-0.5">Driver's License</span>
            <span className="text-[10px] text-slate-300 font-medium block">{info.drivingLicense}</span>
          </div>
        )}

        {/* EDUCATION */}
        {validEducation.length > 0 && (
          <div className="shrink-0 flex items-center gap-3 mb-3 mt-4">
            <div className="w-7 h-7 rounded-full border border-[#c99c60] flex items-center justify-center text-[#c99c60] shrink-0">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>
            </div>
            <h2 className="text-[11px] font-bold tracking-widest text-white uppercase">Education</h2>
            <div className="flex-1 h-px bg-[#c99c60]/40"></div>
          </div>
        )}
        {validEducation.flatMap((edu, idx) => (
          <div key={`edu-${idx}`} className="shrink-0 text-[10px] pl-1 mb-3">
            {edu.degree && <p className="font-bold text-white uppercase">{edu.degree}</p>}
            {edu.school && <p className="text-[#c99c60] italic my-0.5">{edu.school}</p>}
            <p className="text-slate-400">{formatDates(edu.startDate, edu.endDate, edu.isCurrent)}</p>
          </div>
        ))}

        {/* SKILLS */}
        {validSkills.length > 0 && (
          <div className="shrink-0 flex items-center gap-3 mb-3 mt-4">
            <div className="w-7 h-7 rounded-full border border-[#c99c60] flex items-center justify-center text-[#c99c60] shrink-0">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
            </div>
            <h2 className="text-[11px] font-bold tracking-widest text-white uppercase">Skills</h2>
            <div className="flex-1 h-px bg-[#c99c60]/40"></div>
          </div>
        )}
        {validSkills.map((skill, idx) => {
          const name = typeof skill === 'string' ? skill : (skill.name || skill.skill);
          return <span key={`skill-${idx}`} className="shrink-0 text-[10px] text-white font-semibold tracking-wide uppercase block pl-1 mb-2">{name}</span>;
        })}

        {/* LANGUAGES */}
        {validLanguages.length > 0 && (
          <div className="shrink-0 flex items-center gap-3 mb-3 mt-4">
            <div className="w-7 h-7 rounded-full border border-[#c99c60] flex items-center justify-center text-[#c99c60] shrink-0">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
            </div>
            <h2 className="text-[11px] font-bold tracking-widest text-white uppercase">Languages</h2>
            <div className="flex-1 h-px bg-[#c99c60]/40"></div>
          </div>
        )}
        {validLanguages.flatMap((lang, idx) => (
          <div key={`lang-${idx}`} className="shrink-0 pl-1 mb-2.5">
            <span className="text-[10px] text-white font-semibold tracking-wide uppercase block">{lang.name}</span>
            {lang.proficiency && <span className="text-[9px] text-[#c99c60] font-medium mt-0.5 block">{lang.proficiency}</span>}
          </div>
        ))}

        {/* HOBBIES */}
        {validHobbies.length > 0 && (
          <div className="shrink-0 flex items-center gap-3 mb-3 mt-4">
            <div className="w-7 h-7 rounded-full border border-[#c99c60] flex items-center justify-center text-[#c99c60] shrink-0">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-[11px] font-bold tracking-widest text-white uppercase">Hobbies</h2>
            <div className="flex-1 h-px bg-[#c99c60]/40"></div>
          </div>
        )}
        {validHobbies.map((hobby, idx) => (
          <span key={`hobby-${idx}`} className="shrink-0 text-[10px] text-slate-300 font-medium tracking-wide block pl-1 mb-1.5">• {hobby}</span>
        ))}

        {/* CERTIFICATIONS */}
        {validCertificates.length > 0 && (
          <div className="shrink-0 flex items-center gap-3 mb-3 mt-4">
            <div className="w-7 h-7 rounded-full border border-[#c99c60] flex items-center justify-center text-[#c99c60] shrink-0">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138z" /></svg>
            </div>
            <h2 className="text-[11px] font-bold tracking-widest text-white uppercase">Certifications</h2>
            <div className="flex-1 h-px bg-[#c99c60]/40"></div>
          </div>
        )}
        {validCertificates.flatMap((cert, index) => (
          <div key={`cert-${index}`} className="shrink-0 pl-1 mb-3">
            {cert.title && <h3 className="text-[10px] font-bold text-white uppercase leading-snug">{cert.title}</h3>}
            <div className="flex justify-between items-start mt-0.5 pr-2">
              {cert.issuer && <p className="text-[9px] text-[#c99c60] font-medium">{cert.issuer}</p>}
              {cert.date && <p className="text-[8px] text-slate-400 text-right shrink-0 ml-2 mt-0.5">{cert.date}</p>}
            </div>
            {cert.description && (
              <p className="text-[9px] text-slate-300 mt-1.5 leading-relaxed whitespace-pre-wrap pr-2">
                {cert.description}
              </p>
            )}
          </div>
        ))}

      </aside>

      {/* MAIN CONTENT */}
      <main className="w-[65%] p-10 flex flex-col bg-white">
        
        {/* HEADER NAME/TITLE */}
        {hasHeader && (
          <div className="shrink-0 mb-6">
            {firstName && (
              <h1 className="text-[40px] font-serif uppercase tracking-widest text-slate-900 mb-2 leading-none">
                {firstName} <span className="text-[#c99c60]">{lastName}</span>
              </h1>
            )}
            {info.jobTitle && (
              <h2 className="text-[13px] font-bold uppercase tracking-[0.2em] text-slate-600 border-b border-slate-200 pb-4">
                {info.jobTitle}
              </h2>
            )}
          </div>
        )}

        {/* PROFESSIONAL SUMMARY */}
        {validSummary && (
          <div className="shrink-0 flex items-center gap-4 mb-3 mt-2">
            <div className="w-9 h-9 rounded-full border border-[#c99c60] flex items-center justify-center text-[#c99c60] shrink-0">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </div>
            <h2 className="text-[13px] font-bold tracking-widest text-slate-900 uppercase">Professional Summary</h2>
            <div className="flex-1 h-px bg-[#c99c60]/40"></div>
          </div>
        )}
        {validSummary && (
          <p className="shrink-0 text-[11px] text-slate-700 leading-[1.8] text-justify pl-[52px] whitespace-pre-wrap mb-6">
            {validSummary}
          </p>
        )}

        {/* EXPERIENCE */}
        {validExperience.length > 0 && (
          <div className="shrink-0 flex items-center gap-4 mb-4 mt-2">
            <div className="w-9 h-9 rounded-full border border-[#c99c60] flex items-center justify-center text-[#c99c60] shrink-0">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            </div>
            <h2 className="text-[13px] font-bold tracking-widest text-slate-900 uppercase">Experience</h2>
            <div className="flex-1 h-px bg-[#c99c60]/40"></div>
          </div>
        )}
        
        {validExperience.flatMap((exp, index) => {
          const elements = [];
          const isLastExp = index === validExperience.length - 1;

          elements.push(
            <div key={`exp-h-${index}`} className="shrink-0 relative border-l border-[#c99c60]/50 ml-[70px] pl-8 pt-1 pb-2">
              <div className="absolute w-2.5 h-2.5 rounded-full border-[1.5px] border-[#c99c60] bg-white -left-[5.5px] top-1.5"></div>
              <div className="absolute -left-[80px] top-1 text-[10px] text-slate-500 font-medium w-[70px] text-right">
                {formatDates(exp.startDate, exp.endDate, exp.isCurrent)}
              </div>
              {exp.role && <h3 className="text-[12px] font-bold text-slate-900 uppercase tracking-wide">{exp.role}</h3>}
              {exp.company && <h4 className="text-[11px] text-[#c99c60] italic">{exp.company}</h4>}
            </div>
          );

          if (exp.achievements && exp.achievements.length > 0) {
            exp.achievements.forEach((ach, achIndex) => {
              if (ach.trim()) {
                elements.push(
                  <div key={`exp-b-${index}-${achIndex}`} className="shrink-0 relative border-l border-[#c99c60]/50 ml-[70px] pl-8 pb-1 text-[11px] text-slate-700 leading-[1.7]">
                    <span className="absolute left-[20px] top-[0px] text-slate-400 text-[14px] leading-none">•</span>
                    {ach}
                  </div>
                );
              }
            });
          }

          elements.push(
            <div key={`exp-s-${index}`} className={`shrink-0 ml-[70px] h-4 ${!isLastExp ? 'border-l border-[#c99c60]/50' : 'border-l border-transparent'}`}></div>
          );

          return elements;
        })}

        {/* PROJECTS */}
        {data.projects && data.projects.length > 0 && (
          <div className="shrink-0 flex items-center gap-4 mb-4 mt-2">
            <div className="w-9 h-9 rounded-full border border-[#c99c60] flex items-center justify-center text-[#c99c60] shrink-0">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
            </div>
            <h2 className="text-[13px] font-bold tracking-widest text-slate-900 uppercase">Projects</h2>
            <div className="flex-1 h-px bg-[#c99c60]/40"></div>
          </div>
        )}

        {data.projects && data.projects.flatMap((proj, index) => {
          const nodes = [];
          
          nodes.push(
            <div key={`proj-h-${index}`} className="shrink-0 pl-[52px] flex justify-between items-start gap-4 mb-1">
              <h3 className="text-[12px] font-bold text-slate-900 uppercase tracking-wide">{proj.title}</h3>
              {proj.date && <span className="text-[10px] text-slate-500 font-medium text-right shrink-0 mt-0.5">{proj.date}</span>}
            </div>
          );
          
          if (proj.description) {
            nodes.push(
              <p key={`proj-d-${index}`} className="shrink-0 pl-[52px] text-[11px] text-slate-700 leading-[1.7] mb-4 whitespace-pre-wrap">
                {proj.description}
              </p>
            );
          }
          return nodes;
        })}

        {/* REFERENCES */}
        {validReferences.length > 0 && (
          <div className="shrink-0 flex items-center gap-4 mb-4 mt-2">
            <div className="w-9 h-9 rounded-full border border-[#c99c60] flex items-center justify-center text-[#c99c60] shrink-0">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-[13px] font-bold tracking-widest text-slate-900 uppercase">References</h2>
            <div className="flex-1 h-px bg-[#c99c60]/40"></div>
          </div>
        )}

        {validReferences.reduce((acc, ref, i) => {
           if (i % 2 === 0) acc.push([ref]);
           else acc[acc.length - 1].push(ref);
           return acc;
        }, []).map((row, rowIndex) => (
           <div key={`ref-row-${rowIndex}`} className="shrink-0 pl-[52px] flex gap-8 mb-4 w-full">
             {row.map((ref, i) => (
               <div key={i} className="flex-1 text-[11px]">
                 <h3 className="font-bold text-slate-900 uppercase tracking-wide text-[11.5px]">{ref.name}</h3>
                 {(ref.role || ref.company) && (
                   <p className="text-[#c99c60] font-medium my-0.5">
                     {ref.role}{ref.role && ref.company ? `, ${ref.company}` : ref.company}
                   </p>
                 )}
                 {ref.contact && <p className="text-slate-500 font-medium mt-1">{ref.contact}</p>}
               </div>
             ))}
           </div>
        ))}

      </main>
    </div>
  );
}