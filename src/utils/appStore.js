import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import moviesReducer from "./moviesSlice";

// REDUX STORE: one central object that holds the app's shared state.
// Components do not edit it directly. They "dispatch" an action
// (e.g. addUser(...)) and the matching reducer calculates the new state.
// That one-way flow makes it easy to trace why something changed.
//
// Each key below is a "slice" of the state tree. Today it looks like:
//   { user: null, movies: { nowPlayingMovies, popularMovies, trailerVideo } }
// Section 6 adds two more slices:
//   gpt    -> GPT search toggle and results
//   config -> selected language
//
// configureStore (from Redux Toolkit) sets up the store with sensible
// defaults, including the Redux DevTools browser extension support.
const appStore = configureStore({
  reducer: {
    user: userReducer,
    movies: moviesReducer,
  },
});

export default appStore;
