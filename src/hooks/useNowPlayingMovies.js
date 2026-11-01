import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { API_OPTIONS } from "../utils/constants";
import { addNowPlayingMovies } from "../utils/moviesSlice";

// CUSTOM HOOK: a plain function whose name starts with "use" and that calls
// other hooks inside it. It lets us package "fetch data and put it in Redux"
// as one reusable unit, so components stay small: Browse just writes
// `useNowPlayingMovies();` and does not care how the data arrives.
//
// EXECUTION FLOW:
//   1. Browse renders -> this hook runs -> React draws the page first
//   2. useEffect fires AFTER that first draw
//   3. If the store has no movies yet, fetch them from TMDB
//   4. dispatch(...) saves them -> every component using useSelector on this
//      data re-renders with the movies
const useNowPlayingMovies = () => {
  const dispatch = useDispatch();

  // Read what is already in the store, so we can skip a pointless download.
  const nowPlayingMovies = useSelector(
    (store) => store.movies.nowPlayingMovies
  );

  useEffect(() => {
    // ASYNC IN useEffect: the function you pass to useEffect cannot be
    // `async` itself (it must return nothing or a cleanup function, and an
    // async function returns a Promise). So we define an async helper inside
    // and call it.
    const getNowPlayingMovies = async () => {
      try {
        // fetch() returns a Promise; `await` pauses THIS function (not the
        // whole page) until the response arrives.
        const response = await fetch(
          "https://api.themoviedb.org/3/movie/now_playing?page=1",
          API_OPTIONS
        );
        const json = await response.json();

        // fetch() does NOT throw on 401/404 responses, so we check manually.
        // The usual cause here is a missing or wrong TMDB token in .env.
        if (!response.ok) {
          console.error(
            "TMDB now_playing failed:",
            response.status,
            json.status_message
          );
          return;
        }

        dispatch(addNowPlayingMovies(json.results));
      } catch (error) {
        // Network problems end up here. Proper error UI comes in Section 7.
        console.error("TMDB now_playing request error:", error);
      }
    };

    // CACHE: only fetch if the store is still empty. Without this guard,
    // every time Browse re-mounted (e.g. after signing out and back in) we
    // would download the same list again.
    if (!nowPlayingMovies) getNowPlayingMovies();

    // DEPENDENCY LIST: the effect re-runs when one of these changes.
    // After the data is stored, nowPlayingMovies changes, the effect runs
    // once more, sees the data is there and does nothing. dispatch never
    // changes. Listing everything the effect uses keeps ESLint happy and
    // avoids bugs from stale values.
  }, [dispatch, nowPlayingMovies]);
};

export default useNowPlayingMovies;
