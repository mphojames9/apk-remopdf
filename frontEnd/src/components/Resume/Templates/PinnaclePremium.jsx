import React from 'react';

export default function PinnaclePremium({
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
    <div id="resume-raw-content" className="w-full h-full flex bg-white text-neutral-900 relative font-montserrat">
      
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;900&family=Montserrat:wght@300;400;500;600;700;800;900&display=swap');
        .font-cinzel { font-family: 'Cinzel', serif; }
        .font-montserrat { font-family: 'Montserrat', sans-serif; }
      `}} />

      {/* LEFT SIDEBAR: Premium Light Slate - APEX STRUCTURE */}
      <aside className="w-[34%] bg-neutral-50 text-neutral-900 p-8 flex flex-col shrink-0 gap-6 border-r border-neutral-200">
        
        {/* Profile Image Node */}
        {info.photo && (
          <div className="shrink-0 flex justify-center mb-4">
            <div className="relative w-40 h-40">
              <div className="absolute inset-0 border border-neutral-900 translate-x-2 translate-y-2"></div>
              <div className="relative w-full h-full bg-neutral-100 overflow-hidden flex items-center justify-center border border-neutral-300 shadow-sm">
                <img src={info.photo} alt="Profile" className="w-full h-full object-cover grayscale" />
              </div>
            </div>
          </div>
        )}

        {/* Contact Heading Node */}
        {hasContact && (
          <h2 className="text-[10px] font-black tracking-[0.4em] text-neutral-900 uppercase border-b border-neutral-300 pb-2 mt-2">
            Contact
          </h2>
        )}

        {/* Contact Items */}
        {info.email && (
          <div className="flex items-center gap-3 text-[12px] -mt-2">
            <svg className="w-4 h-4 text-neutral-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
            <span className="break-all font-medium tracking-wide text-neutral-700">{info.email}</span>
          </div>
        )}
        {info.phone && (
          <div className="flex items-center gap-3 text-[12px] -mt-2">
            <svg className="w-4 h-4 text-neutral-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" /></svg>
            <span className="font-medium tracking-wide text-neutral-700">{info.phone}</span>
          </div>
        )}
        {info.location && (
          <div className="flex items-center gap-3 text-[12px] -mt-2">
            <svg className="w-4 h-4 text-neutral-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
            <span className="font-medium tracking-wide text-neutral-700">{info.location}</span>
          </div>
        )}
        {info.website && (
          <div className="flex items-center gap-3 text-[12px] -mt-2">
            <svg className="w-4 h-4 text-neutral-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-3.6-9m3.6 9a9 9 0 003.6-9m-3.6-9a9 9 0 00-3.6 9m3.6-9a9 9 0 013.6 9" /></svg>
            <span className="break-all font-medium tracking-wide text-neutral-700">{info.website.replace(/(^\w+:|^)\/\//, '')}</span>
          </div>
        )}
        {info.linkedin && (
          <div className="flex items-center gap-3 text-[12px] -mt-2">
            <svg className="w-4 h-4 text-neutral-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" /></svg>
            <span className="break-all font-medium tracking-wide text-neutral-700">{info.linkedin.replace(/(^\w+:|^)\/\//, '')}</span>
          </div>
        )}
        {info.secondarySocial && (
          <div className="flex items-center gap-3 text-[12px] -mt-2">
            <svg className="w-4 h-4 text-neutral-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" /></svg>
            <span className="break-all font-medium tracking-wide text-neutral-700">{info.secondarySocial.replace(/(^\w+:|^)\/\//, '')}</span>
          </div>
        )}
        {info.github && (
          <div className="flex items-center gap-3 text-[12px] -mt-2">
            <svg className="w-4 h-4 text-neutral-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" /></svg>
            <span className="break-all font-medium tracking-wide text-neutral-700">{info.github.replace(/(^\w+:|^)\/\//, '')}</span>
          </div>
        )}

        {/* Demographics Node */}
        {(info.dob || info.nationality || info.gender || info.drivingLicense) && (
          <h2 className="text-[10px] font-black tracking-[0.4em] text-neutral-900 uppercase border-b border-neutral-300 pb-2 mt-4">
            Details
          </h2>
        )}
        {info.dob && (
          <div className="flex flex-col gap-0.5 -mt-2">
            <span className="text-[9px] font-bold tracking-widest text-neutral-500 uppercase">Date of Birth</span>
            <span className="text-[12px] font-bold text-neutral-800">{info.dob}</span>
          </div>
        )}
        {info.nationality && (
          <div className="flex flex-col gap-0.5 -mt-2">
            <span className="text-[9px] font-bold tracking-widest text-neutral-500 uppercase">Nationality</span>
            <span className="text-[12px] font-bold text-neutral-800">{info.nationality}</span>
          </div>
        )}
        {info.gender && (
          <div className="flex flex-col gap-0.5 -mt-2">
            <span className="text-[9px] font-bold tracking-widest text-neutral-500 uppercase">Gender</span>
            <span className="text-[12px] font-bold text-neutral-800">{info.gender}</span>
          </div>
        )}
        {info.drivingLicense && (
          <div className="flex flex-col gap-0.5 -mt-2">
            <span className="text-[9px] font-bold tracking-widest text-neutral-500 uppercase">Driver's License</span>
            <span className="text-[12px] font-bold text-neutral-800">{info.drivingLicense}</span>
          </div>
        )}

        {/* Skills Heading Node */}
        {validSkills.length > 0 && (
          <h2 className="text-[10px] font-black tracking-[0.4em] text-neutral-900 uppercase border-b border-neutral-300 pb-2 mt-4">
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
              <div className="flex justify-between text-[12px] font-bold text-neutral-800 uppercase tracking-wider">
                <span>{name}</span>
              </div>
              <div className="w-full bg-neutral-200 h-[4px] overflow-hidden">
                <div 
                  className="bg-neutral-900 h-full" 
                  style={{ width: `${barWidth}%` }}
                />
              </div>
            </div>
          );
        })}

        {/* Languages Heading Node */}
        {validLanguages.length > 0 && (
          <h2 className="text-[10px] font-black tracking-[0.4em] text-neutral-900 uppercase border-b border-neutral-300 pb-2 mt-4">
            Languages
          </h2>
        )}
        {validLanguages.map((lang, index) => (
          <div key={`lang-${index}`} className="flex justify-between items-baseline -mt-2 border-b border-neutral-200 pb-1 last:border-0">
             <span className="text-[12px] font-bold tracking-wide text-neutral-800">{lang.name}</span>
             <span className="text-[10px] text-neutral-500 uppercase tracking-widest">{lang.proficiency}</span>
          </div>
        ))}

        {/* Hobbies Heading Node */}
        {validHobbies && validHobbies.length > 0 && (
          <h2 className="text-[10px] font-black tracking-[0.4em] text-neutral-900 uppercase border-b border-neutral-300 pb-2 mt-4">
            Interests
          </h2>
        )}
        {validHobbies && validHobbies.map((hobby, index) => {
          const name = typeof hobby === 'string' ? hobby : hobby.name;
          return (
            <div key={`hobby-${index}`} className="flex items-center gap-3 -mt-2 text-[12px] font-medium text-neutral-700 tracking-wide">
              <span className="w-1.5 h-1.5 bg-neutral-900 rotate-45 shrink-0"></span>
              {name}
            </div>
          );
        })}

      </aside>

      {/* RIGHT MAIN SIDE - APEX STRUCTURE */}
      {/* Note: gap-6 is removed here to prevent double-spacing on flattened nodes */}
      <main className="w-[66%] p-10 flex flex-col shrink-0 bg-white">
        
        {/* Header Node */}
        <div className="flex flex-col gap-3 pb-6 border-b border-neutral-300 mb-6 relative">
          <div className="absolute top-0 right-0 w-16 h-1 bg-neutral-900"></div>
          {info.fullName && <h1 className="text-5xl font-cinzel font-black tracking-tight text-neutral-900 uppercase leading-none">{info.fullName}</h1>}
          {info.jobTitle && <p className="text-[14px] font-bold tracking-[0.3em] text-neutral-500 uppercase mt-1">{info.jobTitle}</p>}
        </div>

        {/* Summary Node */}
        {validSummary && (
          <div className="text-[13px] leading-[1.8] text-neutral-700 mb-6 font-medium text-justify whitespace-pre-wrap">
            {validSummary}
          </div>
        )}

        {/* Experience Heading Node */}
        {validExperience.length > 0 && (
          <h2 className="text-sm font-black text-neutral-900 uppercase tracking-[0.25em] mb-4 flex items-center gap-3">
            <span className="w-4 h-4 bg-neutral-900 flex items-center justify-center text-white text-[10px] font-cinzel">E</span>
            Experience
          </h2>
        )}

        {/* Flattened Experience Item Nodes */}
        {validExperience.map((exp, index) => (
          <React.Fragment key={`exp-${index}`}>
            <div className="flex justify-between items-baseline relative pl-5 border-l border-neutral-300">
              <div className="absolute w-[9px] h-[9px] bg-white border-2 border-neutral-900 -left-[5px] top-1.5 rotate-45"></div>
              <h3 className="text-[15px] font-black text-neutral-900 uppercase tracking-wide">{exp.role}</h3>
              <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest shrink-0 ml-2">
                {formatDates(exp.startDate, exp.endDate, exp.isCurrent)}
              </span>
            </div>
            <div className="flex justify-between items-baseline pl-5 border-l border-neutral-300 mt-1">
              <p className="text-[13px] font-bold text-neutral-400 uppercase tracking-widest">{exp.company}</p>
              {exp.location && <p className="text-[11px] font-semibold text-neutral-400 uppercase">{exp.location}</p>}
            </div>
            {exp.description && (
              <p className="text-[13px] text-neutral-700 leading-relaxed mt-1 whitespace-pre-wrap pl-5 border-l border-neutral-300">
                {exp.description}
              </p>
            )}
            {/* UL replaced with mapped DIVs for granular pagination */}
            {exp.achievements && exp.achievements.length > 0 && exp.achievements.map((ach, i) => (
              <div key={i} className="flex items-start gap-3 pl-5 border-l border-neutral-300 mt-2 text-[13px] text-neutral-700 leading-relaxed">
                <span className="text-neutral-900 mt-1.5 text-[8px] shrink-0">■</span>
                <span>{ach}</span>
              </div>
            ))}
            {/* Spacer maintains border gap between items */}
            <div className="h-6 pl-5 border-l border-neutral-300"></div>
          </React.Fragment>
        ))}

        {/* Projects Heading Node */}
        {data.projects && data.projects.length > 0 && (
          <h2 className="text-sm font-black text-neutral-900 uppercase tracking-[0.25em] mb-4 flex items-center gap-3">
            <span className="w-4 h-4 bg-neutral-900 flex items-center justify-center text-white text-[10px] font-cinzel">P</span>
            Projects
          </h2>
        )}

        {/* Flattened Projects Item Nodes */}
        {data.projects && data.projects.map((proj, index) => (
          <React.Fragment key={`proj-${index}`}>
            <div className="flex justify-between items-baseline relative pl-5 border-l border-neutral-300">
              <div className="absolute w-[9px] h-[9px] bg-white border-2 border-neutral-900 -left-[5px] top-1.5 rotate-45"></div>
              <h3 className="text-[14px] font-black text-neutral-900 uppercase tracking-wide">{proj.title}</h3>
              {proj.date && <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest shrink-0 ml-2">{proj.date}</span>}
            </div>
            {proj.description && (
              <p className="text-[13px] text-neutral-700 leading-relaxed mt-1 whitespace-pre-wrap pl-5 border-l border-neutral-300">{proj.description}</p>
            )}
            <div className="h-6 pl-5 border-l border-neutral-300"></div>
          </React.Fragment>
        ))}

        {/* Education Heading Node */}
        {validEducation.length > 0 && (
          <h2 className="text-sm font-black text-neutral-900 uppercase tracking-[0.25em] mb-4 flex items-center gap-3">
            <span className="w-4 h-4 bg-neutral-900 flex items-center justify-center text-white text-[10px] font-cinzel">A</span>
            Education
          </h2>
        )}

        {/* Flattened Education Item Nodes */}
        {validEducation.map((edu, index) => (
          <React.Fragment key={`edu-${index}`}>
             <div className="flex justify-between items-baseline relative pl-5 border-l border-neutral-300">
             <div className="absolute w-[9px] h-[9px] bg-white border-2 border-neutral-900 -left-[5px] top-1.5 rotate-45"></div>
              <h3 className="text-[14px] font-black text-neutral-900 uppercase tracking-wide">{edu.degree}</h3>
              <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest shrink-0 ml-2">
                {formatDates(edu.startDate, edu.endDate, edu.isCurrent)}
              </span>
            </div>
            <div className="flex justify-between items-baseline pl-5 border-l border-neutral-300 mt-1">
              <p className="text-[13px] font-bold text-neutral-400 uppercase tracking-widest">{edu.school}</p>
              {edu.location && <p className="text-[11px] font-semibold text-neutral-400 uppercase">{edu.location}</p>}
            </div>
            {edu.description && (
              <p className="text-[13px] text-neutral-700 leading-relaxed mt-1 whitespace-pre-wrap pl-5 border-l border-neutral-300">{edu.description}</p>
            )}
            <div className="h-6 pl-5 border-l border-neutral-300"></div>
          </React.Fragment>
        ))}

        {/* Certifications Heading Node */}
        {validCertificates && validCertificates.length > 0 && (
          <h2 className="text-sm font-black text-neutral-900 uppercase tracking-[0.25em] mb-4 flex items-center gap-3">
            <span className="w-4 h-4 bg-neutral-900 flex items-center justify-center text-white text-[10px] font-cinzel">C</span>
            Certifications
          </h2>
        )}

        {/* Flattened Certifications Item Nodes */}
        {validCertificates && validCertificates.map((cert, index) => (
          <React.Fragment key={`cert-${index}`}>
             <div className="flex justify-between items-baseline relative pl-5 border-l border-neutral-300">
             <div className="absolute w-[9px] h-[9px] bg-white border-2 border-neutral-900 -left-[5px] top-1.5 rotate-45"></div>
              <h3 className="text-[14px] font-black text-neutral-900 uppercase tracking-wide">{cert.title}</h3>
              {cert.date && <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest shrink-0 ml-2">{cert.date}</span>}
            </div>
            {cert.issuer && <p className="text-[12px] text-neutral-400 font-bold uppercase tracking-widest pl-5 border-l border-neutral-300 mt-1">{cert.issuer}</p>}
            {cert.description && (
              <p className="text-[13px] text-neutral-700 leading-relaxed mt-1 whitespace-pre-wrap pl-5 border-l border-neutral-300">{cert.description}</p>
            )}
            <div className="h-6 pl-5 border-l border-neutral-300"></div>
          </React.Fragment>
        ))}

        {/* References Heading Node */}
        {validReferences && validReferences.length > 0 && (
          <h2 className="text-sm font-black text-neutral-900 uppercase tracking-[0.25em] mb-4 flex items-center gap-3">
            <span className="w-4 h-4 bg-neutral-900 flex items-center justify-center text-white text-[10px] font-cinzel">R</span>
            References
          </h2>
        )}

        {/* Flattened References Item Nodes */}
        {validReferences && validReferences.length > 0 && validReferences.map((ref, index) => (
          <React.Fragment key={`ref-${index}`}>
            <div className="relative pl-5 border-l border-neutral-300">
              <div className="absolute w-[9px] h-[9px] bg-white border-2 border-neutral-900 -left-[5px] top-1.5 rotate-45"></div>
              <h3 className="text-[14px] font-black text-neutral-900 uppercase tracking-wide">{ref.name}</h3>
            </div>
            {(ref.role || ref.company) && (
              <p className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest mt-1 pl-5 border-l border-neutral-300">
                {ref.role}{ref.role && ref.company ? `, ${ref.company}` : ref.company}
              </p>
            )}
            {ref.contact && <p className="text-[12px] text-neutral-400 mt-1 font-medium pl-5 border-l border-neutral-300">{ref.contact}</p>}
            <div className="h-6 pl-5 border-l border-neutral-300"></div>
          </React.Fragment>
        ))}

      </main>
    </div>
  );
}