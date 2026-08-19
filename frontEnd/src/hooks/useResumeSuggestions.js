import { useState, useEffect } from 'react';
// Ensure dataset is imported alongside fetchEscoSuggestions
import { fetchEscoSuggestions, dataset } from '../utils/escoService'; 

export default function useResumeSuggestions(data) {
  const [suggestions, setSuggestions] = useState({ skills: [], achievementsMap: {} });
  const [isSuggesting, setIsSuggesting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const extractTitle = (val) => {
      if (!val) return '';
      if (typeof val === 'string') return val;
      if (typeof val === 'object') return val.title || val.name || val.label || val.value || '';
      return '';
    };

    // 1. Get the Main Profile Title
    const rawJobTitle = data?.personalInfo?.jobTitle || data?.jobTitle || '';
    const jobTitle = extractTitle(rawJobTitle);
    
    // 2. Get ALL Experience Titles
    const currentRoles = (data?.experience || [])
      .map(exp => extractTitle(exp.role || exp.jobTitle))
      .filter(Boolean);

    // 3. Combine into unique array of titles
    const allTitles = [...new Set([...currentRoles, jobTitle].filter(t => t.trim().length > 0))];

    if (allTitles.length === 0) {
      setSuggestions({ skills: [], achievementsMap: {} });
      setIsSuggesting(false);
      return;
    }

    async function fetchAllSuggestions() {
      setIsSuggesting(true);
      
      try {
        // --- NEW MAPPING LOGIC ---
        // Normalize function to strip spaces/symbols and lowercase
        const normalize = (str) => (str ? str.toLowerCase().replace(/[^a-z0-9]/g, '') : '');
        const availableKeys = dataset ? Object.keys(dataset) : [];
        
        // Map formatted titles (e.g. "Software Engineer") back to exact dataset keys (e.g. "SoftwareEngineer")
        const exactKeysToFetch = allTitles.map(title => {
          const cleanTitle = normalize(title);
          const matchedKey = availableKeys.find(k => normalize(k) === cleanTitle);
          return matchedKey || title; // Use exact key if found, else fallback
        });

        // Remove duplicates and pass the correct unspaced keys to the fetcher
        const uniqueKeys = [...new Set(exactKeysToFetch)];
        const { skills, achievementsMap } = await fetchEscoSuggestions(uniqueKeys);
        // ---------------------------
        
        if (isMounted) {
          const capitalizeFirstLetter = (str) => {
            if (!str) return '';
            return str.charAt(0).toUpperCase() + str.slice(1);
          };

          const finalSkills = Array.isArray(skills) 
            ? skills.slice(0, 30).map(capitalizeFirstLetter) 
            : [];

          const finalAchievementsMap = {};
          if (achievementsMap) {
            Object.keys(achievementsMap).forEach(role => {
              finalAchievementsMap[role] = achievementsMap[role].map(capitalizeFirstLetter);
            });
          }

          setSuggestions({
            skills: finalSkills,
            achievementsMap: finalAchievementsMap
          });
        }
      } catch (error) {
        console.error("Dataset lookup error:", error);
        if (isMounted) {
          setSuggestions({ skills: [], achievementsMap: {} });
        }
      } finally {
        if (isMounted) setIsSuggesting(false);
      }
    }

    fetchAllSuggestions();

    return () => {
      isMounted = false;
    };
  }, [data]);

  return { suggestions, isSuggesting };
}