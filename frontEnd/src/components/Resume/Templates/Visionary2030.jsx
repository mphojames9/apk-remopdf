import React from 'react';

export default function Visionary2030({
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
    <div id="resume-raw-content" className="w-full h-full flex font-sans bg-slate-50 text-slate-800 relative">
      
      {/* LEFT SIDEBAR: Modern Light Blue Layout */}
      <aside className="w-[34%] bg-sky-50 text-slate-700 p-8 flex flex-col shrink-0 gap-5 border-r border-sky-100">
        
        {/* Profile Image Node */}
        {info.photo && (
          <div className="shrink-0 flex justify-center mb-2">
            <div className="w-36 h-36 rounded-2xl border-2 border-sky-400 p-1 shadow-[0_4px_15px_rgba(14,165,233,0.15)] transform rotate-3 transition-transform hover:rotate-0 duration-300">
              <div className="w-full h-full rounded-xl overflow-hidden transform -rotate-3 bg-sky-100 flex items-center justify-center">
                <img src={info.photo} alt="Profile" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        )}

        {/* Contact Heading Node */}
        {hasContact && (
          <h2 className="text-xs font-bold tracking-[0.2em] text-sky-700 uppercase border-b border-sky-200 pb-2 mt-2">
            Contact
          </h2>
        )}
        {info.email && (
          <div className="flex items-center gap-3 text-[13px] -mt-1">
            <svg className="w-4 h-4 text-sky-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            <span className="break-all text-slate-600">{info.email}</span>
          </div>
        )}
        {info.phone && (
          <div className="flex items-center gap-3 text-[13px] -mt-1">
            <svg className="w-4 h-4 text-sky-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>
            <span className="text-slate-600">{info.phone}</span>
          </div>
        )}
        {info.location && (
          <div className="flex items-center gap-3 text-[13px] -mt-1">
            <svg className="w-4 h-4 text-sky-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21s-8-4.5-8-11.8A8 8 0 0112 1.2a8 8 0 018 8C20 16.5 12 21 12 21z"/><circle cx="12" cy="9.2" r="3"/></svg>
            <span className="text-slate-600">{info.location}</span>
          </div>
        )}
        {info.linkedin && (
          <div className="flex items-center gap-3 text-[13px] -mt-1">
            <svg className="w-4 h-4 text-sky-600 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
            <span className="break-all text-slate-600">{info.linkedin.replace(/(^\w+:|^)\/\//, '')}</span>
          </div>
        )}
        {info.secondarySocial && (
          <div className="flex items-center gap-3 text-[13px] -mt-1">
            <svg className="w-4 h-4 text-sky-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
            <span className="break-all text-slate-600">{info.secondarySocial.replace(/(^\w+:|^)\/\//, '')}</span>
          </div>
        )}
        {info.website && (
          <div className="flex items-center gap-3 text-[13px] -mt-1">
            <svg className="w-4 h-4 text-sky-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M3.6 9h16.8M3.6 15h16.8" /><path strokeLinecap="round" strokeLinejoin="round" d="M11.5 3a17 17 0 000 18M12.5 3a17 17 0 000 18" /></svg>
            <span className="break-all text-slate-600">{info.website.replace(/(^\w+:|^)\/\//, '')}</span>
          </div>
        )}
        {info.github && (
          <div className="flex items-center gap-3 text-[13px] -mt-1">
            <svg className="w-4 h-4 text-sky-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
            <span className="break-all text-slate-600">{info.github.replace(/(^\w+:|^)\/\//, '')}</span>
          </div>
        )}

        {/* Personal Details Node */}
        {(info.dob || info.nationality || info.gender || info.drivingLicense) && (
          <h2 className="text-xs font-bold tracking-[0.2em] text-sky-700 uppercase border-b border-sky-200 pb-2 mt-4">
            Details
          </h2>
        )}
        {info.dob && (
          <div className="flex flex-col gap-0.5 -mt-1">
            <span className="text-[10px] font-bold text-sky-600 uppercase tracking-wider">Date of Birth</span>
            <span className="text-[13px] text-slate-700">{info.dob}</span>
          </div>
        )}
        {info.nationality && (
          <div className="flex flex-col gap-0.5 -mt-1">
            <span className="text-[10px] font-bold text-sky-600 uppercase tracking-wider">Nationality</span>
            <span className="text-[13px] text-slate-700">{info.nationality}</span>
          </div>
        )}
        {info.gender && (
          <div className="flex flex-col gap-0.5 -mt-1">
            <span className="text-[10px] font-bold text-sky-600 uppercase tracking-wider">Gender</span>
            <span className="text-[13px] text-slate-700">{info.gender}</span>
          </div>
        )}
        {info.drivingLicense && (
          <div className="flex flex-col gap-0.5 -mt-1">
            <span className="text-[10px] font-bold text-sky-600 uppercase tracking-wider">Driver's License</span>
            <span className="text-[13px] text-slate-700">{info.drivingLicense}</span>
          </div>
        )}

        {/* Skills Heading Node */}
        {validSkills.length > 0 && (
          <h2 className="text-xs font-bold tracking-[0.2em] text-sky-700 uppercase border-b border-sky-200 pb-2 mt-4">
            Core Expertise
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
            <div key={`skill-${index}`} className="flex flex-col gap-1 -mt-1">
              <div className="flex justify-between text-[13px] font-medium text-slate-700">
                <span>{name}</span>
              </div>
              <div className="w-full bg-sky-200/50 h-1.5 rounded-full overflow-hidden p-[1px] border border-sky-200/30">
                <div 
                  className="bg-sky-500 h-full rounded-full shadow-[0_0_6px_rgba(14,165,233,0.4)]" 
                  style={{ width: `${barWidth}%` }}
                />
              </div>
            </div>
          );
        })}

        {/* Languages Heading Node */}
        {validLanguages.length > 0 && (
          <h2 className="text-xs font-bold tracking-[0.2em] text-sky-700 uppercase border-b border-sky-200 pb-2 mt-4">
            Languages
          </h2>
        )}
        {validLanguages.map((lang, index) => (
          <div key={`lang-${index}`} className="flex justify-between items-center text-[13px] -mt-1">
            <span className="font-medium text-slate-700">{lang.name}</span>
            <span className="text-sky-700 text-[10px] font-bold uppercase tracking-widest bg-sky-100 px-2 py-0.5 rounded border border-sky-200/60">{lang.proficiency}</span>
          </div>
        ))}

        {/* Hobbies Heading Node */}
        {validHobbies && validHobbies.length > 0 && (
          <h2 className="text-xs font-bold tracking-[0.2em] text-sky-700 uppercase border-b border-sky-200 pb-2 mt-4">
            Interests
          </h2>
        )}
        {validHobbies && validHobbies.map((hobby, index) => (
          <div key={`hobby-${index}`} className="flex items-center gap-3 -mt-1 text-[13px] text-slate-600">
            <span className="w-1.5 h-1.5 bg-sky-500 rounded-sm shrink-0 transform rotate-45 shadow-[0_0_4px_rgba(14,165,233,0.3)]"></span>
            {hobby}
          </div>
        ))}

      </aside>

      {/* RIGHT MAIN SIDE (Completely flattened inside for flawless pagination) */}
      <main className="w-[66%] p-8 flex flex-col shrink-0 bg-white">
        
        {/* Header Node */}
        <div className="flex flex-col gap-2 pb-5 border-b-2 border-slate-100 mb-5 w-full break-inside-avoid shrink-0">
          {info.fullName && <h1 className="text-4xl font-black tracking-tight text-indigo-950 uppercase">{info.fullName}</h1>}
          {info.jobTitle && <p className="text-sm font-bold tracking-[0.15em] text-cyan-600 uppercase">{info.jobTitle}</p>}
        </div>

        {/* Summary Node */}
        {validSummary && (
          <div className="text-[14px] leading-relaxed text-slate-600 mb-5 bg-gradient-to-r from-slate-50 to-white p-4 border-l-4 border-cyan-400 rounded-r-lg whitespace-pre-wrap shadow-sm w-full break-inside-avoid shrink-0">
            {validSummary}
          </div>
        )}

        {/* Experience Node */}
        {validExperience.length > 0 && (
          <h2 className="text-lg font-bold text-indigo-950 uppercase tracking-widest flex items-center gap-3 mb-4 w-full break-inside-avoid shrink-0">
            <svg className="w-5 h-5 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
            Professional Experience
          </h2>
        )}
        {validExperience.map((exp, index) => {
          const hasDesc = !!exp.description;
          const hasAch = exp.achievements && exp.achievements.length > 0;
          return (
            <React.Fragment key={`exp-${index}`}>
              <div className="flex justify-between items-baseline relative pl-4 border-l-2 border-indigo-100 w-full break-inside-avoid shrink-0 pb-1">
                <div className="absolute w-2 h-2 rounded-full bg-cyan-400 -left-[5px] top-1.5 shadow-[0_0_5px_rgba(34,211,238,0.8)]"></div>
                <h3 className="text-[16px] font-bold text-indigo-950">{exp.role}</h3>
                <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-wider">
                  {formatDates(exp.startDate, exp.endDate, exp.isCurrent)}
                </span>
              </div>
              <div className={`flex justify-between items-baseline pl-4 border-l-2 border-indigo-100 w-full break-inside-avoid shrink-0 ${(!hasDesc && !hasAch) ? 'mb-5' : 'pb-1'}`}>
                <p className="text-[14px] font-semibold text-cyan-600">{exp.company}</p>
                {exp.location && <p className="text-[11px] font-medium text-slate-400 uppercase">{exp.location}</p>}
              </div>
              {hasDesc && (
                <p className={`text-[13.5px] text-slate-600 leading-relaxed whitespace-pre-wrap pl-4 border-l-2 border-indigo-100 w-full break-inside-avoid shrink-0 ${!hasAch ? 'mb-5' : 'pb-2'}`}>
                  {exp.description}
                </p>
              )}
              {hasAch && exp.achievements.map((ach, i) => (
                <li key={`ach-${i}`} className={`flex items-start gap-2.5 list-none text-[13.5px] text-slate-600 leading-relaxed pl-4 border-l-2 border-indigo-100 w-full break-inside-avoid shrink-0 ${i === exp.achievements.length - 1 ? 'mb-5' : 'pb-1.5'}`}>
                  <svg className="w-3.5 h-3.5 text-cyan-500 mt-1 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span>{ach}</span>
                </li>
              ))}
            </React.Fragment>
          );
        })}

        {/* Projects Node */}
        {data.projects && data.projects.length > 0 && (
          <h2 className="text-lg font-bold text-indigo-950 uppercase tracking-widest flex items-center gap-3 mb-4 w-full break-inside-avoid shrink-0">
             <svg className="w-5 h-5 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/></svg>
            Projects
          </h2>
        )}
        {data.projects && data.projects.map((proj, index) => (
          <React.Fragment key={`proj-${index}`}>
            <div className={`flex justify-between items-baseline relative pl-4 border-l-2 border-indigo-100 w-full break-inside-avoid shrink-0 ${!proj.description ? 'mb-5' : 'pb-1'}`}>
              <div className="absolute w-2 h-2 rounded-full bg-cyan-400 -left-[5px] top-1.5"></div>
              <h3 className="text-[15px] font-bold text-indigo-950">{proj.title}</h3>
              {proj.date && <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-wider">{proj.date}</span>}
            </div>
            {proj.description && (
              <p className="text-[13.5px] text-slate-600 leading-relaxed pt-1 mb-5 whitespace-pre-wrap pl-4 border-l-2 border-indigo-100 w-full break-inside-avoid shrink-0">{proj.description}</p>
            )}
          </React.Fragment>
        ))}

        {/* Education Node */}
        {validEducation.length > 0 && (
          <h2 className="text-lg font-bold text-indigo-950 uppercase tracking-widest flex items-center gap-3 mb-4 w-full break-inside-avoid shrink-0">
             <svg className="w-5 h-5 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M12 14l9-5-9-5-9 5 9 5z"/><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/><path strokeLinecap="round" strokeLinejoin="round" d="M12 14v7"/></svg>
            Education
          </h2>
        )}
        {validEducation.map((edu, index) => (
          <React.Fragment key={`edu-${index}`}>
            <div className="flex justify-between items-baseline relative pl-4 border-l-2 border-indigo-100 w-full break-inside-avoid shrink-0 pb-1">
               <div className="absolute w-2 h-2 rounded-full bg-cyan-400 -left-[5px] top-1.5"></div>
              <h3 className="text-[15px] font-bold text-indigo-950">{edu.degree}</h3>
              <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-wider">
                {formatDates(edu.startDate, edu.endDate, edu.isCurrent)}
              </span>
            </div>
            <div className={`flex justify-between items-baseline pl-4 border-l-2 border-indigo-100 w-full break-inside-avoid shrink-0 ${!edu.description ? 'mb-5' : 'pb-1'}`}>
              <p className="text-[14px] text-slate-600">{edu.school}</p>
              {edu.location && <p className="text-[11px] font-medium text-slate-400 uppercase">{edu.location}</p>}
            </div>
            {edu.description && (
              <p className="text-[13.5px] text-slate-600 leading-relaxed pt-1 mb-5 whitespace-pre-wrap pl-4 border-l-2 border-indigo-100 w-full break-inside-avoid shrink-0">{edu.description}</p>
            )}
          </React.Fragment>
        ))}

        {/* Certifications Node */}
        {validCertificates && validCertificates.length > 0 && (
          <h2 className="text-lg font-bold text-indigo-950 uppercase tracking-widest flex items-center gap-3 mb-4 w-full break-inside-avoid shrink-0">
             <svg className="w-5 h-5 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
            Certifications
          </h2>
        )}
        {validCertificates && validCertificates.map((cert, index) => (
          <React.Fragment key={`cert-${index}`}>
            <div className="flex justify-between items-baseline relative pl-4 border-l-2 border-indigo-100 w-full break-inside-avoid shrink-0 pb-1">
              <div className="absolute w-2 h-2 rounded-full bg-cyan-400 -left-[5px] top-1.5"></div>
              <h3 className="text-[14px] font-bold text-indigo-950">{cert.title}</h3>
              {cert.date && <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-wider">{cert.date}</span>}
            </div>
            <p className={`text-[13.5px] text-cyan-600 font-semibold pl-4 border-l-2 border-indigo-100 w-full break-inside-avoid shrink-0 ${!cert.description ? 'mb-5' : 'pb-1'}`}>{cert.issuer}</p>
            {cert.description && (
              <p className="text-[13px] text-slate-600 leading-relaxed pt-1 mb-5 whitespace-pre-wrap pl-4 border-l-2 border-indigo-100 w-full break-inside-avoid shrink-0">{cert.description}</p>
            )}
          </React.Fragment>
        ))}

        {/* References Node */}
        {validReferences && validReferences.length > 0 && (
          <h2 className="text-lg font-bold text-indigo-950 uppercase tracking-widest flex items-center gap-3 mb-4 w-full break-inside-avoid shrink-0">
             <svg className="w-5 h-5 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
            References
          </h2>
        )}
        {validReferences && validReferences.length > 0 && (
          <div className="grid grid-cols-2 gap-6 pl-4 border-l-2 border-indigo-100 relative w-full break-inside-avoid shrink-0 mb-5">
            <div className="absolute w-2 h-2 rounded-full bg-cyan-400 -left-[5px] top-1.5"></div>
            {validReferences.map((ref, index) => (
              <div key={`ref-${index}`} className="flex flex-col gap-0.5">
                <h3 className="text-[14px] font-bold text-indigo-950">{ref.name}</h3>
                {(ref.role || ref.company) && (
                  <p className="text-[12px] font-semibold text-cyan-600">
                    {ref.role}{ref.role && ref.company ? `, ${ref.company}` : ref.company}
                  </p>
                )}
                {ref.contact && <p className="text-[12px] text-slate-500 mt-1">{ref.contact}</p>}
              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  );
}