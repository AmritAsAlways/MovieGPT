// Turns GPT's text answer into a clean array of movie names.
//
// We ask GPT for "5 movie names, comma separated", so a typical answer is
//   "Andaz Apna Apna, Hera Pheri, Chupke Chupke"
// Models do not always obey perfectly, so this function is defensive:
//   - trims the spaces around each name (the original did not, which put a
//     leading space into the TMDB search and into the row titles)
//   - removes quotes some models add:  "Don", 'Sholay'
//   - drops empty pieces (e.g. from a trailing comma)
//   - keeps at most 5, so a chatty answer cannot trigger dozens of requests
// It is a pure function, which is why it is easy to unit test.
export const parseMovieNames = (text) => {
  if (typeof text !== "string") return [];

  return text
    .split(",")
    .map((name) => name.trim().replace(/^["'“‘]+|["'”’]+$/g, "").trim())
    .filter((name) => name.length > 0)
    .slice(0, 5);
};
