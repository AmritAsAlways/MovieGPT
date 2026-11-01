// A tiny home-made "internationalisation" (i18n) system: an object that maps
// a language key to the texts shown in that language.
//
// Usage: lang[langKey].search   (langKey comes from Redux: store.config.lang)
// To add a language: add an entry here AND in SUPPORTED_LANGUAGES (constants.js).
// Real apps usually use a library such as react-i18next once there are many
// strings; for three strings an object is simpler and enough.
const lang = {
  en: {
    search: "Search",
    searching: "Searching...",
    gptSearchPlaceholder: "What would you like to watch today?",
  },
  hindi: {
    search: "खोज",
    searching: "खोज रहे हैं...",
    gptSearchPlaceholder: "आज आप क्या देखना चाहेंगे?",
  },
  spanish: {
    search: "Buscar",
    searching: "Buscando...",
    gptSearchPlaceholder: "¿Qué te gustaría ver hoy?",
  },
};

export default lang;
