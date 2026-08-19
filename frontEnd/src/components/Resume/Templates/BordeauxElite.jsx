import React from 'react';

export default function BordeauxElite({
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
    <div id="resume-raw-content" className="w-full h-full flex bg-[#FDFBF7] text-slate-800 relative shadow-sm">
      
      {/* LEFT SIDEBAR: Deep Bordeaux - FLAT STRUCTURE */}
      <aside className="w-[33%] bg-[#2A141A] text-[#F3EFEA] p-8 flex flex-col shrink-0 gap-6 border-r-4 border-[#8B3A46]">
        
        {/* Profile Image Node */}
        {info.photo && (
          <div className="shrink-0 flex justify-center mb-2">
            <div className="w-36 h-36 rounded-full border border-[#8B3A46] p-1.5">
              <div className="w-full h-full rounded-full overflow-hidden bg-[#1A0C10] flex items-center justify-center">
                <img src={info.photo} alt="Profile" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        )}

        {/* Contact Heading Node */}
        {hasContact && (
          <h2 className="text-xs font-bold tracking-[0.25em] text-[#D4AF37] uppercase border-b border-[#8B3A46]/50 pb-2 mt-2 font-serif">
            Contact
          </h2>
        )}

        {/* Contact Items - Rendered Flat */}
        {info.email && (
          <div className="flex items-center gap-3 text-[13px] -mt-2">
            <svg className="w-4 h-4 text-[#D4AF37] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
            <span className="break-all font-light tracking-wide">{info.email}</span>
          </div>
        )}
        {info.phone && (
          <div className="flex items-center gap-3 text-[13px] -mt-2">
            <svg className="w-4 h-4 text-[#D4AF37] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" /></svg>
            <span className="font-light tracking-wide">{info.phone}</span>
          </div>
        )}
        {info.location && (
          <div className="flex items-center gap-3 text-[13px] -mt-2">
            <svg className="w-4 h-4 text-[#D4AF37] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
            <span className="font-light tracking-wide">{info.location}</span>
          </div>
        )}
        {info.website && (
          <div className="flex items-center gap-3 text-[13px] -mt-2">
            <svg className="w-4 h-4 text-[#D4AF37] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-3.6-9m3.6 9a9 9 0 003.6-9m-3.6-9a9 9 0 00-3.6 9m3.6-9a9 9 0 013.6 9" /></svg>
            <span className="break-all font-light tracking-wide">{info.website.replace(/(^\w+:|^)\/\//, '')}</span>
          </div>
        )}
        {info.linkedin && (
          <div className="flex items-center gap-3 text-[13px] -mt-2">
            <svg className="w-4 h-4 text-[#D4AF37] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" /></svg>
            <span className="break-all font-light tracking-wide">{info.linkedin.replace(/(^\w+:|^)\/\//, '')}</span>
          </div>
        )}
        {info.secondarySocial && (
          <div className="flex items-center gap-3 text-[13px] -mt-2">
            <svg className="w-4 h-4 text-[#D4AF37] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" /></svg>
            <span className="break-all font-light tracking-wide">{info.secondarySocial.replace(/(^\w+:|^)\/\//, '')}</span>
          </div>
        )}

        {info.github && (
          <div className="flex items-center gap-3 text-[13px] -mt-2">
            <svg className="w-4 h-4 text-[#D4AF37] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" /></svg>
            <span className="break-all font-light tracking-wide">{info.github.replace(/(^\w+:|^)\/\//, '')}</span>
          </div>
        )}
        
        {/* Demographics Node */}
        {(info.dob || info.nationality || info.gender || info.drivingLicense) && (
          <h2 className="text-xs font-bold tracking-[0.25em] text-[#D4AF37] uppercase border-b border-[#8B3A46]/50 pb-2 mt-4 font-serif">
            Details
          </h2>
        )}
        {info.dob && (
          <div className="flex flex-col gap-0.5 -mt-2">
            <span className="text-[9px] font-bold tracking-widest text-[#8B3A46] uppercase">Date of Birth</span>
            <span className="text-[13px] font-light text-[#F3EFEA]">{info.dob}</span>
          </div>
        )}
        {info.nationality && (
          <div className="flex flex-col gap-0.5 -mt-2">
            <span className="text-[9px] font-bold tracking-widest text-[#8B3A46] uppercase">Nationality</span>
            <span className="text-[13px] font-light text-[#F3EFEA]">{info.nationality}</span>
          </div>
        )}
        {info.gender && (
          <div className="flex flex-col gap-0.5 -mt-2">
            <span className="text-[9px] font-bold tracking-widest text-[#8B3A46] uppercase">Gender</span>
            <span className="text-[13px] font-light text-[#F3EFEA]">{info.gender}</span>
          </div>
        )}
        {info.drivingLicense && (
          <div className="flex flex-col gap-0.5 -mt-2">
            <span className="text-[9px] font-bold tracking-widest text-[#8B3A46] uppercase">Driver's License</span>
            <span className="text-[13px] font-light text-[#F3EFEA]">{info.drivingLicense}</span>
          </div>
        )}

        {/* Skills Heading Node */}
        {validSkills.length > 0 && (
          <h2 className="text-xs font-bold tracking-[0.25em] text-[#D4AF37] uppercase border-b border-[#8B3A46]/50 pb-2 mt-4 font-serif">
            Expertise
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
            <div key={`skill-${index}`} className="flex flex-col gap-1.5 -mt-2">
              <div className="flex justify-between text-[13px] font-medium tracking-wide">
                <span>{name}</span>
              </div>
              <div className="w-full bg-[#1A0C10] h-[2px] rounded-full overflow-hidden">
                <div 
                  className="bg-[#D4AF37] h-full rounded-full" 
                  style={{ width: `${barWidth}%` }}
                />
              </div>
            </div>
          );
        })}

        {/* Languages Heading Node */}
        {validLanguages.length > 0 && (
          <h2 className="text-xs font-bold tracking-[0.25em] text-[#D4AF37] uppercase border-b border-[#8B3A46]/50 pb-2 mt-4 font-serif">
            Languages
          </h2>
        )}
        {validLanguages.map((lang, index) => (
          <div key={`lang-${index}`} className="flex flex-col gap-0.5 -mt-2">
             <span className="text-[13px] font-medium tracking-wide">{lang.name}</span>
             <span className="text-[11px] text-[#8B3A46] uppercase tracking-widest">{lang.proficiency}</span>
          </div>
        ))}

        {/* Hobbies Heading Node */}
        {validHobbies && validHobbies.length > 0 && (
          <h2 className="text-xs font-bold tracking-[0.25em] text-[#D4AF37] uppercase border-b border-[#8B3A46]/50 pb-2 mt-4 font-serif">
            Interests
          </h2>
        )}
        {validHobbies && validHobbies.map((hobby, index) => {
          const name = typeof hobby === 'string' ? hobby : hobby.name;
          return (
            <div key={`hobby-${index}`} className="flex items-center gap-3 -mt-2 text-[13px] font-light text-[#F3EFEA] tracking-wide">
              <span className="text-[#D4AF37] text-[14px] leading-none shrink-0">♦</span>
              {name}
            </div>
          );
        })}

      </aside>

      {/* RIGHT MAIN SIDE - FLATTENED FOR PAGINATION */}
      <main className="w-[67%] p-10 flex flex-col shrink-0">
        
        {/* Header Node */}
        <div className="flex flex-col gap-2 pb-6 border-b border-[#E5E0D8] mb-6 w-full break-inside-avoid shrink-0">
          {info.fullName && <h1 className="text-5xl font-light tracking-tight text-[#2A141A] font-serif uppercase">{info.fullName}</h1>}
          {info.jobTitle && <p className="text-[15px] font-medium tracking-[0.2em] text-[#8B3A46] uppercase mt-1">{info.jobTitle}</p>}
        </div>

        {/* Summary Node */}
        {validSummary && (
          <div className="text-[14px] leading-relaxed text-[#4A4A4A] mb-6 font-light text-justify whitespace-pre-wrap w-full break-inside-avoid shrink-0">
            {validSummary}
          </div>
        )}

        {/* Experience Heading Node */}
        {validExperience.length > 0 && (
          <h2 className="text-xl font-medium text-[#2A141A] uppercase tracking-widest flex items-center gap-4 mb-4 font-serif w-full break-inside-avoid shrink-0">
            <svg className="w-5 h-5 text-[#8B3A46]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" /></svg>
            Professional Experience
          </h2>
        )}

        {/* Experience Item Nodes */}
        {validExperience.map((exp, index) => {
          const hasDesc = !!exp.description;
          const hasAch = exp.achievements && exp.achievements.length > 0;
          
          return (
            <React.Fragment key={`exp-${index}`}>
              <div className="flex justify-between items-end border-b border-dashed border-[#E5E0D8] pb-1 w-full break-inside-avoid shrink-0">
                <h3 className="text-[16px] font-semibold text-[#2A141A] tracking-wide uppercase">{exp.role}</h3>
                <span className="text-[12px] font-medium text-[#8B3A46] uppercase tracking-wider shrink-0 ml-2">
                  {formatDates(exp.startDate, exp.endDate, exp.isCurrent)}
                </span>
              </div>
              
              <div className={`flex justify-between items-baseline mt-2 w-full break-inside-avoid shrink-0 ${(!hasDesc && !hasAch) ? 'mb-6' : ''}`}>
                <p className="text-[14px] font-medium text-[#4A4A4A]">{exp.company}</p>
                {exp.location && <p className="text-[11px] font-medium text-[#8B3A46] uppercase">{exp.location}</p>}
              </div>
              
              {hasDesc && (
                <p className={`text-[13.5px] text-[#5A5A5A] font-light leading-relaxed mt-1.5 whitespace-pre-wrap w-full break-inside-avoid shrink-0 ${!hasAch ? 'mb-6' : ''}`}>
                  {exp.description}
                </p>
              )}
              
              {hasAch && exp.achievements.map((ach, i) => (
                <div key={`ach-${i}`} className={`flex items-start gap-3 mt-2 text-[13.5px] text-[#5A5A5A] leading-relaxed font-light w-full break-inside-avoid shrink-0 ${i === exp.achievements.length - 1 ? 'mb-6' : ''}`}>
                  <span className="text-[#D4AF37] mt-1 text-[14px] leading-none shrink-0">♦</span>
                  <span>{ach}</span>
                </div>
              ))}
            </React.Fragment>
          );
        })}

        {/* Projects Heading Node */}
        {data.projects && data.projects.length > 0 && (
          <h2 className="text-xl font-medium text-[#2A141A] uppercase tracking-widest flex items-center gap-4 mb-4 font-serif w-full break-inside-avoid shrink-0">
            <svg className="w-5 h-5 text-[#8B3A46]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" /></svg>
            Key Projects
          </h2>
        )}

        {/* Projects Item Nodes */}
        {data.projects && data.projects.map((proj, index) => (
          <React.Fragment key={`proj-${index}`}>
            <div className={`flex justify-between items-end border-b border-dashed border-[#E5E0D8] pb-1 w-full break-inside-avoid shrink-0 ${!proj.description ? 'mb-6' : ''}`}>
              <h3 className="text-[16px] font-semibold text-[#2A141A] tracking-wide uppercase">{proj.title}</h3>
              {proj.date && <span className="text-[12px] font-medium text-[#8B3A46] uppercase tracking-wider shrink-0 ml-2">{proj.date}</span>}
            </div>
            {proj.description && (
              <p className="text-[13.5px] text-[#5A5A5A] font-light leading-relaxed mt-1.5 mb-6 whitespace-pre-wrap w-full break-inside-avoid shrink-0">{proj.description}</p>
            )}
          </React.Fragment>
        ))}

        {/* Education Heading Node */}
        {validEducation.length > 0 && (
          <h2 className="text-xl font-medium text-[#2A141A] uppercase tracking-widest flex items-center gap-4 mb-4 font-serif w-full break-inside-avoid shrink-0">
             <svg className="w-5 h-5 text-[#8B3A46]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" /></svg>
            Academic Profile
          </h2>
        )}

        {/* Education Item Nodes */}
        {validEducation.map((edu, index) => (
          <React.Fragment key={`edu-${index}`}>
            <div className="flex justify-between items-end border-b border-dashed border-[#E5E0D8] pb-1 w-full break-inside-avoid shrink-0">
              <h3 className="text-[15px] font-semibold text-[#2A141A]">{edu.degree}</h3>
              <span className="text-[12px] font-medium text-[#8B3A46] uppercase tracking-wider shrink-0 ml-2">
                {formatDates(edu.startDate, edu.endDate, edu.isCurrent)}
              </span>
            </div>
            <div className={`flex justify-between items-baseline mt-2 w-full break-inside-avoid shrink-0 ${!edu.description ? 'mb-6' : ''}`}>
              <p className="text-[14px] text-[#5A5A5A] font-medium">{edu.school}</p>
              {edu.location && <p className="text-[11px] font-medium text-[#8B3A46] uppercase">{edu.location}</p>}
            </div>
            {edu.description && (
              <p className="text-[13.5px] text-[#5A5A5A] font-light leading-relaxed mt-1.5 mb-6 whitespace-pre-wrap w-full break-inside-avoid shrink-0">{edu.description}</p>
            )}
          </React.Fragment>
        ))}

        {/* Certifications Heading Node */}
        {validCertificates && validCertificates.length > 0 && (
          <h2 className="text-xl font-medium text-[#2A141A] uppercase tracking-widest flex items-center gap-4 mb-4 font-serif w-full break-inside-avoid shrink-0">
             <svg className="w-5 h-5 text-[#8B3A46]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Certifications
          </h2>
        )}

        {/* Certifications Item Nodes */}
        {validCertificates && validCertificates.map((cert, index) => (
          <React.Fragment key={`cert-${index}`}>
            <div className="flex justify-between items-end border-b border-dashed border-[#E5E0D8] pb-1 w-full break-inside-avoid shrink-0">
              <h3 className="text-[15px] font-semibold text-[#2A141A]">{cert.title}</h3>
              {cert.date && <span className="text-[12px] font-medium text-[#8B3A46] uppercase tracking-wider shrink-0 ml-2">{cert.date}</span>}
            </div>
            {cert.issuer && <p className={`text-[14px] text-[#5A5A5A] font-medium mt-1.5 w-full break-inside-avoid shrink-0 ${!cert.description ? 'mb-6' : ''}`}>{cert.issuer}</p>}
            {cert.description && (
              <p className="text-[13.5px] text-[#5A5A5A] font-light leading-relaxed mt-1.5 mb-6 whitespace-pre-wrap w-full break-inside-avoid shrink-0">{cert.description}</p>
            )}
          </React.Fragment>
        ))}

        {/* References Heading Node */}
        {validReferences && validReferences.length > 0 && (
          <h2 className="text-xl font-medium text-[#2A141A] uppercase tracking-widest flex items-center gap-4 mb-4 font-serif w-full break-inside-avoid shrink-0">
             <svg className="w-5 h-5 text-[#8B3A46]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
            References
          </h2>
        )}

        {/* References Item Nodes */}
        {validReferences && validReferences.length > 0 && (
          <div className="grid grid-cols-2 gap-6 w-full break-inside-avoid shrink-0 mb-6">
            {validReferences.map((ref, index) => (
              <div key={`ref-${index}`} className="flex flex-col gap-0.5">
                <h3 className="text-[15px] font-semibold text-[#2A141A]">{ref.name}</h3>
                {(ref.role || ref.company) && (
                  <p className="text-[13px] font-medium text-[#8B3A46]">
                    {ref.role}{ref.role && ref.company ? `, ${ref.company}` : ref.company}
                  </p>
                )}
                {ref.contact && <p className="text-[12.5px] text-[#5A5A5A] font-light mt-1">{ref.contact}</p>}
              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  );
}