import { useSelector } from "react-redux";
import MovieList from "./MovieList";

// Shows the results of a GPT search: one MovieList row per suggested movie
// name, containing the TMDB matches for that name.
//
// This is component REUSE paying off: MovieList (built in Section 5 for the
// home page) needs only a `title` and a `movies` array, so here it simply
// receives "Don" and the TMDB results for "Don".
//
// movieNames[i] and movieResults[i] belong together (same index), which is
// why they are saved together in one Redux action.
const GptMovieSuggestions = () => {
  const { movieResults, movieNames } = useSelector((store) => store.gpt);

  // No search has been made yet: show nothing.
  if (!movieNames) return null;

  return (
    <div className="p-4 m-4 bg-black text-white bg-opacity-90">
      <div>
        {movieNames.map((movieName, index) => (
          <MovieList
            // The same name could appear twice in a GPT answer, and keys must
            // be unique among siblings, so we add the index.
            key={movieName + "-" + index}
            title={movieName}
            movies={movieResults[index]}
          />
        ))}
      </div>
    </div>
  );
};

export default GptMovieSuggestions;
