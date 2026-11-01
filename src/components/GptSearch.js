import GptMovieSuggestions from "./GptMovieSuggestions";
import GptSearchBar from "./GptSearchBar";

// The GPT Search page layout: a search bar on top, results underneath.
// Browse.js shows this INSTEAD of the normal banner and rows when the
// Header's "GPT Search" button has been pressed.
//
// The background is a fixed, full-screen gradient layer: `fixed` keeps it in
// place while the results scroll, and `-z-10` sends it BEHIND the content.
// (The original project uses a Netflix photo here; swap in an <img> if you
// want one.)
const GptSearch = () => {
  return (
    <>
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-gray-900 via-black to-red-950" />
      <div>
        <GptSearchBar />
        <GptMovieSuggestions />
      </div>
    </>
  );
};

export default GptSearch;
