// One place for values that many files need. If a URL or option changes,
// we edit it here once instead of hunting through components.

export const APP_NAME = "MOVIEGPT";

// ---- Environment variables ------------------------------------------------
// Secrets live in the .env file (never committed to git, see .gitignore).
// Create React App only exposes variables whose names start with
// REACT_APP_, and it copies their values INTO the JavaScript bundle at
// build time. Read that twice: anything under REACT_APP_ ends up visible to
// anyone who opens the browser DevTools. That is fine for a TMDB read token
// or Firebase web config, but it is NOT truly secret. See the security note
// in openai.js for what that means for the OpenAI key.
// You must restart `npm start` after editing .env.

// TMDB (used in Section 4). TMDB wants the token in an Authorization header.
export const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: "Bearer " + process.env.REACT_APP_TMDB_KEY,
  },
};

// Base URL for movie posters. We append a poster_path from the API to it.
export const IMG_CDN_URL = "https://image.tmdb.org/t/p/w500";

// Default avatar given to new users on sign up (Section 3).
export const USER_AVATAR = "https://api.dicebear.com/7.x/initials/svg?seed=MG";

// Languages offered on the GPT search page (Section 6).
// "identifier" is the key used in languageConstants.js.
export const SUPPORTED_LANGUAGES = [
  { identifier: "en", name: "English" },
  { identifier: "hindi", name: "Hindi" },
  { identifier: "spanish", name: "Spanish" },
];

// OpenAI (Section 6).
export const OPENAI_KEY = process.env.REACT_APP_OPENAI_KEY;

// Which OpenAI model answers the search. The original project used
// "gpt-3.5-turbo", but OpenAI shut that model down on 23 Oct 2026, so it no
// longer works. Model names change over time, which is why this can be
// overridden from .env without touching code: set REACT_APP_OPENAI_MODEL.
// If a search shows an error like "model not found", check OpenAI's models
// page for a current small, cheap model and put its name in .env.
export const OPENAI_MODEL =
  process.env.REACT_APP_OPENAI_MODEL || "gpt-6-luna";
