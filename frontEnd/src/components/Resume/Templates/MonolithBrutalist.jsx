import React from 'react';

export default function MonolithBrutalist({
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
  
  // Premium Modern Orange Hex
  const accentColor = "#EA580C"; 

  // Generic Globe/Link SVG Path for Web Links
  const webIconPath = "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12";

  const hasPersonalDetails = info.dob || info.nationality || info.gender || info.drivingLicense;

  // Create Contact Items inline
  const contactItems = [];
  if (info.phone) {
    contactItems.push(
      <span key="phone" className="flex items-center gap-1">
        <svg className="w-3.5 h-3.5" style={{ color: accentColor }} fill="currentColor" viewBox="0 0 24 24">
          <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
        </svg>
        {info.phone}
      </span>
    );
  }
  if (info.email) {
    contactItems.push(
      <span key="email" className="flex items-center gap-1">
        <svg className="w-3.5 h-3.5" style={{ color: accentColor }} fill="currentColor" viewBox="0 0 24 24">
          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
        </svg>
        {info.email}
      </span>
    );
  }
  if (info.location) {
    contactItems.push(
      <span key="location" className="flex items-center gap-1">
        <svg className="w-3.5 h-3.5" style={{ color: accentColor }} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
        {info.location}
      </span>
    );
  }
if (info.linkedin) {
  contactItems.push(
    <span key="linkedin" className="flex items-center gap-1">
      {/* LinkedIn Brand SVG */}
      <svg 
        className="w-3.5 h-3.5" 
        style={{ color: accentColor }} 
        fill="currentColor" 
        viewBox="0 0 24 24"
      >
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
      </svg>
      <span className="break-all">
        {info.linkedin.replace(/(^\w+:|^)\/\//, '')}
      </span>
    </span>
  );
}
  if (info.github) {
    contactItems.push(
      <span key="github" className="flex items-center gap-1">
        <svg className="w-3.5 h-3.5" style={{ color: accentColor }} fill="currentColor" viewBox="0 0 24 24">
          <path d={webIconPath}/>
        </svg>
        {info.github.replace(/(^\w+:|^)\/\//, '')}
      </span>
    );
  }
if (info.website) {
  contactItems.push(
    <span key="website" className="flex items-center gap-1">
      {/* Globe / Website SVG */}
      <svg 
        className="w-3.5 h-3.5" 
        style={{ color: accentColor }} 
        fill="currentColor" 
        viewBox="0 0 24 24"
      >
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
      </svg>
      <span className="break-all">
        {info.website.replace(/(^\w+:|^)\/\//, '')}
      </span>
    </span>
  );
}
  if (info.secondarySocial) {
    contactItems.push(
      <span key="secondarySocial" className="flex items-center gap-1">
        <svg className="w-3.5 h-3.5" style={{ color: accentColor }} fill="currentColor" viewBox="0 0 24 24">
          <path d={webIconPath}/>
        </svg>
        {info.secondarySocial.replace(/(^\w+:|^)\/\//, '')}
      </span>
    );
  }

  const contactRow = contactItems.reduce((acc, curr, idx) => {
    if (idx === 0) return [curr];
    return [...acc, <span key={`sep-${idx}`} className="mx-2.5 text-gray-300">|</span>, curr];
  }, []);

  return (
    <div id="resume-raw-content" className="w-full min-h-full bg-white pt-12 pb-14 px-14 relative flex flex-col font-serif-classic">
      
      {/* Font Injection */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=PT+Serif:ital,wght@0,400;0,700;1,400;1,700&display=swap');
        .font-serif-classic { font-family: 'PT Serif', 'Times New Roman', serif; }
      `}} />

      {/* 1. HEADER */}
      <header className="shrink-0 flex flex-col items-center justify-center w-full mb-4">
        <h1 className="text-[34px] font-bold uppercase tracking-wider leading-tight" style={{ color: accentColor }}>
          {firstName} {lastName}
        </h1>
        {info.jobTitle && (
          <h2 className="text-[14px] font-bold tracking-widest uppercase text-gray-800 mt-0.5 mb-2">
            {info.jobTitle}
          </h2>
        )}
        
        {/* CONTACT DETAILS */}
        {hasContact && (
          <div className="flex flex-wrap items-center justify-center text-[11px] text-gray-700 mt-0.5 font-medium">
            {contactRow}
          </div>
        )}

        {/* PERSONAL DETAILS (Displayed inline under contact info) */}
        {hasPersonalDetails && (
          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-gray-700 mt-2 font-medium">
            {info.dob && (
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" style={{ color: accentColor }} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10z"/>
                </svg>
                <span className="font-bold text-gray-900">DOB:</span> {info.dob}
              </span>
            )}
            {info.nationality && (
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" style={{ color: accentColor }} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
                <span className="font-bold text-gray-900">Nationality:</span> {info.nationality}
              </span>
            )}
            {info.gender && (
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" style={{ color: accentColor }} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
                <span className="font-bold text-gray-900">Gender:</span> {info.gender}
              </span>
            )}
            {info.drivingLicense && (
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" style={{ color: accentColor }} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zm-9-9h7v2h-7zm0 4h7v2h-7zM5 8h5v6H5z"/>
                </svg>
                <span className="font-bold text-gray-900">License:</span> {info.drivingLicense}
              </span>
            )}
          </div>
        )}
      </header>

      {/* 2. SUMMARY (Requires ID for Paginator Cleanup so left intact) */}
      {validSummary && (
        <div id="summary-section" className="w-full mb-2 shrink-0">
          <div className="w-full mt-4 mb-2.5 border-b-[1.5px] pb-0.5 shrink-0 break-inside-avoid" style={{ borderColor: accentColor }}>
            <h3 className="text-[13px] font-bold uppercase tracking-wide leading-none" style={{ color: accentColor }}>
              Summary
            </h3>
          </div>
          <p className="text-[12px] text-gray-900 leading-[1.6] text-justify whitespace-pre-wrap">
            {validSummary}
          </p>
        </div>
      )}

      {/* 3. PAGINATOR TARGETS - INLINE MAPPING WITH WRAPPERS REMOVED */}
      <div className="w-full flex flex-col flex-1">
        <aside className="hidden"></aside>
        
        <main className="w-full flex flex-col">
          
          {/* SKILLS */}
          {validSkills && validSkills.length > 0 && (
            <div className="w-full mt-4 mb-2.5 border-b-[1.5px] pb-0.5 shrink-0 break-inside-avoid" style={{ borderColor: accentColor }}>
              <h3 className="text-[13px] font-bold uppercase tracking-wide leading-none" style={{ color: accentColor }}>
                Skills
              </h3>
            </div>
          )}
          {validSkills && validSkills.length > 0 && validSkills.every(s => typeof s === 'string') && (
             <div className="w-full mb-3 text-[12px] text-gray-900 leading-[1.5] break-inside-avoid shrink-0">
               {validSkills.join(', ')}
             </div>
          )}
          {validSkills && validSkills.length > 0 && !validSkills.every(s => typeof s === 'string') && validSkills.map((skill, idx) => (
            <div key={`skill-${idx}`} className={`w-full text-[12px] text-gray-900 leading-[1.5] break-inside-avoid shrink-0 ${idx === validSkills.length - 1 ? 'mb-3' : 'mb-1'}`}>
              {(skill.name || skill.category || skill.skill) && (
                <span className="font-bold">
                  {skill.name || skill.category || skill.skill}
                  {(skill.keywords && skill.keywords.length > 0) || skill.details ? ': ' : ''}
                </span>
              )}
              {skill.keywords && skill.keywords.length > 0 ? skill.keywords.join(', ') : skill.details}
            </div>
          ))}

          {/* EXPERIENCE */}
          {validExperience && validExperience.length > 0 && (
            <div className="w-full mt-4 mb-2.5 border-b-[1.5px] pb-0.5 shrink-0 break-inside-avoid" style={{ borderColor: accentColor }}>
              <h3 className="text-[13px] font-bold uppercase tracking-wide leading-none" style={{ color: accentColor }}>
                Experience
              </h3>
            </div>
          )}
          {validExperience && validExperience.map((exp, idx) => (
            <React.Fragment key={`exp-${idx}`}>
              <div className="flex justify-between items-baseline mb-0.5 w-full break-inside-avoid shrink-0">
                <h4 className="text-[12.5px] font-bold text-gray-900">{exp.role}</h4>
                <span className="text-[11.5px] font-medium shrink-0" style={{ color: accentColor }}>
                  {formatDates(exp.startDate, exp.endDate, exp.isCurrent)}
                </span>
              </div>
              <div className={`flex justify-between items-baseline w-full break-inside-avoid shrink-0 ${(exp.achievements?.length > 0 || exp.description) ? 'mb-1.5' : 'mb-3'}`}>
                <span className="text-[12.5px] text-gray-800 font-bold">{exp.company}</span>
                {exp.location && <span className="text-[11.5px] text-gray-600 font-normal shrink-0">{exp.location}</span>}
              </div>
              
              {/* Removed <ul> for Achievements, mapping purely <li> tags */}
              {exp.achievements && exp.achievements.length > 0 ? (
                exp.achievements.map((ach, i) => (
                  <li key={`ach-${i}`} className={`list-disc list-outside ml-5 pl-0.5 text-[11.5px] text-gray-800 leading-[1.55] w-full break-inside-avoid shrink-0 ${i === exp.achievements.length - 1 ? 'mb-3' : 'mb-1'}`}>
                    {ach}
                  </li>
                ))
              ) : exp.description ? (
                <div className="text-[11.5px] text-gray-800 leading-[1.6] whitespace-pre-wrap ml-1 w-full mb-3 break-inside-avoid shrink-0">
                  {exp.description}
                </div>
              ) : null}
            </React.Fragment>
          ))}

          {/* EDUCATION */}
          {validEducation && validEducation.length > 0 && (
            <div className="w-full mt-4 mb-2.5 border-b-[1.5px] pb-0.5 shrink-0 break-inside-avoid" style={{ borderColor: accentColor }}>
              <h3 className="text-[13px] font-bold uppercase tracking-wide leading-none" style={{ color: accentColor }}>
                Education
              </h3>
            </div>
          )}
          {validEducation && validEducation.map((edu, idx) => (
            <React.Fragment key={`edu-${idx}`}>
              <div className="flex justify-between items-baseline mb-0.5 w-full break-inside-avoid shrink-0">
                <h4 className="text-[12.5px] font-bold text-gray-900">
                  {edu.degree || edu.studyType}{edu.area && ` in ${edu.area}`}
                </h4>
                <span className="text-[11.5px] font-medium shrink-0" style={{ color: accentColor }}>
                  {formatDates(edu.startDate, edu.endDate, edu.isCurrent)}
                </span>
              </div>
              <div className={`flex justify-between items-baseline w-full break-inside-avoid shrink-0 ${!edu.description ? 'mb-3' : ''}`}>
                <span className="text-[12.5px] text-gray-800 font-bold">{edu.school || edu.institution}</span>
                {edu.location && <span className="text-[11.5px] text-gray-600 font-normal shrink-0">{edu.location}</span>}
              </div>
              {edu.description && (
                <div className="text-[11.5px] text-gray-800 mt-1 leading-[1.5] whitespace-pre-wrap w-full mb-3 break-inside-avoid shrink-0">
                  {edu.description}
                </div>
              )}
            </React.Fragment>
          ))}

          {/* PROJECTS */}
          {data?.projects && data.projects.length > 0 && (
            <div className="w-full mt-4 mb-2.5 border-b-[1.5px] pb-0.5 shrink-0 break-inside-avoid" style={{ borderColor: accentColor }}>
              <h3 className="text-[13px] font-bold uppercase tracking-wide leading-none" style={{ color: accentColor }}>
                Projects
              </h3>
            </div>
          )}
          {data?.projects && data.projects.map((proj, idx) => (
            <React.Fragment key={`proj-${idx}`}>
              <div className={`flex justify-between items-baseline w-full break-inside-avoid shrink-0 ${!proj.description ? 'mb-3' : 'mb-1'}`}>
                <h4 className="text-[12.5px] font-bold text-gray-900">{proj.title || proj.name}</h4>
                {proj.date && <span className="text-[11.5px] font-medium shrink-0" style={{ color: accentColor }}>{proj.date}</span>}
              </div>
              {proj.description && (
                <div className="text-[11.5px] text-gray-800 leading-[1.6] whitespace-pre-wrap ml-1 w-full mb-3 break-inside-avoid shrink-0">
                  {proj.description}
                </div>
              )}
            </React.Fragment>
          ))}

          {/* CERTIFICATIONS */}
          {validCertificates && validCertificates.length > 0 && (
            <div className="w-full mt-4 mb-2.5 border-b-[1.5px] pb-0.5 shrink-0 break-inside-avoid" style={{ borderColor: accentColor }}>
              <h3 className="text-[13px] font-bold uppercase tracking-wide leading-none" style={{ color: accentColor }}>
                Certifications
              </h3>
            </div>
          )}
          
          {/* Replaced <li> and bullet formatting with standard Fragments */}
          {validCertificates && validCertificates.map((cert, idx) => (
            <React.Fragment key={`cert-${idx}`}>
              <div className={`flex justify-between items-baseline w-full text-[11.5px] text-gray-800 leading-[1.55] break-inside-avoid shrink-0 ${!cert.description ? (idx === validCertificates.length - 1 ? 'mb-3' : 'mb-2') : ''}`}>
                <div>
                  <span className="font-bold text-gray-900">{cert.title || cert.name}</span>
                  {cert.issuer && <span className="font-bold text-gray-800"> – {cert.issuer}</span>}
                </div>
                {cert.date && <span className="shrink-0 ml-2 font-medium" style={{ color: accentColor }}>{cert.date}</span>}
              </div>
              {cert.description && (
                <div className={`mt-0.5 whitespace-pre-wrap text-[11.5px] text-gray-800 leading-[1.6] w-full break-inside-avoid shrink-0 ${idx === validCertificates.length - 1 ? 'mb-3' : 'mb-2'}`}>
                  {cert.description}
                </div>
              )}
            </React.Fragment>
          ))}

          {/* LANGUAGES */}
          {validLanguages && validLanguages.length > 0 && (
            <div className="w-full mt-4 mb-2.5 border-b-[1.5px] pb-0.5 shrink-0 break-inside-avoid" style={{ borderColor: accentColor }}>
              <h3 className="text-[13px] font-bold uppercase tracking-wide leading-none" style={{ color: accentColor }}>
                Languages
              </h3>
            </div>
          )}
          {validLanguages && validLanguages.length > 0 && (
            <div className="w-full mb-3 text-[11.5px] text-gray-900 leading-[1.5] break-inside-avoid shrink-0">
              {validLanguages.map(l => `${l.name || l.language}${l.proficiency || l.level ? ` (${l.proficiency || l.level})` : ''}`).join(', ')}
            </div>
          )}

          {/* HOBBIES */}
          {validHobbies && validHobbies.length > 0 && (
            <div className="w-full mt-4 mb-2.5 border-b-[1.5px] pb-0.5 shrink-0 break-inside-avoid" style={{ borderColor: accentColor }}>
              <h3 className="text-[13px] font-bold uppercase tracking-wide leading-none" style={{ color: accentColor }}>
                Hobbies
              </h3>
            </div>
          )}
          {validHobbies && validHobbies.length > 0 && (
            <div className="w-full mb-3 text-[11.5px] text-gray-900 leading-[1.5] break-inside-avoid shrink-0">
              {validHobbies.map(h => typeof h === 'string' ? h : h.name).join(', ')}
            </div>
          )}

          {/* REFERENCES */}
          {validReferences && validReferences.length > 0 && (
            <div className="w-full mt-4 mb-2.5 border-b-[1.5px] pb-0.5 shrink-0 break-inside-avoid" style={{ borderColor: accentColor }}>
              <h3 className="text-[13px] font-bold uppercase tracking-wide leading-none" style={{ color: accentColor }}>
                References
              </h3>
            </div>
          )}
          {validReferences && validReferences.length > 0 && validReferences.map((ref, idx) => (
             <div key={`ref-${idx}`} className="w-full mb-3 text-[11.5px] text-gray-900 leading-[1.5] break-inside-avoid shrink-0">
               <div className="font-bold">{ref.name}</div>
               {(ref.role || ref.company) && (
                 <div className="italic text-gray-800">{ref.role}{ref.role && ref.company ? `, ${ref.company}` : ref.company}</div>
               )}
               {ref.contact && <div className="text-gray-600">{ref.contact}</div>}
             </div>
          ))}

        </main>
      </div>

    </div>
  );
}