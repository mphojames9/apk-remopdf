// escoService.js
import cvDatasetCollection from "./cvDataset";

// Initialize the master dataset once
export const dataset = cvDatasetCollection(); 

/**
 * Looks up skills and achievements from the local dataset based on an array of job titles.
 */
export const fetchEscoSuggestions = async (titles) => {
  if (!titles || titles.length === 0) return { skills: [], achievementsMap: {} };

  const uniqueTitles = [...new Set(titles.filter(t => typeof t === 'string' && t.trim().length > 0))];
  const suggestedSkills = new Set();
  const achievementsMap = {};

  for (const title of uniqueTitles) {
    const trimmedTitle = title.trim();

    // Case-insensitive lookup against the FULL dataset keys
    const matchingKey = Object.keys(dataset).find(
      key => key.toLowerCase() === trimmedTitle.toLowerCase()
    );

    if (matchingKey) {
      const roleData = dataset[matchingKey];

      // Aggregate skills
      if (Array.isArray(roleData.skills)) {
        roleData.skills.forEach(skill => suggestedSkills.add(skill));
      }

      // Aggregate achievements map by title
      if (Array.isArray(roleData.achievements) && roleData.achievements.length > 0) {
        achievementsMap[title] = roleData.achievements;
      }
    }
  }

  return { 
    skills: Array.from(suggestedSkills), 
    achievementsMap 
  };
};