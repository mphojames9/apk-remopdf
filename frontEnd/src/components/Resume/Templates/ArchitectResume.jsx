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
  validReferences,
  firstName,
  lastName
}) {
  // Helper to visually represent language proficiency bar width
  const getProficiencyWidth = (proficiency) => {
    const p = (proficiency || '').toLowerCase();
    if (p.includes('native') || p.includes('fluent') || p.includes('bilingual')) return '100%';
    if (p.includes('advanced') || p.includes('proficient')) return '80%';
    if (p.includes('intermediate')) return '60%';
    if (p.includes('basic') || p.includes('beginner')) return '35%';
    return '55%';
  };

  const flatLayoutElements = [];

  // Premium Font Injection
  flatLayoutElements.push(
    <style key="premium-fonts" dangerouslySetInnerHTML={{
      __html: `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&display=swap');
      .font-playfair { font-family: 'Playfair Display', serif; }
      .font-inter { font-family: 'Inter', sans-serif; }
    `}} />
  );

  // 1. HEADER ELEMENT
  flatLayoutElements.push(
    <div key="resume-header" className="shrink-0 flex justify-between items-start w-full mb-8 font-inter">
      <div className="flex flex-col">
        <h1 className="text-[52px] font-playfair font-bold uppercase tracking-wide leading-[1.05] text-[#0B1325]">
          {firstName} <br /> <span className="text-[#164179]">{lastName}</span>
        </h1>
        {info.jobTitle && (
          <div className="mt-4 flex items-center gap-4 min-w-[200px]">
            <div className="h-[1px] w-8 bg-[#164179]"></div>
            <h2 className="text-[11.5px] font-bold tracking-[0.3em] uppercase text-[#2c3545]">
              {info.jobTitle}
            </h2>
          </div>
        )}
      </div>

      {hasContact && (
        <div className="flex flex-col gap-2.5 text-[10.5px] font-medium text-[#2c3545] pt-2">
          {info.phone && (
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded border border-[#164179]/50 flex items-center justify-center shrink-0 text-[#164179]">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <span className="tracking-wide text-[#2c3545]">{info.phone}</span>
            </div>
          )}
          {info.email && (
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded border border-[#164179]/50 flex items-center justify-center shrink-0 text-[#164179]">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="truncate max-w-[240px] tracking-wide text-[#2c3545]">{info.email}</span>
            </div>
          )}
          {info.website && (
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded border border-[#164179]/50 flex items-center justify-center shrink-0 text-[#164179]">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-3.6-9m3.6 9a9 9 0 003.6-9m-3.6-9a9 9 0 00-3.6 9m3.6-9a9 9 0 013.6 9" />
                </svg>
              </div>
              <span className="truncate max-w-[240px] tracking-wide text-[#2c3545]">{info.website}</span>
            </div>
          )}
          {info.location && (
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded border border-[#164179]/50 flex items-center justify-center shrink-0 text-[#164179]">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span className="tracking-wide text-[#2c3545]">{info.location}</span>
            </div>
          )}
{info.linkedin && (
  <div className="flex items-center gap-3">
    <div className="w-5 h-5 rounded border border-[#164179]/50 flex items-center justify-center shrink-0 text-[#164179]">
      {/* LinkedIn Icon */}
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
      </svg>
    </div>
    <span className="tracking-wide text-[#2c3545]">{info.linkedin}</span>
  </div>
)}

{info.secondarySocial && (
  <div className="flex items-center gap-3">
    <div className="w-5 h-5 rounded border border-[#164179]/50 flex items-center justify-center shrink-0 text-[#164179]">
      {/* Universal Link Icon */}
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
      </svg>
    </div>
    <span className="tracking-wide text-[#2c3545]">{info.secondarySocial}</span>
  </div>
)}

{info.github && (
  <div className="flex items-center gap-3">
    <div className="w-5 h-5 rounded border border-[#164179]/50 flex items-center justify-center shrink-0 text-[#164179]">
      {/* Universal Link Icon */}
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
      </svg>
    </div>
    <span className="tracking-wide text-[#2c3545]">{info.github}</span>
  </div>
)}
        </div>
      )}
    </div>
  );

  // Premium subtle divider
  const pushSectionDivider = () => {
    flatLayoutElements.push(
      <div key={`divider-${flatLayoutElements.length}`} className="shrink-0 w-full flex items-center my-6">
        <div className="w-[28%] h-[1px] bg-[#164179]/40 shrink-0"></div>
        <div className="flex-1 h-[1px] bg-slate-200"></div>
      </div>
    );
  };

  // Shared UI component for architectural bullet points
  const ArchitecturalBullet = () => (
    <div className="w-1.5 h-1.5 border border-[#164179] rotate-45 mt-1.5 shrink-0 bg-white"></div>
  );

  // 1.5. DEMOGRAPHICS SECTION
  if (info.dob || info.nationality || info.gender || info.drivingLicense) {
    pushSectionDivider();
    flatLayoutElements.push(
      <div key="personal-details-row" className="shrink-0 flex w-full font-inter">
        <div className="w-[28%] shrink-0 pr-4">
          <h2 className="text-[12.5px] font-bold tracking-[0.25em] uppercase text-[#0B1325]">Details</h2>
        </div>
        <div className="w-[72%] grid grid-cols-1 gap-y-3 gap-x-6">
          {info.dob && (
            <div className="flex flex-col">
              <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-[#164179]">Date of Birth</span>
              <span className="text-[11px] text-[#2c3545] mt-0.5">{info.dob}</span>
            </div>
          )}
          {info.nationality && (
            <div className="flex flex-col">
              <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-[#164179]">Nationality</span>
              <span className="text-[11px] text-[#2c3545] mt-0.5">{info.nationality}</span>
            </div>
          )}
          {info.gender && (
            <div className="flex flex-col">
              <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-[#164179]">Gender</span>
              <span className="text-[11px] text-[#2c3545] mt-0.5">{info.gender}</span>
            </div>
          )}
          {info.drivingLicense && (
            <div className="flex flex-col">
              <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-[#164179]">Driver's License</span>
              <span className="text-[11px] text-[#2c3545] mt-0.5">{info.drivingLicense}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 2. PROFILE SECTION
  if (validSummary) {
    pushSectionDivider();
    flatLayoutElements.push(
      <div key="profile-row" className="shrink-0 flex w-full font-inter">
        <div className="w-[28%] shrink-0 pr-4">
          <h2 className="text-[12.5px] font-bold tracking-[0.25em] uppercase text-[#0B1325]">Profile</h2>
        </div>
        <div className="w-[72%]">
          <p className="text-[11px] leading-[1.85] text-[#2c3545] text-justify whitespace-pre-wrap">
            {validSummary}
          </p>
        </div>
      </div>
    );
  }

  // 3. EXPERIENCE SECTION
  if (validExperience.length > 0) {
    pushSectionDivider();
    validExperience.forEach((exp, index) => {
      flatLayoutElements.push(
        <div key={`exp-header-${index}`} className="shrink-0 flex w-full mb-2 mt-1 font-inter">
          <div className="w-[28%] shrink-0 pr-4">
            {index === 0 && <h2 className="text-[12.5px] font-bold tracking-[0.25em] uppercase text-[#0B1325]">Experience</h2>}
          </div>
          <div className="w-[72%] flex gap-4 items-start">
            <ArchitecturalBullet />
            <div className="flex flex-col flex-1">
              <div className="flex justify-between items-baseline border-b border-slate-100 pb-1 mb-1.5">
                <h3 className="text-[12px] font-bold uppercase text-[#0B1325] tracking-wide leading-tight">{exp.role}</h3>
                <span className="text-[10px] text-slate-500 font-semibold ml-2 text-right shrink-0 uppercase tracking-widest">
                  {formatDates(exp.startDate, exp.endDate, exp.isCurrent)}
                </span>
              </div>
              <div className="flex justify-between items-baseline mb-1">
                <p className="text-[12px] font-playfair italic text-[#164179]">{exp.company}</p>
                {exp.location && <p className="text-[10px] text-slate-400">{exp.location}</p>}
              </div>
              {exp.description && (
                <p className="text-[11px] text-[#2c3545] mt-1.5 text-justify leading-[1.8] whitespace-pre-wrap">
                  {exp.description}
                </p>
              )}
            </div>
          </div>
        </div>
      );

      if (exp.achievements) {
        exp.achievements.forEach((ach, achIdx) => {
          if (ach.trim()) {
            flatLayoutElements.push(
              <div key={`exp-ach-${index}-${achIdx}`} className="shrink-0 flex w-full mb-1.5 font-inter">
                <div className="w-[28%] shrink-0"></div>
                <div className="w-[72%] pl-[22px] text-[11px] text-[#2c3545] leading-[1.7] text-justify flex items-start gap-2.5">
                  <span className="text-[#164179] text-[14px] leading-none shrink-0">•</span>
                  <span className="flex-1 pt-[1px]">{ach}</span>
                </div>
              </div>
            );
          }
        });
      }
    });
  }

    // 4. PROJECTS SECTION
  if (data.projects && data.projects.length > 0) {
    pushSectionDivider();
    data.projects.forEach((proj, idx) => {
      flatLayoutElements.push(
        <div key={`proj-row-${idx}`} className="shrink-0 flex w-full mb-4 font-inter">
          <div className="w-[28%] shrink-0 pr-4">
            {idx === 0 && <h2 className="text-[12.5px] font-bold tracking-[0.25em] uppercase text-[#0B1325]">Projects</h2>}
          </div>
          <div className="w-[72%] flex gap-4 items-start">
            <ArchitecturalBullet />
            <div className="flex flex-col flex-1">
              <div className="flex justify-between items-baseline border-b border-slate-100 pb-1 mb-1.5">
                <h3 className="text-[12px] font-bold text-[#0B1325] uppercase tracking-wide leading-tight">{proj.title}</h3>
                {proj.date && <span className="text-[10px] text-slate-500 font-semibold ml-2 shrink-0 uppercase tracking-widest">{proj.date}</span>}
              </div>
              {proj.description && (
                <p className="text-[11px] text-[#2c3545] mt-1 text-justify leading-[1.8] whitespace-pre-wrap">
                  {proj.description}
                </p>
              )}
            </div>
          </div>
        </div>
      );
    });
  }

    // 5. EDUCATION SECTION
  if (validEducation.length > 0) {
    pushSectionDivider();
    validEducation.forEach((edu, idx) => {
      flatLayoutElements.push(
        <div key={`edu-row-${idx}`} className="shrink-0 flex w-full mb-4 font-inter">
          <div className="w-[28%] shrink-0 pr-4">
            {idx === 0 && <h2 className="text-[12.5px] font-bold tracking-[0.25em] uppercase text-[#0B1325]">Education</h2>}
          </div>
          <div className="w-[72%] flex gap-4 items-start">
            <ArchitecturalBullet />
            <div className="flex flex-col flex-1">
              <div className="flex justify-between items-baseline border-b border-slate-100 pb-1 mb-1.5">
                <h3 className="text-[12px] font-bold uppercase text-[#0B1325] tracking-wide leading-tight">{edu.school}</h3>
                <span className="text-[10px] text-slate-500 font-semibold ml-2 text-right shrink-0 uppercase tracking-widest">
                  {formatDates(edu.startDate, edu.endDate, edu.isCurrent)}
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <p className="text-[12px] font-playfair italic text-[#164179]">{edu.degree}</p>
                {edu.location && <p className="text-[10px] text-slate-400">{edu.location}</p>}
              </div>
              {edu.description && (
                <p className="text-[11px] text-[#2c3545] mt-2 whitespace-pre-wrap leading-[1.8]">
                  {edu.description}
                </p>
              )}
            </div>
          </div>
        </div>
      );
    });
  }


    // 7. THREE-COLUMN BOTTOM GRID (Skills, Hobbies, Language)
  const maxBottomItems = Math.max(validSkills.length, validHobbies.length, validLanguages.length);

  if (validSkills.length > 0 || validHobbies.length > 0 || validLanguages.length > 0) {
    pushSectionDivider();

    flatLayoutElements.push(
      <div key="columns-head-row" className="shrink-0 grid grid-cols-3 gap-8 w-full mb-5 mt-1 font-inter">
        <div>{validSkills.length > 0 && <h2 className="text-[12.5px] font-bold tracking-[0.25em] uppercase text-[#0B1325]">Skills</h2>}</div>
        <div>{validHobbies.length > 0 && <h2 className="text-[12.5px] font-bold tracking-[0.25em] uppercase text-[#0B1325]">Hobbies</h2>}</div>
        <div>{validLanguages.length > 0 && <h2 className="text-[12.5px] font-bold tracking-[0.25em] uppercase text-[#0B1325]">Languages</h2>}</div>
      </div>
    );

    for (let i = 0; i < maxBottomItems; i++) {
      const skill = validSkills[i];
      const hobby = validHobbies[i];
      const lang = validLanguages[i];

      const skillName = skill ? (typeof skill === 'string' ? skill : (skill.name || skill.skill)) : null;

      flatLayoutElements.push(
        <div key={`col-data-row-${i}`} className="shrink-0 grid grid-cols-3 gap-8 w-full mb-3 font-inter">
          <div>
            {skillName && (
              <div className="flex items-center gap-3">
                <div className="w-1 h-1 rounded-sm bg-[#164179] shrink-0 rotate-45"></div>
                <span className="text-[11px] text-[#2c3545] tracking-wide font-medium">{skillName}</span>
              </div>
            )}
          </div>
          <div>
            {hobby && (
              <div className="flex items-center gap-3">
                <div className="w-1 h-1 rounded-sm bg-[#164179] shrink-0 rotate-45"></div>
                <span className="text-[11px] text-[#2c3545] tracking-wide font-medium">{hobby}</span>
              </div>
            )}
          </div>
          <div>
            {lang && (
              <div className="flex items-center gap-3">
                <div className="w-1 h-1 rounded-sm bg-[#164179] shrink-0 rotate-45"></div>
                <span className="text-[11px] text-[#2c3545] tracking-wide font-medium w-[60px] truncate shrink-0">{lang.name}</span>
                {lang.proficiency && (
                  <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden min-w-[45px]">
                    <div
                      className="h-full bg-[#164179] rounded-full"
                      style={{ width: getProficiencyWidth(lang.proficiency) }}
                    ></div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }
  }




  // 6. CERTIFICATIONS SECTION
  if (validCertificates && validCertificates.length > 0) {
    pushSectionDivider();
    validCertificates.forEach((cert, idx) => {
      flatLayoutElements.push(
        <div key={`cert-row-${idx}`} className="shrink-0 flex w-full mb-4 font-inter">
          <div className="w-[28%] shrink-0 pr-4">
            {idx === 0 && <h2 className="text-[12.5px] font-bold tracking-[0.25em] uppercase text-[#0B1325]">Certifications</h2>}
          </div>
          <div className="w-[72%] flex gap-4 items-start">
            <ArchitecturalBullet />
            <div className="flex flex-col flex-1">
              <div className="flex justify-between items-baseline border-b border-slate-100 pb-1 mb-1.5">
                <h3 className="text-[12px] font-bold text-[#0B1325] uppercase tracking-wide leading-tight">{cert.title}</h3>
                {cert.date && <span className="text-[10px] text-slate-500 font-semibold ml-2 shrink-0 uppercase tracking-widest">{cert.date}</span>}
              </div>
              {cert.issuer && <p className="text-[12px] font-playfair italic text-[#164179]">{cert.issuer}</p>}
              {cert.description && (
                <p className="text-[11px] text-[#2c3545] mt-2 whitespace-pre-wrap leading-[1.8]">
                  {cert.description}
                </p>
              )}
            </div>
          </div>
        </div>
      );
    });
  }


  // 8. REFERENCES SECTION
  if (validReferences && validReferences.length > 0) {
    pushSectionDivider();
    validReferences.forEach((ref, idx) => {
      flatLayoutElements.push(
        <div key={`ref-row-${idx}`} className="shrink-0 flex w-full mb-4 font-inter">
          <div className="w-[28%] shrink-0 pr-4">
            {idx === 0 && <h2 className="text-[12.5px] font-bold tracking-[0.25em] uppercase text-[#0B1325]">References</h2>}
          </div>
          <div className="w-[72%] flex gap-4 items-start">
            <ArchitecturalBullet />
            <div className="flex flex-col flex-1">
              <h3 className="text-[12px] font-bold text-[#0B1325] uppercase tracking-wide leading-tight">{ref.name}</h3>
              {(ref.role || ref.company) && (
                <p className="text-[12px] font-playfair italic text-[#164179] mt-0.5">
                  {ref.role}{ref.role && ref.company ? `, ${ref.company}` : ref.company}
                </p>
              )}
              {ref.contact && <p className="text-[10.5px] text-slate-500 mt-1 font-medium tracking-wide">{ref.contact}</p>}
            </div>
          </div>
        </div>
      );
    });
  }

  return (
    <div id="resume-raw-content" className="w-full h-full bg-white pt-12 pb-14 px-14 relative flex font-inter">
      <aside className="hidden"></aside>
      <main className="w-full flex flex-col">
        {flatLayoutElements}
      </main>
    </div>
  );
}