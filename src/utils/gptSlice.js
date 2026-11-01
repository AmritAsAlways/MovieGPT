import { createSlice } from "@reduxjs/toolkit";

// GPT SLICE: state for the AI search feature.
//   showGptSearch -> true while the GPT Search page is open (false = normal browse view)
//   movieNames    -> the movie titles GPT suggested, e.g. ["Don", "Sholay"]
//   movieResults  -> for each name, the TMDB search results (an array of arrays),
//                    in the SAME ORDER as movieNames
//
// Why keep this in Redux and not in the search bar's own useState?
// Because two different components need it: GptSearchBar WRITES the results
// and GptMovieSuggestions READS them. They are siblings, so a shared store is
// the simplest way to connect them.
const gptSlice = createSlice({
  name: "gpt",
  initialState: {
    showGptSearch: false,
    movieNames: null,
    movieResults: null,
  },
  reducers: {
    // Flips true <-> false. Header's button dispatches this.
    toggleGptSearchView: (state) => {
      state.showGptSearch = !state.showGptSearch;
    },
    // The payload is an object, so we unpack both fields in one action.
    // Saving both together means they can never get out of sync.
    addGptMovieResult: (state, action) => {
      const { movieNames, movieResults } = action.payload;
      state.movieNames = movieNames;
      state.movieResults = movieResults;
    },
  },
});

export const { toggleGptSearchView, addGptMovieResult } = gptSlice.actions;

export default gptSlice.reducer;
