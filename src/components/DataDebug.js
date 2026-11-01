import { useSelector } from "react-redux";
import useMovieTrailer from "../hooks/useMovieTrailer";

// TEMPORARY (Section 4 only). There is no movie UI yet, so this small panel
// proves the data layer works by showing what landed in Redux.
// Section 5 deletes this file and builds the real Browse UI.

// useMovieTrailer needs a movie id, which only exists once the list has
// loaded. Hooks cannot be called conditionally, so we put the call in a small
// child component that is only rendered when we have an id. (Section 5's
// VideoBackground component does the same job.)
const TrailerCheck = ({ movieId }) => {
  useMovieTrailer(movieId);
  const trailerVideo = useSelector((store) => store.movies.trailerVideo);

  return (
    <li>
      Trailer for first movie:{" "}
      {trailerVideo ? (
        <span data-testid="trailer-key">
          {trailerVideo.type} (YouTube key {trailerVideo.key})
        </span>
      ) : (
        "loading..."
      )}
    </li>
  );
};

const DataDebug = () => {
  const movies = useSelector((store) => store.movies);
  const firstMovie = movies.nowPlayingMovies?.[0];

  return (
    <ul className="mt-8 space-y-2 text-left inline-block text-gray-300">
      <li>
        Now playing:{" "}
        {movies.nowPlayingMovies
          ? `${movies.nowPlayingMovies.length} movies (first: ${firstMovie?.original_title})`
          : "loading..."}
      </li>
      <li>
        Popular:{" "}
        {movies.popularMovies
          ? `${movies.popularMovies.length} movies`
          : "loading..."}
      </li>
      {firstMovie && <TrailerCheck movieId={firstMovie.id} />}
      <li className="text-gray-500 text-sm pt-2">
        Stuck on "loading..."? Open the browser console (F12) and check .env.
      </li>
    </ul>
  );
};

export default DataDebug;
