// Configuration - FOCUSED ON CORE 7 CRITERIA ONLY
const SCORING_WEIGHTS = {
  employer: {
    availabilityMatch: 25, // Compare job dates vs candidate dates
    relevantExperience: 10, // No. of previous seasons in similar role
    certifications: 10, // DBS, Safeguarding, First Aid etc.
    psychometricSkills: 30, // From quiz: Enthusiasm, Communication, etc.
    profileCompletion: 10, // Based on % fields completed
    trainingModules: 10, // Completed e.g. Safeguarding badge
    suitabilityTags: 5, // e.g. "Works with Teens" or "Over 18"
  },
  candidate: {
    availabilityMatch: 25, // Compare job dates vs candidate dates
    relevantExperience: 10, // No. of previous seasons in similar role
    certifications: 10, // DBS, Safeguarding, First Aid etc.
    psychometricSkills: 30, // From quiz: Enthusiasm, Communication, etc.
    profileCompletion: 10, // Based on % fields completed
    trainingModules: 10, // Completed e.g. Safeguarding badge
    suitabilityTags: 5, // e.g. "Works with Teens" or "Over 18"
  },
};

const MAX_VALUES = {
  experience: 3,
  trainingModules: 5,
  psychometricScore: 100,
};

// CORE FIELDS ONLY - Remove all extra fields
const CORE_PROFILE_FIELDS = [
  "name",
  "email",
  "phone",
  "availability",
  "experience",
  "certifications",
  "psychometricScore",
  "trainingModules",
  "suitabilityTags",
];

console.log("✅ Config.js loaded successfully");
