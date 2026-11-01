import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import moviesReducer from "./moviesSlice";
import gptReducer from "./gptSlice";
import configReducer from "./configSlice";

// REDUX STORE: one central object that holds the app's shared state.
// Components do not edit it directly. They "dispatch" an action
// (e.g. addUser(...)) and the matching reducer calculates the new state.
// That one-way flow makes it easy to trace why something changed.
//
// Each key below is a "slice" of the state tree. The complete tree:
//   {
//     user:   null | { uid, email, displayName, photoURL }          (Section 3)
//     movies: { nowPlayingMovies, popularMovies, trailerVideo }     (Section 4)
//     gpt:    { showGptSearch, movieNames, movieResults }           (Section 6)
//     config: { lang }                                              (Section 6)
//   }
//
// configureStore (from Redux Toolkit) sets up the store with sensible
// defaults, including the Redux DevTools browser extension support.
const appStore = configureStore({
  reducer: {
    user: userReducer,
    movies: moviesReducer,
    gpt: gptReducer,
    config: configReducer,
  },
});

export default appStore;
