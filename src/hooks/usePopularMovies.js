import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { API_OPTIONS } from "../utils/constants";
import { addPopularMovies } from "../utils/moviesSlice";

// Same pattern as useNowPlayingMovies (read that file for the full
// explanation): fetch once, store in Redux, skip if already stored.
// Only the URL and the action differ. In Section 7 we could merge the two
// into one generic hook, but keeping them separate is clearer while learning
// and matches the original project.
const usePopularMovies = () => {
  const dispatch = useDispatch();
  const popularMovies = useSelector((store) => store.movies.popularMovies);

  useEffect(() => {
    const getPopularMovies = async () => {
      try {
        const response = await fetch(
          "https://api.themoviedb.org/3/movie/popular?page=1",
          API_OPTIONS
        );
        const json = await response.json();

        if (!response.ok) {
          console.error(
            "TMDB popular failed:",
            response.status,
            json.status_message
          );
          return;
        }

        dispatch(addPopularMovies(json.results));
      } catch (error) {
        console.error("TMDB popular request error:", error);
      }
    };

    if (!popularMovies) getPopularMovies();
  }, [dispatch, popularMovies]);
};

export default usePopularMovies;
