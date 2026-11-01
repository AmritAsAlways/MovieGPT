import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOpenAIClient } from "../utils/openai";
import lang from "../utils/languageConstants";
import { API_OPTIONS, OPENAI_MODEL } from "../utils/constants";
import { addGptMovieResult } from "../utils/gptSlice";
import { parseMovieNames } from "../utils/parseMovieNames";

// THE SEARCH BAR: this component holds the whole "AI search" workflow.
//
// EXECUTION FLOW when the user presses Search:
//   1. Read what they typed (useRef) and build a prompt around it
//   2. Ask OpenAI for 5 movie names            -> "Don, Sholay, Zanjeer, ..."
//   3. parseMovieNames() turns that text into an array of clean names
//   4. Search TMDB once per name, ALL AT THE SAME TIME (Promise.all)
//   5. dispatch(addGptMovieResult(...)) -> Redux -> GptMovieSuggestions re-renders
// Two different APIs are chained: OpenAI knows WHAT to recommend, TMDB knows
// the posters and ids, so we need both.
const GptSearchBar = () => {
  const dispatch = useDispatch();
  // Which language is selected (set by the dropdown in Header).
  const langKey = useSelector((store) => store.config.lang);
  const searchText = useRef(null);

  // Local UI state: only this component cares, so it does not go in Redux.
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Search ONE movie name on TMDB and return its list of matches.
  const searchMovieTMDB = async (movie) => {
    const response = await fetch(
      // encodeURIComponent makes a name safe inside a URL: "Dil Chahta Hai"
      // becomes "Dil%20Chahta%20Hai", and a title with "&" or "?" cannot
      // break the query string.
      "https://api.themoviedb.org/3/search/movie?query=" +
        encodeURIComponent(movie) +
        "&include_adult=false&language=en-US&page=1",
      API_OPTIONS
    );
    const json = await response.json();

    if (!response.ok) {
      throw new Error("TMDB search failed: " + (json.status_message || response.status));
    }
    return json.results;
  };

  const handleGptSearchClick = async (event) => {
    // Stop the browser's default "reload the page when a form is submitted".
    // Using the form's onSubmit (not the button's onClick) also makes the
    // Enter key work.
    event.preventDefault();

    const userQuery = searchText.current.value.trim();
    if (!userQuery) return;

    setIsLoading(true);
    setErrorMessage(null);

    // PROMPT DESIGN: we tell the model its role, the task, the exact output
    // format and give an example. Strict, simple formats are much easier to
    // parse reliably than free text.
    const gptQuery =
      "Act as a Movie Recommendation system and suggest some movies for the query : " +
      userQuery +
      ". only give me names of 5 movies, comma seperated like the example result given ahead. Example Result: Gadar, Sholay, Don, Golmaal, Koi Mil Gaya";

    // try / catch / finally: anything that throws below (no key, no internet,
    // quota exceeded, TMDB down...) jumps to catch, where we show the message
    // instead of leaving the page silently stuck. `finally` always runs, so
    // the button is never left disabled.
    try {
      const gptResults = await getOpenAIClient().chat.completions.create({
        messages: [{ role: "user", content: gptQuery }],
        model: OPENAI_MODEL,
      });

      const gptMovies = parseMovieNames(
        gptResults.choices?.[0]?.message?.content
      );
      if (gptMovies.length === 0) {
        throw new Error("GPT did not suggest any movies. Try rephrasing your search.");
      }

      // PARALLEL REQUESTS: .map() starts all the searches immediately and
      // gives an array of Promises. Promise.all waits until EVERY one has
      // finished and returns their results in the same order. Awaiting them
      // one by one would be about 5 times slower.
      const tmdbResults = await Promise.all(
        gptMovies.map((movie) => searchMovieTMDB(movie))
      );

      dispatch(
        addGptMovieResult({ movieNames: gptMovies, movieResults: tmdbResults })
      );
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-[35%] md:pt-[10%] flex justify-center">
      <form
        className="w-full md:w-1/2 bg-black grid grid-cols-12"
        onSubmit={handleGptSearchClick}
      >
        <input
          ref={searchText}
          type="text"
          className="p-4 m-4 col-span-9"
          placeholder={lang[langKey].gptSearchPlaceholder}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="col-span-3 m-4 py-2 px-4 bg-red-700 text-white rounded-lg disabled:opacity-60"
        >
          {isLoading ? lang[langKey].searching : lang[langKey].search}
        </button>
        {errorMessage && (
          <p className="col-span-12 px-4 pb-4 text-red-500 font-bold">
            {errorMessage}
          </p>
        )}
      </form>
    </div>
  );
};

export default GptSearchBar;
