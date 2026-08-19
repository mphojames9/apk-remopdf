import React from 'react';
import ModernExecutive from './Templates/ModernExecutive';
import ProfessionalDark from './Templates/ProfessionalDark';
import ArchitectResume from './Templates/ArchitectResume';
import PremiumMinimal from './Templates/PremiumMinimal';
import Visionary2030 from './Templates/Visionary2030';
import BordeauxElite from './Templates/BordeauxElite';
import PrestigeIvory from './Templates/PrestigeIvory';
import ApexExecutive from './Templates/ApexExecutive';
import PinnaclePremium from './Templates/PinnaclePremium';
import CorporateLegacy from './Templates/CorporateLegacy';
import LegacyElite from './Templates/LegacyElite';
import NovaStandard from './Templates/NovaStandard';
import QuantumObsidian from './Templates/QuantumObsidian';
import AetherMinimal from './Templates/AetherMinimal';
import HeliosZenith from './Templates/HeliosZenith';
import CyberMatrix from './Templates/CyberMatrix';
import VelvetStandard from './Templates/VelvetStandard';
import AuroraMinimal from './Templates/AuroraMinimal';
import GraphitePro from './Templates/GraphitePro';
import MonolithBrutalist from './Templates/MonolithBrutalist';


export default function ResumePreview({ data, template }) {
  const info = data.personalInfo || {};
  const experience = data.experience || [];
  const education = data.education || [];
  const skills = data.skills || [];
  const certificates = data.certificates || [];
  const languages = data.languages || [];
  const hobbies = data.hobbies || [];       
  const references = data.references || [];   

  const formatDates = (startDate, endDate, isCurrent) => {
    if (!startDate && !endDate && !isCurrent) return '';
    const start = startDate || '...';
    const end = isCurrent ? 'Present' : (endDate || '...');
    return `${start} - ${end}`;
  };

  const hasContact = info.phone || info.email || info.location || info.website || info.linkedin;
  const validEducation = education.filter(edu => edu.degree?.trim() || edu.school?.trim());
  const validExperience = experience.filter(exp => exp.role?.trim() || exp.company?.trim());
  const validSummary = info.summary?.trim();
  const validCertificates = certificates.filter(cert => cert.title?.trim() || cert.issuer?.trim());
  const validLanguages = languages.filter(lang => lang.name?.trim());
  const validHobbies = hobbies.filter(hobby => hobby?.trim()); 
  const validReferences = references.filter(ref => ref.name?.trim()); 
  
  const validSkills = skills.filter(skill => 
    typeof skill === 'string' ? skill.trim() : (skill.name?.trim() || skill.skill?.trim())
  );

  const nameStr = info.fullName?.trim() || '';
  const nameParts = nameStr.split(' ');
  const firstName = nameParts[0];
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
  const hasHeader = nameStr || info.jobTitle;

  // Bundle calculated layout properties together
  const layoutProps = {
    info,
    data,
    formatDates,
    hasContact,
    hasHeader,
    validEducation,
    validExperience,
    validSummary,
    validCertificates,
    validLanguages,
    validHobbies,
    validReferences,
    validSkills,
    firstName,
    lastName
  };

  if (template === 'Modern Executive') {
    return <ModernExecutive {...layoutProps} />;
  }
  
  if (template === 'Professional Dark') {
    return <ProfessionalDark {...layoutProps} />;
  }

  if (template === 'Architect Resume') {
    return <ArchitectResume {...layoutProps} />;
  }

  if (template === 'Premium Minimal') {
    return <PremiumMinimal {...layoutProps} />;
  }

  if (template === 'Visionary 2030') {
    return <Visionary2030 {...layoutProps} />;
  }

  if (template === 'Bordeaux Elite') {
    return <BordeauxElite {...layoutProps} />;
  }

  if (template === 'Prestige Ivory') {
    return <PrestigeIvory {...layoutProps} />;
  }

  if (template === 'Apex Executive') {
    return <ApexExecutive {...layoutProps} />;
  }

  if (template === 'Pinnacle Premium') {
    return <PinnaclePremium {...layoutProps} />;
  }

  if (template === 'Corporate Legacy') {
  return <CorporateLegacy {...layoutProps} />;
  }

  if (template === 'Legacy Elite') {
  return <LegacyElite {...layoutProps} />;
  }

  if (template === 'Nova Standard') {
  return <NovaStandard {...layoutProps} />;
}

if (template === 'Quantum Obsidian') {
    return <QuantumObsidian {...layoutProps} />;
  }

if (template === 'Aether Minimal') {
    return <AetherMinimal {...layoutProps} />;
  }
  
  if (template === 'Helios Zenith') {
    return <HeliosZenith {...layoutProps} />;
  }

  if (template === 'Cyber Matrix') return <CyberMatrix {...layoutProps} />;
  if (template === 'Velvet Standard') return <VelvetStandard {...layoutProps} />;
  if (template === 'Aurora Minimal') return <AuroraMinimal {...layoutProps} />;
  if (template === 'Graphite Pro') return <GraphitePro {...layoutProps} />;
  if (template === 'Monolith Brutalist') return <MonolithBrutalist {...layoutProps} />;

  // Fallback Template
  return (
    <div id="resume-raw-content" className="w-full h-full flex text-slate-800 font-sans bg-white relative">
      <aside className="hidden"></aside>
      <main className="w-full p-[8%] flex flex-col space-y-6">
         <div className="pb-6 border-b-2 border-slate-900 shrink-0">
            {info.fullName && <h1 className="text-4xl font-extrabold uppercase">{info.fullName}</h1>}
         </div>
         {validExperience.map((exp, index) => (
            <div key={index} className="shrink-0 group">
              <h3 className="font-bold text-sm text-slate-800">{exp.role}</h3>
              <p className="text-xs text-orange-600 font-medium mb-1">{exp.company}</p>
            </div>
         ))}
      </main>
    </div>
  );
}