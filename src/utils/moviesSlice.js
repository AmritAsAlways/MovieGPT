import { createSlice } from "@reduxjs/toolkit";

// MOVIES SLICE: holds everything we download from TMDB.
//   nowPlayingMovies -> array of movie objects (or null until loaded)
//   popularMovies    -> array of movie objects (or null until loaded)
//   trailerVideo     -> ONE video object { key, type, ... } for the featured movie
//
// Why start with null instead of an empty array []?
// null means "we have not asked yet / still loading", while [] would mean
// "we asked and there are no movies". The hooks use that difference: they only
// fetch while the value is still null.
const moviesSlice = createSlice({
  name: "movies",
  initialState: {
    nowPlayingMovies: null,
    popularMovies: null,
    trailerVideo: null,
  },
  reducers: {
    // Unlike userSlice (whose whole state was null), here the state is an
    // object, so we can write `state.x = value`. This LOOKS like mutating the
    // state, which Redux forbids, but Redux Toolkit wraps reducers with a
    // library called Immer. Immer records the changes you make to a draft copy
    // and produces a new immutable state for you. Redux (and React) detect
    // changes by comparing old and new objects, so a fresh object is what
    // triggers the re-render.
    addNowPlayingMovies: (state, action) => {
      state.nowPlayingMovies = action.payload;
    },
    addPopularMovies: (state, action) => {
      state.popularMovies = action.payload;
    },
    addTrailerVideo: (state, action) => {
      state.trailerVideo = action.payload;
    },
  },
});

export const { addNowPlayingMovies, addPopularMovies, addTrailerVideo } =
  moviesSlice.actions;

export default moviesSlice.reducer;
