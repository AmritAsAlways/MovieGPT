import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { API_OPTIONS } from "../utils/constants";
import { addTrailerVideo } from "../utils/moviesSlice";

// Fetches the videos of ONE movie and stores the best trailer in Redux.
// Unlike the list hooks it needs an input: the movie's id. A hook can take
// arguments like any function. VideoBackground calls
// useMovieTrailer(movieId) with the id of the featured movie.
const useMovieTrailer = (movieId) => {
  const dispatch = useDispatch();
  const trailerVideo = useSelector((store) => store.movies.trailerVideo);

  useEffect(() => {
    const getMovieVideos = async () => {
      try {
        const response = await fetch(
          "https://api.themoviedb.org/3/movie/" +
            movieId +
            "/videos?language=en-US",
          API_OPTIONS
        );
        const json = await response.json();

        if (!response.ok) {
          console.error(
            "TMDB videos failed:",
            response.status,
            json.status_message
          );
          return;
        }

        // A movie has many videos (teasers, clips, featurettes...).
        // Prefer one whose type is "Trailer"; if there is none, fall back to
        // the first video of any kind.
        const trailers = json.results.filter(
          (video) => video.type === "Trailer"
        );
        const trailer = trailers.length ? trailers[0] : json.results[0];

        // Only store something real. Dispatching `undefined` for a movie with
        // no videos would change the state and re-trigger this effect.
        if (trailer) dispatch(addTrailerVideo(trailer));
      } catch (error) {
        console.error("TMDB videos request error:", error);
      }
    };

    // Same cache idea as the list hooks. Also skip if there is no id yet.
    // (Known simplification, same as the original: the stored trailer is not
    // cleared when the featured movie changes. Fine here because the
    // featured movie is always the first now-playing one.)
    if (movieId && !trailerVideo) getMovieVideos();
  }, [dispatch, movieId, trailerVideo]);
};

export default useMovieTrailer;
