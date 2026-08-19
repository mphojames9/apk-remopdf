import React from 'react';

export default function GraphitePro({
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
    <div id="resume-raw-content" className="w-full min-w-[800px] min-h-full flex flex-row print:flex-row bg-[#030712] text-[#E2E8F0] relative font-sans overflow-hidden">
      
      {/* 2030 Futuristic Cyber-style Grid Overlay */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px]"></div>
      
      {/* LEFT SIDEBAR */}
      <aside className="w-[35%] print:w-[35%] bg-white/[0.02] backdrop-blur-md pt-12 pb-8 px-10 flex flex-col shrink-0 gap-6 border-r border-white/10 relative z-10">
        
        {/* Profile Image */}
        {info.photo && (
          <div className="shrink-0 flex justify-center mb-2 relative group">
            <div className="absolute -inset-2 bg-gradient-to-br from-[#10B981]/40 to-[#8B5CF6]/40 rounded-full blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative w-40 h-40 rounded-full overflow-hidden border border-white/20 p-1 bg-[#030712]">
              <div className="w-full h-full rounded-full overflow-hidden">
                <img src={info.photo} alt="Profile" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        )}

        {/* Name & Title */}
        {info.fullName && (
          <h1 className="text-[28px] font-bold tracking-wider text-white leading-tight mt-2 text-center drop-shadow-md">
            {info.fullName}
          </h1>
        )}
        {info.jobTitle && (
          <p className="text-[12px] font-medium tracking-[0.3em] text-[#10B981] uppercase text-center mb-2">
            {info.jobTitle}
          </p>
        )}

        {/* Contact Heading */}
        {hasContact && (
          <h2 className="text-[11px] font-bold tracking-[0.2em] text-white/50 uppercase mt-4 mb-2 flex items-center gap-2">
            <span className="w-1 h-1 bg-[#8B5CF6] rounded-full"></span>
            Contact
          </h2>
        )}

        <div className="flex flex-col gap-3">
          {info.email && (
            <div className="flex items-center gap-3 text-[12px]">
              <div className="w-6 h-6 rounded flex items-center justify-center bg-white/5 border border-white/10 shrink-0">
                <svg className="w-3 h-3 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <span className="font-light text-[#94A3B8] break-all">{info.email}</span>
            </div>
          )}
          {info.phone && (
            <div className="flex items-center gap-3 text-[12px]">
              <div className="w-6 h-6 rounded flex items-center justify-center bg-white/5 border border-white/10 shrink-0">
                 <svg className="w-3 h-3 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              </div>
              <span className="font-light text-[#94A3B8]">{info.phone}</span>
            </div>
          )}
          {info.location && (
            <div className="flex items-center gap-3 text-[12px]">
              <div className="w-6 h-6 rounded flex items-center justify-center bg-white/5 border border-white/10 shrink-0">
                 <svg className="w-3 h-3 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
              <span className="font-light text-[#94A3B8]">{info.location}</span>
            </div>
          )}
          {info.website && (
            <div className="flex items-center gap-3 text-[12px]">
               <div className="w-6 h-6 rounded flex items-center justify-center bg-white/5 border border-white/10 shrink-0">
                  <svg className="w-3 h-3 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-3.6-9m3.6 9a9 9 0 003.6-9m-3.6-9a9 9 0 00-3.6 9m3.6-9a9 9 0 013.6 9" /></svg>
               </div>
              <span className="font-light text-[#94A3B8] break-all">{info.website.replace(/(^\w+:|^)\/\//, '')}</span>
            </div>
          )}
          {info.linkedin && (
            <div className="flex items-center gap-3 text-[12px]">
              <div className="w-6 h-6 rounded flex items-center justify-center bg-white/5 border border-white/10 shrink-0">
                 <svg className="w-3 h-3 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" /><circle cx="4" cy="4" r="2" strokeWidth="2" /></svg>
              </div>
              <span className="font-light text-[#94A3B8] break-all">{info.linkedin.replace(/(^\w+:|^)\/\//, '')}</span>
            </div>
          )}
{info.secondarySocial && (
  <div className="flex items-center gap-3 text-[12px]">
    <div className="w-6 h-6 rounded flex items-center justify-center bg-white/5 border border-white/10 shrink-0">
      {/* Globe / Website SVG */}
      <svg className="w-3 h-3 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18zM12 3c2.5 0 4.5 4.03 4.5 9s-2 9-4.5 9m0-18c-2.5 0-4.5 4.03-4.5 9s2 9 4.5 9m-9-9h18" />
      </svg>
    </div>
    <span className="font-light text-[#94A3B8] break-all">
      {info.secondarySocial.replace(/(^\w+:|^)\/\//, '')}
    </span>
  </div>
)}

{info.github && (
  <div className="flex items-center gap-3 text-[12px]">
    <div className="w-6 h-6 rounded flex items-center justify-center bg-white/5 border border-white/10 shrink-0">
      {/* GitHub Brand SVG */}
      <svg className="w-3 h-3 text-[#10B981]" fill="currentColor" viewBox="0 0 24 24">
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    </div>
    <span className="font-light text-[#94A3B8] break-all">
      {info.github.replace(/(^\w+:|^)\/\//, '')}
    </span>
  </div>
)}
        </div>

        {/* PERSONAL DETAILS SECTION (Single Column) */}
        {(info.dob || info.nationality || info.gender || info.drivingLicense) && (
          <>
            <h2 className="text-[11px] font-bold tracking-[0.2em] text-white/50 uppercase mt-4 mb-2 flex items-center gap-2">
              <span className="w-1 h-1 bg-[#8B5CF6] rounded-full"></span>
              Details
            </h2>
            <div className="flex flex-col gap-3">
              {info.dob && (
                <div className="flex flex-col">
                  <span className="text-[10px] font-mono tracking-widest uppercase text-[#10B981]">Date of Birth</span>
                  <span className="text-[12px] font-medium text-[#E2E8F0] mt-0.5">{info.dob}</span>
                </div>
              )}
              {info.nationality && (
                <div className="flex flex-col">
                  <span className="text-[10px] font-mono tracking-widest uppercase text-[#10B981]">Nationality</span>
                  <span className="text-[12px] font-medium text-[#E2E8F0] mt-0.5">{info.nationality}</span>
                </div>
              )}
              {info.gender && (
                <div className="flex flex-col">
                  <span className="text-[10px] font-mono tracking-widest uppercase text-[#10B981]">Gender</span>
                  <span className="text-[12px] font-medium text-[#E2E8F0] mt-0.5">{info.gender}</span>
                </div>
              )}
              {info.drivingLicense && (
                <div className="flex flex-col">
                  <span className="text-[10px] font-mono tracking-widest uppercase text-[#10B981]">License</span>
                  <span className="text-[12px] font-medium text-[#E2E8F0] mt-0.5">{info.drivingLicense}</span>
                </div>
              )}
            </div>
          </>
        )}

        {validSummary && (
          <>
            <h2 className="text-[11px] font-bold tracking-[0.2em] text-white/50 uppercase mt-4 mb-2 flex items-center gap-2">
              <span className="w-1 h-1 bg-[#8B5CF6] rounded-full"></span>
              About Me
            </h2>
            <div className="text-[12px] leading-relaxed text-[#94A3B8] font-light whitespace-pre-wrap">
              {validSummary}
            </div>
          </>
        )}

                {/* SKILLS SECTION */}
        {validSkills.length > 0 && (
          <h2 className="text-[14px] font-bold text-white uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
            <span className="text-[#10B981]"></span> Skills
          </h2>
        )}
        <div className="grid grid-cols-1 gap-4 mb-8">
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
              <div key={`skill-${index}`} className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-[12px] text-[#E2E8F0] font-medium">{name}</span>
                  <span className="text-[10px] text-[#64748B] font-mono">{Math.round(barWidth)}%</span>
                </div>
                <div className="w-full h-[3px] bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#10B981] to-[#8B5CF6] rounded-full"
                    style={{ width: `${barWidth}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>

        {validLanguages && validLanguages.length > 0 && (
          <>
            <h2 className="text-[11px] font-bold tracking-[0.2em] text-white/50 uppercase mt-4 mb-2 flex items-center gap-2">
              <span className="w-1 h-1 bg-[#8B5CF6] rounded-full"></span>
              Languages
            </h2>
            <div className="flex flex-col gap-2">
              {validLanguages.map((lang, index) => (
                <div key={`lang-${index}`} className="flex justify-between items-baseline">
                   <span className="text-[12px] font-medium text-[#E2E8F0]">{lang.name}</span>
                   <span className="text-[10px] text-[#10B981] font-mono tracking-widest uppercase">{lang.proficiency}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {validHobbies && validHobbies.length > 0 && (
          <>
            <h2 className="text-[11px] font-bold tracking-[0.2em] text-white/50 uppercase mt-4 mb-2 flex items-center gap-2">
              <span className="w-1 h-1 bg-[#8B5CF6] rounded-full"></span>
              Interests
            </h2>
            <div className="flex flex-wrap gap-2">
              {validHobbies.map((hobby, index) => {
                const name = typeof hobby === 'string' ? hobby : hobby.name;
                return (
                  <span key={`hobby-${index}`} className="text-[11px] px-3 py-1 bg-white/5 border border-white/10 rounded-full font-light text-[#94A3B8]">
                    {name}
                  </span>
                );
              })}
            </div>
          </>
        )}
      </aside>

      {/* MAIN CONTENT */}
      <main className="w-[65%] print:w-[65%] pt-12 pb-20 px-12 flex flex-col shrink-0 relative z-10">
        
        {/* EXPERIENCE SECTION */}
        {validExperience.length > 0 && (
          <h2 className="text-[14px] font-bold text-white uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
            <span className="text-[#10B981]">01.</span> Experience
          </h2>
        )}
        <div className="flex flex-col gap-6 mb-8">
          {validExperience.map((exp, index) => (
            <div key={`exp-${index}`} className="relative group">
              <div className="absolute -left-6 top-1.5 w-1.5 h-1.5 bg-[#10B981] rounded-full shadow-[0_0_8px_rgba(16,185,129,0.6)] group-hover:scale-150 transition-transform"></div>
              <div className="flex flex-row justify-between items-baseline mb-1 gap-4">
                <h3 className="text-[14px] font-bold text-white">{exp.role}</h3>
                <span className="text-[11px] font-mono text-[#8B5CF6] whitespace-nowrap">
                  {formatDates(exp.startDate, exp.endDate, exp.isCurrent)}
                </span>
              </div>
              <p className="text-[12px] font-medium text-[#94A3B8] mb-2">
                {exp.company} {exp.location && <span className="opacity-60">• {exp.location}</span>}
              </p>
              {exp.description && (
                <p className="text-[12px] text-[#64748B] leading-relaxed font-light mb-2">{exp.description}</p>
              )}
              {exp.achievements && exp.achievements.length > 0 && (
                <ul className="flex flex-col gap-1.5 mt-2">
                  {exp.achievements.map((ach, i) => (
                    <li key={`ach-${index}-${i}`} className="flex items-start gap-2 text-[12px] text-[#64748B] leading-relaxed font-light">
                      <span className="text-[#10B981] text-[8px] mt-1.5">▶</span>
                      {ach}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* EDUCATION SECTION */}
        {validEducation.length > 0 && (
          <h2 className="text-[14px] font-bold text-white uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
            <span className="text-[#10B981]">02.</span> Education
          </h2>
        )}
        <div className="flex flex-col gap-6 mb-8">
          {validEducation.map((edu, index) => (
            <div key={`edu-${index}`} className="relative group">
               <div className="absolute -left-6 top-1.5 w-1.5 h-1.5 bg-transparent border border-[#8B5CF6] rounded-full group-hover:bg-[#8B5CF6] transition-colors"></div>
              <div className="flex flex-row justify-between items-baseline mb-1 gap-4">
                <h3 className="text-[14px] font-bold text-white">{edu.degree}</h3>
                <span className="text-[11px] font-mono text-[#8B5CF6] whitespace-nowrap">
                  {formatDates(edu.startDate, edu.endDate, edu.isCurrent)}
                </span>
              </div>
              <p className="text-[12px] font-medium text-[#94A3B8] mb-2">{edu.school}</p>
              {edu.description && (
                <p className="text-[12px] text-[#64748B] leading-relaxed font-light">{edu.description}</p>
              )}
            </div>
          ))}
        </div>

                {/* PROJECTS SECTION */}
        {data.projects && data.projects.length > 0 && (
           <h2 className="text-[14px] font-bold text-white uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
            <span className="text-[#10B981]">03.</span> Projects
          </h2>
        )}
        {data.projects && data.projects.length > 0 && (
          <div className="flex flex-col gap-6 mb-8">
            {data.projects.map((proj, index) => (
              <div key={`proj-${index}`} className="relative group p-4 rounded-lg bg-white/[0.02] border border-white/5 hover:border-[#8B5CF6]/30 transition-colors">
                <div className="flex flex-row justify-between items-baseline mb-2 gap-4">
                  <h3 className="text-[14px] font-bold text-white">{proj.title}</h3>
                  <span className="text-[11px] font-mono text-[#8B5CF6] whitespace-nowrap">{proj.date || 'Project'}</span>
                </div>
                {proj.description && (
                  <p className="text-[12px] text-[#64748B] leading-relaxed font-light">{proj.description}</p>
                )}
              </div>
            ))}
          </div>
        )}



        {/* CERTIFICATIONS SECTION */}
        {validCertificates && validCertificates.length > 0 && (
           <h2 className="text-[14px] font-bold text-white uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
            <span className="text-[#10B981]">04.</span> Certifications
          </h2>
        )}
        <div className="flex flex-col gap-5 mb-8">
          {validCertificates && validCertificates.map((cert, index) => (
            <div key={`cert-${index}`} className="flex flex-col">
               <div className="flex flex-row justify-between items-baseline gap-1">
                 <h3 className="text-[13px] font-bold text-white">{cert.title}</h3>
                 <span className="text-[11px] font-mono text-[#8B5CF6] whitespace-nowrap">{cert.date || 'Certification'}</span>
               </div>
               {cert.issuer && (
                 <p className="text-[12px] text-[#94A3B8] mt-1">{cert.issuer}</p>
               )}
               {cert.description && (
                 <p className="text-[11px] text-[#64748B] leading-relaxed mt-1.5">{cert.description}</p>
               )}
            </div>
          ))}
        </div>

        {/* REFERENCES SECTION */}
        {validReferences && validReferences.length > 0 && (
          <h2 className="text-[14px] font-bold text-white uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
            <span className="text-[#10B981]">05.</span> References
          </h2>
        )}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {validReferences && validReferences.map((ref, index) => (
            <div key={`ref-${index}`} className="flex flex-col p-4 bg-white/[0.02] border border-white/5 rounded-lg">
               <h3 className="text-[13px] font-bold text-white">{ref.name}</h3>
               {(ref.role || ref.company) && (
                 <p className="text-[11px] text-[#10B981] mt-1">
                   {ref.role}{ref.role && ref.company ? ` • ${ref.company}` : ref.company}
                 </p>
               )}
               {ref.contact && (
                 <p className="text-[11px] text-[#64748B] mt-2 font-mono">{ref.contact}</p>
               )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}