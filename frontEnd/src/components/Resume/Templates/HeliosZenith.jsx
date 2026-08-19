import React from 'react';

export default function HeliosZenith({
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
  const mainElements = [];

  // 1. DEMOGRAPHICS
  if (info.dob || info.nationality || info.gender || info.drivingLicense) {
    mainElements.push(
      <div key="personaldetails" id="personal-section" className="relative text-[14px] leading-relaxed text-slate-700 bg-slate-50/50 px-6 whitespace-pre-wrap">
        <h2 key="Summary" className="font-serif text-lg font-bold text-stone-900 uppercase tracking-wider flex items-center gap-3 mb-5 mt-2">
          Personal Details
        </h2>
        <span className="absolute text-[10px] text-cyan-500 font-mono top-0 right-2 select-none pointer-events-none opacity-40"></span>
        <div className="relative z-10 font-medium">
          <div key="demographics" className="flex flex-wrap gap-x-10 gap-y-4 pb-6 mb-8 border-b border-stone-200/80">
            {info.dob && (
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Date of Birth</span>
                <span className="text-[13px] font-bold text-stone-800">{info.dob}</span>
              </div>
            )}
            {info.nationality && (
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Nationality</span>
                <span className="text-[13px] font-bold text-stone-800">{info.nationality}</span>
              </div>
            )}
            {info.gender && (
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Gender</span>
                <span className="text-[13px] font-bold text-stone-800">{info.gender}</span>
              </div>
            )}
            {info.drivingLicense && (
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Driver's License</span>
                <span className="text-[13px] font-bold text-stone-800">{info.drivingLicense}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 2. EXECUTIVE SUMMARY
  if (validSummary) {
    mainElements.push(
      <div key="summary" id="summary-section" className="relative font-serif text-[15px] leading-relaxed text-stone-700 italic bg-white p-6 mb-8 border-l-[3px] border-amber-500 rounded-r-xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] whitespace-pre-wrap">
        <span className="absolute text-5xl text-amber-200 font-serif -top-3 left-2 select-none pointer-events-none">“</span>
        <div className="relative z-10 pl-3">{validSummary}</div>
      </div>
    );
  }

  // 3. EXPERIENCE
  if (validExperience.length > 0) {
    mainElements.push(
      <h2 key="experience-heading" className="font-serif text-lg font-bold text-stone-900 uppercase tracking-wider flex items-center gap-3 mb-5 mt-2">
        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
        Professional Experience
      </h2>
    );
    validExperience.forEach((exp, index) => {
      const hasAchievements = exp.achievements && exp.achievements.length > 0;
      const hasDescription = !!exp.description;

      mainElements.push(
        <div key={`exp-${index}-header`} className="flex justify-between items-baseline gap-4 relative pl-6 border-l border-stone-200 ml-1.5 pt-1">
          <div className="absolute w-2 h-2 rounded-full bg-amber-500 -left-[4.5px] top-[7px] ring-4 ring-stone-50" />
          <h3 className="text-[15px] font-bold text-stone-900 tracking-tight">{exp.role}</h3>
          <span className="text-[10px] font-extrabold text-stone-600 bg-stone-200/60 border border-stone-300/30 px-2.5 py-0.5 rounded-md uppercase tracking-wider shrink-0">
            {formatDates(exp.startDate, exp.endDate, exp.isCurrent)}
          </span>
        </div>
      );

      const isCompanyLast = !hasDescription && !hasAchievements;
      mainElements.push(
        <div key={`exp-${index}-company`} className={`flex justify-between items-baseline pl-6 border-l border-stone-200 ml-1.5 mt-0.5 ${isCompanyLast ? 'mb-6 pb-2' : ''}`}>
          <p className="text-[13px] font-semibold text-amber-600 tracking-wide">{exp.company}</p>
          {exp.location && <p className="text-[11px] font-medium text-stone-400 uppercase tracking-wider">{exp.location}</p>}
        </div>
      );

      if (hasDescription) {
        const isDescLast = !hasAchievements;
        mainElements.push(
          <p key={`exp-${index}-desc`} className={`text-[13.5px] text-stone-600 leading-relaxed pl-6 border-l border-stone-200 ml-1.5 mt-1.5 whitespace-pre-wrap ${isDescLast ? 'mb-6 pb-2' : ''}`}>
            {exp.description}
          </p>
        );
      }

      if (hasAchievements) {
        exp.achievements.forEach((ach, i) => {
          const isLastAch = i === exp.achievements.length - 1;
          mainElements.push(
            <div key={`exp-${index}-ach-${i}`} className={`flex items-start gap-2.5 text-[13.5px] text-stone-600 leading-relaxed pl-6 border-l border-stone-200 ml-1.5 pt-1.5 ${isLastAch ? 'mb-6 pb-2' : ''}`}>
              <span className="text-amber-500 font-bold mt-0.5 select-none">→</span>
              <span>{ach}</span>
            </div>
          );
        });
      }
    });
  }

  // 4. EDUCATION
  if (validEducation.length > 0) {
    mainElements.push(
      <h2 key="education-heading" className="font-serif text-lg font-bold text-stone-900 uppercase tracking-wider flex items-center gap-3 mb-5 mt-2">
        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
        Education History
      </h2>
    );
    validEducation.forEach((edu, index) => {
      const hasDescription = !!edu.description;

      mainElements.push(
        <div key={`edu-${index}-header`} className="flex justify-between items-baseline gap-4 relative pl-6 border-l border-stone-200 ml-1.5 pt-1">
          <div className="absolute w-2 h-2 rounded-full bg-amber-500 -left-[4.5px] top-[7px] ring-4 ring-stone-50" />
          <h3 className="text-[15px] font-bold text-stone-900 tracking-tight">{edu.degree}</h3>
          <span className="text-[10px] font-extrabold text-stone-600 bg-stone-200/60 border border-stone-300/30 px-2.5 py-0.5 rounded-md uppercase tracking-wider shrink-0">
            {formatDates(edu.startDate, edu.endDate, edu.isCurrent)}
          </span>
        </div>
      );

      const isSchoolLast = !hasDescription;
      mainElements.push(
        <div key={`edu-${index}-school`} className={`flex justify-between items-baseline pl-6 border-l border-stone-200 ml-1.5 mt-0.5 ${isSchoolLast ? 'mb-6 pb-2' : ''}`}>
          <p className="text-[13px] text-stone-700 font-semibold">{edu.school}</p>
          {edu.location && <p className="text-[11px] font-medium text-stone-400 uppercase tracking-wider">{edu.location}</p>}
        </div>
      );

      if (hasDescription) {
        mainElements.push(
          <p key={`edu-${index}-desc`} className="text-[13.5px] text-stone-600 leading-relaxed pl-6 border-l border-stone-200 ml-1.5 mt-1 mb-6 pb-2 whitespace-pre-wrap">
            {edu.description}
          </p>
        );
      }
    });
  }

  // 5. SKILLS
  if (validSkills.length > 0) {
    mainElements.push(
      <h2 key="skills-heading" className="font-serif text-lg font-bold text-stone-900 uppercase tracking-wider flex items-center gap-3 mb-5 mt-2">
        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
        Core Expertise
      </h2>
    );
    mainElements.push(
      <div key="skills-grid" className="grid grid-cols-2 gap-x-8 gap-y-3 pl-4.5 mb-8">
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
            <div key={`skill-${index}`} className="flex flex-col gap-1 w-full">
              <div className="flex justify-between text-[13px] font-bold text-stone-800">
                <span>{name}</span>
              </div>
              <div className="w-full bg-stone-200/70 h-1 rounded-full overflow-hidden relative">
                <div 
                  className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-1000" 
                  style={{ width: `${barWidth}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // 6. PROJECTS
  if (data.projects && data.projects.length > 0) {
    mainElements.push(
      <h2 key="projects-heading" className="font-serif text-lg font-bold text-stone-900 uppercase tracking-wider flex items-center gap-3 mb-5 mt-2">
        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
        Featured Projects
      </h2>
    );
    data.projects.forEach((proj, index) => {
      const hasDescription = !!proj.description;

      mainElements.push(
        <div key={`proj-${index}-header`} className={`flex justify-between items-baseline gap-4 relative pl-6 border-l border-stone-200 ml-1.5 pt-1 ${!hasDescription ? 'mb-6 pb-2' : ''}`}>
          <div className="absolute w-2 h-2 rounded-full bg-amber-500 -left-[4.5px] top-[7px] ring-4 ring-stone-50" />
          <h3 className="text-[15px] font-bold text-stone-900 tracking-tight">{proj.title}</h3>
          {proj.date && <span className="text-[10px] font-extrabold text-stone-600 bg-stone-200/60 border border-stone-300/30 px-2.5 py-0.5 rounded-md uppercase tracking-wider shrink-0">{proj.date}</span>}
        </div>
      );

      if (hasDescription) {
        mainElements.push(
          <p key={`proj-${index}-desc`} className="text-[13.5px] text-stone-600 leading-relaxed pl-6 border-l border-stone-200 ml-1.5 mt-1 mb-6 pb-2 whitespace-pre-wrap">
            {proj.description}
          </p>
        );
      }
    });
  }

  // 7. CERTIFICATIONS
  if (validCertificates && validCertificates.length > 0) {
    mainElements.push(
      <h2 key="certs-heading" className="font-serif text-lg font-bold text-stone-900 uppercase tracking-wider flex items-center gap-3 mb-5 mt-2">
        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
        Certifications
      </h2>
    );
    validCertificates.forEach((cert, index) => {
      const hasDescription = !!cert.description;

      mainElements.push(
        <div key={`cert-${index}-header`} className="flex justify-between items-baseline gap-4 relative pl-6 border-l border-stone-200 ml-1.5 pt-1">
          <div className="absolute w-2 h-2 rounded-full bg-amber-500 -left-[4.5px] top-[7px] ring-4 ring-stone-50" />
          <h3 className="text-[14px] font-bold text-stone-900 tracking-tight">{cert.title}</h3>
          {cert.date && <span className="text-[10px] font-extrabold text-stone-600 bg-stone-200/60 border border-stone-300/30 px-2.5 py-0.5 rounded-md uppercase tracking-wider shrink-0">{cert.date}</span>}
        </div>
      );

      mainElements.push(
        <p key={`cert-${index}-issuer`} className={`text-[12.5px] text-amber-600 font-semibold pl-6 border-l border-stone-200 ml-1.5 mt-0.5 ${!hasDescription ? 'mb-6 pb-2' : ''}`}>
          {cert.issuer}
        </p>
      );

      if (hasDescription) {
        mainElements.push(
          <p key={`cert-${index}-desc`} className="text-[13.5px] text-stone-600 leading-relaxed pl-6 border-l border-stone-200 ml-1.5 mt-1 mb-6 pb-2 whitespace-pre-wrap">
            {cert.description}
          </p>
        );
      }
    });
  }

  // 8. LANGUAGES & HOBBIES (Dual Column Block)
  if (validLanguages.length > 0 || (validHobbies && validHobbies.length > 0)) {
    mainElements.push(
      <div key="lang-hobbies-block" className="flex flex-row gap-8 pb-2 mb-8 mt-2">
        {validLanguages.length > 0 && (
          <div className="flex-1 flex flex-col gap-3">
            <h2 className="font-serif text-base font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
              Languages
            </h2>
            <div className="flex flex-col gap-2 pl-4">
              {validLanguages.map((lang, index) => (
                <div key={`lang-${index}`} className="flex justify-between items-center text-[13.5px] border-b border-stone-200/60 pb-1">
                  <span className="font-bold text-stone-800">{lang.name}</span>
                  <span className="text-amber-600 text-[10px] font-extrabold uppercase tracking-widest bg-amber-50 border border-amber-200/40 px-2 py-0.5 rounded">
                    {lang.proficiency}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {validHobbies && validHobbies.length > 0 && (
          <div className="flex-1 flex flex-col gap-3">
            <h2 className="font-serif text-base font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
              Interests
            </h2>
            <div className="flex flex-wrap gap-2 pl-4">
              {validHobbies.map((hobby, index) => (
                <div key={`hobby-${index}`} className="inline-flex items-center gap-2 text-[13px] font-bold text-stone-700 bg-white border border-stone-200 px-3 py-1.5 rounded-lg shadow-sm">
                  <span className="w-1 h-1 bg-amber-500 rounded-full" />
                  {hobby}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // 9. REFERENCES
  if (validReferences && validReferences.length > 0) {
    mainElements.push(
      <h2 key="refs-heading" className="font-serif text-lg font-bold text-stone-900 uppercase tracking-wider flex items-center gap-3 mb-5 mt-2">
        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
        References
      </h2>
    );
    validReferences.forEach((ref, index) => {
      const hasRole = ref.role || ref.company;
      const hasContact = !!ref.contact;

      mainElements.push(
        <div key={`ref-${index}-name`} className={`relative pl-6 border-l border-stone-200 ml-1.5 pt-1 ${(!hasRole && !hasContact) ? 'mb-6 pb-2' : ''}`}>
          <div className="absolute w-2 h-2 rounded-full bg-amber-500 -left-[4.5px] top-[7px] ring-4 ring-stone-50" />
          <h3 className="text-[14px] font-bold text-stone-900 tracking-tight">{ref.name}</h3>
        </div>
      );

      if (hasRole) {
        mainElements.push(
          <p key={`ref-${index}-role`} className={`text-[12.5px] font-semibold text-amber-600 pl-6 border-l border-stone-200 ml-1.5 mt-0.5 ${!hasContact ? 'mb-6 pb-2' : ''}`}>
            {ref.role}{ref.role && ref.company ? `, ${ref.company}` : ref.company}
          </p>
        );
      }

      if (hasContact) {
        mainElements.push(
          <p key={`ref-${index}-contact`} className="text-[12.5px] text-stone-500 mt-1 font-mono tracking-tight pl-6 border-l border-stone-200 ml-1.5 mb-6 pb-2">
            {ref.contact}
          </p>
        );
      }
    });
  }

  return (
    <div id="resume-raw-content" className="w-full min-w-[800px] h-full flex flex-col font-sans bg-stone-50 text-stone-800 relative">
      
      {/* TOP HEADER SIDEBAR */}
      <aside className="w-full bg-stone-50">
        <div className="w-full bg-stone-950 text-stone-300 px-12 py-10 flex flex-row gap-10 items-center border-b-[4px] border-amber-500 shadow-2xl relative z-10 selection:bg-amber-500/30">
          
          {info.photo && (
            <div className="shrink-0 flex justify-center">
              <div className="relative w-36 h-36 rounded-2xl border border-stone-800 p-1.5 bg-stone-900/50 shadow-[0_8px_30px_rgb(0,0,0,0.6)]">
                <div className="w-full h-full rounded-xl overflow-hidden bg-stone-800 flex items-center justify-center relative group">
                  <img src={info.photo} alt="Profile" className="w-full h-full object-cover filter grayscale contrast-125 mix-blend-luminosity hover:mix-blend-normal transition-all duration-500" />
                  <div className="absolute inset-0 border border-white/10 rounded-xl pointer-events-none" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-amber-500 rounded-full border-4 border-stone-950" />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-5 flex-1">
            <div className="flex flex-col gap-1 border-b border-stone-800/80 pb-5">
              {info.fullName && (
                <h1 className="font-serif text-5xl font-normal tracking-tight text-white leading-none uppercase flex flex-wrap gap-x-3">
                  {info.fullName.split(' ').map((word, i) => (
                    <span 
                      key={i} 
                      className={i >= 1 ? "font-black text-transparent bg-clip-text bg-gradient-to-r from-stone-100 to-stone-400" : "font-light"}
                    >
                      {word}
                    </span>
                  ))}
                </h1>
              )}
              {info.jobTitle && (
                <p className="text-[12px] font-black tracking-[0.3em] text-amber-500 uppercase mt-2 ml-1">
                  {info.jobTitle}
                </p>
              )}
            </div>

            {hasContact && (
              <div className="flex flex-wrap gap-x-8 gap-y-3 text-stone-400 pl-1">
                {info.email && (
                  <div className="flex items-center gap-2 group">
                     <svg className="w-4 h-4 shrink-0 text-stone-600 group-hover:text-amber-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    <span className="text-[13px] font-medium text-stone-300 break-all transition-colors group-hover:text-amber-400">{info.email}</span>
                  </div>
                )}
                {info.phone && (
                  <div className="flex items-center gap-2 group">
                    <svg className="w-4 h-4 shrink-0 text-stone-600 group-hover:text-amber-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>
                    <span className="text-[13px] font-medium text-stone-300 transition-colors group-hover:text-amber-400">{info.phone}</span>
                  </div>
                )}
                {info.location && (
                  <div className="flex items-center gap-2 group">
                    <svg className="w-4 h-4 shrink-0 text-stone-600 group-hover:text-amber-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21s-8-4.5-8-11.8A8 8 0 0112 1.2a8 8 0 018 8C20 16.5 12 21 12 21z"/><circle cx="12" cy="9.2" r="3"/></svg>
                    <span className="text-[13px] font-medium text-stone-300 transition-colors group-hover:text-amber-400">{info.location}</span>
                  </div>
                )}
                {info.linkedin && (
                  <div className="flex items-center gap-2 group">
                    <svg className="w-4 h-4 shrink-0 text-stone-600 group-hover:text-amber-500 transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                    <span className="text-[13px] font-medium text-stone-300 break-all transition-colors group-hover:text-amber-400">
                      {info.linkedin.replace(/(^\w+:|^)\/\//, '')}
                    </span>
                  </div>
                )}
                {info.website && (
                  <div className="flex items-center gap-2 group">
                    <svg className="w-4 h-4 shrink-0 text-stone-600 group-hover:text-amber-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M3.6 9h16.8M3.6 15h16.8" /><path strokeLinecap="round" strokeLinejoin="round" d="M11.5 3a17 17 0 000 18M12.5 3a17 17 0 000 18" /></svg>
                    <span className="text-[13px] font-medium text-stone-300 break-all transition-colors group-hover:text-amber-400">
                      {info.website.replace(/(^\w+:|^)\/\//, '')}
                    </span>
                  </div>
                )}
                {info.secondarySocial && (
                  <div className="flex items-center gap-2 group">
                    <svg className="w-4 h-4 shrink-0 text-stone-600 group-hover:text-amber-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                    </svg>
                    <span className="text-[13px] font-medium text-stone-300 break-all transition-colors group-hover:text-amber-400">
                      {info.secondarySocial.replace(/(^\w+:|^)\/\//, '')}
                    </span>
                  </div>
                )}
                {info.github && (
                  <div className="flex items-center gap-2 group">
                    <svg className="w-4 h-4 shrink-0 text-stone-600 group-hover:text-amber-500 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    <span className="text-[13px] font-medium text-stone-300 break-all transition-colors group-hover:text-amber-400">
                      {info.github.replace(/(^\w+:|^)\/\//, '')}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Container - Fully Flattened Queue */}
      <main className="flex-1 p-10 flex flex-col bg-stone-50 selection:bg-amber-100">
        {mainElements}
      </main>
    </div>
  );
}