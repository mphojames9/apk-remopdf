import React from 'react';

export default function LegacyElite({
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
  const hasPersonalDetails = info.dob || info.nationality || info.gender || info.drivingLicense;

  // Create Contact Items
  const contactItems = [];
  if (info.phone) {
    contactItems.push(
      <span key="phone" className="flex items-center gap-1">
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
        </svg>
        {info.phone}
      </span>
    );
  }
  if (info.email) {
    contactItems.push(
      <span key="email" className="flex items-center gap-1">
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
        </svg>
        {info.email}
      </span>
    );
  }
  if (info.location) {
    contactItems.push(
      <span key="location" className="flex items-center gap-1">
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
        {info.location}
      </span>
    );
  }
  if (info.linkedin) {
    contactItems.push(
      <span key="linkedin" className="flex items-center gap-1">
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
        </svg>
        {info.linkedin.replace(/(^\w+:|^)\/\//, '')}
      </span>
    );
  }
if (info.github) {
    contactItems.push(
      <span key="github" className="flex items-center gap-1">
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
        {info.github.replace(/(^\w+:|^)\/\//, '')}
      </span>
    );
  }

  if (info.website) {
    contactItems.push(
      <span key="website" className="flex items-center gap-1">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.6 9h16.8M3.6 15h16.8" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.5 3a17 17 0 000 18M12.5 3a17 17 0 000 18" />
        </svg>
        {info.website.replace(/(^\w+:|^)\/\//, '')}
      </span>
    );
  }

  if (info.secondarySocial) {
    contactItems.push(
      <span key="secondarySocial" className="flex items-center gap-1">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
        </svg>
        {info.secondarySocial.replace(/(^\w+:|^)\/\//, '')}
      </span>
    );
  }

  const contactRow = contactItems.reduce((acc, curr, idx) => {
    if (idx === 0) return [curr];
    return [...acc, <span key={`sep-${idx}`} className="mx-2.5 text-black">|</span>, curr];
  }, []);

  // Section Heading Builder
  const renderSectionHeader = (title) => (
    <div className="w-full mt-4 mb-2.5 border-b-[1.5px] border-black pb-0.5 shrink-0 break-inside-avoid">
      <h3 className="text-[13px] font-bold uppercase tracking-wide text-black leading-none">
        {title}
      </h3>
    </div>
  );

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
        <h1 className="text-[34px] font-bold uppercase tracking-wider text-black leading-tight">
          {firstName} {lastName}
        </h1>
        {info.jobTitle && (
          <h2 className="text-[14px] font-normal tracking-widest uppercase text-gray-700 mt-0.5 mb-2">
            {info.jobTitle}
          </h2>
        )}
        
        {hasContact && (
          <div className="flex flex-wrap items-center justify-center text-[11px] text-gray-800 mt-0.5">
            {contactRow}
          </div>
        )}

        {/* PERSONAL DETAILS (Displayed in a single row) */}
        {hasPersonalDetails && (
          <div className="flex flex-wrap items-center justify-center gap-4 mt-1.5 text-[11px] text-gray-800">
            {info.dob && (
              <div className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10z"/>
                </svg>
                <span className="font-bold uppercase tracking-wider text-[10px] text-gray-700">DOB:</span>
                <span>{info.dob}</span>
              </div>
            )}
            {info.nationality && (
              <div className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
                <span className="font-bold uppercase tracking-wider text-[10px] text-gray-700">Nationality:</span>
                <span>{info.nationality}</span>
              </div>
            )}
            {info.gender && (
              <div className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
                <span className="font-bold uppercase tracking-wider text-[10px] text-gray-700">Gender:</span>
                <span>{info.gender}</span>
              </div>
            )}
            {info.drivingLicense && (
              <div className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zm-9-9h7v2h-7zm0 4h7v2h-7zM5 8h5v6H5z"/>
                </svg>
                <span className="font-bold uppercase tracking-wider text-[10px] text-gray-700">License:</span>
                <span>{info.drivingLicense}</span>
              </div>
            )}
          </div>
        )}
      </header>

      {/* 2. SUMMARY */}
      {validSummary && (
        <div id="summary-section" className="w-full mb-2 shrink-0">
          {renderSectionHeader("Summary")}
          <p className="text-[12px] text-black leading-[1.6] text-justify whitespace-pre-wrap">
            {validSummary}
          </p>
        </div>
      )}

      {/* 3. MAIN CONTENT */}
      <div className="w-full flex flex-col flex-1">
        <aside className="hidden"></aside>
        
        <main className="w-full flex flex-col">

          {/* 1. SKILLS SECTION */}
          {validSkills && validSkills.length > 0 && renderSectionHeader("Skills")}
          {validSkills && validSkills.length > 0 && validSkills.every(s => typeof s === 'string') && (
             <div className="w-full mb-3 text-[12px] text-black leading-[1.5] break-inside-avoid shrink-0">
               {validSkills.join(', ')}
             </div>
          )}
          {validSkills && validSkills.length > 0 && !validSkills.every(s => typeof s === 'string') && validSkills.map((skill, idx) => {
            const name = skill.name || skill.category || skill.skill || '';
            const keywords = skill.keywords ? skill.keywords.join(', ') : skill.details || '';
            return (
              <div key={`skill-${idx}`} className={`w-full text-[12px] text-black leading-[1.5] break-inside-avoid shrink-0 ${idx === validSkills.length - 1 ? 'mb-3' : ''}`}>
                {name && <span className="font-bold">{name}{keywords ? ': ' : ''}</span>}
                {keywords && <span>{keywords}</span>}
              </div>
            );
          })}

          {/* 2. EXPERIENCE SECTION */}
          {validExperience && validExperience.length > 0 && renderSectionHeader("Experience")}
          {validExperience && validExperience.map((exp, idx) => (
            <React.Fragment key={`exp-${idx}`}>
              <div className="flex justify-between items-baseline mb-0.5 w-full break-inside-avoid shrink-0">
                <h4 className="text-[12.5px] font-bold text-black">{exp.role}</h4>
                <span className="text-[11.5px] text-black font-normal shrink-0">
                  {formatDates(exp.startDate, exp.endDate, exp.isCurrent)}
                </span>
              </div>
              <div className={`flex justify-between items-baseline w-full break-inside-avoid shrink-0 ${(exp.achievements?.length > 0 || exp.description) ? 'mb-1.5' : 'mb-3'}`}>
                <span className="text-[12.5px] text-black font-normal">{exp.company}</span>
                {exp.location && <span className="text-[11.5px] text-black font-normal shrink-0">{exp.location}</span>}
              </div>
              
              {exp.achievements && exp.achievements.length > 0 ? (
                exp.achievements.map((ach, i) => (
                  <li key={`ach-${i}`} className={`list-disc list-outside ml-5 pl-0.5 text-[11.5px] text-black leading-[1.55] w-full break-inside-avoid shrink-0 ${i === exp.achievements.length - 1 ? 'mb-3' : 'mb-1'}`}>
                    {ach}
                  </li>
                ))
              ) : exp.description ? (
                <div className="text-[11.5px] text-black leading-[1.6] whitespace-pre-wrap ml-1 w-full mb-3 break-inside-avoid shrink-0">
                  {exp.description}
                </div>
              ) : null}
            </React.Fragment>
          ))}

          {/* 3. EDUCATION SECTION */}
          {validEducation && validEducation.length > 0 && renderSectionHeader("Education")}
          {validEducation && validEducation.map((edu, idx) => (
            <React.Fragment key={`edu-${idx}`}>
              <div className="flex justify-between items-baseline mb-0.5 w-full break-inside-avoid shrink-0">
                <h4 className="text-[12.5px] font-bold text-black">
                  {edu.degree || edu.studyType}{edu.area && ` in ${edu.area}`}
                </h4>
                <span className="text-[11.5px] text-black font-normal shrink-0">
                  {formatDates(edu.startDate, edu.endDate, edu.isCurrent)}
                </span>
              </div>
              <div className={`flex justify-between items-baseline w-full break-inside-avoid shrink-0 ${!edu.description ? 'mb-3' : ''}`}>
                <span className="text-[12.5px] text-black">{edu.school || edu.institution}</span>
                {edu.location && <span className="text-[11.5px] text-black font-normal shrink-0">{edu.location}</span>}
              </div>
              {edu.description && (
                <div className="text-[11.5px] text-black mt-1 leading-[1.5] whitespace-pre-wrap w-full mb-3 break-inside-avoid shrink-0">
                  {edu.description}
                </div>
              )}
            </React.Fragment>
          ))}

          {/* 4. PROJECTS SECTION */}
          {data?.projects && data.projects.length > 0 && renderSectionHeader("Projects")}
          {data?.projects && data.projects.map((proj, idx) => (
            <React.Fragment key={`proj-${idx}`}>
              <div className={`flex justify-between items-baseline w-full break-inside-avoid shrink-0 ${!proj.description ? 'mb-3' : 'mb-1'}`}>
                <h4 className="text-[12.5px] font-bold text-black">{proj.title || proj.name}</h4>
                {proj.date && <span className="text-[11.5px] text-black shrink-0">{proj.date}</span>}
              </div>
              {proj.description && (
                <div className="text-[11.5px] text-black leading-[1.6] whitespace-pre-wrap ml-1 w-full mb-3 break-inside-avoid shrink-0">
                  {proj.description}
                </div>
              )}
            </React.Fragment>
          ))}

          {/* 5. CERTIFICATIONS SECTION */}
          {validCertificates && validCertificates.length > 0 && renderSectionHeader("Certifications")}
          {validCertificates && validCertificates.map((cert, idx) => (
            <React.Fragment key={`cert-${idx}`}>
              <li className={`list-disc list-outside ml-5 pl-0.5 text-[11.5px] text-black leading-[1.55] w-full break-inside-avoid shrink-0 ${!cert.description ? (idx === validCertificates.length - 1 ? 'mb-3' : 'mb-2') : ''}`}>
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="font-bold">{cert.title || cert.name}</span>
                    {cert.issuer && <span> – {cert.issuer}</span>}
                  </div>
                  {cert.date && <span className="shrink-0 ml-2">{cert.date}</span>}
                </div>
              </li>
              {cert.description && (
                <div className={`mt-0.5 whitespace-pre-wrap text-[11.5px] text-black leading-[1.6] ml-5 w-full break-inside-avoid shrink-0 ${idx === validCertificates.length - 1 ? 'mb-3' : 'mb-2'}`}>
                  {cert.description}
                </div>
              )}
            </React.Fragment>
          ))}

          {/* 6. LANGUAGES SECTION */}
          {validLanguages && validLanguages.length > 0 && renderSectionHeader("Languages")}
          {validLanguages && validLanguages.length > 0 && (
            <div className="w-full mb-3 text-[11.5px] text-black leading-[1.5] break-inside-avoid shrink-0">
              {validLanguages.map(l => {
                const name = l.name || l.language;
                const prof = l.proficiency || l.level;
                return `${name}${prof ? ` (${prof})` : ''}`;
              }).join(', ')}
            </div>
          )}

          {/* 7. HOBBIES SECTION */}
          {validHobbies && validHobbies.length > 0 && renderSectionHeader("Hobbies")}
          {validHobbies && validHobbies.length > 0 && (
            <div className="w-full mb-3 text-[11.5px] text-black leading-[1.5] break-inside-avoid shrink-0">
              {validHobbies.map(h => typeof h === 'string' ? h : h.name).join(', ')}
            </div>
          )}

          {/* 8. REFERENCES SECTION */}
          {validReferences && validReferences.length > 0 && renderSectionHeader("References")}
          {validReferences && validReferences.length > 0 && (
            <div className="w-full grid grid-cols-2 gap-4 mb-3 break-inside-avoid shrink-0">
              {validReferences.map((ref, idx) => (
                <div key={`ref-${idx}`} className="text-[11.5px] text-black leading-[1.5]">
                  <div className="font-bold">{ref.name}</div>
                  {(ref.role || ref.company) && (
                    <div className="italic text-gray-800">{ref.role}{ref.role && ref.company ? `, ${ref.company}` : ref.company}</div>
                  )}
                  {ref.contact && <div className="text-gray-600">{ref.contact}</div>}
                </div>
              ))}
            </div>
          )}

        </main>
      </div>

    </div>
  );
}